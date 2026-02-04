// app/actions/posts.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";
import { pool } from "../lib/db";
import { getUserFamily } from "../lib/family";


export async function createPost(content: string) {
  const user = await requireUser();
  console.log("Creating post for user:", user);
  const familyId = await getUserFamily(user.id);

  console.log("Creating post for family:", familyId);
  await pool.query(
    `INSERT INTO posts (family_id, user_id, content)
     VALUES ($1, $2, $3)`,
    [familyId, user.id, content]
  );
  revalidatePath("/feed");
}

export async function togglePostLike(postId: string) {
  const user = await requireUser();
  // Ensure post exists & belongs to family
  const { rowCount } = await pool.query(
    `SELECT 1 FROM posts WHERE id = $1 AND family_id = $2`,
    [postId, user.family_id]
  );

  if (!rowCount) {
    throw new Error("Post not found");
  }

  const result = await pool.query(
    `
    DELETE FROM post_likes
    WHERE post_id = $1
      AND user_id = $2
      AND family_id = $3
    RETURNING id
    `,
    [postId, user.id, user.family_id]
  );

  // If nothing was deleted → insert (like)
  if (result.rowCount === 0) {
    await pool.query(
      `
      INSERT INTO post_likes (id, post_id, user_id, family_id)
      VALUES (gen_random_uuid(), $1, $2, $3)
      `,
      [postId, user.id, user.family_id]
    );
  }

  revalidatePath("/feed");
}