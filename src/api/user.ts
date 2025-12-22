/**
 * 用户相关 API
 */

import request from '@/utils/request'

// 定义接口类型
export interface UserInfo {
  id: string
  username: string
  email: string
  name: string
  roles?: string[]
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  return request.get<ApiResponse<UserInfo>>('/api/user/current')
}

/**
 * 获取用户详情
 */
export const getUserById = (userId: string) => {
  return request.get<ApiResponse<UserInfo>>(`/api/user/${userId}`)
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return request.put<ApiResponse<UserInfo>>('/api/user', data)
}

/**
 * 获取用户列表（带分页）
 */
export const getUserList = (params: { page: number; pageSize: number }) => {
  return request.get<ApiResponse<{ list: UserInfo[]; total: number }>>('/api/users', {
    params
  })
}