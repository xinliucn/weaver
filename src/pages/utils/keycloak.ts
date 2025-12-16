import Keycloak from "keycloak-js"

const keycloak = new Keycloak({
  url: "https://ssosit.dch-ecomplatform.com",
  realm: "weaver",
  clientId: "vue-spa",
});

let isInitialized = false

// 简化版初始化函数
export async function initKeycloak(onTokenReady?: (token: string) => void) {
  // 如果已经初始化过，直接返回认证状态
  if (isInitialized) {
    return keycloak.authenticated || false
  }

  // 检查 URL 中是否有认证码（可能在 hash 或 search 中）
  const urlParams = new URLSearchParams(window.location.search)
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const hasAuthCode = urlParams.has('code') || hashParams.has('code') ||
                      urlParams.has('session_state') || hashParams.has('session_state')

  if (!hasAuthCode) {
    // 没有认证码时，标记为已初始化但不调用 init
    isInitialized = true
    return false
  }

  // 有认证码时，初始化 Keycloak
  const authenticated = await keycloak.init({
    checkLoginIframe: false,
    pkceMethod: 'S256',
    flow: 'standard',
  });

  isInitialized = true

  if (authenticated && keycloak.token) {
    onTokenReady?.(keycloak.token);

    // 认证成功后，如果当前在根路径，跳转到登录页
    if (window.location.hash === '' || window.location.hash.startsWith('#state=') || window.location.hash.startsWith('#session_state=')) {
      window.location.hash = '#/pages/index/index';
    }

    // Auto refresh every minute
    setInterval(async () => {
      try {
        const refreshed = await keycloak.updateToken(70);
        if (refreshed && keycloak.token) {
          onTokenReady?.(keycloak.token);
        }
      } catch (e) {
        console.error('Token refresh failed', e);
      }
    }, 60_000);
  }

  return authenticated;
}

export { keycloak };
