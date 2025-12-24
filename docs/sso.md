# SSO 认证方案 B - 后端 Session + Cookie 架构

## 🏗️ 系统架构

- **前端（superapp）**: `https://superapp.dchbi.app/`
- **后端 BFF（windmill api）**: `https://windmill-uat.dchbi.app/api/r/weaver/`
- **身份提供商**: Keycloak + Entra ID (Azure AD)
- **会话存储**: Redis
- **认证方式**: OAuth 2.0 / OIDC 授权码流程 + PKCE

## 📋 核心流程

### 1️⃣ 登录流程（Login Flow）

```
用户浏览器                前端                后端 BFF            Keycloak          Entra ID        Redis
    |                     |                    |                    |                 |               |
    |-- 打开应用 -------->|                    |                    |                 |               |
    |                     |                    |                    |                 |               |
    |                     |-- POST /auth/login -->                  |                 |               |
    |                     |                    |-- 生成 PKCE 参数 ---------------------------------->|
    |                     |                    |   (code_verifier, state, nonce)                     |
    |                     |                    |-- write session_id: -------------------------------->|
    |                     |                    |   {code_verifier, state, nonce}                     |
    |                     |                    |                    |                 |               |
    |                     |<-- auth_url + Set-Cookie: session_id (SameSite=None) --|               |
    |                     |                    |                    |                 |               |
    |<-- 302 跳转到 Keycloak ---------------------------------------------->|          |               |
    |                     |                    |                    |                 |               |
    |-- GET authUrl ---------------------------------------->|          |                 |               |
    |                     |                    |                    |-- 302 Entra ID --------------->|
    |                     |                    |                    |                 |               |
    |<-- Entra ID 登录页面 ---------------------------------------------------------->|               |
    |-- 输入账号密码 ------------------------------------------------------------>|               |
    |                     |                    |                    |<-- 登录成功 ---|               |
    |<-- 302 跳转 Keycloak ------------------------------------------------------<--|               |
    |                     |                    |                    |                 |               |
    |<-- 302 回调：GET /auth/callback?code=xxx&state=yyy --------------------------|               |
    |                     |                    |                    |                 |               |
    |                     |                    |<-- GET /auth/callback?code&state --|               |
    |                     |                    |-- 验证 state -------------------------------->|       |
    |                     |                    |-- PKCE 验证 code_verifier ------------------>|       |
    |                     |                    |                    |                 |               |
    |                     |                    |-- POST /token ---->|                 |               |
    |                     |                    |   (code, code_verifier, client_secret)              |
    |                     |                    |<-- 200 OK ---------|                 |               |
    |                     |                    |   {id_token, access_token, refresh_token}           |
    |                     |                    |                    |                 |               |
    |                     |                    |-- write session_id: -------------------------------->|
    |                     |                    |   {id_token, access_token, refresh_token}           |
    |                     |                    |                    |                 |               |
    |<-- 302 重定向到前端 /#/pages/index/index ------------------------------------|               |
```

**关键步骤说明：**

1. **POST /auth/login**：前端调用后端接口启动登录流程
2. **生成 PKCE 参数**：后端生成 `code_verifier`, `state`, `nonce` 并存入 Redis
3. **返回 auth_url**：后端返回 Keycloak 授权 URL 和 `session_id` Cookie
4. **跳转 Keycloak**：前端重定向到 Keycloak 授权页面
5. **Keycloak → Entra ID**：Keycloak 将认证委托给 Entra ID（使用 `kc_idp_hint=oidc`）
6. **用户登录**：用户在 Entra ID 页面输入账号密码
7. **回调后端**：Keycloak 重定向到后端 `/auth/callback?code=xxx&state=yyy`
8. **PKCE 验证**：后端验证 `state` 和 `code_verifier`
9. **交换 Token**：后端用 `code` 向 Keycloak 换取 Token（需要 `client_secret`）
10. **存储 Token**：后端将 Token 存入 Redis（key 为 `session_id`）
11. **重定向前端**：后端重定向到前端首页

---

### 2️⃣ API 访问流程 - Access Token 有效

