// app/lib/family-storage.ts
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

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
 * Saves a family avatar emblem image using a resilient multi-tier strategy:
 * 1. Supabase Storage bucket ('family' or 'avatars') if configured.
 * 2. Local filesystem in development.
 * 3. Base64 Data URL fallback for serverless/Vercel.
 */
export async function saveFamilyAvatar(
  file: File,
  familyId: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `avatar.jpg`;
  const mimeType = file.type || "image/jpeg";

  // Tier 1: Supabase Storage
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const storagePath = `${familyId}/${filename}`;
      const { data, error } = await supabase.storage
        .from("family")
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("family")
          .getPublicUrl(storagePath);
        if (publicUrlData?.publicUrl) {
          return `${publicUrlData.publicUrl}?v=${Date.now()}`;
        }
      }
      console.warn("Supabase family avatar upload failed or bucket missing:", error?.message);
    } catch (err) {
      console.warn("Supabase family avatar error:", err);
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
        "family",
        familyId
      );
      await fs.mkdir(dir, { recursive: true });
      const filepath = path.join(dir, filename);
      await fs.writeFile(filepath, buffer);
      return `/uploads/family/${familyId}/${filename}?v=${Date.now()}`;
    } catch (err) {
      console.warn("Local filesystem family avatar write failed:", err);
    }
  }

  // Tier 3: Fail-safe Base64 Data URL
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

/**
 * Saves a family canopy banner backdrop image using a resilient multi-tier strategy:
 * 1. Supabase Storage bucket ('family') if configured.
 * 2. Local filesystem in development.
 * 3. Base64 Data URL fallback for serverless/Vercel.
 */
export async function saveFamilyBackdrop(
  file: File,
  familyId: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `backdrop.jpg`;
  const mimeType = file.type || "image/jpeg";

  // Tier 1: Supabase Storage
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const storagePath = `${familyId}/${filename}`;
      const { data, error } = await supabase.storage
        .from("family")
        .upload(storagePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from("family")
          .getPublicUrl(storagePath);
        if (publicUrlData?.publicUrl) {
          return `${publicUrlData.publicUrl}?v=${Date.now()}`;
        }
      }
      console.warn("Supabase family backdrop upload failed or bucket missing:", error?.message);
    } catch (err) {
      console.warn("Supabase family backdrop error:", err);
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
        "family",
        familyId
      );
      await fs.mkdir(dir, { recursive: true });
      const filepath = path.join(dir, filename);
      await fs.writeFile(filepath, buffer);
      return `/uploads/family/${familyId}/${filename}?v=${Date.now()}`;
    } catch (err) {
      console.warn("Local filesystem family backdrop write failed:", err);
    }
  }

  // Tier 3: Fail-safe Base64 Data URL
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
