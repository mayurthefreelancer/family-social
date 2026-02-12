"use server"

import { logAuditEvent } from "@/app/lib/audit"
import { pool } from "@/app/lib/db"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function resetPassword(token: string, newPassword: string) {
  const client = await pool.connect()

  try {
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex")

    const result = await client.query(
      `
      SELECT * FROM password_reset_tokens
      WHERE token_hash = $1
      AND used_at IS NULL
      AND expires_at > NOW()
      `,
      [tokenHash]
    )

    if (result.rowCount === 0) {
      return { error: "Invalid or expired token" }
    }

    const resetRecord = result.rows[0]

    const passwordHash = await bcrypt.hash(newPassword, 10)

    await client.query("BEGIN")

    await client.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [passwordHash, resetRecord.user_id]
    )

    await client.query(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`,
      [resetRecord.id]
    )

    await client.query("COMMIT")

    await logAuditEvent({
      familyId: resetRecord.family_id,
      actorUserId: resetRecord.user_id,
      action: "password_reset",
      entityType: "user",
      entityId: resetRecord.user_id,
      metadata: {},
    })

    return { success: true }
  } catch (e) {
    await client.query("ROLLBACK")
    throw e
  } finally {
    client.release()
  }
}
