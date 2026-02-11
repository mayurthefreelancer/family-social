import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "./session";
import { pool } from "./db";

export type AuthUser = {
  id: string;
  name: string;
  family_id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
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

  if (!res.rowCount) redirect("/login");

  // User exists but has no family (possible after register)
  if (!user) {
    redirect("/create-family");
  }

  return user;
}

export async function requireLoggedInUser(): Promise<AuthUser> {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const { rows } = await pool.query(
    `
    SELECT
      u.id,
      u.email,

      p.display_name,
      p.avatar_url,

      fm.family_id,
      fm.role
    FROM users u

    JOIN family_members fm
      ON fm.user_id = u.id

    JOIN profiles p
      ON p.user_id = u.id
     AND p.family_id = fm.family_id

    WHERE u.id = $1
    `,
    [session.userId]
  );

  const row = rows[0];

  if (!row) {
    // extremely defensive, but safe
    redirect("/login");
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    family_id: row.family_id,
    role: row.role,
  };
}

