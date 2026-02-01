// lib/comments.ts
import { pool } from "./db";

export async function getComments(postId: string) {
  const res = await pool.query(
    `
    SELECT
      comments.id,
      comments.content,
      comments.created_at,
      users.name
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at ASC
    `,
    [postId]
  );

  return res.rows;
}
