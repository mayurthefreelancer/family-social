"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Heart, ShieldCheck, Share2 } from "lucide-react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import { CommentSection } from "./CommentSection";
import { LikeButton } from "./LikeButton";

export function PostCard({
  post,
  currentUser,
}: {
  post: {
    id: string;
    authorName: string;
    authorAvatarUrl?: string | null;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    commentCount?: number;
    likeCount: number;
    likedByMe: boolean;
  };
  currentUser?: {
    id?: string;
    name?: string;
    avatarUrl?: string | null;
  };
}) {
  const [openComments, setOpenComments] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const isRecipe = post.content?.startsWith("[🍲 Family Recipe]");
  const cleanContent = isRecipe
    ? post.content.replace("[🍲 Family Recipe]", "").trim()
    : post.content;

  return (
    <Card className="rounded-[24px] border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 transition-colors">
      {/* Post Author Header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.authorAvatarUrl ?? undefined}
            fallback={post.authorName}
            size="md"
          />

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-zinc-950 dark:text-zinc-50 tracking-tight">
                {post.authorName}
              </span>
              <Badge
                variant="secondary"
                className="text-xs font-mono uppercase tracking-wider px-2 py-0.5"
              >
                Kin
              </Badge>
              {isRecipe && (
                <span className="text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                  🍲 Recipe
                </span>
              )}
            </div>
            <span
              className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal"
              suppressHydrationWarning
            >
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-zinc-200/60 dark:border-zinc-800 hidden sm:inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Family Only
          </span>
        </div>
      </header>

      {/* Editorial Post Body */}
      <div className="text-base leading-relaxed font-normal text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
        {cleanContent}
      </div>

      {/* Post Image Attachment */}
      {post.imageUrl && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 max-h-[480px]">
          <img
            src={post.imageUrl}
            alt="Family moment"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Tactile Reaction Pills & Actions */}
      <footer className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Like Pill */}
          <div className="h-8 px-3 rounded-full border border-zinc-200/80 dark:border-zinc-750 bg-zinc-50/70 dark:bg-zinc-800/60 flex items-center gap-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors">
            <LikeButton post={post} />
          </div>

          {/* Comment Pill */}
          <button
            type="button"
            onClick={() => setOpenComments(!openComments)}
            className={`h-8 px-3 rounded-full border flex items-center gap-1.5 transition-colors font-medium cursor-pointer ${
              openComments
                ? "border-zinc-900 dark:border-zinc-200 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950"
                : "border-zinc-200/80 dark:border-zinc-750 bg-zinc-50/70 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/60"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{post.commentCount ?? 0}</span>
            <span className="hidden sm:inline">
              {post.commentCount === 1 ? "comment" : "comments"}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-zinc-400">
          Private Living Room
        </span>
      </footer>

      {/* Expandable Comment Section */}
      {openComments && (
        <div className="pt-2 animate-in fade-in duration-150">
          <CommentSection
            postId={post.id}
            initialCount={post.commentCount ?? 0}
            currentUserName={currentUser?.name}
            currentUserAvatar={currentUser?.avatarUrl}
          />
        </div>
      )}
    </Card>
  );
}