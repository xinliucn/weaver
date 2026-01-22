<template>
  <view class="login-page">
    <view class="login-container">
      <!-- Logo and Title -->
      <view class="login-header">
        <img class="login-logo" :src="logoImage" alt="DCH Logo" />
        <view class="subtitle">New ePortal Experience</view>
      </view>

      <!-- Loading Indicator -->
      <view class="loading-section">
        <view class="loading-spinner"></view>
        <view class="loading-text">{{ loadingText }}</view>
      </view>
    </view>
    <nut-toast v-model:visible="toast.visible" :msg="toast.msg" :type="toast.type" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Taro from '@tarojs/taro'
import { initiateLogin, getCurrentUser } from '@/api/auth'
import logoImage from '@/assets/images/image002.jpg'

const loadingText = ref('Checking authentication...')

const toast = ref({
  visible: false,
  msg: '',
  type: 'text' as 'text' | 'success' | 'fail' | 'warn' | 'loading'
})

const showToast = (msg: string, type: 'text' | 'success' | 'fail' | 'warn' | 'loading' = 'text') => {
  toast.value = {
    visible: true,
    msg,
    type
  }
}

// SSO登录
const handleSSOLogin = async () => {
  loadingText.value = 'Redirecting to SSO...'

  try {
    // 调用后端 API 获取授权 URL
    const response = await initiateLogin()

    if (response.data.authorization_url) {
      window.location.href = response.data.authorization_url
    } else {
      throw new Error('后端未返回授权 URL')
    }
  } catch (error: any) {
    loadingText.value = 'Login failed'
    if (error.response) {
      showToast(`登录失败: ${error.response.data?.message || '服务器错误'}`, 'fail')
    } else if (error.request) {
      showToast('网络错误，请检查后端服务是否启动', 'fail')
    } else {
      showToast(`登录失败: ${error.message}`, 'fail')
    }
  }
}

// 检查是否已有 session_id，避免无限重定向
const checkSessionAndLogin = async () => {
  try {
    // 调用身份验证接口，检查是否已有有效会话
    const userResponse: any = await getCurrentUser()
    // const userResponse = {
    //   data: {
    //     "code": 1,
    //     "user": {
    //       "name": "Xin LIU",
    //       "email": "xinliu@dchbi.com",
    //       "roles": [],
    //       "user_id": "48529189-aa93-48dd-9d11-dd6f2fe08c63",
    //       "username": "xinliu@dchbi.com"
    //     },
    //     "login_at": 1767593555235,
    //     "session_id": "c9070008dbda4cf59d569e498b000c2f",
    //     "token_valid": false,
    //     "authenticated": true,
    //     "logged_in_for": 910,
    //     "token_expired": false,
    //     "token_refreshed": true,
    //     "token_expires_at": 1767594765000,
    //     "token_expires_in": 299
    //   }
    // }
    if (userResponse.data.code == 1) {
      loadingText.value = 'Login successful, redirecting...'
      Taro.navigateTo({
        url: '/pages/index/index'
      })
      return
    } else {
      console.log('🔄 无有效会话，继续登录流程')
      handleSSOLogin()
    }
  } catch (error) {
    console.error('检查会话失败:', error)
    handleSSOLogin()
  }
}

onMounted(() => {
  checkSessionAndLogin()
})

onUnmounted(() => {
  // 清理工作
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecef 100%);
  padding: 40px 20px;
}

.login-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 440px;
  padding: 50px 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo {
  width: 300px;
  height: auto;
  display: block;
  margin: 0 auto 20px;
  object-fit: contain;
}

.subtitle {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

/* Loading Section */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top-color: #a52a3a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 16px;
  color: #666;
  text-align: center;
}
</style>
