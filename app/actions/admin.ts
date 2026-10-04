// app/actions/admin.ts
"use server";

import { requireSuperadmin } from "../lib/auth";
import { pool } from "../lib/db";
import { revalidatePath } from "next/cache";
import { logAuditEvent } from "../lib/audit";

/**
 * Superadmin action to toggle platform superadmin status for any user.
 */
export async function toggleSuperadmin(targetUserId: string) {
  try {
    const admin = await requireSuperadmin();

    // Check target user
    const userRes = await pool.query(
      `SELECT id, name, email, is_superadmin FROM users WHERE id = $1`,
      [targetUserId]
    );

    if (userRes.rowCount === 0) {
      return { error: "User not found." };
    }

    const targetUser = userRes.rows[0];
    const newStatus = !targetUser.is_superadmin;

    // Prevent demoting oneself if they are the only superadmin
    if (!newStatus && targetUserId === admin.id) {
      const countRes = await pool.query(
        `SELECT COUNT(*)::int as count FROM users WHERE is_superadmin = true`
      );
      if (countRes.rows[0].count <= 1) {
        return { error: "You cannot remove the last superadmin on the platform." };
      }
    }

    await pool.query(
      `UPDATE users SET is_superadmin = $1 WHERE id = $2`,
      [newStatus, targetUserId]
    );

    const resolvedFamilyId =
      admin.familyId ||
      (
        await pool.query(
          `SELECT family_id FROM family_members WHERE user_id = $1 LIMIT 1`,
          [targetUserId]
        )
      ).rows[0]?.family_id ||
      (await pool.query(`SELECT id FROM families LIMIT 1`)).rows[0]?.id;

    if (resolvedFamilyId) {
      await logAuditEvent({
        familyId: resolvedFamilyId,
        actorUserId: admin.id,
        action: newStatus ? "user_promoted_to_superadmin" : "user_demoted_from_superadmin",
        entityType: "user",
        entityId: targetUserId,
        metadata: { targetEmail: targetUser.email, newStatus },
      });
    }

    revalidatePath("/admin");
    return { success: true, isSuperadmin: newStatus };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: err?.message || "Failed to update superadmin role." };
  }
}

/**
 * Superadmin action to update status and resolution note of a governance ticket.
 */
