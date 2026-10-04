import { redirect } from "next/navigation"
import { requireUser } from "./auth"
import { pool } from "./db"

export interface Profile {
  user_id: string
  family_id: string
  display_name: string
  bio: string
  avatar_url?: string
  username?: string
  custom_tag?: string
  created_at: string
  updated_at: string
  role?: string
  post_count?: number
  family_name?: string
  family_backdrop_url?: string | null
}

export async function getMyProfile(): Promise<Profile> {
  const user = await requireUser()
  if (!user.family_id) {
    redirect("/create-family");
  }
  const { rows } = await pool.query(
    `
    SELECT p.*,
           fm.role,
           f.name AS family_name,
           f.backdrop_url AS family_backdrop_url
    FROM profiles p
    LEFT JOIN family_members fm ON fm.user_id = p.user_id AND fm.family_id = p.family_id
    LEFT JOIN families f ON f.id = p.family_id
    WHERE p.user_id = $1
      AND p.family_id = $2
    `,
    [user.id, user.family_id]
  )

  return rows[0]
}

export async function getMemberProfile(memberUserId: string) {
  const user = await requireUser()

  if (!user.family_id) {
    redirect("/create-family");
  }
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

