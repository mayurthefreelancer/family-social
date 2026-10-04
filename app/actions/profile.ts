"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { requireUser } from "../lib/auth"
import { saveAvatarLocally } from "../lib/avatar-storage"
import { pool } from "../lib/db"
import { logAuditEvent } from "../lib/audit"

export async function uploadAvatar(formData: FormData) {
  try {
    const user = await requireUser()
    if (!user.family_id) {
      redirect("/create-family");
    }
    const file = formData.get("avatar") as File | null
    if (!file || file.size === 0) {
      return { success: false, error: "Please select an image to upload" }
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files (JPEG, PNG, WebP) are allowed" }
    }

    if (file.size > 2_000_000) {
      return { success: false, error: "Image must be under 2MB" }
    }

    const avatarUrl = await saveAvatarLocally(
      file,
      user.family_id,
      user.id
    )

    await pool.query(
      `
      UPDATE profiles
      SET avatar_url = $1,
          updated_at = NOW()
      WHERE user_id = $2
        AND family_id = $3
      `,
      [avatarUrl, user.id, user.family_id]
    )

    await pool.query(
      `
      UPDATE users
      SET avatar_url = $1
      WHERE id = $2
      `,
      [avatarUrl, user.id]
    )

    revalidatePath("/profile")
    revalidatePath("/profile/edit")
    revalidatePath("/feed")
    revalidatePath("/", "layout")

    return { success: true, avatarUrl }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    console.error("[uploadAvatar error]:", err);
    return { success: false, error: err?.message || "Failed to upload avatar" }
  }
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser()
  if (!user.family_id) {
    redirect("/create-family");
  }
  const displayName = formData.get("display_name")?.toString().trim()
  const bio = formData.get("bio")?.toString().trim()
  const username = formData.get("username")?.toString().trim()

  if (!displayName) {
    throw new Error("Display name is required")
  }

  await pool.query(
    `
    UPDATE profiles
    SET display_name = $1,
        bio = $2,
        username = $3,
        updated_at = NOW()
    WHERE user_id = $4
      AND family_id = $5
    `,
    [displayName, bio || null, username || null, user.id, user.family_id]
  )

  // navigate to profile page after update
  redirect("/profile")
}

/**
 * Family member request for a password reset code. Automatically logs a ticket for SuperAdmin.
 */
export async function requestPasswordResetCode(reason?: string) {
  try {
    const user = await requireUser();
    if (!user.family_id) {
      return { error: "Family context required." };
    }

    const ticketCode = `TIK-${Math.floor(1000 + Math.random() * 9000)}`;

    await pool.query(
      `
      INSERT INTO admin_tickets (
        ticket_code,
        family_id,
        requester_email,
        category,
        priority,
        status,
        subject,
        description,
        target_entity_type,
        target_entity_id
      )
      VALUES ($1, $2, $3, 'password_reset', 'high', 'open', $4, $5, 'user', $6)
      `,
      [
        ticketCode,
        user.family_id,
        user.email,
        `Password Reset Code Request: ${user.displayName || user.email}`,
        `Member ${user.displayName || user.email} requested a password reset code. Justification: ${reason || "User requested self-service password reset code from their profile."}`,
        user.id,
      ]
    );

    await logAuditEvent({
      familyId: user.family_id,
      actorUserId: user.id,
      action: "password_reset_code_ticket_created",
      entityType: "ticket",
      metadata: { ticketCode, reason },
    });

    revalidatePath("/profile");
    revalidatePath("/admin");
    return { success: true, ticketCode };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: err?.message || "Failed to submit password reset request." };
  }
}

/**
 * Family member request to change their associated tag (KIN -> Grandmother / Uncle / etc.)
 */
export async function requestTagChange(requestedTag: string, reason?: string) {
  try {
    const user = await requireUser();
    if (!user.family_id) {
      return { error: "Family context required." };
    }

    const cleanTag = requestedTag.trim();
    if (!cleanTag || cleanTag.length > 30) {
      return { error: "Requested tag must be between 1 and 30 characters." };
    }

    const ticketCode = `TIK-${Math.floor(1000 + Math.random() * 9000)}`;

    await pool.query(
      `
      INSERT INTO admin_tickets (
        ticket_code,
        family_id,
        requester_email,
        category,
        priority,
        status,
        subject,
        description,
        target_entity_type,
        target_entity_id
      )
      VALUES ($1, $2, $3, 'tag_change', 'medium', 'open', $4, $5, 'user', $6)
      `,
      [
        ticketCode,
        user.family_id,
        user.email,
        `Tag/Role Change Request: ${user.displayName || user.email} -> "${cleanTag}"`,
        `Member ${user.displayName || user.email} requested to change their family tag from current label to "${cleanTag}". Requested new tag: "${cleanTag}". Notes: ${reason || "None"}`,
        user.id,
      ]
    );

    await logAuditEvent({
      familyId: user.family_id,
      actorUserId: user.id,
      action: "tag_change_ticket_created",
      entityType: "ticket",
      metadata: { ticketCode, requestedTag: cleanTag, reason },
    });

    revalidatePath("/profile");
    revalidatePath("/admin");
    return { success: true, ticketCode };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: err?.message || "Failed to submit tag change request." };
  }
}
