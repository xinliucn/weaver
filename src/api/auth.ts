/**
 * 后端认证相关 API（方案 B - 后端 Session + Cookie）
 */

import request from '@/utils/request'

/**
 * 发起登录 - 获取 Keycloak 授权 URL
 *
 * @param redirectUri - 登录成功后的回调地址
 * @returns { auth_url: string, state: string, nonce: string }
 */
export const initiateLogin = () => {
  return request.post('/api/r/weaver/auth/login')
}

/**
 * 获取当前用户信息
 *
 * 后端会验证 session_id Cookie，从 Redis 获取 Token，返回用户信息
 */
export const getCurrentUser = () => {
  return request.get('/api/r/weaver/auth/user')
}

/**
 * 登出
 *
 * 后端会清除 Redis 中的 session 和 Cookie
 */
export const logout = () => {
  return request.post('/api/r/weaver/auth/logout')
}

/**
 * 刷新 Token（可选）
 *
 * 后端会使用 refresh_token 刷新 access_token
 */
export const refreshToken = () => {
  return request.post('/api/r/weaver/auth/refresh')
}
