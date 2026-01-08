# 环境变量配置说明

## 环境变量文件

项目包含以下环境变量文件：

- `.env` - 所有环境的默认配置
- `.env.development` - 开发环境配置（`yarn dev:h5`）
- `.env.production` - 生产环境配置（`yarn build:h5`）
- `.env.local` - 本地覆盖配置（不提交到 git）

## 配置优先级

```
.env.local > .env.[mode] > .env
```

## 可用的环境变量

### 应用配置
- `VITE_APP_TITLE` - 应用标题
- `VITE_APP_ENV` - 当前环境标识

### API 配置
- `VITE_API_BASE_URL` - API 基础地址

### Keycloak 配置
- `VITE_KEYCLOAK_URL` - Keycloak 服务器地址
- `VITE_KEYCLOAK_REALM` - Realm 名称
- `VITE_KEYCLOAK_CLIENT_ID` - 客户端 ID

## 使用方法

### 1. 在代码中使用

```typescript
import env from '@/config/env'

// 使用 API 地址
console.log(env.apiBaseUrl)

// 使用 Keycloak 配置
console.log(env.keycloak.url)

// 判断环境
if (env.isDev) {
  console.log('开发环境')
}
```

### 2. 创建本地配置（可选）

如果你需要本地特定的配置，创建 `.env.local` 文件：

```bash
# .env.local（不会被提交到 git）
VITE_API_BASE_URL=http://localhost:3000
VITE_KEYCLOAK_URL=http://localhost:8080
```

### 3. 切换环境

```bash
# 开发环境（自动使用 .env.development）
yarn dev:h5

# 生产构建（自动使用 .env.production）
yarn build:h5
```

## 注意事项

⚠️ **重要规则：**

1. **变量命名**：必须以 `VITE_` 开头才能在客户端访问
2. **安全性**：不要在环境变量中存储敏感信息（密钥、密码等）
3. **修改生效**：修改环境变量后需要重启开发服务器
4. **提交规则**：
   - ✅ 提交 `.env`、`.env.development`、`.env.production`
   - ❌ 不要提交 `.env.local`、`.env.*.local`

## 示例：不同环境的配置

### 开发环境
```bash
VITE_API_BASE_URL=https://api-dev.dchbi.app
```

### 测试环境
```bash
VITE_API_BASE_URL=https://api-test.dchbi.app
```

### 生产环境
```bash
VITE_API_BASE_URL=https://api.dchbi.app
```