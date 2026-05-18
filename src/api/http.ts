import axios from "axios";
import { keycloak } from "../plugins/keycloak";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  if (keycloak && keycloak.authenticated) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

// Origin for direct media URLs (strips trailing /api so server-provided
// paths like "/api/images/{id}/content" concatenate without doubling).
export const apiOrigin = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/api\/?$/, '');

export default http;
