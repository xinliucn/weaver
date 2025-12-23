import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import env from '@/config/env'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl, // 从环境变量读取 API 基础地址
  timeout: 30000, // 请求超时时间 30秒
  withCredentials: true, // ⭐ 关键！跨域请求时自动携带 cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - Cookie 会自动携带，不需要手动处理
request.interceptors.request.use(
  (config) => {
    console.log('📤 发送请求:', config.method?.toUpperCase(), config.url)
    // Cookie（session_id）会被浏览器自动添加到请求头中
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
          // 未授权 - Session 已过期或无效，跳转登录页
          console.error('❌ 401 未授权 - Session 已过期，跳转登录页')
          window.location.href = '/#/pages/login/index'
          break

        case 403:
          console.error('❌ 403 禁止访问 - 权限不足')
          break

        case 404:
          console.error('❌ 404 资源不存在')
          break

        case 500:
          console.error('❌ 500 服务器错误')
          break

        default:
          console.error(`❌ 请求失败: ${status}`)
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('❌ 网络错误 - 无响应:', error.request)
    } else {
      // 发送请求时出了问题
      console.error('❌ 请求配置错误:', error.message)
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