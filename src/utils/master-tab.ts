// composables/useMasterTab.ts
const channel = new BroadcastChannel('socket-tab-master')
let isMaster = false
const listeners: ((isMaster: boolean) => void)[] = []

const LOCK_KEY = 'websocket-master-lock'
const LOCK_TTL = 1000 // 1秒防抖动

channel.onmessage = (e) => {
  if (e.data === 'force-claim-master') {
    if (isMaster) {
      isMaster = false
      notify(false)
    }
  }
}

function notify(val: boolean) {
  listeners.forEach((cb) => cb(val))
}

function canAcquireLock(): boolean {
  const now = Date.now()
  const last = Number(localStorage.getItem(LOCK_KEY) || '0')
  if (now - last > LOCK_TTL) {
    localStorage.setItem(LOCK_KEY, String(now))
    return true
  }
  return false
}

/**
 * 我当前 tab 要成为主 tab
 */
export function forceClaimMaster() {
  if (!canAcquireLock()) return

  channel.postMessage('force-claim-master')
  isMaster = true
  notify(true)
}

/**
 * 主 tab 被关闭时广播释放主连接
 */
export function broadcastDisconnect() {
  if (isMaster) {
    channel.postMessage('force-claim-master')
  }
}

export function onMasterChange(cb: (val: boolean) => void) {
  listeners.push(cb)
}

export function isMasterTab() {
  return isMaster
}
