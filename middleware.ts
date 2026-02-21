// middleware.ts — FIXED
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // At this point, withAuth has already verified the token exists.
    // Redirect authenticated users away from auth pages.
    const isAuthRoute =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register") ||
      req.nextUrl.pathname.startsWith("/forgot-password") ||
      req.nextUrl.pathname.startsWith("/reset-password");

    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/feed", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      // withAuth only runs the middleware function if this returns true.
      // For auth routes, we want it to run (to redirect away if logged in).
      // For protected routes, we need a valid token.
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        const isAuthRoute =
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/forgot-password") ||
          pathname.startsWith("/reset-password");

        // Allow unauthenticated users to access auth routes
        if (isAuthRoute) return true;

        // For everything else, require token
        return !!token;
      },
    },
  }
);

export const config = {
  // CRITICAL: Include auth routes so logged-in users get redirected away.
  // Also include create-family and profile routes.
  matcher: [
    "/feed/:path*",
    "/family/:path*",
    "/post/:path*",
    "/profile/:path*",
    "/create-family",
    "/login",
    "/forgot-password",
    "/reset-password",
  ],
};