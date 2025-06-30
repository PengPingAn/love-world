import { onUnmounted } from 'vue'
import { forceClaimMaster, onMasterChange, isMasterTab, broadcastDisconnect } from './master-tab'

// 类型定义
type WebSocketEvent = 'open' | 'message' | 'error' | 'close'
type MessageCallback<T = unknown> = (data: T) => void
type EventCallback = () => void

interface WebSocketOptions {
  url: string
  protocols?: string | string[]
  reconnectTimeout?: number // 重连间隔时间
  maxRetries?: number // 最大重试次数
}

/**
 * WebSocket 心跳管理类
 * 负责连接保活和超时处理
 */
class HeartbeatManager {
  private pingTimer?: NodeJS.Timeout // 心跳发送定时器
  private pongTimeout?: NodeJS.Timeout // 心跳响应超时检测器

  constructor(
    private sendPing: () => void, // 心跳发送方法
    private onTimeout: () => void, // 超时回调
    private interval: number, // 心跳间隔(ms)
    private timeout: number // 超时时间(ms)
  ) {}

  /**
   * 启动心跳检测
   */
  start() {
    this.clear()
    this.pingTimer = setInterval(() => {
      if (document.visibilityState === 'hidden') {
        console.log('[心跳] 页面处于后台，跳过本次心跳检测')
        return
      }
      this.clearTimeout() // ✅ 清除旧的等待定时器
      this.sendPing()
      this.waitPong()
    }, this.interval)
  }

  /**
   * 重置心跳检测（收到消息时调用）
   */
  reset() {
    this.clearTimeout()
    if (document.visibilityState === 'hidden') {
      console.log('[心跳] 页面处于后台，跳过超时检测')
      return
    }
    this.waitPong()
  }

  /**
   * 等待pong响应
   */
  private waitPong() {
    this.pongTimeout = setTimeout(() => {
      this.onTimeout()
      this.clear()
    }, this.timeout)
  }

  /**
   * 清理所有定时器
   */
  clear() {
    this.clearInterval()
    this.clearTimeout()
  }

  private clearInterval() {
    clearInterval(this.pingTimer)
    this.pingTimer = undefined
  }

  private clearTimeout() {
    clearTimeout(this.pongTimeout)
    this.pongTimeout = undefined
  }
}

/**
 * WebSocket 核心服务类
 * 封装WebSocket连接管理、事件处理和重连逻辑
 */
class WebSocketService {
  private ws: WebSocket | null = null
  private callbacks = new Map<WebSocketEvent, Set<Function>>()
  private retryCount = 0 // 当前重试次数
  private reconnectTimer?: NodeJS.Timeout // 重连定时器
  private heartbeat: HeartbeatManager // 心跳管理器

  constructor(private options: WebSocketOptions) {
    // 初始化心跳检测（2秒发送心跳，5秒超时）
    this.heartbeat = new HeartbeatManager(
      () => this.sendHeartbeat(),
      () => this.handleTimeout(),
      2000,
      5000
    )

    // 页面切换时暂停/恢复心跳机制
    document.addEventListener('visibilitychange', () => {
      if (!isMasterTab()) return
      if (document.visibilityState === 'hidden') {
        console.log('[心跳] 页面切换到后台，暂停心跳')
        this.heartbeat.clear()
      } else {
        console.log('[心跳] 页面切换到前台，恢复心跳')
        this.heartbeat.start()
      }
    })
  }

  /**
   * 建立WebSocket连接
   */
  public open(): void {
    this.cleanup() // 清理旧连接

    try {
      this.ws = new WebSocket(this.options.url, this.options.protocols)
      this.bindEvents()
    } catch (error) {
      console.error('WebSocket初始化失败:', error)
      this.scheduleReconnect()
    }
  }

  /**
   * 关闭连接
   * @param permanent 是否永久关闭（不重连）
   */
  public close(permanent = false): void {
    if (permanent) {
      this.options.maxRetries = 0 // 禁用重连
    }

    this.cleanup()
    this.ws?.close()
  }

  /**
   * 重新连接
   */
  public reconnect(): void {
    this.retryCount = 0
    this.open()
  }

