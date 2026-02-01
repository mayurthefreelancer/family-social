// app/actions/invite.ts
"use server";

import { requireUser } from "../lib/auth";
import { pool } from "../lib/db";
import { getUserFamily } from "../lib/family";
import { generateInviteToken } from "../lib/invite";

export async function createInvite() {
  const userId = await requireUser();
  const familyId = await getUserFamily(userId);

  if (!familyId) throw new Error("No family");

  // Optional: verify admin role
  const roleRes = await pool.query(
    `SELECT role FROM family_members
     WHERE user_id = $1 AND family_id = $2`,
    [userId, familyId]
  );

  if (roleRes.rows[0]?.role !== "admin") {
    throw new Error("Only admin can invite");
  }

  const token = generateInviteToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await pool.query(
    `INSERT INTO invites (token, family_id, expires_at)
     VALUES ($1, $2, $3)`,
    [token, familyId, expiresAt]
  );

  return token;
}
