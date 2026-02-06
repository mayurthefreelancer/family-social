// lib/avatar-storage.ts
import fs from "fs/promises"
import path from "path"

export async function saveAvatarLocally(
  file: File,
  familyId: string,
  userId: string
) {
  const buffer = Buffer.from(await file.arrayBuffer())

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "avatars",
    familyId
  )

  await fs.mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, `${userId}.jpg`)
  await fs.writeFile(filePath, buffer)

  return `/uploads/avatars/${familyId}/${userId}.jpg`
}
