"use client";

import { useEffect, useState } from "react";
import { fetchComments, updateComment, deleteComment } from "@/app/actions/comments";
import { Comment } from "../feed/CommentSection";
import { Avatar } from "@/app/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";

export function CommentList({
  comments: propComments,
  isLoading,
  postId,
  optimisticComments = [],
  currentUserId,
  currentUserRole,
  onCommentCountChange,
}: {
  comments?: Comment[];
  isLoading?: boolean;
  postId?: string;
  optimisticComments?: Comment[];
  currentUserId?: string;
  currentUserRole?: string;
  onCommentCountChange?: (delta: number) => void;
}) {
  const [internalComments, setInternalComments] = useState<Comment[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [actionPendingId, setActionPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (postId && !propComments) {
      fetchComments(postId).then(setInternalComments);
    }
  }, [postId, propComments]);

  // Sync propComments if provided
  useEffect(() => {
    if (propComments) {
      setInternalComments(propComments);
    }
  }, [propComments]);

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

  function startEdit(comment: Comment) {
    setEditingId(comment.id);
    setEditContent(comment.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditContent("");
  }

  async function handleSaveEdit(commentId: string) {
    if (!editContent.trim() || actionPendingId) return;

    setActionPendingId(commentId);
    try {
      await updateComment(commentId, editContent.trim());
      setInternalComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, content: editContent.trim(), isEdited: true }
            : c
        )
      );
      cancelEdit();
    } catch (err) {
      console.error("Failed to edit comment:", err);
    } finally {
      setActionPendingId(null);
    }
  }

  async function handleDelete(commentId: string) {
    if (actionPendingId) return;
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setActionPendingId(commentId);
    try {
      await deleteComment(commentId);
      setInternalComments((prev) => prev.filter((c) => c.id !== commentId));
      onCommentCountChange?.(-1);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      setActionPendingId(null);
    }
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

        const isOwner = currentUserId && c.userId === currentUserId;
        const canManage = isOwner || currentUserRole === "admin";
        const isCurrentlyEditing = editingId === c.id;

        return (
          <div key={c.id} className="flex items-start gap-2.5 text-xs group">
            <Avatar
              src={c.authorAvatarUrl}
              fallback={c.authorName}
              size="sm"
              className="w-7 h-7 text-[11px] shrink-0 mt-0.5"
            />
            <div className="flex-1 bg-zinc-100/80 dark:bg-zinc-800/70 rounded-2xl px-3.5 py-2.5 border border-zinc-200/60 dark:border-zinc-700/60 shadow-xs transition-colors">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {c.authorName}
                  </span>
                  {timeAgo && (
                    <span
                      className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal"
                      suppressHydrationWarning
                    >
                      {timeAgo}
                    </span>
                  )}
                  {c.isEdited && (
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal italic">
                      • (edited)
                    </span>
                  )}
                </div>

                {canManage && !isCurrentlyEditing && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors rounded cursor-pointer"
                      title="Edit comment"
                      aria-label="Edit comment"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      disabled={actionPendingId === c.id}
                      className="p-1 text-zinc-400 hover:text-rose-600 transition-colors rounded cursor-pointer"
                      title="Delete comment"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {isCurrentlyEditing ? (
                <div className="mt-1 space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-2 py-1 rounded-full text-[11px] font-medium text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(c.id)}
                      disabled={actionPendingId === c.id || !editContent.trim()}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 transition cursor-pointer flex items-center gap-1"
                    >
                      {actionPendingId === c.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {c.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
