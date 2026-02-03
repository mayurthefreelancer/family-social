import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "./session";
import { pool } from "./db";

export type AuthUser = {
  id: string;
  name: string;
  family_id: string;
  role: "admin" | "member";
};

export async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session.userId) {
    redirect("/login");
  }
  return session.userId;
}

export async function requireUser(): Promise<AuthUser> {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const res = await pool.query(
    `
    SELECT
      u.id,
      u.email,
      u.name,
      fm.family_id,
      fm.role
    FROM users u
    JOIN family_members fm ON fm.user_id = u.id
    WHERE u.id = $1
    `,
    [session.userId]
  );

  const user = res.rows[0];
  console.log("👋🏼user: for session.userId", session.userId, "is", user);

  if (!res.rowCount) redirect("/login");

  // User exists but has no family (possible after register)
  if (!user) {
    redirect("/create-family");
  }

  return user;
}
