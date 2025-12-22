// API 使用示例

import request, { get, post, put, del } from '@/utils/request'

// ============= 方式1: 直接使用 request 实例 =============

// GET 请求
export const getUserInfo = () => {
  return request.get('/api/user/info')
}

// POST 请求
export const createUser = (data: any) => {
  return request.post('/api/user', data)
}

// PUT 请求
export const updateUser = (id: string, data: any) => {
  return request.put(`/api/user/${id}`, data)
}

// DELETE 请求
export const deleteUser = (id: string) => {
  return request.delete(`/api/user/${id}`)
}


// ============= 方式2: 使用导出的快捷方法 =============

// 获取用户列表
export const getUserList = () => {
  return get('/api/users')
}

// 登录（虽然你用 Keycloak SSO，但作为示例）
export const login = (username: string, password: string) => {
  return post('/api/login', { username, password })
}


// ============= 在 Vue 组件中使用 =============

/**
 * 示例：在 Vue 组件中使用
 *
 * <script setup lang="ts">
 * import { getUserInfo } from '@/api/user'  // 假设你把 API 放在 api 目录
 * import { onMounted, ref } from 'vue'
 *
 * const userInfo = ref(null)
 *
 * onMounted(async () => {
 *   try {
 *     const response = await getUserInfo()
 *     userInfo.value = response.data
 *   } catch (error) {
 *     console.error('获取用户信息失败:', error)
 *   }
 * })
 * </script>
 */


// ============= 带类型的请求示例 =============

interface User {
  id: string
  name: string
  email: string
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 带类型的请求
export const getTypedUserInfo = async (): Promise<User> => {
  const response = await get<ApiResponse<User>>('/api/user/info')
  return response.data.data
}


// ============= 自定义配置的请求 =============

// 不携带 credentials 的请求（覆盖默认配置）
export const publicApi = () => {
  return request.get('/api/public', {
    withCredentials: false
  })
}

// 自定义 headers
export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 设置超时时间
export const longRunningTask = () => {
  return get('/api/long-task', {
    timeout: 60000 // 60秒
  })
}
