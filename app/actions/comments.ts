// app/actions/comments.ts
"use server";

import { addComment, getCommentsByPost, CommentView } from "@/app/lib/comments";
import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";
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
    authorName: user.displayName,
    authorAvatarUrl: user.avatarUrl,
    content: trimmed,
    createdAt: new Date().toISOString(),
  };
}