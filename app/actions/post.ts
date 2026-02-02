// app/actions/posts.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";
import { pool } from "../lib/db";
import { getUserFamily } from "../lib/family";


export async function createPost(content: string) {
  const user = await requireUser();
  const familyId = await getUserFamily(user.familyId);

  await pool.query(
    `INSERT INTO posts (family_id, user_id, content)
     VALUES ($1, $2, $3)`,
    [familyId, user.id, content]
  );
  revalidatePath("/feed");
}
