"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "../lib/auth"
import { pool } from "../lib/db"

export async function updateProfile(formData: FormData) {
  const user = await requireUser()

  const displayName = formData.get("display_name")?.toString().trim()
  const bio = formData.get("bio")?.toString().trim()
  const avatar = formData.get("avatar_url")?.toString().trim()

  if (!displayName) throw new Error("Display name required")

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
    [displayName, bio || null, avatar || null, user.id, user.family_id]
  )

  revalidatePath("/profile")
}
