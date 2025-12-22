<template>
  <view class="home-page">
    <!-- 顶部导航栏 -->
    <view class="top-navbar">
      <view class="navbar-left">
        <img :src="logoImage" class="logo" alt="DCH Logo" />
        <view class="nav-menu">
          <view class="nav-item-wrapper">
            <text
              :class="['nav-item', { active: activeTab === 'workspace' }]"
              @click="activeTab = 'workspace'"
            >
              Workspace
            </text>
            <!-- Workspace 下拉菜单 -->
            <view class="nav-dropdown-menu">
              <view class="dropdown-item">DCH Group</view>
              <view class="dropdown-item">DCH Mainland China</view>
              <view class="dropdown-item">Group Legal & Compliance</view>
              <view class="dropdown-item">By Department</view>
            </view>
          </view>

          <view class="nav-item-wrapper">
            <text
              :class="['nav-item', { active: activeTab === 'applications' }]"
              @click="activeTab = 'applications'"
            >
              My Applications
            </text>
            <!-- My Applications 下拉菜单 -->
            <view class="nav-dropdown-menu wide">
              <view class="dropdown-item">All Applications</view>
              <view class="dropdown-item has-submenu">
                Group Digital and Technology
                <text class="submenu-arrow">›</text>
              </view>
              <view class="dropdown-item has-submenu">
                Group Finance
                <text class="submenu-arrow">›</text>
              </view>
              <view class="dropdown-item has-submenu">
                Group Legal and Compliance
                <text class="submenu-arrow">›</text>
              </view>
              <view class="dropdown-item has-submenu">
                Group HR
                <text class="submenu-arrow">›</text>
              </view>
              <view class="dropdown-item">DCHBI</view>
              <view class="dropdown-item has-submenu">
                Common Data Maintenance
                <text class="submenu-arrow">›</text>
              </view>
            </view>
          </view>

          <view class="nav-item-wrapper">
            <text class="nav-item more-icon">⋯</text>
            <!-- 更多菜单下拉框 -->
            <view class="nav-dropdown-menu">
              <view class="dropdown-item has-submenu">
                Process Center
                <text class="submenu-arrow">›</text>
              </view>
              <view class="dropdown-item has-submenu">
                Knowledge Base
                <text class="submenu-arrow">›</text>
              </view>
              <view class="dropdown-item has-submenu">
                Organization
                <text class="submenu-arrow">›</text>
              </view>
              <view class="dropdown-item has-submenu">
                Info Center
                <text class="submenu-arrow">›</text>
              </view>
              <view class="dropdown-item">Delegation</view>
            </view>
          </view>
        </view>
      </view>

      <view class="navbar-right">
        <view class="search-box">
          <input type="text" placeholder="Search" class="search-input" />
           <text class="search-icon">
            <img :src="seachIcon" class="input-icon" alt="search" />
           </text>
        </view>
        <view class="icon-btn"> <img :src="messageIcon" class="input-icon" alt="account" /></view>
        <view class="icon-btn"><img :src="moreIcon" class="input-icon" alt="more" /></view>
        <view class="user-info-wrapper">
          <view class="user-info" @click="toggleUserMenu">
            <view class="avatar">
              <img :src="userInfoImage" class="avatar-image" alt="User Avatar" />
            </view>
            <text class="username">{{ userInfo.name || userInfo.username || 'User' }}</text>
            <img :src="showUserMenu ? arrowUpIcon : arrowDownIcon" class="dropdown-icon" alt="dropdown" />
          </view>
          <!-- 用户下拉菜单 -->
          <view :class="['user-dropdown-menu', { show: showUserMenu }]">
            <view class="user-profile">
              <view class="user-avatar-large"><img :src="userInfoImage" class="avatar-image" alt="User Avatar" /></view>
              <view class="user-details">
                <text class="user-name">{{ userInfo.name || userInfo.username || 'User' }}</text>
                <text class="user-title">{{ userInfo.email || '' }}</text>
                <text class="user-dept">DCH Group</text>
              </view>
            </view>
            <view class="user-menu-divider"></view>
            <view class="user-menu-item">
              <text class="menu-icon"><img :src="earthIcon" class="avatar-image" alt="Earth Icon" /></text>
              <text class="menu-text">Language</text>
              <text class="menu-value">English</text>
              <text class="menu-arrow">›</text>
            </view>
            <view class="user-menu-item">
              <text class="menu-icon"><img :src="settingsIcon" class="avatar-image" alt="Settings Icon" /></text>
              <text class="menu-text">Personalization</text>
              <text class="menu-arrow">›</text>
            </view>
            <view class="user-menu-item">
              <text class="menu-icon"><img :src="passwordIcon" class="avatar-image" alt="Password Icon" /></text>
              <text class="menu-text">Password Settings</text>
              <text class="menu-arrow">›</text>
            </view>
            <view class="user-menu-item">
              <text class="menu-icon"><img :src="topicIcon" class="avatar-image" alt="Topic Icon" /></text>
              <text class="menu-text">Theme Center</text>
              <text class="menu-arrow">›</text>
            </view>
            <view class="user-menu-divider"></view>
            <view class="user-menu-item" @click="testCookieAPI">
              <text class="menu-icon">🧪</text>
              <text class="menu-text">Test Cookie API</text>
            </view>
            <view class="user-menu-divider"></view>
            <view class="user-menu-item" @click="handleLogout">
              <text class="menu-icon"><img :src="logoutIcon" class="avatar-image" alt="Logout Icon" /></text>
              <text class="menu-text">Logout</text>
            </view>
          </view>
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
          <img :src="bannerBgImage" class="banner-image" />
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
import { ref, onMounted } from 'vue'
import { keycloak } from '../utils/keycloak'
import { UserInfoManager } from '../../utils/userInfo'
import { testCookieRequest } from '@/api/test'
import logoImage from '@/assets/images/image002.jpg'
import userInfoImage from '@/assets/images/icon_m_wev8.jpg'
import bannerBgImage from '@/assets/images/BgGray.png'
import seachIcon from '@/assets/icons/seach.svg'
import messageIcon from '@/assets/icons/message.svg'
import moreIcon from '@/assets/icons/more.svg'
import arrowDownIcon from '@/assets/icons/arrow down.svg'
import arrowUpIcon from '@/assets/icons/arrow on.svg'
import earthIcon from '@/assets/icons/earth-fill.svg'
import topicIcon from '@/assets/icons/topic.svg'
import passwordIcon from '@/assets/icons/password.svg'
import settingsIcon from '@/assets/icons/settings.svg'
import logoutIcon from '@/assets/icons/logout.svg'

