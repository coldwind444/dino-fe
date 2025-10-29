import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// =========================
// 🔧 Base URL
// =========================
export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// =========================
// 🧠 Token Management (in-memory + sessionStorage)
// =========================
let accessToken: string | null =
  typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;

export const setAccessToken = (token: string) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    sessionStorage.setItem("accessToken", token);
  }
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
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
// 🛡️ Request Interceptor
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
// ⚠️ Response Interceptor
// =========================
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: Token may be invalid or expired.");
      clearAccessToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// =========================
// ✅ Export
// =========================
export default api;
