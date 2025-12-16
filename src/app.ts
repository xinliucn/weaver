import { createApp } from 'vue'
import NutUI from '@nutui/nutui-taro'
import '@nutui/nutui-taro/dist/style.css'
import { keycloak, initKeycloak } from '@/pages/utils/keycloak'
import { registerSW } from 'virtual:pwa-register'
import './app.css'

// 注册 PWA Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, please refresh.')
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})

const App = createApp({
  onLaunch() {
    // 在应用启动时初始化 Keycloak
    initKeycloak((token: string) => {
      console.log('Token ready:', token)
    }).catch(err => {
      console.error('Keycloak init failed:', err)
    })
  },
  onShow() {
    // 应用显示时不需要额外操作
  },
  // 入口组件不需要实现 render 方法,即使实现了也会被 taro 所覆盖
})

App.use(NutUI)

// 将 keycloak 实例挂载到全局属性上,方便在组件中使用
App.config.globalProperties.$keycloak = keycloak

export default App