const show = ref(false)
const activeTab = ref('workspace')
const showUserMenu = ref(false)

// 用户信息
const userInfo = ref({
  username: '',
  name: '',
  email: '',
  preferredUsername: ''
})

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 处理登出
const handleLogout = () => {
  if (keycloak) {
    // 清除用户信息缓存
    UserInfoManager.clearCache()
    // 登出
    keycloak.logout({
      redirectUri: window.location.origin + '/#/pages/login/index'
    })
  }
}

// 测试 Cookie API
const testCookieAPI = async () => {
  try {
    console.log('=== 测试 Cookie API ===')
    console.log('Token:', keycloak.token)
    console.log('Authenticated:', keycloak.authenticated)

    const response = await testCookieRequest({ a: '1' })

    console.log('✅ API 请求成功!')
    console.log('响应数据:', response.data)

    alert('API 测试成功！\n查看控制台获取详细信息')
  } catch (error: any) {
    console.error('❌ API 请求失败:', error)

    if (error.response) {
      console.error('响应状态:', error.response.status)
      console.error('响应数据:', error.response.data)
      alert(`API 测试失败！\n状态码: ${error.response.status}\n请查看控制台获取详细信息`)
    } else {
      alert(`API 测试失败！\n错误: ${error.message}`)
    }
  } finally {
    // 关闭菜单
    showUserMenu.value = false
  }
}

// 从Keycloak加载用户信息
onMounted(async () => {
  if (keycloak && keycloak.authenticated) {
    const info = await UserInfoManager.getUserInfo()
    if (info) {
      userInfo.value = info
    }
  }
})
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
  height: 80px;
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

.nav-item-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 80px;
}

.nav-item {
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 0 0 3px 0;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  line-height: 1.5;
}

.nav-item.active {
  color: #8b2332;
}

.nav-item:hover {
  color: #8b2332;
  border-bottom-color: #8b2332;
}

/* Workspace 导航下拉菜单 */
.nav-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 240px;
  z-index: 1001;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.nav-dropdown-menu.wide {
  min-width: 280px;
}

.nav-item-wrapper:hover .nav-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  right: 8px;
  font-size: 16px;
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 200px;
  height: 32px;
  padding: 0 32px 0 12px;
  border: none;
  background: transparent;
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: #999;
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

.user-info-wrapper {
  position: relative;
  display: inline-block;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f7fa;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 14px;
  color: #333;
}

.dropdown-icon {
  width: 12px;
  height: 12px;
  opacity: 0.6;
  transition: transform 0.3s ease;
}

/* 用户下拉菜单 */
.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  z-index: 1001;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.user-dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 12px;
  background: #f5f7fa;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.user-title {
  font-size: 13px;
  color: #666;
}

.user-dept {
  font-size: 12px;
  color: #999;
}

.user-menu-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 8px 0;
}

.user-menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.user-menu-item:hover {
  background: #f5f7fa;
}

.menu-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.menu-value {
  font-size: 13px;
  color: #999;
  margin-right: 4px;
}

.menu-arrow {
  font-size: 16px;
  color: #999;
}

/* 下拉菜单项样式 */
.dropdown-item {
  padding: 12px 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f5f7fa;
  color: #8b2332;
}

.dropdown-item.has-submenu {
  position: relative;
}

.submenu-arrow {
  font-size: 16px;
  color: #999;
  margin-left: 8px;
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
