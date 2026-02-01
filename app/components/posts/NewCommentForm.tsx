// components/posts/NewCommentForm.tsx
"use client";

import { addComment } from "@/app/actions/comments";

export function NewCommentForm({ postId }: { postId: string }) {
  return (
    <form
      action={async (formData) => {
        await addComment(
          postId,
          formData.get("content") as string
        );
      }}
    >
      <input
        name="content"
        placeholder="Write a comment..."
        required
      />
      <button type="submit">Comment</button>
    </form>
  );
}
