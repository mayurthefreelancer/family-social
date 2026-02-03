// app/actions/posts.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";
import { getUserFamily } from "../lib/family";
import { pool } from "../lib/db";

export async function createPost(content: string) {
  if (!content.trim()) return;

  const user = await requireUser();
  const familyId = await getUserFamily(user.family_id);

  if (!familyId) throw new Error("User not in family");

  await pool.query(
    `INSERT INTO posts (family_id, user_id, content)
     VALUES ($1, $2, $3)`,
    [familyId, user.id, content]
  );

  // Refresh feed
  revalidatePath("/feed");
}
