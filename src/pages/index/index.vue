<template>
  <view class="home-page">
    <!-- 顶部导航栏 -->
    <view class="top-navbar">
      <view class="navbar-left">
        <img :src="logoImage" class="logo" alt="DCH Logo" />
        <view class="nav-menu">
          <text class="nav-item active">Workspace</text>
          <text class="nav-item">My Applications</text>
          <text class="nav-item">Process Center</text>
          <text class="nav-item more-icon">⋯</text>
        </view>
      </view>

      <view class="navbar-right">
        <view class="search-box">
          <input type="text" placeholder="Search" class="search-input" />
        </view>
        <view class="icon-btn">🔔</view>
        <view class="icon-btn">🌐</view>
        <view class="user-info">
          <view class="avatar">👤</view>
          <text class="username">huang jianyong</text>
          <text class="dropdown-icon">▼</text>
        </view>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class="main-content">
      <!-- 左侧内容 -->
      <view class="content-left">
        <!-- Banner -->
        <view class="banner">
          <view class="banner-text">
            <text class="banner-title">大昌行家書</text>
            <text class="banner-subtitle">ETTER TO DCH</text>
          </view>
          <img src="../assets/images/BgGray.png" class="banner-image" />
        </view>

        <!-- 任务列表 -->
        <view class="tasks-section">
          <view class="tabs">
            <text class="tab active">My Outstanding Tasks</text>
            <text class="tab">Followed Tasks</text>
            <text class="tab">My Completed Tasks</text>
            <text class="tab">My Pending Requests</text>
          </view>

          <view class="task-list">
            <view class="task-item">
              <text class="task-title">CM制造变更--CK Admin--2025-12-08</text>
              <text class="task-owner">CK Admin</text>
              <text class="task-date">2025-12-08 01:18:46</text>
              <text class="task-date">2025-12-08 01:18:46</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 右侧边栏 -->
      <view class="sidebar-right">
        <!-- Quick Access -->
        <view class="widget">
          <view class="widget-header">
            <text class="widget-title">Quick Access</text>
          </view>
          <view class="quick-access-grid">
            <view class="access-item">
              <view class="access-icon">📧</view>
              <text class="access-label">Letter to DCH</text>
            </view>
            <view class="access-item">
              <view class="access-icon">🔗</view>
              <text class="access-label">DCH Connect</text>
            </view>
            <view class="access-item">
              <view class="access-icon">💻</view>
              <text class="access-label">ePortal</text>
            </view>
            <view class="access-item">
              <view class="access-icon">🛠️</view>
              <text class="access-label">IT Service Desk</text>
            </view>
            <view class="access-item">
              <view class="access-icon">📊</view>
              <text class="access-label">Group HRMS</text>
            </view>
            <view class="access-item">
              <view class="access-icon">📚</view>
              <text class="access-label">eLearning</text>
            </view>
            <view class="access-item">
              <view class="access-icon">🌐</view>
              <text class="access-label">Intranet</text>
            </view>
          </view>
        </view>

        <!-- News -->
        <view class="widget">
          <view class="widget-header">
            <text class="widget-title">News</text>
          </view>
          <view class="news-banner">
            <text class="news-text">Click here to check our latest news</text>
          </view>
        </view>

        <!-- Departmental Portal -->
        <view class="widget">
          <view class="widget-header">
            <text class="widget-title">Departmental Portal</text>
          </view>
          <view class="portal-grid">
            <view class="portal-item">
              <view class="portal-icon">🌱</view>
              <text class="portal-label">DCH Green</text>
            </view>
            <view class="portal-item">
              <view class="portal-icon">👥</view>
              <text class="portal-label">Group HR</text>
            </view>
            <view class="portal-item">
              <view class="portal-icon">⚖️</view>
              <text class="portal-label">Group Legal & Compliance</text>
            </view>
          </view>
        </view>

        <!-- eShop -->
        <view class="widget">
          <view class="widget-header">
            <text class="widget-title">eShop</text>
          </view>
          <view class="eshop-grid">
            <view class="eshop-item">
              <view class="eshop-logo">🏪</view>
            </view>
            <view class="eshop-item">
              <view class="eshop-logo">🚗</view>
            </view>
            <view class="eshop-item">
              <view class="eshop-logo">🏠</view>
            </view>
            <view class="eshop-item">
              <view class="eshop-logo">👔</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部认证和合作伙伴 -->
    <view class="footer-section">
      <view class="certificates-grid">
        <!-- 第一行 -->
        <view class="cert-item">🏆</view>
        <view class="cert-item">🌿</view>
        <view class="cert-item">♻️</view>
        <view class="cert-item">🔵</view>
        <view class="cert-item">🌱</view>
        <view class="cert-item">🌐</view>
        <view class="cert-item">🎯</view>
        <view class="cert-item">🌳</view>
        <view class="cert-item">📊</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logoImage from '../assets/images/image002.jpg'

const show = ref(false)
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 顶部导航栏 */
.top-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.nav-menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-item {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding-bottom: 20px;
  border-bottom: 3px solid transparent;
}

.nav-item.active {
  color: #8b2332;
  border-bottom-color: #8b2332;
}

.nav-item:hover {
  color: #8b2332;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
}

.search-input {
  width: 200px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-size: 14px;
  color: #333;
}

.dropdown-icon {
  font-size: 10px;
  color: #999;
}

/* 主要内容区域 */
.main-content {
  margin-top: 64px;
  display: flex;
  gap: 24px;
  padding: 24px;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
}

.content-left {
  flex: 1;
  min-width: 0;
}

.sidebar-right {
  width: 380px;
  flex-shrink: 0;
}

/* Banner */
.banner {
  height: 300px;
  background: linear-gradient(135deg, #3a1a1f 0%, #8b2332 100%);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  padding: 40px;
  margin-bottom: 24px;
}

.banner-text {
  position: relative;
  z-index: 2;
}

.banner-title {
  display: block;
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
}

.banner-subtitle {
  display: block;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.9);
}

.banner-image {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 50%;
  object-fit: cover;
  opacity: 0.3;
}

/* 任务列表 */
.tasks-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  padding: 16px 24px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
}

.tab.active {
  color: #8b2332;
  border-bottom-color: #8b2332;
}

.task-list {
  padding: 16px;
}

.task-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.task-title {
  font-size: 14px;
  color: #333;
}

.task-owner,
.task-date {
  font-size: 13px;
  color: #999;
}

/* Widget */
.widget {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.widget-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* Quick Access Grid */
.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.access-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.access-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.access-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* News Banner */
.news-banner {
  height: 120px;
  background: linear-gradient(135deg, #8b2332 0%, #a52a3a 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.news-text {
  font-size: 16px;
  color: white;
  font-weight: 500;
}

/* Portal Grid */
.portal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.portal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.portal-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.portal-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

/* eShop Grid */
.eshop-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.eshop-item {
  aspect-ratio: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.eshop-item:hover {
  border-color: #8b2332;
  transform: translateY(-2px);
}

.eshop-logo {
  font-size: 32px;
}

/* 底部认证区域 */
.footer-section {
  background: white;
  padding: 40px 24px;
  margin-top: 24px;
}

.certificates-grid {
  max-width: 1600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 24px;
  align-items: center;
}

.cert-item {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
}

.cert-item:hover {
  opacity: 1;
}
</style>
