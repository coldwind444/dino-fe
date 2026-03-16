import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const baseURL = '/backend';

const TOKEN_KEY = "accessToken";
const ROLE_KEY = "userRole";

export const setAccessToken = (token: string, role: string) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Strict`;
  document.cookie = `${ROLE_KEY}=${role}; path=/; SameSite=Strict`;
};

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Strict`;
  document.cookie = `${ROLE_KEY}=; path=/; max-age=0; SameSite=Strict`;
};

export const publicApi: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 403) {
      console.warn("Forbidden: Token may be invalid or expired.");
      clearAccessToken();
    }
    return Promise.reject(error);
  }
);

export default api;