```
用户浏览器                前端                后端 BFF            Redis             Keycloak
    |                     |                    |                    |                 |
    |-- 访问页面 -------->|                    |                    |                 |
    |                     |                    |                    |                 |
    |                     |-- GET/POST /api/xxx (cookies: session_id) -->            |
    |                     |                    |                    |                 |
    |                     |                    |-- read session_id -->               |
    |                     |                    |<-- {id_token, access_token, -------|
    |                     |                    |     refresh_token}                  |
    |                     |                    |                    |                 |
    |                     |                    |-- 验证 JWT -------->|                 |
    |                     |                    |-- 验证 access_token -------->|         |
    |                     |                    |                    |                 |
    |                     |<-- 返回数据 --------|                    |                 |
    |<-- 显示数据 --------|                    |                    |                 |
```

**关键步骤说明：**

1. 前端发送请求时，浏览器自动携带 `session_id` Cookie
2. 后端从 Redis 读取该 session 对应的 Token
3. 验证 JWT 签名和 `access_token` 有效性
4. 验证通过，返回请求的数据

---

### 3️⃣ API 访问流程 - Access Token 过期（自动刷新）

```
用户浏览器                前端                后端 BFF            Redis             Keycloak
    |                     |                    |                    |                 |
    |                     |-- GET/POST /api/xxx (cookies: session_id) -->            |
    |                     |                    |                    |                 |
    |                     |                    |-- read session_id -->               |
    |                     |                    |<-- {id_token, access_token, -------|
    |                     |                    |     refresh_token}                  |
    |                     |                    |                    |                 |
    |                     |                    |-- 验证 JWT -------->|                 |
    |                     |                    |-- access_token 已过期！             |
    |                     |                    |                    |                 |
    |                     |                    |-- POST /token (refresh_token) ------->|
    |                     |                    |<-- 200 OK -------------------------|
    |                     |                    |   {新的 id_token, access_token, refresh_token}
    |                     |                    |                    |                 |
    |                     |                    |-- write session_id: -------------------------------->|
    |                     |                    |   {新 Token}                        |
    |                     |                    |                    |                 |
    |                     |<-- 返回数据 --------|                    |                 |
    |<-- 显示数据 --------|                    |                    |                 |
```

**关键步骤说明：**

1. 后端检测到 `access_token` 已过期
2. 使用 `refresh_token` 向 Keycloak 请求新的 Token
3. 更新 Redis 中的 Token
4. 返回请求的数据（前端无感知）

---

### 4️⃣ API 访问流程 - Refresh Token 过期（需重新登录）

```
用户浏览器                前端                后端 BFF            Redis             Keycloak
    |                     |                    |                    |                 |
    |                     |-- GET/POST /api/xxx (cookies: session_id) -->            |
    |                     |                    |                    |                 |
    |                     |                    |-- read session_id -->               |
    |                     |                    |<-- {id_token, access_token, -------|
    |                     |                    |     refresh_token}                  |
    |                     |                    |                    |                 |
    |                     |                    |-- POST /token (refresh_token) ------->|
    |                     |                    |<-- 403 Invalid Token --------------|
    |                     |                    |                    |                 |
    |                     |                    |-- invalid cookies ----------------->|
    |                     |                    |   (删除 Redis session)              |
    |                     |                    |                    |                 |
    |                     |<-- 403 Forbidden --|                    |                 |
    |                     |   (清除前端 cookie)                     |                 |
    |                     |                    |                    |                 |
    |<-- 跳转登录页 ------|                    |                    |                 |
```

**关键步骤说明：**

1. `access_token` 和 `refresh_token` 都已过期
2. 后端尝试刷新 Token 失败（Keycloak 返回 403）
3. 后端删除 Redis 中的 session
4. 返回 403，前端跳转到登录页

---

### 5️⃣ API 访问流程 - Cookie 过期或不存在

```
用户浏览器                前端                后端 BFF
    |                     |                    |
    |                     |-- GET/POST /api/xxx (无 cookies 或 cookies 过期) -->
    |                     |                    |
    |                     |<-- 403 Forbidden --|
    |                     |                    |
    |<-- 跳转登录页 ------|                    |
```

**关键步骤说明：**

1. 请求中没有 `session_id` Cookie，或 Cookie 已过期
2. 后端直接返回 403
3. 前端拦截器跳转到登录页

