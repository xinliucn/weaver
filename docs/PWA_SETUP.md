# PWA 配置说明

## 已完成的配置

### 1. 安装依赖
已安装 `vite-plugin-pwa` 插件用于 PWA 支持。

### 2. 配置文件修改

#### config/index.ts
添加了 VitePWA 插件配置：
- **应用信息**:
  - 名称: DCH ePortal
  - 短名称: ePortal
  - 主题颜色: #8b2332 (酒红色)
  - 背景颜色: #ffffff
  - 显示模式: standalone

- **缓存策略**:
  - Google Fonts: CacheFirst (缓存优先，1年有效期)
  - API 请求: NetworkFirst (网络优先，5分钟缓存)
  - 静态资源: 自动预缓存

- **自动更新**: 启用自动更新检测

#### src/index.html
添加了 PWA 相关的 meta 标签：
- theme-color: #8b2332
- favicon 和 apple-touch-icon 链接

#### src/app.ts
注册了 Service Worker：
- onNeedRefresh: 当有新内容时提示
- onOfflineReady: 离线就绪时提示

#### src/vite-env.d.ts
添加了 TypeScript 类型声明支持 PWA 虚拟模块。

### 3. PWA 资源
在 `/public` 目录下添加了以下文件：
- pwa-192x192.png (192x192 图标)
- pwa-512x512.png (512x512 图标)
- favicon.ico (网站图标)
- apple-touch-icon.png (iOS 主屏幕图标)

## 构建和部署

### 构建命令
```bash
npm run build:h5
```

### 生成的文件
构建后会在 `dist/` 目录生成：
- `manifest.webmanifest` - PWA 清单文件
- `sw.js` - Service Worker 文件
- `workbox-*.js` - Workbox 运行时

### 验证 PWA

#### 本地测试
```bash
npm run dev:h5
```

#### 生产环境验证
1. 部署到 HTTPS 服务器（PWA 需要 HTTPS）
2. 打开 Chrome DevTools
3. 进入 Application -> Manifest 检查清单
4. 进入 Application -> Service Workers 检查 SW 状态
5. 使用 Lighthouse 运行 PWA 审计

### PWA 功能

#### 已启用的功能
- ✅ 离线访问（Service Worker 缓存）
- ✅ 可安装到主屏幕
- ✅ 应用图标和启动画面
- ✅ 主题颜色自定义
- ✅ 自动更新检测
- ✅ 静态资源预缓存
- ✅ API 请求缓存（5分钟）
- ✅ 字体资源缓存（1年）

#### 在开发环境中测试 PWA
配置中已启用 `devOptions.enabled: true`，可以在开发环境中测试 PWA 功能。

## 注意事项

1. **HTTPS 要求**: PWA 必须在 HTTPS 环境下运行（localhost 除外）
2. **图标优化**: 当前使用的是 logo 图片，建议制作专门的 PWA 图标（正方形，带内边距）
3. **离线页面**: 可以考虑添加自定义的离线页面
4. **更新策略**: 当前使用 autoUpdate，用户会自动获取新版本

## 下一步优化建议

1. 制作专门的 PWA 图标（192x192 和 512x512）
2. 添加更多的缓存策略（图片、字体等）
3. 实现自定义的更新提示 UI
4. 添加离线降级页面
5. 配置后台同步功能
6. 添加推送通知支持
