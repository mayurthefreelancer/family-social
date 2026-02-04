// app/actions/invite.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";
import { pool } from "../lib/db";
import { getUserFamily, getUserFamilyWithRole } from "../lib/family";
import { generateInviteToken } from "../lib/invite";
import { logAuditEvent } from "../lib/audit";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "./auth";
import crypto from "crypto";

export async function createInvite() {
  const user = await requireUser();
  const familyId = await getUserFamily(user.family_id);

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


export async function generateInvite() {
  const user = await requireUser();

  if (user.role !== "admin") {
    throw new Error("Not authorized");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await pool.query(
    `
    INSERT INTO invites (
      id, family_id, token, expires_at, created_by
    )
    VALUES (gen_random_uuid(), $1, $2, $3, $4)
    `,
    [user.family_id, token, expiresAt, user.id]
  );

  await logAuditEvent({
    familyId: user.family_id,
    actorUserId: user.id,
    action: "invite_created",
    entityType: "invite",
    entityId: token,
    metadata: { expiresAt },
  });

  return token;
}


export async function acceptInvite(
  token: string,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  await pool.query("BEGIN");

  try {
    const inviteRes = await pool.query(
      `
      SELECT *
      FROM invites
      WHERE token = $1
        AND used_at IS NULL
        AND expires_at > now()
      FOR UPDATE
      `,
      [token]
    );

    if (!inviteRes.rowCount) {
      throw new Error("Invalid invite");
    }

    const invite = inviteRes.rows[0];

    // Create user
    const userId = crypto.randomUUID();
    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users (id, email, password_hash, name)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, email, hash, name]
    );

    // Add to family
    await pool.query(
      `
      INSERT INTO family_members (user_id, family_id, role)
      VALUES ($1, $2, 'member')
      `,
      [userId, invite.family_id]
    );

    // Mark invite used
    await pool.query(
      `
      UPDATE invites
      SET used_at = now()
      WHERE id = $1
      `,
      [invite.id]
    );

    await logAuditEvent({
      familyId: invite.family_id,
      actorUserId: userId,
      action: "member_joined",
      entityType: "user",
      entityId: userId,
      metadata: {},
    });

    await pool.query("COMMIT");

    await createSession(userId);
    redirect("/feed");
  } catch (e) {
    await pool.query("ROLLBACK");
    throw e;
  }
}
