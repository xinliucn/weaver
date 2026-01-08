import { createApp } from 'vue'
import NutUI from '@nutui/nutui-taro'
import '@nutui/nutui-taro/dist/style.css'
// import { registerSW } from 'virtual:pwa-register' // 暂时禁用 PWA

// 暂时禁用 PWA Service Worker 注册
// const updateSW = registerSW({
//   onNeedRefresh() {
//     console.log('New content available, please refresh.')
//   },
//   onOfflineReady() {
//     console.log('App ready to work offline')
//   },
// })

const App = createApp({
  onLaunch() {
    console.log('🚀 应用启动')
    // 使用方案 B（后端 Session + Cookie）
    // 不需要在前端初始化 Keycloak
    // 认证完全由后端处理
  },
  onShow() {
    // 应用显示时不需要额外操作
  },
  // 入口组件不需要实现 render 方法,即使实现了也会被 taro 所覆盖
})

App.use(NutUI)

export default App
