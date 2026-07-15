import Keycloak from "keycloak-js";
import { computed, ref } from "vue";

const TOKEN_KEY = "kc_token";
const REFRESH_TOKEN_KEY = "kc_refresh_token";

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export const isAuthenticated = ref(false);

export const hasAdminRole = computed(() => {
  if (!isAuthenticated.value) return false;
  const roles: string[] =
    (keycloak.tokenParsed as any)?.resource_access?.["imagegallery-frontend"]?.roles ?? [];
  return roles.includes("Admin");
});

function saveTokens() {
  sessionStorage.setItem(TOKEN_KEY, keycloak.token ?? "");
  sessionStorage.setItem(REFRESH_TOKEN_KEY, keycloak.refreshToken ?? "");
}

function clearTokens() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function initializeKeycloak() {
  keycloak.onAuthSuccess = () => {
    isAuthenticated.value = true;
    saveTokens();
  };

  keycloak.onAuthRefreshSuccess = () => {
    saveTokens();
  };

  keycloak.onAuthLogout = () => {
    clearTokens();
    isAuthenticated.value = false;
  };

  try {
    await keycloak.init({
      token: sessionStorage.getItem(TOKEN_KEY) ?? undefined,
      refreshToken: sessionStorage.getItem(REFRESH_TOKEN_KEY) ?? undefined,
      checkLoginIframe: false,
    });
    isAuthenticated.value = keycloak.authenticated ?? false;
  } catch {
    isAuthenticated.value = false;
  }
}

export const username = computed(() =>
  keycloak.tokenParsed?.preferred_username ?? ""
);

/**
 * Local logout for the direct-access-grant (password) flow.
 *
 * Logins go through our own /login page, which obtains tokens from Keycloak's
 * token endpoint directly. That creates NO browser SSO session and NO idToken,
 * so we must NOT redirect through Keycloak's end-session endpoint (that leaves
 * sessionStorage populated and re-authenticates on the next init). Instead we
 * clear the local tokens, best-effort revoke the refresh token server-side,
 * then reload.
 */
export async function logout(redirectTo: string = window.location.origin) {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);

  clearTokens();
  isAuthenticated.value = false;
  try {
    keycloak.clearToken();
  } catch {
    // instance may not be fully initialized — local tokens are already gone
  }

  if (refreshToken) {
    try {
      await fetch(
        `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
            refresh_token: refreshToken,
          }),
        },
      );
    } catch {
      // network/CORS failure — local tokens are already cleared, proceed
    }
  }

  window.location.href = redirectTo;
}
