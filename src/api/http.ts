import axios from "axios";
import { keycloak } from "../plugins/keycloak";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

http.interceptors.request.use(async (config) => {
  if (keycloak?.authenticated) {
    try {
      await keycloak.updateToken(30); // refresh if expiring within 30 s
    } catch {
      // refresh failed — send with current token; API will return 401 if truly expired
    }
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

// Origin for direct media URLs (strips trailing /api so server-provided
// paths like "/api/images/{id}/content" concatenate without doubling).
export const apiOrigin = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/api\/?$/, '');

export default http;
