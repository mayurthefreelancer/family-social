import { UUID } from "crypto";
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
  authorName: string;
  content: string;
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
      u.name AS "authorName",
      c.content,
      c.created_at AS "createdAt"
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = $1
      AND c.family_id = $2
    ORDER BY c.created_at ASC
    `,
    [postId, familyId]
  );

  return rows;
}
