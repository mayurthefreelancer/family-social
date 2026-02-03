import { formatDistanceToNow } from "date-fns";
import { CommentSection } from "./CommentSection";
import { LikeButton } from "./LikeButton";

export function PostCard({
  post,
}: {
  post: {
    id: string;
    authorName: string;
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
      <header className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          {post.authorName}
        </span>

        <time className="text-xs text-[var(--color-text-muted)]">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </time>
      </header>

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
      
      <LikeButton post={{
        id: post.id,
        likeCount: post.likeCount,
        likedByMe: post.likedByMe,
      }} />

    </article>
  );
}
