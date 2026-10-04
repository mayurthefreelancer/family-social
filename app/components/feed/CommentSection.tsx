"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchComments, addNewComment } from "@/app/actions/comments";
import { CommentList } from "../posts/CommentList";
import { NewCommentForm } from "../posts/NewCommentForm";

export type Comment = {
  id: string;
  userId?: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  content: string;
  isEdited?: boolean;
  updatedAt?: string | null;
  createdAt?: string;
};

export function CommentSection({
  postId,
  initialCount,
  currentUserName,
  currentUserAvatar,
  currentUserId: propUserId,
  currentUserRole: propUserRole,
  onCommentCountChange,
}: {
  postId: string;
  initialCount: number;
  currentUserName?: string;
  currentUserAvatar?: string | null;
  currentUserId?: string;
  currentUserRole?: string;
  onCommentCountChange?: (delta: number) => void;
}) {
  const { data: session } = useSession();
  const effectiveUserName =
    currentUserName ||
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "You";
  const effectiveUserAvatar = currentUserAvatar || session?.user?.image || null;
  const currentUserId = propUserId || (session?.user as any)?.id;
  const currentUserRole = propUserRole || (session?.user as any)?.role;

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchComments(postId)
      .then((data) => {
        if (active) {
          setComments(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch comments:", err);
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [postId]);

  async function handleAdd(content: string) {
    const tempId = `temp-${Date.now()}`;
    const optimisticComment: Comment = {
      id: tempId,
      userId: currentUserId,
      authorName: effectiveUserName,
      authorAvatarUrl: effectiveUserAvatar,
      content,
      isEdited: false,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [...prev, optimisticComment]);
    onCommentCountChange?.(1);

    try {
      const saved = await addNewComment(postId, content);
      if (saved) {
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? saved : c))
        );
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      // Remove temp comment on failure
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      onCommentCountChange?.(-1);
    }
  }

  return (
    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-3">
      <CommentList
        comments={comments}
        isLoading={isLoading}
        postId={postId}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        onCommentCountChange={onCommentCountChange}
      />
      <NewCommentForm
        postId={postId}
        currentUserName={effectiveUserName}
        currentUserAvatar={effectiveUserAvatar}
        onAddComment={handleAdd}
      />
    </div>
  );
}
