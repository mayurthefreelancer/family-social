// app/actions/invite.ts
"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { logAuditEvent } from "../lib/audit";
import { requireUser } from "../lib/auth";
import { pool } from "../lib/db";
import { getUserFamilyWithRole } from "../lib/family";

/**
 * Generate a new cryptographically secure invitation token for the family.
 * Unifies previous split actions (createInvite / generateInvite) into a single atomic action.
 */
export async function generateInvite(options?: { role?: "admin" | "member" }) {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }
  if (user.role !== "admin") {
    throw new Error("Only family organizers and admins can generate invitation links.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

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
    metadata: {
      expiresAt,
      role: options?.role || "member",
    },
  });

  return token;
}

/**
 * Backward-compatible alias for generateInvite
 */
export async function createInvite() {
  return generateInvite();
}

/**
 * Revoke an active invitation token.
 */
export async function revokeInvite(token: string) {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }
  const membership = await getUserFamilyWithRole(user.id);

  if (!membership || membership.role !== "admin") {
    throw new Error("Unauthorized to revoke invitations.");
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
  revalidatePath("/family");
}

/**
 * Accept an invite for an unauthenticated user (either brand new or existing user signing in via invite).
 * Resolves Pitfall 1 (unauthenticated redirect loop) and Pitfall 2 (unique email constraint collision).
 */
export async function acceptInvite(
  token: string,
  formData: FormData
): Promise<{ success: boolean; error?: string; email?: string; isExistingUser?: boolean }> {
  const emailRaw = formData.get("email");
  const passwordRaw = formData.get("password");
  const nameRaw = formData.get("name");

  if (typeof emailRaw !== "string" || typeof passwordRaw !== "string" || typeof nameRaw !== "string") {
    return { success: false, error: "Please fill out all required fields." };
  }

  const email = emailRaw.toLowerCase().trim();
  const password = passwordRaw;
  const name = nameRaw.trim();

  if (!email || !password || !name) {
    return { success: false, error: "Name, email, and password cannot be empty." };
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Verify invitation token with row-level lock
    const inviteRes = await client.query(
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
      await client.query("ROLLBACK");
      return { success: false, error: "This invitation link is invalid or has expired." };
    }

    const invite = inviteRes.rows[0];

    // 2. Check if a user with this email already exists
    const existingUserRes = await client.query(
      `SELECT id, password_hash, name FROM users WHERE email = $1`,
      [email]
    );

    let resolvedUserId: string;
    let isExistingUser = false;

    if (existingUserRes.rowCount && existingUserRes.rowCount > 0) {
      // Existing user: verify password
      const existingUser = existingUserRes.rows[0];
      if (!existingUser.password_hash) {
        await client.query("ROLLBACK");
        return {
          success: false,
          error: "An account with this email exists via Google login. Please sign in with Google first.",
        };
      }

      const isMatch = await bcrypt.compare(password, existingUser.password_hash);
      if (!isMatch) {
        await client.query("ROLLBACK");
        return {
          success: false,
          error: "An account with this email already exists, but the password provided was incorrect.",
        };
      }

      resolvedUserId = existingUser.id;
      isExistingUser = true;

      // Update name if previously blank or generic
      if (!existingUser.name && name) {
        await client.query(`UPDATE users SET name = $1 WHERE id = $2`, [name, resolvedUserId]);
      }
    } else {
      // New user: hash password and insert
      resolvedUserId = crypto.randomUUID();
      const hash = await bcrypt.hash(password, 10);

      await client.query(
        `
        INSERT INTO users (id, email, password_hash, name)
        VALUES ($1, $2, $3, $4)
        `,
        [resolvedUserId, email, hash, name]
      );
    }

    // 3. Query role from audit log if specified
    const auditRes = await client.query(
      `SELECT metadata->>'role' as role FROM audit_logs WHERE action = 'invite_created' AND entity_id = $1 LIMIT 1`,
      [token]
    );
    const assignedRole = auditRes.rows[0]?.role === "admin" ? "admin" : "member";

    // Bind to family_members idempotently
    await client.query(
      `
      INSERT INTO family_members (user_id, family_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, family_id) DO UPDATE SET role = EXCLUDED.role
      `,
      [resolvedUserId, invite.family_id, assignedRole]
    );

    // 4. Create or update profile for this family sanctuary
    await client.query(
      `
      INSERT INTO profiles (user_id, family_id, display_name, avatar_url, email)
      VALUES ($1, $2, $3, NULL, $4)
      ON CONFLICT (user_id) DO UPDATE
      SET display_name = COALESCE(profiles.display_name, EXCLUDED.display_name),
          family_id = EXCLUDED.family_id
      `,
      [resolvedUserId, invite.family_id, name, email]
    );

    // 5. Mark invite as redeemed
    await client.query(
      `
      UPDATE invites
      SET used_at = now()
      WHERE id = $1
      `,
      [invite.id]
    );

    // 6. Log audit event within the transaction using the same client
    await logAuditEvent({
      familyId: invite.family_id,
      actorUserId: resolvedUserId,
      action: "member_joined",
      entityType: "user",
      entityId: resolvedUserId,
      metadata: { isExistingUser },
      client,
    });

    await client.query("COMMIT");

    return {
      success: true,
      email,
      isExistingUser,
    };
  } catch (e: any) {
    await client.query("ROLLBACK");
    console.error("[acceptInvite] ERROR:", e);
    return { success: false, error: e?.message ?? "An unexpected error occurred while accepting the invitation." };
  } finally {
    client.release();
  }
}

