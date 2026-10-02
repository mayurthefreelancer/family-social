"use client";

import { addNewComment } from "@/app/actions/comments";
import { useState, useTransition } from "react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Send, Loader2 } from "lucide-react";

export function NewCommentForm({
  postId,
  currentUserName,
  currentUserAvatar,
  onAddComment,
  onOptimisticAdd,
}: {
  postId: string;
  currentUserName?: string;
  currentUserAvatar?: string | null;
  onAddComment?: (content: string) => Promise<void> | void;
  onOptimisticAdd?: (content: string) => void;
}) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isPending) return;

    setContent("");

    if (onAddComment) {
      startTransition(async () => {
        await onAddComment(trimmed);
      });
    } else if (onOptimisticAdd) {
      onOptimisticAdd(trimmed);
      startTransition(async () => {
        await addNewComment(postId, trimmed);
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
      <Avatar
        src={currentUserAvatar}
        fallback={currentUserName || "You"}
        size="sm"
        className="w-7 h-7 text-[11px] shrink-0"
      />
      <div className="relative flex-1 flex items-center">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Reply as ${currentUserName || "a relative"}…`}
          disabled={isPending}
          className="w-full rounded-full border border-zinc-200 dark:border-zinc-700/80 bg-zinc-100/70 dark:bg-zinc-800/60 px-3.5 py-1.5 pr-9 text-xs text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!content.trim() || isPending}
          aria-label="Post comment"
          className="absolute right-1.5 p-1 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </form>
  );
}
