// app/actions/comments.ts
"use server";

import { getComments, addComment, getCommentsByPost } from "@/app/lib/comments";
import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";

export async function fetchComments(postId: string) {
  const user = await requireUser();
  return getCommentsByPost(postId, user.family_id);
}

export async function addNewComment(postId: string, content: string) {
  const user = await requireUser();
  await addComment({
    id: globalThis.crypto.randomUUID(),
    postId,
    userId: user.id,
    familyId: user.family_id,
    content,
  });
  revalidatePath(`/feed`);
}