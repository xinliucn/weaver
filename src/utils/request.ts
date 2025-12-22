import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { keycloak } from '@/pages/utils/keycloak'
import env from '@/config/env'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl, // 从环境变量读取 API 基础地址
  timeout: 30000, // 请求超时时间 30秒
  withCredentials: true, // 跨域请求时携带 cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 自动添加 Token
request.interceptors.request.use(
  async (config) => {
    // 如果 Keycloak 已认证，自动添加 token
    if (keycloak.authenticated && keycloak.token) {
      // 检查 token 是否即将过期（30秒内），如果是则刷新
      if (keycloak.isTokenExpired(30)) {
        try {
          const refreshed = await keycloak.updateToken(30)
          if (refreshed) {
            console.log('Token 已刷新')
          }
        } catch (error) {
          console.error('Token 刷新失败:', error)
          // Token 刷新失败，可能需要重新登录
          keycloak.login()
          return Promise.reject(new Error('Token 刷新失败'))
        }
      }

      // 添加 Authorization header
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }

    return config
  },
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一错误处理
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数
    return response
  },
  async (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数

    if (error.response) {
      const { status } = error.response

      switch (status) {
        case 401:
          // 未授权 - Token 可能过期或无效
          console.error('401 未授权 - 尝试刷新 token')
          try {
            const refreshed = await keycloak.updateToken(5)
            if (refreshed && error.config) {
              // Token 刷新成功，重试原请求
              error.config.headers.Authorization = `Bearer ${keycloak.token}`
              return request(error.config)
            } else {
              // 刷新失败，跳转登录
              keycloak.login()
            }
          } catch (refreshError) {
            console.error('Token 刷新失败:', refreshError)
            keycloak.login()
          }
          break

        case 403:
          console.error('403 禁止访问 - 权限不足')
          break

        case 404:
          console.error('404 资源不存在')
          break

        case 500:
          console.error('500 服务器错误')
          break

        default:
          console.error(`请求失败: ${status}`)
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误 - 无响应:', error.request)
    } else {
      // 发送请求时出了问题
      console.error('请求配置错误:', error.message)
    }

    return Promise.reject(error)
  }
)

// 导出封装好的实例
export default request

// 导出常用方法（可选，方便使用）
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return request.get<T>(url, config)
}

export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return request.post<T>(url, data, config)
}

export const put = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return request.put<T>(url, data, config)
}

export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return request.delete<T>(url, config)
}