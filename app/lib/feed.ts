import { requireUser } from "./auth";
import { pool } from "./db";

export type FeedPost = {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;

  authorName: string;
  authorAvatarUrl: string | null;

  commentCount: number;
  likeCount: number;
  likedByMe: boolean;
};

export async function getFeed(): Promise<FeedPost[]> {
  console.log("💡Fetching feed...");
  const user = await requireUser();

  const { rows } = await pool.query(
    `
    SELECT
      posts.id,
      posts.content,
      posts.image_url,
      posts.created_at,

      profiles.display_name AS author_name,
      profiles.avatar_url   AS author_avatar_url,

      COUNT(DISTINCT comments.id)        AS comment_count,
      COUNT(DISTINCT post_likes.user_id)      AS like_count,

      BOOL_OR(post_likes.user_id = $2)        AS liked_by_me

    FROM posts

    JOIN profiles
      ON profiles.user_id = posts.user_id
     AND profiles.family_id = posts.family_id

    LEFT JOIN comments
      ON comments.post_id = posts.id

    LEFT JOIN post_likes
      ON post_likes.post_id = posts.id

    WHERE posts.family_id = $1

    GROUP BY
      posts.id,
      profiles.display_name,
      profiles.avatar_url

    ORDER BY posts.created_at DESC
    `,
    [user.family_id, user.id]
  );

  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    imageUrl: row.image_url,
    createdAt: row.created_at,

    authorName: row.author_name,
    authorAvatarUrl: row.author_avatar_url,

    commentCount: Number(row.comment_count),
    likeCount: Number(row.like_count),
    likedByMe: row.liked_by_me ?? false,
  }));
}
