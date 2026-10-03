"use client";

import { useEffect, useState } from "react";
import { fetchComments } from "@/app/actions/comments";
import { Comment } from "../feed/CommentSection";
import { Avatar } from "@/app/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";

export function CommentList({
  comments: propComments,
  isLoading,
  postId,
  optimisticComments = [],
}: {
  comments?: Comment[];
  isLoading?: boolean;
  postId?: string;
  optimisticComments?: Comment[];
}) {
  const [internalComments, setInternalComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (postId && !propComments) {
      fetchComments(postId).then(setInternalComments);
    }
  }, [postId, propComments]);

  const activeComments = propComments ?? [...internalComments, ...optimisticComments];

  if (isLoading) {
    return (
      <div className="py-2 text-xs text-zinc-400 animate-pulse">
        Loading comments…
      </div>
    );
  }

  if (activeComments.length === 0) {
    return (
      <p className="py-1 text-xs text-zinc-400 dark:text-zinc-500 italic">
        No comments yet. Be the first to reply!
      </p>
    );
  }

  return (
    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
      {activeComments.map((c) => {
        let timeAgo = "";
        try {
          if (c.createdAt) {
            timeAgo = formatDistanceToNow(new Date(c.createdAt), {
              addSuffix: true,
            });
          }
        } catch {
          // ignore date parse issues
        }

        return (
          <div key={c.id} className="flex items-start gap-2.5 text-xs">
            <Avatar
              src={c.authorAvatarUrl}
              fallback={c.authorName}
              size="sm"
              className="w-7 h-7 text-[11px] shrink-0 mt-0.5"
            />
            <div className="flex-1 bg-zinc-100/80 dark:bg-zinc-800/70 rounded-2xl px-3.5 py-2.5 border border-zinc-200/60 dark:border-zinc-700/60 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {c.authorName}
                </span>
                {timeAgo && (
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">
                    {timeAgo}
                  </span>
                )}
              </div>
              <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
