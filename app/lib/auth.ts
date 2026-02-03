import "server-only";

import { redirect } from "next/navigation";
import { getSession } from "./session";
import { pool } from "./db";

export type AuthUser = {
  id: string;
  name: string;
  familyId: string;
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

  if (!session.userId) {
    redirect("/login");
  }

  // Fetch user + family in one go
  const { rows } = await pool.query<AuthUser>(
    `
    SELECT
      u.id,
      u.name,
      fm.family_id AS "familyId"
    FROM users u
    JOIN family_members fm ON fm.user_id = u.id
    WHERE u.id = $1
    LIMIT 1
    `,
    [session.userId]
  );

  const user = rows[0];

  // User exists but has no family (possible after register)
  if (!user) {
    redirect("/create-family");
  }

  return user;
}
