import axios, { type AxiosRequestConfig, AxiosError, type Method } from 'axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 根据项目环境配置
  timeout: 10000 // 默认超时时间：10秒
})

// 请求拦截器（可添加 token 等）
service.interceptors.request.use(
  (config) => {
    // 示例：添加 token
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器（统一错误处理）
service.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.code !== undefined && data.code !== 200 && data.code !== 102) {
      window.$message.error(data.message)
      return Promise.reject(data)
    }
    return data
  },
  (error) => Promise.reject(error)
)

// 通用请求方法，支持重试
async function baseRequest<T = any>(
  method: Method,
  url: string,
  data?: any,
  config: AxiosRequestConfig & { retry?: number; retryDelay?: number } = {}
): Promise<T> {
  const { retry = 0, retryDelay = 1000, ...axiosConfig } = config

  let retries = 0

  while (true) {
    try {
      const finalConfig: AxiosRequestConfig = {
        method,
        url,
        ...axiosConfig
      }

      if (method.toUpperCase() === 'GET') {
        finalConfig.params = data
      } else {
        finalConfig.data = data
      }

      return await service(finalConfig)
    } catch (err) {
      const error = err as AxiosError
      const isNetworkOrTimeout =
        error.code === 'ECONNABORTED' || error.message.includes('timeout') || !error.response

      if (retries < retry && isNetworkOrTimeout) {
        retries++
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
      } else {
        throw error
      }
    }
  }
}

// 暴露请求对象形式
const request = {
  Get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
  ) {
    return baseRequest<T>('GET', url, params, config)
  },
  Post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
  ) {
    return baseRequest<T>('POST', url, data, config)
  },
  Put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
  ) {
    return baseRequest<T>('PUT', url, data, config)
  },
  Delete<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
  ) {
    return baseRequest<T>('DELETE', url, data, config)
  },
  Patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { retry?: number; retryDelay?: number }
  ) {
    return baseRequest<T>('PATCH', url, data, config)
  }
}

export default request
