// app/lib/avatar-storage.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveAvatarLocally(
  file: File,
  familyId: string,
  userId: string
) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${familyId}/${userId}.jpg`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true, // overwrite if exists
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  // cache-busting
  return `${data.publicUrl}?v=${Date.now()}`;
}