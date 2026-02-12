"use server"

import bcrypt from "bcryptjs"
import { pool } from "../lib/db"

export async function createFamilyAdmin(
  name: string,
  email: string,
  password: string,
  familyName: string
) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const passwordHash = await bcrypt.hash(password, 10)

    const userResult = await client.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [name, email, passwordHash]
    )

    const userId = userResult.rows[0].id

    const familyResult = await client.query(
      `
      INSERT INTO families (name, created_by)
      VALUES ($1, $2)
      RETURNING id
      `,
      [familyName, userId]
    )

    const familyId = familyResult.rows[0].id

    await client.query(
      `
      INSERT INTO family_members (user_id, family_id, role)
      VALUES ($1, $2, 'admin')
      `,
      [userId, familyId]
    )

    await client.query(
      `
      INSERT INTO profiles (user_id, family_id, display_name, email)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, familyId, name, email]
    )

    await client.query("COMMIT")

    return { success: true, userId }
  } catch (e) {
    await client.query("ROLLBACK")
    throw e
  } finally {
    client.release()
  }
}
