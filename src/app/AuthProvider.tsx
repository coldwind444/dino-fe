"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthGuard();
  return <>{children}</>;
}
