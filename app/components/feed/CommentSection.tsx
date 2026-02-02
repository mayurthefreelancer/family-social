"use client";

import { useState } from "react";
import { CommentList } from "../posts/CommentList";
import { NewCommentForm } from "../posts/NewCommentForm";

export type Comment = {
  id: string;
  authorName: string;
  content: string;
};

export function CommentSection({
  postId,
  initialCount,
  currentUserName,
}: {
  postId: string;
  initialCount: number;
  currentUserName: string;
}) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  function handleAdd(content: string) {
    const tempComment: Comment = {
      id: crypto.randomUUID(), // client-side temp id
      authorName: currentUserName,
      content,
    };

    setComments((prev) => [...prev, tempComment]);
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
      >
        {initialCount + comments.length > 0
          ? `${initialCount + comments.length} comment${
              initialCount + comments.length > 1 ? "s" : ""
            }`
          : "Comment"}
      </button>

      {open && (
        <div className="pt-3 border-t border-[var(--color-border)] space-y-3">
          <CommentList
            postId={postId}
            optimisticComments={comments}
          />
          <NewCommentForm
            postId={postId}
            onOptimisticAdd={handleAdd}
          />
        </div>
      )}
    </div>
  );
}
