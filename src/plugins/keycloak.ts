import Keycloak from "keycloak-js";
import { computed, ref } from "vue";

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
});

export const isAuthenticated = ref(false);

export const hasAdminRole = computed(() => {
  const roles =
    keycloak.tokenParsed?.resource_access?.["imagegallery-frontend"]?.roles ??
    [];
  return roles.includes("Admin");
});
export async function initializeKeycloak() {
  const authenticated = await keycloak.init({
    onLoad: "check-sso",
    silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
  });

  isAuthenticated.value = authenticated;

  console.log("Keycloak loaded:", authenticated);
}
export const username = computed(() =>
  keycloak.tokenParsed?.preferred_username ?? ""
);