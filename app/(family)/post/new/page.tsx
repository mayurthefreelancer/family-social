"use client";

import { createPost } from "@/app/actions/post";


export function NewPostForm() {
  return (
    <form action={async formData => {
      await createPost(formData.get("content") as string);
    }}>
      <textarea name="content" required />
      <button type="submit">Post</button>
    </form>
  );
}
