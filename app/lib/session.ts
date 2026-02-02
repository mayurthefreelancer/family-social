// lib/session.ts
import '../lib/server-only';
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";


export type SessionData = {
  userId?: string;
};

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "family_social_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function getSessionUser() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session.userId ?? null;
}
