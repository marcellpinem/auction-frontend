import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/auctions"];
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];
const ADMIN_ROUTES = ["/admin"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith("/auctions/"),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isVerifyEmailRoute = pathname.startsWith("/verify-email");

  // Kalau tidak ada refresh token dan bukan public/auth route → redirect ke login
  if (!refreshToken && !isPublicRoute && !isAuthRoute && !isVerifyEmailRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Kalau sudah login dan coba akses auth route → redirect ke dashboard
  if (refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
