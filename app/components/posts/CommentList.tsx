"use client";

import { useEffect, useState } from "react";
import { fetchComments } from "@/app/actions/comments";
import { Comment } from "../feed/CommentSection";

export function CommentList({
  postId,
  optimisticComments,
}: {
  postId: string;
  optimisticComments: Comment[];
}) {
  const [serverComments, setServerComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments(postId).then(setServerComments);
  }, [postId]);

  const allComments = [...serverComments, ...optimisticComments];

  if (allComments.length === 0) {
    return (
      <p className="text-xs text-[var(--color-text-muted)]">
        No comments yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {allComments.map((c) => (
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
