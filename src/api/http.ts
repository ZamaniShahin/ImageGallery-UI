import axios from "axios";
import { keycloak } from "../plugins/keycloak";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

// Automatically attach Bearer token when available
http.interceptors.request.use((config) => {
  if (keycloak && keycloak.authenticated) {
    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }
  return config;
});

export default http;
