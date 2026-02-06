"use server"

import { revalidatePath } from "next/cache"
import { pool } from "../lib/db"
import { requireUser } from "../lib/auth"
import { saveAvatarLocally } from "../lib/avatar-storage"

export async function uploadAvatar(formData: FormData) {
  const user = await requireUser()

  const file = formData.get("avatar") as File | null
  if (!file) throw new Error("No file selected")

  if (!file.type.startsWith("image/")) {
    throw new Error("Only images allowed")
  }

  if (file.size > 2_000_000) {
    throw new Error("Max size is 2MB")
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

  revalidatePath("/profile")
}
