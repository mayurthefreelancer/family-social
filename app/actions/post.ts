// app/actions/posts.ts
"use server";

import { requireUser } from "../lib/auth";
import { pool } from "../lib/db";
import { getUserFamily } from "../lib/family";


export async function createPost(content: string) {
  const userId = await requireUser();
  const familyId = await getUserFamily(userId);

  await pool.query(
    `INSERT INTO posts (family_id, user_id, content)
     VALUES ($1, $2, $3)`,
    [familyId, userId, content]
  );
}
