import { NextResponse, NextRequest } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, SessionData } from "./app/lib/session"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(req, res, sessionOptions)

  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register") ||
    req.nextUrl.pathname.startsWith("/forgot-password") ||
    req.nextUrl.pathname.startsWith("/reset-password")

  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/feed") ||
    req.nextUrl.pathname.startsWith("/family")

  if (!session.userId && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (session.userId && isAuthRoute) {
    return NextResponse.redirect(new URL("/feed", req.url))
  }

  return res
}
