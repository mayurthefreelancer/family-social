// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/feed", "/create-family"];
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // VERY IMPORTANT:
  // Middleware can ONLY check if a cookie exists.
  // It must NOT read or decode sessions.
  const hasSessionCookie = request.cookies.has("family_social_session");

  // Home route routing
  if (pathname === "/") {
    if (!hasSessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  // Protect authenticated routes
  if (
    PROTECTED_ROUTES.some((path) => pathname.startsWith(path)) &&
    !hasSessionCookie
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent logged-in users from accessing auth pages
  if (
    AUTH_ROUTES.some((path) => pathname.startsWith(path)) &&
    hasSessionCookie
  ) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/feed", "/login", "/register", "/create-family"],
};
