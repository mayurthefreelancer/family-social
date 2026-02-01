// components/posts/NewPostForm.tsx
"use client";

import { createPost } from "@/app/actions/posts";

export function NewPostForm() {
  return (
    <form
      action={async (formData) => {
        await createPost(formData.get("content") as string);
      }}
    >
      <textarea
        name="content"
        placeholder="What's happening in the family?"
        required
      />
      <button type="submit">Post</button>
    </form>
  );
}
