// hooks/useAuthGuard.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, clearAccessToken } from "@/apis/config";

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          clearAccessToken();         // wipes sessionStorage + cookie
          router.push("/auth");       // Next.js client-side redirect
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptor when the component unmounts
    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, [router]);
}