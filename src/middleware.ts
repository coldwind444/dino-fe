// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/auth", "/login"];

const EXACT_PUBLIC_ROUTES = ["/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Route guard for payment success page to prevent direct access without VNPay parameters
  if (pathname === "/parent/payment/success") {
    const { searchParams } = request.nextUrl;
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");
    const vnpSecureHash = searchParams.get("vnp_SecureHash");

    if (!vnpResponseCode || !vnpSecureHash) {
      return NextResponse.redirect(new URL("/parent/dashboard", request.url));
    }
  }

  const isPublicRoute =
    EXACT_PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  const token = request.cookies.get("accessToken")?.value;

  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|backend/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
