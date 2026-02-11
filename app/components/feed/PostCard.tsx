import { formatDistanceToNow } from "date-fns";
import { CommentSection } from "./CommentSection";
import { LikeButton } from "./LikeButton";

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
        rounded-md border border-[var(--color-border)]
        bg-[var(--color-surface)]
        px-4 py-3
        space-y-3
      "
    >
      {/* Header */}
      <header className="flex items-start gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          {post.authorAvatarUrl ? (
            <img
              src={post.authorAvatarUrl}
              alt={post.authorName}
              className="
                h-9 w-9 rounded-full object-cover
                border border-[var(--color-border)]
              "
            />
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
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {post.authorName}
          </span>

          <time className="text-xs text-[var(--color-text-muted)]">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </time>
        </div>
      </header>

      {/* Content */}
      <p
        className="
          text-sm leading-relaxed
          text-[var(--color-text-primary)]
          whitespace-pre-wrap
        "
      >
        {post.content}
      </p>

      <CommentSection
        postId={post.id}
        initialCount={post.commentCount ?? 0}
        currentUserName={post.authorName}
      />

      <LikeButton
        post={{
          id: post.id,
          likeCount: post.likeCount,
          likedByMe: post.likedByMe,
        }}
      />
    </article>
  );
}
