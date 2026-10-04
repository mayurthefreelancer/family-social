// app/actions/comments.ts
"use server";

import { addComment, getCommentsByPost, CommentView } from "@/app/lib/comments";
import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";
import { pool } from "../lib/db";
import { redirect } from "next/navigation";

export async function fetchComments(postId: string): Promise<CommentView[]> {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }
  return getCommentsByPost(postId, user.family_id);
}

export async function addNewComment(
  postId: string,
  content: string
): Promise<CommentView> {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }

  const commentId = globalThis.crypto.randomUUID();
  const trimmed = content.trim();

  await addComment({
    id: commentId,
    postId,
    userId: user.id,
    familyId: user.family_id,
    content: trimmed,
  });

  revalidatePath(`/feed`);

  return {
    id: commentId,
    userId: user.id,
    authorName: user.displayName,
    authorAvatarUrl: user.avatarUrl,
    content: trimmed,
    isEdited: false,
    createdAt: new Date().toISOString(),
  };
}

export async function updateComment(
  commentId: string,
  content: string
): Promise<{ success: boolean }> {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }

  const client = await pool.connect();
  try {
    const checkRes = await client.query(
      `SELECT c.user_id, fm.role
       FROM comments c
       JOIN family_members fm ON fm.family_id = c.family_id AND fm.user_id = $1
       WHERE c.id = $2 AND c.family_id = $3`,
      [user.id, commentId, user.family_id]
    );

    if (!checkRes.rows.length) {
      throw new Error("Comment not found or unauthorized");
    }

    const { user_id: authorId, role } = checkRes.rows[0];
    if (authorId !== user.id && role !== "admin") {
      throw new Error("You do not have permission to edit this comment");
    }

    await client.query(
      `UPDATE comments
       SET content = $1, is_edited = true, updated_at = NOW()
       WHERE id = $2 AND family_id = $3`,
      [content.trim(), commentId, user.family_id]
    );
  } finally {
    client.release();
  }

  revalidatePath("/feed");
  return { success: true };
}

export async function deleteComment(
  commentId: string
): Promise<{ success: boolean }> {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }

  const client = await pool.connect();
  try {
    const checkRes = await client.query(
      `SELECT c.user_id, fm.role
       FROM comments c
       JOIN family_members fm ON fm.family_id = c.family_id AND fm.user_id = $1
       WHERE c.id = $2 AND c.family_id = $3`,
      [user.id, commentId, user.family_id]
    );

    if (!checkRes.rows.length) {
      throw new Error("Comment not found or unauthorized");
    }

    const { user_id: authorId, role } = checkRes.rows[0];
    if (authorId !== user.id && role !== "admin") {
      throw new Error("You do not have permission to delete this comment");
    }

    await client.query(
      `DELETE FROM comments WHERE id = $1 AND family_id = $2`,
      [commentId, user.family_id]
    );
  } finally {
    client.release();
  }

  revalidatePath("/feed");
  return { success: true };
}