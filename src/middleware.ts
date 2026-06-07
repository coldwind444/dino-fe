// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/auth", "/login"];

const EXACT_PUBLIC_ROUTES = ["/"];
const PAYMENT_SUCCESS_ROUTE = "/parent/payment/success";

export function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  // VNPay returns to this route from an external site. The auth cookie may not
  // be sent on that cross-site navigation, so allow signed callbacks through.
  if (pathname === PAYMENT_SUCCESS_ROUTE) {
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");
    const vnpSecureHash = searchParams.get("vnp_SecureHash");

    if (!vnpResponseCode || !vnpSecureHash) {
      return NextResponse.redirect(new URL("/parent/dashboard", request.url));
    }

    return NextResponse.next();
  }

  const isPublicRoute =
    EXACT_PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  const token = request.cookies.get("accessToken")?.value;

  if (!isPublicRoute && !token) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|backend/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
