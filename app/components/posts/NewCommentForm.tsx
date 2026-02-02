"use client";

import { addNewComment } from "@/app/actions/comments";
import { useState, useTransition } from "react";

export function NewCommentForm({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!content.trim()) return;

    startTransition(async () => {
      await addNewComment(postId, content);
      setContent("");
    });
  }

  return (
    <div className="flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment…"
        className="
          flex-1
          rounded-md
          border border-[var(--color-border)]
          px-3 py-1.5
          text-sm
          focus:outline-none
        "
      />
      <button
        onClick={submit}
        disabled={isPending}
        className="
          text-sm
          text-[var(--color-text-primary)]
          disabled:opacity-40
        "
      >
        Post
      </button>
    </div>
  );
}
