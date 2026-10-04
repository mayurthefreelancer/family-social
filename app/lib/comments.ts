import { pool } from "./db";

export async function getComments(postId: string) {
  const { rows } = await pool.query(
    `
    SELECT id, content, created_at
    FROM comments
    WHERE post_id = $1
    ORDER BY created_at ASC
    `,
    [postId]
  );

  return rows;
}

export async function addComment({
  id,
  postId,
  userId,
  familyId,
  content,
}: {
  id: string;
  postId: string;
  userId: string;
  familyId: string;
  content: string;
}) {
  await pool.query(
    `
    INSERT INTO comments (id, post_id, user_id, family_id, content, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    `,
    [id, postId, userId, familyId, content.trim()]
  );
}

export type CommentView = {
  id: string;
  userId: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  content: string;
  isEdited?: boolean;
  updatedAt?: string | null;
  createdAt: string;
};

export async function getCommentsByPost(
  postId: string,
  familyId: string
): Promise<CommentView[]> {
  const { rows } = await pool.query<CommentView>(
    `
    SELECT
      c.id,
      c.user_id AS "userId",
      COALESCE(p.display_name, u.name) AS "authorName",
      COALESCE(p.avatar_url, u.avatar_url) AS "authorAvatarUrl",
      c.content,
      COALESCE(c.is_edited, false) AS "isEdited",
      c.updated_at AS "updatedAt",
      c.created_at AS "createdAt"
    FROM comments c
    JOIN users u ON u.id = c.user_id
    LEFT JOIN profiles p ON p.user_id = c.user_id AND p.family_id = c.family_id
    WHERE c.post_id = $1
      AND c.family_id = $2
    ORDER BY c.created_at ASC
    `,
    [postId, familyId]
  );

  return rows;
}
