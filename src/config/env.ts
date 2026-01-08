/**
 * 环境变量配置
 * 注意：在 Vite 中，只有以 VITE_ 开头的变量才会暴露给客户端
 */

interface ImportMetaEnv {
  // 应用配置
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_ENV: string

  // API 配置
  readonly VITE_API_BASE_URL: string

  // Keycloak 配置
  readonly VITE_KEYCLOAK_URL: string
  readonly VITE_KEYCLOAK_REALM: string
  readonly VITE_KEYCLOAK_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 导出环境变量配置
export const env = {
  // 应用配置
  appTitle: import.meta.env.VITE_APP_TITLE || 'Weaver',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',

  // API 配置
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',

  // Keycloak 配置
  keycloak: {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'https://ssosit.dch-ecomplatform.com',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'weaver',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'vue-spa',
  },

  // 判断是否是开发环境
  isDev: import.meta.env.DEV,
  // 判断是否是生产环境
  isProd: import.meta.env.PROD,
}

// 打印环境信息（仅开发环境）
if (env.isDev) {
  console.log('=== 环境配置 ===')
  console.log('环境:', env.appEnv)
  console.log('API 地址:', env.apiBaseUrl)
  console.log('Keycloak URL:', env.keycloak.url)
  console.log('===============')
}

export default env