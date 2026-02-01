// app/actions/comments.ts
"use server";

import { pool } from "../lib/db";
import { requireUser } from "../lib/auth";
import { revalidatePath } from "next/cache";

export async function addComment(postId: string, content: string) {
  if (!content.trim()) return;

  const userId = await requireUser();

  await pool.query(
    `INSERT INTO comments (post_id, user_id, content)
     VALUES ($1, $2, $3)`,
    [postId, userId, content]
  );

  revalidatePath("/feed");
}

export async function getComments(postId: string) {
  const res = await pool.query(
    `
    SELECT comments.content, users.name
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE post_id = $1
    ORDER BY comments.created_at
    `,
    [postId]
  );

  return res.rows;
}
