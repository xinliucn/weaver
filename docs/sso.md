打开应用
  ↓
访问登录页 → 调用后端 /api/auth/login → 获取授权 URL
  ↓
跳转 Keycloak OIDC 登录
  ↓
登录成功 → Keycloak 回调到后端 /api/auth/callback（带 code）
  ↓
后端交换 Token → 存储到 Redis → 设置 session_id Cookie → 重定向到前端首页
  ↓
首页调用 API → 浏览器自动携带 session_id Cookie → 后端从 Redis 获取 Token


用户浏览器              前端              后端              Keycloak            Redis
    |                  |                 |                   |                   |
    |-- 访问登录页 ---->|                 |                   |                   |
    |                  |-- POST /auth/login -->              |                   |
    |                  |                 |-- 生成 state/nonce -->                |
    |                  |                 |-- 存入 Redis ----------------------->|
    |                  |<-- auth_url + cookie --|              |                 |
    |<-- 跳转到 Keycloak ----------------->|                   |                 |
    |                                     |                   |                 |
    |-- 输入账号密码 ------------------------------------------------>|           |
    |                                     |                   |                 |
    |<-- 回调：/api/auth/callback?code=xxx&state=yyy ----------|                 |
    |                                     |                   |                 |
    |                  |                 |<-- GET callback --|                 |
    |                  |                 |-- 验证 state --------------->|       |
    |                  |                 |-- 用 code 换 token ---------->|       |
    |                  |                 |<-- access_token, refresh_token --|   |
    |                  |                 |-- 存入 Redis ----------------------->|
    |<-- 重定向到前端首页 /#/pages/index/index --|              |                 |
    |                  |                 |                   |                 |
    |-- 加载首页 ------>|                 |                   |                 |
    |                  |-- GET /auth/user (带 cookie) ------->|                 |
    |                  |                 |-- 验证 cookie ---------------->|       |
    |                  |                 |-- 从 Redis 获取 token ---------->|   |
    |                  |                 |-- 用 token 获取用户信息 -------->|     |
    |                  |<-- 返回用户信息 --|                   |                 |
    |<-- 显示用户信息 ---|                 |                   |                 |