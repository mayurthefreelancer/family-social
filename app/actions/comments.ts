// app/actions/comments.ts
"use server";

import { getComments, addComment, getCommentsByPost } from "@/app/lib/comments";
import { revalidatePath } from "next/cache";
import { requireUser } from "../lib/auth";
import { redirect } from "next/navigation";

export async function fetchComments(postId: string) {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }
  return getCommentsByPost(postId, user.family_id);
}

export async function addNewComment(postId: string, content: string) {
  const user = await requireUser();
  if (!user.family_id) {
    redirect("/create-family");
  }
  await addComment({
    id: globalThis.crypto.randomUUID(),
    postId,
    userId: user.id,
    familyId: user.family_id,
    content,
  });
  revalidatePath(`/feed`);
}