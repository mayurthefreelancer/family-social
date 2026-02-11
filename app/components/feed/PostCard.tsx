import { formatDistanceToNow } from "date-fns";
import { CommentSection } from "./CommentSection";
import { LikeButton } from "./LikeButton";
import { Avatar } from "../profile/Avatar";

export function PostCard({
  post,
}: {
  post: {
    id: string;
    authorName: string;
    authorAvatarUrl?: string | null;
    content: string;
    createdAt: string;
    commentCount?: number;
    likeCount: number;
    likedByMe: boolean;
  };
}) {
  return (
    <article
      className="
        rounded-2xl
        bg-white
        shadow-sm
        overflow-hidden
        border border-neutral-200
        p-4
        flex flex-col gap-4
      "
    >
      {/* Header */}
      <header className="flex items-center gap-3">
        {/* Avatar */}
        <div className="shrink-0 ">
          {post.authorAvatarUrl ? (
            <Avatar avatar={post.authorAvatarUrl} name={post.authorName} size="sm" />
          ) : (
            <div
              className="
                h-9 w-9 rounded-full
                bg-[var(--color-border)]
                flex items-center justify-center
                text-xs font-semibold
                text-[var(--color-text-muted)]
              "
            >
              {post.authorName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name + time */}
        <div>
          <div className="font-medium text-neutral-900">
            {post.authorName}
          </div>
          <div className="text-xs text-neutral-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>
      </header>

      {/* Content */}
      <p className="text-[15px] leading-relaxed text-neutral-800">
        {post.content}
      </p>

      <div className="flex flex-col gap-6 mt-2 border-t border-[var(--color-border)] pt-3">
        <LikeButton
          post={{
            id: post.id,
            likeCount: post.likeCount,
            likedByMe: post.likedByMe,
          }}
        />
        <CommentSection
          postId={post.id}
          initialCount={post.commentCount ?? 0}
          currentUserName={post.authorName}
        />

      </div>
    </article>
  );
}
