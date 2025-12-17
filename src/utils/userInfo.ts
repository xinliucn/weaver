import { keycloak } from '../pages/utils/keycloak'
import { SecureStorage } from './secureStorage'

/**
 * 用户信息接口
 */
export interface UserInfo {
  username: string
  name: string
  email: string
  preferredUsername: string
  firstName?: string
  lastName?: string
  roles?: string[]
}

/**
 * 用户信息管理工具
 * 结合Keycloak和加密存储
 */
export class UserInfoManager {
  private static STORAGE_KEY = 'user_info_cached'

  /**
   * 从Keycloak加载用户信息
   * 自动缓存到加密存储
   */
  static async loadFromKeycloak(): Promise<UserInfo | null> {
    if (!keycloak || !keycloak.authenticated) {
      console.warn('Keycloak未认证')
      return null
    }

    try {
      // 加载用户配置信息
      await keycloak.loadUserProfile()
      const profile = keycloak.profile
      const tokenParsed = keycloak.tokenParsed

      const userInfo: UserInfo = {
        username: profile?.username || '',
        name: profile?.firstName && profile?.lastName
          ? `${profile.firstName} ${profile.lastName}`
          : profile?.username || tokenParsed?.preferred_username || '',
        email: profile?.email || tokenParsed?.email || '',
        preferredUsername: tokenParsed?.preferred_username || profile?.username || '',
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        roles: tokenParsed?.realm_access?.roles || []
      }

      // 加密存储到SessionStorage（关闭浏览器后自动清除）
      SecureStorage.setItem(this.STORAGE_KEY, userInfo, true)

      return userInfo
    } catch (error) {
      console.error('Failed to load user profile:', error)

      // 如果loadUserProfile失败，使用token中的信息
      const tokenParsed = keycloak.tokenParsed
      if (tokenParsed) {
        const userInfo: UserInfo = {
          username: tokenParsed.preferred_username || '',
          name: tokenParsed.name || tokenParsed.preferred_username || '',
          email: tokenParsed.email || '',
          preferredUsername: tokenParsed.preferred_username || '',
          roles: tokenParsed.realm_access?.roles || []
        }

        // 加密存储
        SecureStorage.setItem(this.STORAGE_KEY, userInfo, true)

        return userInfo
      }

      return null
    }
  }

  /**
   * 从缓存读取用户信息（加密存储）
   */
  static getCached(): UserInfo | null {
    return SecureStorage.getItem(this.STORAGE_KEY, true)
  }

  /**
   * 获取用户信息（优先从缓存，缓存不存在则从Keycloak加载）
   */
  static async getUserInfo(): Promise<UserInfo | null> {
    // 先尝试从缓存读取
    const cached = this.getCached()
    if (cached) {
      return cached
    }

    // 缓存不存在，从Keycloak加载
    return await this.loadFromKeycloak()
  }

  /**
   * 刷新用户信息
   */
  static async refresh(): Promise<UserInfo | null> {
    return await this.loadFromKeycloak()
  }

  /**
   * 清除缓存的用户信息
   */
  static clearCache(): void {
    SecureStorage.removeItem(this.STORAGE_KEY, true)
  }

  /**
   * 检查用户是否有特定角色
   */
  static hasRole(role: string): boolean {
    const userInfo = this.getCached()
    if (!userInfo || !userInfo.roles) {
      return false
    }
    return userInfo.roles.includes(role)
  }

  /**
   * 检查用户是否有任意一个角色
   */
  static hasAnyRole(roles: string[]): boolean {
    const userInfo = this.getCached()
    if (!userInfo || !userInfo.roles) {
      return false
    }
    return roles.some(role => userInfo.roles!.includes(role))
  }

  /**
   * 检查用户是否有所有角色
   */
  static hasAllRoles(roles: string[]): boolean {
    const userInfo = this.getCached()
    if (!userInfo || !userInfo.roles) {
      return false
    }
    return roles.every(role => userInfo.roles!.includes(role))
  }
}
