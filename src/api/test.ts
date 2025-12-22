/**
 * 测试相关 API
 */

import request from '@/utils/request'

/**
 * 测试 Cookie 请求
 * 使用 form-urlencoded 格式
 */
export const testCookieRequest = (data: Record<string, any>) => {
  // 将对象转换为 URLSearchParams
  const params = new URLSearchParams()
  Object.keys(data).forEach(key => {
    params.append(key, data[key])
  })

  console.log('📤 发送请求:')
  console.log('  URL:', 'https://windmill-uat.dchbi.app/api/r/weaver/test')
  console.log('  Method: POST')
  console.log('  Content-Type: application/x-www-form-urlencoded')
  console.log('  WithCredentials: true (全局配置)')
  console.log('  Data:', data)

  return request.post('https://windmill-uat.dchbi.app/api/r/weaver/test', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // withCredentials 已经在 request 实例中全局配置了，不需要再传
  })
}

/**
 * 测试普通 JSON 请求
 */
export const testJsonRequest = (data: any) => {
  return request.post('https://windmill-uat.dchbi.app/api/r/weaver/test', data)
}