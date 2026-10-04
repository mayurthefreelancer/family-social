// app/lib/post-photo-storage.ts
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

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
 * Saves a post photo using environment-aware storage:
 * - Local Machine (Development): Stores directly in local filesystem (public/uploads/posts/[familyId]/).
 * - Non-Dev (Vercel / Production): Stores in Supabase Storage bucket ('posts').
 * - Fallback: Base64 Data URL if non-dev storage is unconfigured.
 */
export async function savePostPhoto(
  familyId: string,
  postId: string,
  file: File,
  index: number
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueId = crypto.randomUUID();
  const filename = `${postId}_${index}_${uniqueId}.webp`;
  const mimeType = file.type || "image/webp";

  // 1. Local Machine: Prioritize Local Filesystem
  if (isLocalEnvironment()) {
    try {
      const dir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "posts",
        familyId
      );
      await fs.mkdir(dir, { recursive: true });
      const filepath = path.join(dir, filename);
      await fs.writeFile(filepath, buffer);
      return `/uploads/posts/${familyId}/${filename}`;
    } catch (err) {
      console.warn("Local filesystem write failed, checking fallback:", err);
    }
  }

  // 2. Non-Dev / Production: Use Supabase Storage (Cloud CDN)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const storagePath = `${familyId}/${filename}`;
      const { data, error } = await supabase.storage
        .from("posts")
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("posts")
          .getPublicUrl(storagePath);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
      console.warn("Supabase upload returned error:", error?.message);
    } catch (err) {
      console.warn("Supabase storage exception:", err);
    }
  }

  // 3. Fail-safe Data URL (Prevents Vercel serverless crashes if Supabase is unconfigured)
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
