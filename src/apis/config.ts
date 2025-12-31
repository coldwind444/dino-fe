import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// =========================
// 🔧 Base URL
// =========================
export const baseURL = process.env.NEXT_PUBLIC_API_URL;

// =========================
// 🧠 Token Management (sessionStorage only, SSR-safe)
// =========================
export const setAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("accessToken", token);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("accessToken");
  }
  return null;
};

export const clearAccessToken = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("accessToken");
  }
};

// =========================
// 🧩 Axios Instances
// =========================
export const publicApi: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// =========================
// 🛡️ Request Interceptor (adds token automatically)
// =========================
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

// =========================
// ⚠️ Response Interceptor (redirect on 401)
// =========================
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: Token may be invalid or expired.");
      clearAccessToken();
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

// =========================
// ✅ Export
// =========================
export default api;
