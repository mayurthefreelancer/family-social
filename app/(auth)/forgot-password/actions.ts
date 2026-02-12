"use server"

import { pool } from "@/app/lib/db"
import crypto from "crypto"

export async function requestPasswordReset(email: string) {
  const client = await pool.connect()

  try {
    // get family id as well to associate token with family from profiles table
    const userResult = await client.query(
      `
      SELECT user_id, family_id FROM profiles WHERE email = $1
      `,
      [email]
    )
   
    
    if (userResult.rowCount === 0) {
      // Prevent email enumeration
      return { success: true }
    }
    
    const family_id = userResult.rows[0].family_id
    const user_id = userResult.rows[0].user_id

    const rawToken = crypto.randomBytes(32).toString("hex")
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await client.query(
      `
      INSERT INTO password_reset_tokens (family_id, user_id, token_hash, expires_at)
      VALUES ($1, $2, $3, $4)
      `,
      [family_id, user_id, tokenHash, expiresAt]
    )

    // For now (no email service yet), return token
    return { success: true, token: rawToken }
  } finally {
    client.release()
  }
}
