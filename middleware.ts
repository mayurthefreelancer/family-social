// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
    "/feed",
    "/create-family",
];

const AUTH_ROUTES = [
    "/login",
    "/register",
];

export function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("family_social_session");

    const isLoggedIn = !!sessionCookie;
    const pathname = request.nextUrl.pathname;

    // 1️⃣ Protect authenticated routes
    if (
        PROTECTED_ROUTES.some((path) => pathname.startsWith(path)) &&
        !isLoggedIn
    ) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    // 2️⃣ Prevent logged-in users from accessing auth pages
    if (
        AUTH_ROUTES.some((path) => pathname.startsWith(path)) &&
        isLoggedIn
    ) {
        return NextResponse.redirect(
            new URL("/feed", request.url)
        );
    }

    if (
        pathname.startsWith("/invite") &&
        isLoggedIn
    ) {
        return NextResponse.redirect(
            new URL("/feed", request.url)
        );
    }


    return NextResponse.next();
}

export const config = {
    matcher: [
        "/feed/:path*",
        "/login",
        "/register",
        "/create-family",
        "/invite/:path*",
    ],
};
