<template>
  <view class="login-page">
    <view class="login-container">
      <!-- Logo and Title -->
      <view class="login-header">
        <img
          class="login-logo"
          :src="logoImage"
          alt="DCH Logo"
        />
        <view class="subtitle">New ePortal Experience</view>
        <view class="language">English</view>
      </view>

      <!-- Login Form -->
      <view class="login-form">
        <view class="input-group">
          <nut-input
            v-model="username"
            placeholder="Account /Employee No. /Mobile /Email"
            class="custom-input"
          >
            <template #left>
              <img :src="accountIcon" class="input-icon" alt="account" />
            </template>
          </nut-input>
        </view>

        <view class="input-group">
          <nut-input
            v-model="password"
            type="password"
            placeholder="Password"
            class="custom-input"
          >
            <template #left>
              <img :src="passwordIcon" class="input-icon" alt="password" />
            </template>
          </nut-input>
        </view>

        <view class="remember-row">
          <view class="checkbox-label" @click="rememberUsername = !rememberUsername">
            <view :class="['custom-checkbox', { checked: rememberUsername }]">
              <text v-if="rememberUsername" class="check-icon">✓</text>
            </view>
            <text class="checkbox-text">Remember Username</text>
          </view>
          <view class="checkbox-label" @click="rememberPassword = !rememberPassword">
            <view :class="['custom-checkbox', { checked: rememberPassword }]">
              <text v-if="rememberPassword" class="check-icon">✓</text>
            </view>
            <text class="checkbox-text">Remember Password</text>
          </view>
        </view>

        <view class="button-group">
          <nut-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :loading="isLoading"
          >
            Login
          </nut-button>

          <nut-button
            type="primary"
            class="sso-btn"
            @click="handleSSOLogin"
          >
            SSO Login
          </nut-button>
        </view>
      </view>
    </view>

    <nut-toast
      v-model:visible="toast.visible"
      :msg="toast.msg"
      :type="toast.type"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { initiateLogin } from '@/api/auth'
import logoImage from '@/assets/images/image002.jpg'
import accountIcon from '@/assets/icons/account.svg'
import passwordIcon from '@/assets/icons/password.svg'

const username = ref('')
const password = ref('')
const rememberUsername = ref(false)
const rememberPassword = ref(false)
const isLoading = ref(false)

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

// 普通登录（暂时跳转到SSO）
const handleLogin = () => {
  handleSSOLogin()
}

// SSO 登录 - 方案 B：调用后端 API
const handleSSOLogin = async () => {
  console.log('🔐 开始 SSO 登录流程（方案 B）')
  isLoading.value = true

  try {
    // 1. 调用后端 API 获取授权 URL
    const redirectUri = `${window.location.protocol}//${window.location.host}/`
    console.log('📤 调用后端 /api/auth/login，redirect_uri:', redirectUri)

    const response = await initiateLogin()

    console.log('✅ 收到后端响应:', response)
//     {
//     "authorization_url": "https://ssosit.dch-ecomplatform.com/realms/weaver/protocol/openid-connect/auth?client_id=vue-bff&am…
// }

    // 2. 跳转到后端返回的授权 URL
    if (response.authorization_url) {
      console.log('🔄 跳转到 Keycloak 授权页面:', response.authorization_url)
      window.location.href = response.authorization_url
    } else {
      throw new Error('后端未返回授权 URL')
    }
  } catch (error: any) {
    console.error('❌ 登录失败:', error)
    isLoading.value = false

    if (error.response) {
      showToast(`登录失败: ${error.response.data?.message || '服务器错误'}`, 'fail')
    } else if (error.request) {
      showToast('网络错误，请检查后端服务是否启动', 'fail')
    } else {
      showToast(`登录失败: ${error.message}`, 'fail')
    }
  }
}

onMounted(() => {
  handleSSOLogin()
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

.language {
  font-size: 12px;
  color: #999;
  cursor: pointer;
}

.login-form {
  width: 100%;
}

.input-group {
  margin-bottom: 20px;
}

.input-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  opacity: 0.6;
}

.custom-input {
  width: 100%;
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.remember-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  user-select: none;
  margin-left: 20px;
}

.checkbox-text {
  margin-left: 8px;
}

/* 自定义方形 checkbox */
.custom-checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #ddd;
  border-radius: 2px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.custom-checkbox.checked {
  background-color: #a52a3a;
  border-color: #a52a3a;
}

.check-icon {
  color: white;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}
  

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login-btn,
.sso-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 4px;
  border: none;
}

.login-btn {
  background: linear-gradient(135deg, #8b2332 0%, #a52a3a 100%);
  color: white;
}

.sso-btn {
  background: linear-gradient(135deg, #8b2332 0%, #a52a3a 100%);
  color: white;
}
</style>
