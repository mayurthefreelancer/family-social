'use client';
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Avatar } from "../profile/Avatar";
import { CommentSection } from "./CommentSection";
import { LikeButton } from "./LikeButton";
import { MessageCircle } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  return (
    <article className="card surface-1">
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          marginBottom: "var(--space-4)",
        }}
      >
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          {post.authorAvatarUrl ? (
            <Avatar avatar={post.authorAvatarUrl} name={post.authorName} size="sm" />
          ) : (
            <div
              style={{
                height: "36px",
                width: "36px",
                borderRadius: "9999px",
                background: "var(--muted-surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              {post.authorName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name + time */}
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "var(--text-md)",
            }}
          >
            {post.authorName}
          </div>
          <div
            className="text-muted"
            style={{
              fontSize: "var(--text-xs)",
            }}
          >
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>
      </header>

      {/* Content */}
      <p
        style={{
          fontSize: "var(--text-md)",
          lineHeight: 1.6,
          marginBottom: "var(--space-5)",
        }}
      >
        {post.content}
      </p>

      <footer className="post-actions">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-1">
          <MessageCircle className="text-gray-400"/> {post.commentCount ?? 0}
        </button>
        <LikeButton post={post} />
      </footer>

      {open && (
        <div className="post-comments">
          <CommentSection
            postId={post.id}
            initialCount={post.commentCount ?? 0}
            currentUserName={post.authorName}
          />
        </div>
      )}


    </article>
  );
}