  /**
   * 事件监听
   * @param event 事件类型
   * @param callback 回调函数
   */
  public on(event: 'message', callback: MessageCallback): void
  public on(event: Exclude<WebSocketEvent, 'message'>, callback: EventCallback): void
  public on(event: WebSocketEvent, callback: Function): void {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set())
    }
    this.callbacks.get(event)?.add(callback)
  }

  /**
   * 发送消息
   * @param data 要发送的数据
   */
  public send(data: unknown): void {
    if (this.isConnected) {
      try {
        this.ws?.send(JSON.stringify(data))
      } catch (error) {
        console.error('消息发送失败:', error)
      }
    } else {
      console.warn('消息未发送 - 连接未就绪')
      this.scheduleReconnect()
    }
  }

  // 私有方法区域---------------------------------------------

  /**
   * 获取当前连接状态
   */
  private get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  /**
   * 绑定WebSocket事件监听
   */
  private bindEvents() {
    if (!this.ws) return

    const handlers = {
      open: this.handleOpen,
      message: this.handleMessage,
      error: this.handleError,
      close: this.handleClose
    }

    // 添加事件监听
    Object.entries(handlers).forEach(([event, handler]) => {
      this.ws?.addEventListener(event, handler)
    })
  }

  /**
   * 清理资源
   */
  private cleanup() {
    this.heartbeat.clear()
    clearTimeout(this.reconnectTimer)

    // 移除所有事件监听
    if (this.ws) {
      ;['open', 'message', 'error', 'close'].forEach((event) => {
        this.ws?.removeEventListener(event, this.handleOpen)
        // 其他事件处理函数同理
      })
      this.ws = null
    }
  }

  /**
   * 触发事件回调
   */
  private trigger(event: WebSocketEvent, ...args: any[]) {
    this.callbacks.get(event)?.forEach((cb) => cb(...args))
  }

  /**
   * 处理打开连接事件
   */
  private handleOpen = () => {
    console.log('WebSocket连接已建立')
    this.retryCount = 0
    this.heartbeat.start()
    this.trigger('open')
  }

  /**
   * 处理消息事件
   */
  private handleMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      this.heartbeat.reset() // 收到消息重置心跳
      this.trigger('message', data)
    } catch (error) {
      console.error('消息解析失败:', error)
    }
  }

  /**
   * 处理错误事件
   */
  private handleError = (error: Event) => {
    console.error('WebSocket错误:', error)
    this.trigger('error')
    this.scheduleReconnect()
  }

  /**
   * 处理关闭事件
   */
  private handleClose = () => {
    console.log('WebSocket连接已关闭')
    this.cleanup()
    this.trigger('close')
    this.scheduleReconnect()
  }

  /**
   * 发送心跳包
   */
  private sendHeartbeat() {
    if (isMasterTab()) this.send({ type: 'bus', data: { type: 'heartbeat' } })
  }

  /**
   * 处理心跳超时
   */
  private handleTimeout() {
    console.warn('心跳超时，主动断开连接')
    this.close()
    this.scheduleReconnect()
  }

  /**
   * 调度重连（指数退避算法）
   */
  private scheduleReconnect() {
    const maxRetries = this.options.maxRetries ?? 5
    const baseInterval = this.options.reconnectTimeout ?? 5000

    console.trace('[调用堆栈] 触发 scheduleReconnect 的位置')
    if (this.retryCount++ >= maxRetries) {
      console.error(`已达最大重试次数(${maxRetries})`)
      return
    }

    const delay = Math.min(
      baseInterval * Math.pow(2, this.retryCount),
      30000 // 最大间隔30秒
    )

    this.reconnectTimer = setTimeout(() => {
      console.log(`第${this.retryCount}次重连...`)
      this.open()
    }, delay)
  }
}

/**
 * Vue组合式API封装
 */
export default function useWebSocket(options: WebSocketOptions) {
  const wsService = new WebSocketService(options)

  // 🚀 我当前 tab 就是主 tab
  forceClaimMaster()

  // 监听 master 状态变化（可能被踢）
  onMasterChange((master) => {
    if (master) {
      wsService.open()
    } else {
      wsService.close(true)
    }
  })

  onUnmounted(() => {
    if (isMasterTab()) {
      broadcastDisconnect()
      wsService.close(true)
    }
  })

  return {
    open: wsService.open.bind(wsService),
    close: wsService.close.bind(wsService),
    reconnect: wsService.reconnect.bind(wsService),
    on: wsService.on.bind(wsService),
    send: wsService.send.bind(wsService),
    wsService // 暴露实例用于特殊场景
  }
}
