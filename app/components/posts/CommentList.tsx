"use client";

import { useEffect, useState } from "react";
import { fetchComments } from "@/app/actions/comments";

type Comment = {
  id: string;
  authorName: string;
  content: string;
};

export function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments(postId).then(setComments);
  }, [postId]);

  if (comments.length === 0) {
    return (
      <p className="text-xs text-[var(--color-text-muted)]">
        No comments yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {comments.map((c) => (
        <div key={c.id} className="text-sm leading-relaxed">
          <span className="font-medium text-[var(--color-text-primary)]">
            {c.authorName}
          </span>
          <span className="text-[var(--color-text-secondary)]">
            {": "}
            {c.content}
          </span>
        </div>
      ))}
    </div>
  );
}
