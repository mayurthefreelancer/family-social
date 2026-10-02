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
  familyName: string;
  familyDescription?: string | null;
  familyAvatarUrl?: string | null;
  familyBackdropUrl?: string | null;
  isSuperadmin: boolean;
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
      u.is_superadmin,
      p.display_name,
      p.avatar_url,
      fm.family_id,
      fm.role,
      f.name AS family_name,
      f.description AS family_description,
      f.avatar_url AS family_avatar_url,
      f.backdrop_url AS family_backdrop_url
    FROM users u
    JOIN family_members fm ON fm.user_id = u.id
    JOIN profiles p ON p.user_id = u.id AND p.family_id = fm.family_id
    JOIN families f ON f.id = fm.family_id
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
    familyName: row.family_name,
    familyDescription: row.family_description,
    familyAvatarUrl: row.family_avatar_url,
    familyBackdropUrl: row.family_backdrop_url,
    isSuperadmin: Boolean(row.is_superadmin),
  };
}

export type SuperadminUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  isSuperadmin: boolean;
  familyId: string | null;
  familyName: string | null;
};

export async function requireSuperadmin(): Promise<SuperadminUser> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { rows } = await pool.query(
    `SELECT
      u.id,
      u.email,
      u.name,
      u.avatar_url,
      u.is_superadmin,
      fm.family_id,
      f.name AS family_name
    FROM users u
    LEFT JOIN family_members fm ON fm.user_id = u.id
    LEFT JOIN families f ON f.id = fm.family_id
    WHERE u.id = $1
    ORDER BY fm.joined_at ASC
    LIMIT 1`,
    [session.user.id]
  );

  const row = rows[0];
  if (!row || !row.is_superadmin) {
    // Only genuine platform superadmins are granted access; family admins redirect to feed
    redirect("/feed");
  }

  return {
    id: row.id,
    email: row.email,
    displayName: row.name,
    avatarUrl: row.avatar_url,
    isSuperadmin: true,
    familyId: row.family_id ?? null,
    familyName: row.family_name ?? null,
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