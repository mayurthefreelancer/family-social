// app/actions/invite.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";
import { pool } from "../lib/db";
import { getUserFamily, getUserFamilyWithRole } from "../lib/family";
import { generateInviteToken } from "../lib/invite";
import { logAuditEvent } from "../lib/audit";

export async function createInvite() {
  const user = await requireUser();
  const familyId = await getUserFamily(user.familyId);

  if (!familyId) throw new Error("No family");

  // Optional: verify admin role
  const roleRes = await pool.query(
    `SELECT role FROM family_members
     WHERE user_id = $1 AND family_id = $2`,
    [user.id, familyId]
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

  // Log audit event
  await logAuditEvent({
    familyId,
    actorUserId: user.id,
    action: "invite_created",
    entityType: "invite",
    entityId: token,
    metadata: {
      expiresAt,
    },
  });

  return token;
}

export async function revokeInvite(token: string) {
  const user = await requireUser();
  const membership = await getUserFamilyWithRole(user.id);

  if (!membership || membership.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await pool.query(
    `
    DELETE FROM invites
    WHERE token = $1
      AND family_id = $2
    `,
    [token, membership.family_id]
  );

  await logAuditEvent({
    familyId: membership.family_id,
    actorUserId: user.id,
    action: "invite_revoked",
    entityType: "invite",
    entityId: token,
  });

  revalidatePath("/family/invites");
}