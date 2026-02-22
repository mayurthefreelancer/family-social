import "server-only";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { pool } from "./db";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  family_id: string;
  role: "admin" | "member";
};

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export async function requireFamilyUser(): Promise<AuthUser> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { rows } = await pool.query(
    `SELECT
      u.id,
      u.email,
      p.display_name,
      p.avatar_url,
      fm.family_id,
      fm.role
    FROM users u
    JOIN family_members fm ON fm.user_id = u.id
    JOIN profiles p ON p.user_id = u.id AND p.family_id = fm.family_id
    WHERE u.id = $1`,
    [session.user.id]
  );

  if (rows.length > 0) {
    console.log("[requireFamilyUser] first row:", { id: rows[0].id, family_id: rows[0].family_id });
  }

  const row = rows[0];
  if (!row) {
    redirect("/create-family");
  }

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    family_id: row.family_id,
    role: row.role,
  };
}

export async function requireUser(): Promise<AuthUser> {
  return requireFamilyUser();
}

export async function requireUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}