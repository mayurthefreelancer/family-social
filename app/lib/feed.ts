import { pool } from "@/app/lib/db";

export async function getFamilyFeed(familyId: string) {
  const { rows } = await pool.query(
    `
    SELECT
      p.id,
      p.content,
      p.created_at AS "createdAt",
      u.name AS "authorName"
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE p.family_id = $1
    ORDER BY p.created_at DESC
    LIMIT 50
    `,
    [familyId]
  );

  return rows;
}
