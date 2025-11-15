import Keycloak from 'keycloak-js';
import { ref } from 'vue';
import { computed } from 'vue';

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
});

export const isAuthenticated = ref(false);
export async function initializeKeycloak() {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      flow: 'standard',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      checkLoginIframe: false   // avoid extra iframe calls
    });

    // Clean the ugly URL fragment after login
    if (window.location.hash.includes("session_state")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    isAuthenticated.value = authenticated;

  } catch (err) {
    console.error("Keycloak init failed:", err);
  }
}

export function login() {
  return keycloak.login({ redirectUri: window.location.href });
}

export function logout() {
  return keycloak.logout({ redirectUri: window.location.origin });
}
export const hasAdminRole = computed(() => {
  const roles =
    keycloak.tokenParsed?.resource_access?.["imagegallery-frontend"]?.roles ?? [];
  return roles.includes("Admin");
});
export const username = computed(() =>
  keycloak.tokenParsed?.preferred_username ?? ""
);