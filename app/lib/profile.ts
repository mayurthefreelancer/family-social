import { requireUser } from "./auth"
import { pool } from "./db"

export async function getMyProfile() {
  const user = await requireUser()

  const { rows } = await pool.query(
    `
    SELECT *
    FROM profiles
    WHERE user_id = $1
      AND family_id = $2
    `,
    [user.id, user.family_id]
  )

  return rows[0]
}

export async function getMemberProfile(memberUserId: string) {
  const user = await requireUser()

  const { rows } = await pool.query(
    `
    SELECT p.*, fm.role
    FROM profiles p
    JOIN family_members fm ON fm.user_id = p.user_id
    WHERE p.user_id = $1
      AND p.family_id = $2
    `,
    [memberUserId, user.family_id]
  )

  if (!rows.length) throw new Error("Profile not found")

  return rows[0]
}

