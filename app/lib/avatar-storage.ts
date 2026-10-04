// app/lib/avatar-storage.ts
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

function isLocalEnvironment(): boolean {
  if (process.env.STORAGE_PROVIDER === "local") return true;
  if (process.env.STORAGE_PROVIDER === "supabase") return false;

  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    process.env.NODE_ENV === "production";

  return !isServerless;
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

/**
 * Saves a user portrait avatar using environment-aware storage:
 * - Local Machine (Development): Stores in local filesystem (public/uploads/avatar/[familyId]/).
 * - Non-Dev (Vercel / Production): Stores in Supabase Storage bucket ('avatars').
 * - Fallback: Base64 Data URL if non-dev storage is unconfigured.
 */
export async function saveAvatarLocally(
  file: File,
  familyId: string,
  userId: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${userId}.jpg`;
  const mimeType = file.type || "image/jpeg";

  // 1. Local Machine: Prioritize Local Filesystem
  if (isLocalEnvironment()) {
    try {
      const dir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "avatar",
        familyId
      );
      await fs.mkdir(dir, { recursive: true });
      const filepath = path.join(dir, filename);
      await fs.writeFile(filepath, buffer);
      return `/uploads/avatar/${familyId}/${filename}?v=${Date.now()}`;
    } catch (err) {
      console.warn("Local filesystem avatar write failed, checking fallback:", err);
    }
  }

  // 2. Non-Dev / Production: Use Supabase Storage (Cloud CDN)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const storagePath = `${familyId}/${filename}`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(storagePath);
        if (publicUrlData?.publicUrl) {
          return `${publicUrlData.publicUrl}?v=${Date.now()}`;
        }
      }
      console.warn("Supabase avatar upload failed:", error?.message);
    } catch (err) {
      console.warn("Supabase avatar storage error:", err);
    }
  }

  // 3. Fail-safe Data URL
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}