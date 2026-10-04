// app/lib/post-photo-storage.ts
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

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
 * Saves a post photo using a resilient multi-tier strategy:
 * 1. Supabase Storage bucket ('posts') if credentials are provided.
 * 2. Local filesystem (public/uploads/posts/) in local development.
 * 3. Base64 Data URL fallback for Vercel/serverless environments without external storage.
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

  // Tier 1: Supabase Storage (Cloud CDN)
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
      console.warn("Supabase upload returned error or empty data:", error?.message);
    } catch (err) {
      console.warn("Supabase storage error in savePostPhoto:", err);
    }
  }

  // Tier 2: Local Filesystem (Skipped on Vercel / serverless environments)
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    process.env.NODE_ENV === "production";

  if (!isServerless) {
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
      console.warn("Local filesystem write failed in savePostPhoto:", err);
    }
  }

  // Tier 3: Fail-safe Base64 Data URL (guaranteed to work on Vercel with zero storage dependencies)
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
