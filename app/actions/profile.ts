"use server"

import { redirect } from "next/navigation"
import { requireUser } from "../lib/auth"
import { saveAvatarLocally } from "../lib/avatar-storage"
import { pool } from "../lib/db"


export async function uploadAvatar(formData: FormData) {
  const user = await requireUser()
  if (!user.family_id) {
    redirect("/create-family");
  }
  const file = formData.get("avatar") as File | null
  if (!file || file.size === 0) {
    // This case can happen if the user submits the form without selecting a file
    throw new Error("Please select an image to upload")
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only images allowed")
  }

  if (file.size > 2_000_000) {
    throw new Error("Image must be under 2MB")
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

  redirect("/profile/edit")
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser()
  if (!user.family_id) {
    redirect("/create-family");
  }
  const displayName = formData.get("display_name")?.toString().trim()
  const bio = formData.get("bio")?.toString().trim()
  const username = formData.get("username")?.toString().trim()

  if (!displayName) {
    throw new Error("Display name is required")
  }

  await pool.query(
    `
    UPDATE profiles
    SET display_name = $1,
        bio = $2,
        username = $3,
        updated_at = NOW()
    WHERE user_id = $4
      AND family_id = $5
    `,
    [displayName, bio || null, username || null, user.id, user.family_id]
  )

  // navigate to profile page after update
  redirect("/profile")
}
