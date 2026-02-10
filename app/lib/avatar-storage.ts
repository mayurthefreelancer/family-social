import fs from "fs/promises"
import path from "path"

export async function saveAvatarLocally(
  file: File,
  familyId: string,
  userId: string
) {
  const buffer = Buffer.from(await file.arrayBuffer())

  const dir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "avatars",
    familyId
  )

  await fs.mkdir(dir, { recursive: true })

  const filename = `${userId}.jpg`
  const filepath = path.join(dir, filename)

  await fs.writeFile(filepath, buffer)

  // cache-busting is IMPORTANT
  return `/uploads/avatars/${familyId}/${filename}?v=${Date.now()}`
}
