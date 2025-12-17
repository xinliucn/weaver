import CryptoJS from 'crypto-js'

// 使用环境变量或固定密钥（生产环境应该从服务器获取）
const SECRET_KEY = 'DCH_EPORTAL_SECRET_KEY_2025' // 生产环境应该更复杂

/**
 * 安全存储工具类
 * 对敏感数据进行AES加密后存储
 */
export class SecureStorage {
  /**
   * 加密并存储数据
   */
  static setItem(key: string, value: any, useSession = false): void {
    try {
      const jsonString = JSON.stringify(value)
      const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString()

      const storage = useSession ? sessionStorage : localStorage
      storage.setItem(key, encrypted)
    } catch (error) {
      console.error('SecureStorage setItem error:', error)
    }
  }

  /**
   * 读取并解密数据
   */
  static getItem(key: string, useSession = false): any {
    try {
      const storage = useSession ? sessionStorage : localStorage
      const encrypted = storage.getItem(key)

      if (!encrypted) return null

      const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8)

      return jsonString ? JSON.parse(jsonString) : null
    } catch (error) {
      console.error('SecureStorage getItem error:', error)
      return null
    }
  }

  /**
   * 删除数据
   */
  static removeItem(key: string, useSession = false): void {
    const storage = useSession ? sessionStorage : localStorage
    storage.removeItem(key)
  }

  /**
   * 清空所有数据
   */
  static clear(useSession = false): void {
    const storage = useSession ? sessionStorage : localStorage
    storage.clear()
  }
}

/**
 * 敏感数据专用存储
 * 自动使用SessionStorage，关闭浏览器后自动清除
 */
export class SensitiveStorage {
  /**
   * 存储敏感信息（如用户详细信息）
   */
  static setUserInfo(userInfo: any): void {
    SecureStorage.setItem('user_sensitive_info', userInfo, true)
  }

  /**
   * 获取敏感信息
   */
  static getUserInfo(): any {
    return SecureStorage.getItem('user_sensitive_info', true)
  }

  /**
   * 存储临时Token
   */
  static setTempToken(token: string): void {
    SecureStorage.setItem('temp_token', token, true)
  }

  /**
   * 获取临时Token
   */
  static getTempToken(): string | null {
    return SecureStorage.getItem('temp_token', true)
  }

  /**
   * 清除所有敏感数据
   */
  static clearAll(): void {
    SecureStorage.clear(true)
  }
}

/**
 * 普通数据存储（非敏感）
 */
export class AppStorage {
  /**
   * 存储用户偏好设置
   */
  static setPreferences(prefs: any): void {
    SecureStorage.setItem('user_preferences', prefs, false)
  }

  /**
   * 获取用户偏好设置
   */
  static getPreferences(): any {
    return SecureStorage.getItem('user_preferences', false)
  }

  /**
   * 存储应用配置
   */
  static setConfig(config: any): void {
    SecureStorage.setItem('app_config', config, false)
  }

  /**
   * 获取应用配置
   */
  static getConfig(): any {
    return SecureStorage.getItem('app_config', false)
  }
}
