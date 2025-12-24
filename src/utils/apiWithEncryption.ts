import Taro from '@tarojs/taro'
import { SecureStorage } from './secureStorage'
import { keycloak } from './keycloak'

/**
 * 带加密的API请求工具
 * Service Worker会缓存这些请求的响应
 */
export class SecureApiClient {
  private static baseURL = 'https://api.dchbi.app'

  /**
   * 获取认证头
   */
  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const token = keycloak?.token

    if (!token) {
      throw new Error('未授权：请先登录')
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  /**
   * 通用请求方法
   * Service Worker会自动处理缓存
   */
  private static async request<T>(
    url: string,
    options: Partial<Taro.request.Option> = {}
  ): Promise<T> {
    try {
      const headers = await this.getAuthHeaders()

      const response = await Taro.request({
        url: `${this.baseURL}${url}`,
        method: options.method || 'GET',
        data: options.data,
        header: {
          ...headers,
          ...options.header
        }
      })

      if (response.statusCode === 200) {
        // 成功响应，Service Worker已经缓存了这个响应
        return response.data as T
      } else if (response.statusCode === 401) {
        // Token过期，需要刷新
        throw new Error('Token已过期')
      } else {
        throw new Error(`请求失败：${response.statusCode}`)
      }
    } catch (error) {
      console.error('API请求错误:', error)
      // 离线时，Service Worker会返回缓存的数据
      throw error
    }
  }

  /**
   * GET请求 - 获取用户敏感信息
   * Service Worker会缓存响应（5分钟）
   */
  static async getUserInfo(): Promise<any> {
    const data = await this.request('/api/user/info', {
      method: 'GET'
    })

    // 将敏感数据加密存储到SessionStorage（关闭浏览器后清除）
    SecureStorage.setItem('cached_user_info', data, true)

    return data
  }

  /**
   * GET请求 - 获取用户任务列表
   */
  static async getTasks(): Promise<any[]> {
    return await this.request('/api/tasks', {
      method: 'GET'
    })
  }

  /**
   * POST请求 - 提交表单数据
   */
  static async submitForm(formData: any): Promise<any> {
    return await this.request('/api/form/submit', {
      method: 'POST',
      data: formData
    })
  }

  /**
   * 离线模式：从本地加密存储读取
   */
  static async getUserInfoOffline(): Promise<any> {
    const cached = SecureStorage.getItem('cached_user_info', true)

    if (!cached) {
      throw new Error('离线模式下无可用数据')
    }

    return cached
  }
}

/**
 * 监听网络状态，自动切换在线/离线模式
 */
export class NetworkManager {
  private static isOnline = true

  static init() {
    // 监听网络状态变化
    Taro.onNetworkStatusChange((res) => {
      this.isOnline = res.isConnected

      if (this.isOnline) {
        console.log('网络已恢复，尝试同步数据...')
        this.syncPendingData()
      } else {
        console.log('网络已断开，切换到离线模式')
      }
    })

    // 检查当前网络状态
    Taro.getNetworkType({
      success: (res) => {
        this.isOnline = res.networkType !== 'none'
      }
    })
  }

  static getNetworkStatus(): boolean {
    return this.isOnline
  }

  /**
   * 同步离线期间产生的数据
   */
  private static async syncPendingData() {
    // 从IndexedDB读取待同步数据
    // 上传到服务器
    // 这里可以实现后台同步逻辑
  }
}
