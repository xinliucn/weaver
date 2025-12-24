import { keycloak } from './keycloak'

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
 * 直接从 Keycloak 或后端 API 获取用户信息
 * 依赖 cookies 进行认证
 */
export class UserInfoManager {
  /**
   * 从 Keycloak 加载用户信息
   */
  static async loadFromKeycloak(): Promise<UserInfo | null> {
    if (!keycloak || !keycloak.authenticated) {
      console.warn('Keycloak 未认证')
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

      return userInfo
    } catch (error) {
      console.error('Failed to load user profile:', error)

      // 如果 loadUserProfile 失败，使用 token 中的信息
      const tokenParsed = keycloak.tokenParsed
      if (tokenParsed) {
        const userInfo: UserInfo = {
          username: tokenParsed.preferred_username || '',
          name: tokenParsed.name || tokenParsed.preferred_username || '',
          email: tokenParsed.email || '',
          preferredUsername: tokenParsed.preferred_username || '',
          roles: tokenParsed.realm_access?.roles || []
        }

        return userInfo
      }

      return null
    }
  }

  /**
   * 获取用户信息
   * 每次都从 Keycloak 重新加载（依赖 cookies 认证）
   */
  static async getUserInfo(): Promise<UserInfo | null> {
    return await this.loadFromKeycloak()
  }

  /**
   * 刷新用户信息
   */
  static async refresh(): Promise<UserInfo | null> {
    return await this.loadFromKeycloak()
  }

  /**
   * 清除缓存（已移除加密存储，保留方法以兼容现有代码）
   */
  static clearCache(): void {
    // 不再使用本地存储，无需清除
    console.log('用户信息不再使用本地缓存')
  }

  /**
   * 检查用户是否有特定角色
   */
  static async hasRole(role: string): Promise<boolean> {
    const userInfo = await this.getUserInfo()
    if (!userInfo || !userInfo.roles) {
      return false
    }
    return userInfo.roles.includes(role)
  }

  /**
   * 检查用户是否有任意一个角色
   */
  static async hasAnyRole(roles: string[]): Promise<boolean> {
    const userInfo = await this.getUserInfo()
    if (!userInfo || !userInfo.roles) {
      return false
    }
    return roles.some(role => userInfo.roles!.includes(role))
  }

  /**
   * 检查用户是否有所有角色
   */
  static async hasAllRoles(roles: string[]): Promise<boolean> {
    const userInfo = await this.getUserInfo()
    if (!userInfo || !userInfo.roles) {
      return false
    }
    return roles.every(role => userInfo.roles!.includes(role))
  }
}

