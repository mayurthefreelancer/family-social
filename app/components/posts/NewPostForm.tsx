"use client";

import { createPost } from "@/app/actions/post";
import { useState } from "react";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) return;
    setPending(true);
    await createPost(content);
    setContent("");
    setPending(false);
  }

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <textarea
        rows={3}
        placeholder="What would you like to share?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="
          w-full resize-none bg-transparent text-sm
          text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-muted)]
          focus:outline-none
        "
      />

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={pending || !content.trim()}
          className="
            rounded-md px-4 py-1.5 text-sm
            text-white
            bg-[var(--color-accent)]
            disabled:opacity-40
          "
        >
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}
