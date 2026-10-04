// app/actions/post.ts
"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";
import { pool } from "../lib/db";
import { getUserFamily } from "../lib/family";
import { redirect } from "next/navigation";
import { savePostPhoto } from "../lib/post-photo-storage";

export async function createPost(input: FormData | string) {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }

  const familyId = (await getUserFamily(user.id)) || user.family_id;

  let content = "";
  let files: File[] = [];

  if (typeof input === "string") {
    content = input;
  } else if (input instanceof FormData) {
    content = (input.get("content") as string) || "";
    const rawFiles = input.getAll("photos");
    files = rawFiles.filter(
      (f): f is File => f instanceof File && f.size > 0
    );
  }

  const client = await pool.connect();
  let postId: string;
  try {
    await client.query("BEGIN");

    // Insert post record scoped by family_id
    const postRes = await client.query(
      `INSERT INTO posts (family_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [familyId, user.id, content]
    );
    postId = postRes.rows[0].id;

    // Process and save photos
    let primaryImageUrl: string | null = null;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const photoUrl = await savePostPhoto(familyId, postId, file, i);
      if (i === 0) {
        primaryImageUrl = photoUrl;
      }

      await client.query(
        `INSERT INTO post_photos (id, post_id, family_id, url, sort_order)
         VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
        [postId, familyId, photoUrl, i]
      );
    }

    if (primaryImageUrl) {
      await client.query(
        `UPDATE posts SET image_url = $1 WHERE id = $2 AND family_id = $3`,
        [primaryImageUrl, postId, familyId]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to create post transaction:", error);
    throw error;
  } finally {
    client.release();
  }

  revalidatePath("/feed");
  return { success: true, postId };
}

export async function updatePost(
  postId: string,
  content: string,
  keptPhotoIds?: string[]
) {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verify ownership or admin privileges
    const checkRes = await client.query(
      `SELECT p.id, p.user_id, fm.role
       FROM posts p
       JOIN family_members fm ON fm.family_id = p.family_id AND fm.user_id = $1
       WHERE p.id = $2 AND p.family_id = $3`,
      [user.id, postId, user.family_id]
    );

    if (!checkRes.rows.length) {
      throw new Error("Post not found or unauthorized");
    }

    const { user_id: authorId, role } = checkRes.rows[0];
    if (authorId !== user.id && role !== "admin") {
      throw new Error("You do not have permission to edit this post");
    }

    // Update content and edit flags
    await client.query(
      `UPDATE posts
       SET content = $1, is_edited = true, updated_at = NOW()
       WHERE id = $2 AND family_id = $3`,
      [content.trim(), postId, user.family_id]
    );

    // If keptPhotoIds was specified, filter post_photos
    if (keptPhotoIds !== undefined) {
      if (keptPhotoIds.length === 0) {
        await client.query(
          `DELETE FROM post_photos WHERE post_id = $1 AND family_id = $2`,
          [postId, user.family_id]
        );
        await client.query(
          `UPDATE posts SET image_url = NULL WHERE id = $1 AND family_id = $2`,
          [postId, user.family_id]
        );
      } else {
        await client.query(
          `DELETE FROM post_photos
           WHERE post_id = $1 AND family_id = $2 AND NOT (id = ANY($3::uuid[]))`,
          [postId, user.family_id, keptPhotoIds]
        );

        // Update posts.image_url to first remaining photo
        const firstPhoto = await client.query(
          `SELECT url FROM post_photos WHERE post_id = $1 AND family_id = $2 ORDER BY sort_order ASC LIMIT 1`,
          [postId, user.family_id]
        );
        const newFirstUrl = firstPhoto.rows[0]?.url || null;
        await client.query(
          `UPDATE posts SET image_url = $1 WHERE id = $2 AND family_id = $3`,
          [newFirstUrl, postId, user.family_id]
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to update post:", error);
    throw error;
  } finally {
    client.release();
  }

  revalidatePath("/feed");
  return { success: true };
}

export async function deletePost(postId: string) {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verify ownership or admin privileges
    const checkRes = await client.query(
      `SELECT p.id, p.user_id, fm.role
       FROM posts p
       JOIN family_members fm ON fm.family_id = p.family_id AND fm.user_id = $1
       WHERE p.id = $2 AND p.family_id = $3`,
      [user.id, postId, user.family_id]
    );

    if (!checkRes.rows.length) {
      throw new Error("Post not found or unauthorized");
    }

    const { user_id: authorId, role } = checkRes.rows[0];
    if (authorId !== user.id && role !== "admin") {
      throw new Error("You do not have permission to delete this post");
    }

    // Cascade deletion handles post_photos, post_likes, comments
    await client.query(
      `DELETE FROM posts WHERE id = $1 AND family_id = $2`,
      [postId, user.family_id]
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to delete post:", error);
    throw error;
  } finally {
    client.release();
  }

  revalidatePath("/feed");
  return { success: true };
}

export async function togglePostLike(postId: string) {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }
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