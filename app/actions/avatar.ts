"use server"

import { revalidatePath } from "next/cache"
import { requireUser } from "@/app/lib/auth"
import { pool } from "@/app/lib/db"
import { saveAvatarLocally } from "../lib/avatar-storage"

type UploadState = {
  error?: string
}

export async function uploadAvatar(
  prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  try {
    const user = await requireUser()

    const file = formData.get("avatar") as File | null

    if (!file || file.size === 0) {
      return { error: "Please select a photo before uploading." }
    }

    if (!file.type.startsWith("image/")) {
      return { error: "Only image files are allowed." }
    }

    if (file.size > 2_000_000) {
      return { error: "Image must be smaller than 2MB." }
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

    await pool.query(
      `
      UPDATE users
      SET avatar_url = $1
      WHERE id = $2
      `,
      [avatarUrl, user.id]
    )

    revalidatePath("/profile")

    return {} // success → no error
  } catch {
    return { error: "Something went wrong. Please try again." }
  }
}
