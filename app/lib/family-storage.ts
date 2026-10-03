// app/lib/family-storage.ts
import fs from "fs/promises";
import path from "path";

/**
 * Saves a family avatar emblem image locally in public/uploads/family/[familyId]/
 */
export async function saveFamilyAvatar(
  file: File,
  familyId: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const dir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "family",
    familyId
  );

  await fs.mkdir(dir, { recursive: true });

  const filename = `avatar.jpg`;
  const filepath = path.join(dir, filename);

  await fs.writeFile(filepath, buffer);

  return `/uploads/family/${familyId}/${filename}?v=${Date.now()}`;
}

/**
 * Saves a family canopy banner backdrop image locally in public/uploads/family/[familyId]/
 */
export async function saveFamilyBackdrop(
  file: File,
  familyId: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const dir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "family",
    familyId
  );

  await fs.mkdir(dir, { recursive: true });

  const filename = `backdrop.jpg`;
  const filepath = path.join(dir, filename);

  await fs.writeFile(filepath, buffer);

  return `/uploads/family/${familyId}/${filename}?v=${Date.now()}`;
}
