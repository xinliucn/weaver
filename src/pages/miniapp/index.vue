<template>
  <view class="miniapp-container">
    <!-- Custom Navigation Bar -->
    <view class="custom-navbar">
      <view class="navbar-left" @click="handleClose">
        <text class="back-icon">←</text>
        <text class="back-text">Back</text>
      </view>
      <view class="navbar-title">{{ miniAppTitle }}</view>
      <view class="navbar-right"></view>
    </view>

    <!-- Loading Indicator -->
    <view v-if="isLoading" class="loading-overlay">
      <view class="loading-spinner"></view>
      <text class="loading-text">Loading MiniApp...</text>
    </view>

    <!-- Iframe Container -->
    <view class="iframe-wrapper">
      <iframe
        ref="miniAppFrame"
        :src="miniAppUrl"
        class="miniapp-iframe"
        @load="handleIframeLoad"
        frameborder="0"
        allow="camera; microphone; geolocation"
      ></iframe>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Taro from '@tarojs/taro'

// MiniApp URL（从路由参数获取）
const miniAppUrl = ref('')
const miniAppTitle = ref('MiniApp')
const isLoading = ref(true)

// 从路由参数获取 MiniApp URL
onMounted(() => {
  console.log('🎯 MiniApp 容器页面已加载')
  const instance = Taro.getCurrentInstance()
  console.log('📦 Taro Instance:', instance)
  const params = instance.router?.params
  console.log('📝 路由参数:', params)

  if (params?.url) {
    miniAppUrl.value = decodeURIComponent(params.url)
    console.log('🌐 MiniApp URL:', miniAppUrl.value)
  }
  if (params?.title) {
    miniAppTitle.value = decodeURIComponent(params.title)
    console.log('📌 MiniApp Title:', miniAppTitle.value)
  }


  // 5秒后如果还在加载，关闭加载状态
  setTimeout(() => {
    if (isLoading.value) {
      isLoading.value = false
      console.log('⏰ 加载超时，关闭加载状态')
    }
  }, 5000)
})

onUnmounted(() => {

})

// Iframe 加载完成
const handleIframeLoad = () => {
  isLoading.value = false
}


// 关闭 MiniApp
const handleClose = () => {
  Taro.navigateBack()
}
</script>

<style scoped>
.miniapp-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* Custom Navigation Bar */
.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #a52a3a;
}

.back-icon {
  font-size: 24px;
  margin-right: 4px;
}

.back-text {
  font-size: 16px;
}

.navbar-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.navbar-right {
  width: 60px;
}

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top-color: #a52a3a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: #666;
}

/* Iframe Wrapper */
.iframe-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.miniapp-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
