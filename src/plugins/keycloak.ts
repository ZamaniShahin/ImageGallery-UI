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
