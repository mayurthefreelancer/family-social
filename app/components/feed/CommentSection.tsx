"use client";

import { useState } from "react";
import { CommentList } from "../posts/CommentList";
import { NewCommentForm } from "../posts/NewCommentForm";

export function CommentSection({
  postId,
  initialCount,
}: {
  postId: string;
  initialCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          text-xs
          text-[var(--color-text-muted)]
          hover:text-[var(--color-text-primary)]
        "
      >
        {initialCount > 0
          ? `${initialCount} comment${initialCount > 1 ? "s" : ""}`
          : "Comment"}
      </button>

      {open && (
        <div
          className="
            pt-3
            border-t border-[var(--color-border)]
            space-y-3
          "
        >
          <CommentList postId={postId} />
          <NewCommentForm postId={postId} />
        </div>
      )}
    </div>
  );
}
