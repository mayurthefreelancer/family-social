// app/lib/post-photo-storage.ts
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Saves a post photo locally in public/uploads/posts/[familyId]/[postId]_[index]_[uuid].webp
 * and returns the relative public URL.
 */
export async function savePostPhoto(
  familyId: string,
  postId: string,
  file: File,
  index: number
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueId = crypto.randomUUID();
  const dir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "posts",
    familyId
  );

  await fs.mkdir(dir, { recursive: true });

  const filename = `${postId}_${index}_${uniqueId}.webp`;
  const filepath = path.join(dir, filename);

  await fs.writeFile(filepath, buffer);

  return `/uploads/posts/${familyId}/${filename}`;
}