export async function updateTicketStatus(
  ticketId: string,
  status: "open" | "in_progress" | "resolved" | "closed",
  resolutionNote?: string
) {
  try {
    const admin = await requireSuperadmin();

    const isResolving = status === "resolved" || status === "closed";

    const updateRes = await pool.query(
      `
      UPDATE admin_tickets
      SET
        status = $1,
        resolution_note = COALESCE($2, resolution_note),
        resolved_by = CASE WHEN $3 = true THEN $4 ELSE resolved_by END,
        resolved_at = CASE WHEN $3 = true THEN NOW() ELSE resolved_at END,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [status, resolutionNote || null, isResolving, admin.id, ticketId]
    );

    if (updateRes.rowCount === 0) {
      return { error: "Ticket not found." };
    }

    const ticket = updateRes.rows[0];

    if (ticket.family_id) {
      await logAuditEvent({
        familyId: ticket.family_id,
        actorUserId: admin.id,
        action: `ticket_${status}`,
        entityType: "ticket",
        entityId: ticket.id,
        metadata: {
          ticketCode: ticket.ticket_code,
          category: ticket.category,
          note: resolutionNote,
        },
      });
    }

    revalidatePath("/admin");
    return { success: true, ticket };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: err?.message || "Failed to update ticket status." };
  }
}

/**
 * Superadmin action to execute governance intervention specified in a ticket:
 * - member removal
 * - role reassignment / handover
 * - access control (superadmin toggle)
 * - family deletion / archive
 */
export async function executeTicketAction(
  ticketId: string,
  actionType:
    | "remove_member"
    | "change_role"
    | "toggle_superadmin"
    | "delete_family"
    | "generate_reset_code"
    | "approve_tag_change",
  params: {
    familyId?: string;
    userId?: string;
    newRole?: "admin" | "member";
    note?: string;
  }
) {
  try {
    const admin = await requireSuperadmin();

    // Verify ticket exists
    const ticketRes = await pool.query(`SELECT * FROM admin_tickets WHERE id = $1`, [ticketId]);
    if (ticketRes.rowCount === 0) {
      return { error: "Ticket not found." };
    }

    const ticket = ticketRes.rows[0];
    const familyId = params.familyId || ticket.family_id;
    const userId = params.userId || ticket.target_entity_id;
    let auditAction = "";
    let executionSummary = "";

    if (actionType === "remove_member") {
      if (!familyId || !userId) {
        return { error: "Family ID and Target User ID are required to remove a member." };
      }

      // Check if user is member
      const memberRes = await pool.query(
        `SELECT u.name, u.email, fm.role FROM family_members fm JOIN users u ON u.id = fm.user_id WHERE fm.family_id = $1 AND fm.user_id = $2`,
        [familyId, userId]
      );

      if (memberRes.rowCount === 0) {
        return { error: "User is not a member of the designated family." };
      }

      await pool.query(
        `DELETE FROM family_members WHERE family_id = $1 AND user_id = $2`,
        [familyId, userId]
      );

      auditAction = "superadmin_ticket_member_removed";
      executionSummary = `Executed removal of member (${memberRes.rows[0].email}) from family.`;
    } else if (actionType === "change_role") {
      if (!familyId || !userId || !params.newRole) {
        return { error: "Family ID, Target User ID, and newRole ('admin' | 'member') are required." };
      }

      await pool.query(
        `UPDATE family_members SET role = $1 WHERE family_id = $2 AND user_id = $3`,
        [params.newRole, familyId, userId]
      );

      auditAction = "superadmin_ticket_role_changed";
      executionSummary = `Reassigned member role to '${params.newRole}' for user in family.`;
    } else if (actionType === "toggle_superadmin") {
      if (!userId) {
        return { error: "Target User ID is required to adjust access control." };
      }

      const res = await toggleSuperadmin(userId);
      if (res?.error) {
        return { error: res.error };
      }

      auditAction = "superadmin_ticket_access_toggled";
      executionSummary = `Superadmin access status updated to ${res.isSuperadmin ? "Active" : "Revoked"}.`;
    } else if (actionType === "generate_reset_code") {
      if (!userId) {
        return { error: "Target User ID is required to generate a reset code." };
      }

      const resetCode = `RESET-${Math.floor(100000 + Math.random() * 900000)}`;
      auditAction = "superadmin_ticket_reset_code_issued";
      executionSummary = `Issued single-use reset authorization code: ${resetCode}. Code dispatched for user.`;
    } else if (actionType === "approve_tag_change") {
      if (!familyId || !userId) {
        return { error: "Family ID and Target User ID are required to approve tag change." };
      }

      const tagMatch = ticket.subject.match(/"([^"]+)"/) || ticket.description.match(/"([^"]+)"/);
      const newTag = (params.note?.trim()) || (tagMatch ? tagMatch[1] : "KIN");

      await pool.query(
        `UPDATE profiles SET custom_tag = $1, updated_at = NOW() WHERE user_id = $2 AND family_id = $3`,
        [newTag, userId, familyId]
      );

      auditAction = "superadmin_ticket_tag_approved";
      executionSummary = `Approved and applied custom tag '${newTag}' to user profile.`;
    } else if (actionType === "delete_family") {
      if (!familyId) {
        return { error: "Target Family ID is required for family deletion." };
      }

      // Get family name for audit
      const famRes = await pool.query(`SELECT name FROM families WHERE id = $1`, [familyId]);
      const famName = famRes.rows[0]?.name || "Family";

      // Cascading cleanup of family references
      await pool.query(`DELETE FROM invites WHERE family_id = $1`, [familyId]);
      await pool.query(`DELETE FROM comments WHERE family_id = $1`, [familyId]);
      await pool.query(`DELETE FROM posts WHERE family_id = $1`, [familyId]);
      await pool.query(`DELETE FROM family_members WHERE family_id = $1`, [familyId]);
      await pool.query(`DELETE FROM families WHERE id = $1`, [familyId]);

      auditAction = "superadmin_ticket_family_deleted";
      executionSummary = `Decommissioned family '${famName}' and purged associated records per ticket directive.`;
    } else {
      return { error: `Unsupported governance action '${actionType}'.` };
    }

    // Automatically resolve ticket and record full audit trail
    const finalNote = params.note
      ? `${executionSummary} Notes: ${params.note}`
      : executionSummary;

    await pool.query(
      `
      UPDATE admin_tickets
      SET
        status = 'resolved',
        resolution_note = $1,
        resolved_by = $2,
        resolved_at = NOW(),
        updated_at = NOW()
      WHERE id = $3
      `,
      [finalNote, admin.id, ticketId]
    );

    if (familyId) {
      const validFamRes = await pool.query(`SELECT id FROM families WHERE id = $1`, [familyId]);
      const validFamilyId = validFamRes.rowCount ? familyId : (await pool.query(`SELECT id FROM families LIMIT 1`)).rows[0]?.id;
      if (validFamilyId) {
        await logAuditEvent({
          familyId: validFamilyId,
          actorUserId: admin.id,
          action: auditAction,
          entityType: "ticket",
          entityId: ticketId,
          metadata: {
            ticketCode: ticket.ticket_code,
            actionType,
            executionSummary,
          },
        });
      }
    }

    revalidatePath("/admin");
    revalidatePath("/feed");
    revalidatePath("/family");
    return { success: true, message: executionSummary };
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message === "NEXT_REDIRECT") {
      throw err;
    }
    return { error: err?.message || "Failed to execute governance action." };
  }
}

/**
 * Create a new operational governance ticket (can be raised by superadmin or platform telemetry).
 */
export async function createAdminTicket(input: {
  familyId?: string;
  requesterEmail: string;
  category: string;
  priority?: "critical" | "high" | "medium" | "low";
  subject: string;
  description: string;
  targetEntityType?: "user" | "family" | "access_control" | "post";
  targetEntityId?: string;
}) {
  try {
    const code = `TIK-${Math.floor(1000 + Math.random() * 9000)}`;

    const res = await pool.query(
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
      VALUES ($1, $2, $3, $4, $5, 'open', $6, $7, $8, $9)
      RETURNING *
      `,
      [
        code,
        input.familyId || null,
        input.requesterEmail,
        input.category,
        input.priority || "medium",
        input.subject,
        input.description,
        input.targetEntityType || null,
        input.targetEntityId || null,
      ]
    );

    revalidatePath("/admin");
    return { success: true, ticket: res.rows[0] };
  } catch (err: any) {
    return { error: err?.message || "Failed to create governance ticket." };
  }
}

