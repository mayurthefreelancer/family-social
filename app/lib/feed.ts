import { redirect } from "next/navigation";
import { requireUser } from "./auth";
import { pool } from "./db";

export interface PostPhotoItem {
  id: string;
  url: string;
  caption?: string | null;
}

export type FeedPost = {
  id: string;
  authorId: string;
  content: string;
  imageUrl: string | null;
  photos: PostPhotoItem[];
  isEdited: boolean;
  updatedAt?: string | null;
  createdAt: string;

  authorName: string;
  authorAvatarUrl: string | null;

  commentCount: number;
  likeCount: number;
  likedByMe: boolean;
};

export async function getFeed(): Promise<FeedPost[]> {
  const user = await requireUser();
  if (!user.family_id) {
    console.warn("User has no family_id, redirecting to create-family");
    redirect("/create-family");
  }
  const { rows } = await pool.query(
    `
    SELECT
      posts.id,
      posts.user_id                          AS author_id,
      posts.content,
      posts.image_url,
      COALESCE(posts.is_edited, false)       AS is_edited,
      posts.updated_at,
      posts.created_at,

      profiles.display_name                  AS author_name,
      profiles.avatar_url                    AS author_avatar_url,

      COUNT(DISTINCT comments.id)            AS comment_count,
      COUNT(DISTINCT post_likes.user_id)     AS like_count,

      BOOL_OR(post_likes.user_id = $2)       AS liked_by_me,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', pp.id,
              'url', pp.url,
              'caption', pp.caption
            )
            ORDER BY pp.sort_order ASC
          )
          FROM post_photos pp
          WHERE pp.post_id = posts.id AND pp.family_id = $1
        ),
        '[]'::json
      ) AS photos

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
      posts.user_id,
      posts.content,
      posts.image_url,
      posts.is_edited,
      posts.updated_at,
      posts.created_at,
      profiles.display_name,
      profiles.avatar_url

    ORDER BY posts.created_at DESC
    `,
    [user.family_id, user.id]
  );

  return rows.map((row) => {
    let photosList: PostPhotoItem[] = [];
    if (Array.isArray(row.photos)) {
      photosList = row.photos;
    } else if (typeof row.photos === "string") {
      try {
        photosList = JSON.parse(row.photos);
      } catch {
        photosList = [];
      }
    }

    if (photosList.length === 0 && row.image_url) {
      photosList = [{ id: row.id, url: row.image_url, caption: null }];
    }

    return {
      id: row.id,
      authorId: row.author_id,
      content: row.content,
      imageUrl: row.image_url,
      photos: photosList,
      isEdited: Boolean(row.is_edited),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
      createdAt: row.created_at,

      authorName: row.author_name,
      authorAvatarUrl: row.author_avatar_url,

      commentCount: Number(row.comment_count),
      likeCount: Number(row.like_count),
      likedByMe: row.liked_by_me ?? false,
    };
  });
}
