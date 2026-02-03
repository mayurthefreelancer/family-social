import { pool } from "@/app/lib/db";
import { unstable_noStore } from "next/cache";

export async function getFamilyFeed(
  familyId: string,
  userId: string
) {
  unstable_noStore(); // ensure no caching surprises

  const { rows } = await pool.query(
    `
    SELECT
      p.id,
      p.content,
      p.created_at,
      u.name AS author_name,

      COUNT(pl.id) AS like_count,

      EXISTS (
        SELECT 1
        FROM post_likes pl2
        WHERE pl2.post_id = p.id
          AND pl2.user_id = $2
      ) AS liked_by_me

    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN post_likes pl ON pl.post_id = p.id

    WHERE p.family_id = $1

    GROUP BY p.id, u.name
    ORDER BY p.created_at DESC
    `,
    [familyId, userId]
  );

  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    authorName: row.author_name,
    createdAt: row.created_at,

    // 🔑 THIS IS WHAT YOU WERE MISSING
    likeCount: Number(row.like_count),
    likedByMe: row.liked_by_me,
  }));
}