/**
 * Superadmin direct action to remove a member from a family.
 */
export async function adminRemoveFamilyMember(familyId: string, userId: string) {
  try {
    const admin = await requireSuperadmin();

    const memRes = await pool.query(
      `SELECT u.email FROM family_members fm JOIN users u ON u.id = fm.user_id WHERE fm.family_id = $1 AND fm.user_id = $2`,
      [familyId, userId]
    );

    if (memRes.rowCount === 0) {
      return { error: "Target user is not a member of this family." };
    }

    await pool.query(
      `DELETE FROM family_members WHERE family_id = $1 AND user_id = $2`,
      [familyId, userId]
    );

    await logAuditEvent({
      familyId,
      actorUserId: admin.id,
      action: "superadmin_direct_member_removed",
      entityType: "user",
      entityId: userId,
      metadata: { targetEmail: memRes.rows[0].email },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to remove member." };
  }
}

/**
 * Superadmin direct action to update a member role.
 */
export async function adminUpdateMemberRole(
  familyId: string,
  userId: string,
  newRole: "admin" | "member"
) {
  try {
    const admin = await requireSuperadmin();

    await pool.query(
      `UPDATE family_members SET role = $1 WHERE family_id = $2 AND user_id = $3`,
      [newRole, familyId, userId]
    );

    await logAuditEvent({
      familyId,
      actorUserId: admin.id,
      action: "superadmin_direct_role_updated",
      entityType: "user",
      entityId: userId,
      metadata: { newRole },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err?.message || "Failed to update member role." };
  }
}