---

## 🔐 安全机制

### PKCE（Proof Key for Code Exchange）

- **code_verifier**：随机生成的字符串（43-128 位）
- **code_challenge**：`BASE64URL(SHA256(code_verifier))`
- **作用**：防止授权码拦截攻击

### State 参数

- **作用**：防止 CSRF 攻击
- **验证**：回调时必须与初始请求的 state 一致

### Nonce 参数

- **作用**：防止重放攻击
- **验证**：id_token 中的 nonce 必须与初始请求一致

### Cookie 安全属性

```
Set-Cookie: session_id=xxx;
  HttpOnly;          // 防止 XSS 攻击（JS 无法读取）
  Secure;            // 仅通过 HTTPS 传输
  SameSite=None;     // 允许跨站请求携带（前后端分离架构）
  Domain=.dchbi.app; // 允许子域名共享
  Path=/;
  Max-Age=3600       // 1 小时过期
```

---

## 📦 Token 存储结构（Redis）

```javascript
// Key
session_id: "1c9bd67131fd47a69ee1a117f369e1be"

// Value
{
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "refresh_expires_in": 86400,
  "token_type": "Bearer"
}

// TTL
3600 秒（1 小时）
```

---

## 🌐 前端配置要点

### 1. Axios 配置（`src/utils/request.ts`）

```typescript
const request = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30000,
  withCredentials: true, // ⭐ 关键！允许跨域携带 Cookie
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### 2. 登录页面（`src/pages/login/index.vue`）

```typescript
import { initiateLogin } from '@/api/auth'

const handleSSOLogin = async () => {
  const response = await initiateLogin()
  if (response.data.authorization_url) {
    window.location.href = response.data.authorization_url
  }
}
```

### 3. 首页加载（`src/pages/index/index.vue`）

```typescript
import { getCurrentUser } from '@/api/auth'

onMounted(async () => {
  try {
    const response = await getCurrentUser()
    userInfo.value = response.data
  } catch (error) {
    if (error.response?.status === 403) {
      window.location.href = '/#/pages/login/index'
    }
  }
})
```

---

## ⚙️ 后端 API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/r/weaver/auth/login` | POST | 启动登录流程，返回 authorization_url |
| `/api/r/weaver/auth/callback` | GET | OAuth 回调端点，交换 Token |
| `/api/auth/user` | GET | 获取当前用户信息 |
| `/api/auth/logout` | POST | 退出登录，清除 session |
| `/api/auth/refresh` | POST | 手动刷新 Token（一般不需要） |

---

## 🔄 与方案 A（纯前端 Token）的对比

| 特性 | 方案 A（纯前端） | 方案 B（后端 Session） |
|------|------------------|------------------------|
| **Token 存储** | localStorage/sessionStorage | Redis（后端） |
| **跨域共享** | 困难（需要每个子域名都存储） | 简单（Cookie 自动携带） |
| **安全性** | XSS 风险高（JS 可读取 Token） | XSS 风险低（HttpOnly Cookie） |
| **Token 刷新** | 前端需要实现刷新逻辑 | 后端自动处理 |
| **client_secret** | 不能使用（会暴露） | 安全（仅后端持有） |
| **实现复杂度** | 前端复杂，后端简单 | 前端简单，后端复杂 |
| **适用场景** | 单页应用、移动 App | 企业级应用、多子域名 |

---

## ✅ 优势

1. **安全性高**：Token 不暴露在前端，防止 XSS 攻击
2. **跨域友好**：Cookie 可在多个子域名之间共享（`.dchbi.app`）
3. **用户体验好**：Token 自动刷新，用户无感知
4. **前端简单**：不需要处理 Token 存储和刷新逻辑
5. **可控性强**：后端可以随时撤销 session

## ⚠️ 注意事项

1. **Cookie 跨域**：必须配置 `SameSite=None` + `Secure`（需 HTTPS）
2. **CORS 配置**：后端需要正确配置 `Access-Control-Allow-Credentials: true`
3. **Redis 可用性**：Redis 故障会导致所有用户无法访问
4. **Session 过期**：需要合理设置 TTL，平衡安全性和用户体验
5. **多实例部署**：需要确保所有后端实例都连接到同一个 Redis