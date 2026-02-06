import { requireUser } from "./auth"
import { pool } from "./db"

export interface Profile {
  user_id: string
  family_id: string
  display_name: string
  bio: string
  avatar_url?: string
  username?: string
  created_at: string
  updated_at: string
  role?: string
  post_count?: number
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser()
  const displayName = formData.get("display_name") as string
  const bio = formData.get("bio") as string
  const avatarUrl = formData.get("avatar_url") as string

  await pool.query(
    `
    UPDATE profiles
    SET display_name = $1,
        bio = $2,
        avatar_url = $3,
        updated_at = NOW()
    WHERE user_id = $4
      AND family_id = $5
    `,
    [displayName, bio, avatarUrl, user.id, user.family_id]
  )
}

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