/**
 * Accept invite for an ALREADY authenticated user.
 * Resolves Pitfall 3 (ghost session detection) allowing 1-click family joining.
 */
export async function acceptInviteAuthenticated(
  token: string
): Promise<{ success: boolean; error?: string; familyId?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to accept this invitation." };
  }

  const userId = session.user.id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Verify invitation token with row-level lock
    const inviteRes = await client.query(
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
      await client.query("ROLLBACK");
      return { success: false, error: "This invitation link is invalid or has already been used." };
    }

    const invite = inviteRes.rows[0];

    // 2. Fetch current user info
    const userRes = await client.query(`SELECT id, name, email FROM users WHERE id = $1`, [userId]);
    const currentUser = userRes.rows[0];
    if (!currentUser) {
      await client.query("ROLLBACK");
      return { success: false, error: "User record not found." };
    }

    // 3. Query role from audit log if specified
    const auditRes = await client.query(
      `SELECT metadata->>'role' as role FROM audit_logs WHERE action = 'invite_created' AND entity_id = $1 LIMIT 1`,
      [token]
    );
    const assignedRole = auditRes.rows[0]?.role === "admin" ? "admin" : "member";

    // Add to family_members idempotently
    await client.query(
      `
      INSERT INTO family_members (user_id, family_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, family_id) DO UPDATE SET role = EXCLUDED.role
      `,
      [userId, invite.family_id, assignedRole]
    );

    // 4. Upsert profile for this family
    await client.query(
      `
      INSERT INTO profiles (user_id, family_id, display_name, email)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE
      SET family_id = EXCLUDED.family_id
      `,
      [userId, invite.family_id, currentUser.name, currentUser.email]
    );

    // 5. Mark invite used
    await client.query(`UPDATE invites SET used_at = now() WHERE id = $1`, [invite.id]);

    // 6. Log audit event within the transaction using the same client
    await logAuditEvent({
      familyId: invite.family_id,
      actorUserId: userId,
      action: "member_joined",
      entityType: "user",
      entityId: userId,
      metadata: { method: "authenticated_one_click" },
      client,
    });

    await client.query("COMMIT");

    return { success: true, familyId: invite.family_id };
  } catch (e: any) {
    await client.query("ROLLBACK");
    console.error("[acceptInviteAuthenticated] ERROR:", e);
    return { success: false, error: e?.message ?? "Failed to join family sanctuary." };
  } finally {
    client.release();
  }
}
