// lib/feed.ts
import { pool } from "./db";

export async function getFeed(familyId: string) {
  const res = await pool.query(
    `
    SELECT
      posts.id,
      posts.content,
      posts.created_at,
      users.name
    FROM posts
    JOIN users ON users.id = posts.user_id
    WHERE posts.family_id = $1
    ORDER BY posts.created_at DESC
    `,
    [familyId]
  );

  return res.rows;
}
