// app/actions/family.ts
"use server";

import { requireUserId, requireFamilyUser } from "../lib/auth";
import { pool } from "../lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveFamilyAvatar, saveFamilyBackdrop } from "../lib/family-storage";
import { logAuditEvent } from "../lib/audit";

export async function createFamily(name: string) {
  const userId = await requireUserId();

  const familyRes = await pool.query(
    `INSERT INTO families (name, created_by)
     VALUES ($1, $2)
     RETURNING id`,
    [name, userId]
  );

  await pool.query(
    `INSERT INTO family_members (user_id, family_id, role)
     VALUES ($1, $2, 'admin')`,
    [userId, familyRes.rows[0].id]
  );

  redirect(`/feed`);
}

/**
 * Updates family name and description. Only accessible by family admins.
 */
export async function updateFamilyInfo(prevState: any, formData: FormData) {
  try {
    const user = await requireFamilyUser();
    if (user.role !== "admin") {
      return { error: "Only family admins can modify family settings." };
    }

    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() ?? "";

    if (!name || name.length < 2) {
      return { error: "Family name must be at least 2 characters long." };
    }

    if (name.length > 80) {
      return { error: "Family name cannot exceed 80 characters." };
    }

    if (description.length > 500) {
      return { error: "Family description cannot exceed 500 characters." };
    }

    await pool.query(
      `
      UPDATE families
      SET name = $1,
          description = $2,
          updated_at = NOW()
      WHERE id = $3
      `,
      [name, description || null, user.family_id]
    );

    await logAuditEvent({
      familyId: user.family_id,
      actorUserId: user.id,
      action: "family_info_updated",
      entityType: "family",
      entityId: user.family_id,
      metadata: { name, description },
    });

    revalidatePath("/family");
    revalidatePath("/feed");
    revalidatePath("/", "layout");

    return { success: true, message: "Family details saved successfully!" };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: err?.message || "Failed to update family information." };
  }
}

/**
 * Uploads and sets the family avatar crest.
 */
export async function uploadFamilyAvatar(prevState: any, formData: FormData) {
  try {
    const user = await requireFamilyUser();
    if (user.role !== "admin") {
      return { error: "Only family admins can update the family avatar." };
    }

    const file = formData.get("familyAvatar") as File | null;
    if (!file || file.size === 0) {
      return { error: "Please select an image file to upload." };
    }

    if (!file.type.startsWith("image/")) {
      return { error: "Only image files (JPEG, PNG, WebP) are allowed." };
    }

    if (file.size > 3_000_000) {
      return { error: "Avatar image must be smaller than 3MB." };
    }

    const avatarUrl = await saveFamilyAvatar(file, user.family_id);

    await pool.query(
      `
      UPDATE families
      SET avatar_url = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [avatarUrl, user.family_id]
    );

    await logAuditEvent({
      familyId: user.family_id,
      actorUserId: user.id,
      action: "family_avatar_updated",
      entityType: "family",
      entityId: user.family_id,
      metadata: { avatarUrl },
    });

    revalidatePath("/family");
    revalidatePath("/feed");
    revalidatePath("/", "layout");

    return { success: true, avatarUrl, message: "Family crest updated successfully!" };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: err?.message || "Failed to upload family avatar." };
  }
}

/**
 * Uploads and sets the family backdrop canopy banner image.
 */
export async function uploadFamilyBackdrop(prevState: any, formData: FormData) {
  try {
    const user = await requireFamilyUser();
    if (user.role !== "admin") {
      return { error: "Only family admins can update the family banner backdrop." };
    }

    const file = formData.get("familyBackdrop") as File | null;
    if (!file || file.size === 0) {
      return { error: "Please select an image file to upload." };
    }

    if (!file.type.startsWith("image/")) {
      return { error: "Only image files (JPEG, PNG, WebP) are allowed." };
    }

    if (file.size > 8_000_000) {
      return { error: "Backdrop image must be smaller than 8MB." };
    }

    const backdropUrl = await saveFamilyBackdrop(file, user.family_id);

    await pool.query(
      `
      UPDATE families
      SET backdrop_url = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [backdropUrl, user.family_id]
    );

    await logAuditEvent({
      familyId: user.family_id,
      actorUserId: user.id,
      action: "family_backdrop_updated",
      entityType: "family",
      entityId: user.family_id,
      metadata: { backdropUrl },
    });

    revalidatePath("/family");
    revalidatePath("/feed");
    revalidatePath("/", "layout");

    return { success: true, backdropUrl, message: "Family banner backdrop updated successfully!" };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: err?.message || "Failed to upload banner backdrop." };
  }
}

/**
 * Family Admin action to raise a member removal request ticket for SuperAdmin.
 */
export async function requestMemberRemoval(targetUserId: string, reason: string) {
  try {
    const admin = await requireFamilyUser();
    if (admin.role !== "admin") {
      return { error: "Only family organizers can request member removal." };
    }

    if (admin.id === targetUserId) {
      return { error: "You cannot request removal of yourself through this action." };
    }

    // Lookup target member
    const targetRes = await pool.query(
      `SELECT u.name, u.email FROM users u JOIN family_members fm ON fm.user_id = u.id WHERE fm.family_id = $1 AND u.id = $2`,
      [admin.family_id, targetUserId]
    );

    if (targetRes.rowCount === 0) {
      return { error: "Target member is not found in your family." };
    }

    const targetUser = targetRes.rows[0];
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
      VALUES ($1, $2, $3, 'member_removal', 'high', 'open', $4, $5, 'user', $6)
      `,
      [
        ticketCode,
        admin.family_id,
        admin.email,
        `Member Removal Request: ${targetUser.name} (${targetUser.email})`,
        `Family Admin ${admin.displayName} (${admin.email}) requested removal of member ${targetUser.name} (${targetUser.email}) from family. Stated reason: ${reason || "Family administrator requested member departure."}`,
        targetUserId,
      ]
    );

    await logAuditEvent({
      familyId: admin.family_id,
      actorUserId: admin.id,
      action: "member_removal_ticket_created",
      entityType: "ticket",
      entityId: targetUserId,
      metadata: { ticketCode, targetEmail: targetUser.email, reason },
    });

    revalidatePath("/family");
    revalidatePath("/admin");
    return { success: true, ticketCode, targetName: targetUser.name };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: err?.message || "Failed to raise member removal request." };
  }
}

