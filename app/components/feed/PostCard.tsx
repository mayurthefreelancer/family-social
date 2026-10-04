"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MessageCircle,
  ShieldCheck,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Card } from "@/app/components/ui/Card";
import { CommentSection } from "./CommentSection";
import { LikeButton } from "./LikeButton";
import { PhotoMosaicGrid, PhotoItem } from "./PhotoMosaicGrid";
import { PhotoLightboxModal } from "./PhotoLightboxModal";
import { updatePost, deletePost } from "@/app/actions/post";

export function PostCard({
  post,
  currentUser,
}: {
  post: {
    id: string;
    authorId?: string;
    authorName: string;
    authorAvatarUrl?: string | null;
    content: string;
    imageUrl?: string | null;
    photos?: PhotoItem[];
    isEdited?: boolean;
    updatedAt?: string | null;
    createdAt: string;
    commentCount?: number;
    likeCount: number;
    likedByMe: boolean;
  };
  currentUser?: {
    id?: string;
    name?: string;
    avatarUrl?: string | null;
    role?: string;
  };
}) {
  const [openComments, setOpenComments] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Edit / Delete State
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isActionPending, setIsActionPending] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [currentContent, setCurrentContent] = useState(post.content);
  const [editContent, setEditContent] = useState(post.content);
  const [isEdited, setIsEdited] = useState(Boolean(post.isEdited));

  const initialPhotos: PhotoItem[] =
    post.photos && post.photos.length > 0
      ? post.photos
      : post.imageUrl
      ? [{ id: post.id, url: post.imageUrl }]
      : [];

  const [photosList, setPhotosList] = useState<PhotoItem[]>(initialPhotos);
  const [keptPhotoIds, setKeptPhotoIds] = useState<string[]>(
    initialPhotos.map((p) => p.id)
  );
  const [commentCount, setCommentCount] = useState(post.commentCount ?? 0);

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  const isAuthor = currentUser?.id && post.authorId === currentUser.id;
  const isAdmin = currentUser?.role === "admin";
  const canManage = isAuthor || isAdmin;

  const isRecipe = currentContent?.startsWith("[🍲 Family Recipe]");
  const cleanContent = isRecipe
    ? currentContent.replace("[🍲 Family Recipe]", "").trim()
    : currentContent;

  if (isDeleted) {
    return null;
  }

  function handleStartEdit() {
    setShowMenu(false);
    setEditContent(currentContent);
    setKeptPhotoIds(photosList.map((p) => p.id));
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditContent(currentContent);
    setKeptPhotoIds(photosList.map((p) => p.id));
  }

  function handleRemovePhotoFromEdit(photoId: string) {
    setKeptPhotoIds((prev) => prev.filter((id) => id !== photoId));
  }

  async function handleSaveEdit() {
    if (!editContent.trim() && keptPhotoIds.length === 0) return;
    setIsActionPending(true);

    try {
      await updatePost(post.id, editContent.trim(), keptPhotoIds);
      setCurrentContent(editContent.trim());
      setPhotosList((prev) => prev.filter((p) => keptPhotoIds.includes(p.id)));
      setIsEdited(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setIsActionPending(false);
    }
  }

  async function handleConfirmDelete() {
    setIsActionPending(true);
    try {
      await deletePost(post.id);
      setIsDeleted(true);
    } catch (err) {
      console.error("Failed to delete post:", err);
      setIsActionPending(false);
    }
  }

  return (
    <Card className="rounded-[24px] border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 transition-colors">
      {/* Post Author Header */}
      <header className="flex items-center justify-between gap-3 relative">
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
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal"
                suppressHydrationWarning
              >
                {formattedDate}
              </span>
              {isEdited && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal italic">
                  • (edited)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-zinc-400 relative">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-zinc-200/60 dark:border-zinc-800 hidden sm:inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Family Only
          </span>

          {canManage && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="w-8 h-8 aspect-square shrink-0 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Manage memory"
                aria-label="Manage memory"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Actions Dropdown */}
              {showMenu && (
                <div className="absolute right-0 top-9 w-36 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl py-1.5 z-20 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="w-full px-3 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Edit Memory</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      setShowDeleteConfirm(true);
                    }}
                    className="w-full px-3 py-2 text-left font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Delete Confirmation Modal / Banner */}
      {showDeleteConfirm && (
        <div className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 space-y-2.5">
          <p className="text-xs sm:text-sm font-medium text-rose-900 dark:text-rose-200">
            Are you sure you want to delete this memory? This cannot be undone.
          </p>
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isActionPending}
              className="px-3 py-1 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isActionPending}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {isActionPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Delete Memory</span>
            </button>
          </div>
        </div>
      )}

      {/* Editing Mode */}
      {isEditing ? (
        <div className="space-y-3 pt-1">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            className="w-full text-[15px] leading-relaxed p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none resize-none"
            placeholder="Edit your memory..."
            autoFocus
          />

          {/* Photo Management in Edit Mode */}
          {photosList.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs text-zinc-500 font-medium">
                Attached photos ({keptPhotoIds.length} remaining):
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {photosList.map((photo, idx) => {
                  const isKept = keptPhotoIds.includes(photo.id);
                  return (
                    <div
                      key={photo.id || idx}
                      className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                        isKept
                          ? "border-zinc-200 dark:border-zinc-700"
                          : "opacity-30 border-rose-300 line-through"
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt="Photo thumbnail"
                        className="w-full h-full object-cover"
                      />
                      {isKept ? (
                        <button
                          type="button"
                          onClick={() => handleRemovePhotoFromEdit(photo.id)}
                          className="absolute top-1 right-1 w-5 h-5 aspect-square shrink-0 rounded-full bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center p-0 border-0 cursor-pointer shadow-sm"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setKeptPhotoIds((prev) => [...prev, photo.id])
                          }
                          className="absolute inset-0 bg-black/50 text-white text-[11px] font-semibold flex items-center justify-center cursor-pointer"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Edit Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isActionPending}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              disabled={isActionPending || (!editContent.trim() && keptPhotoIds.length === 0)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {isActionPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Editorial Post Body */}
          {cleanContent && (
            <div className="text-base leading-relaxed font-normal text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
              {cleanContent}
            </div>
          )}

          {/* Post Photos Attachment (Adaptive Mosaic Grid) */}
          {photosList.length > 0 && (
            <PhotoMosaicGrid
              photos={photosList}
              onPhotoClick={(idx) => {
                setLightboxIndex(idx);
                setLightboxOpen(true);
              }}
            />
          )}
        </>
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
            <span>{commentCount}</span>
            <span className="hidden sm:inline">
              {commentCount === 1 ? "comment" : "comments"}
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
            initialCount={commentCount}
            currentUserName={currentUser?.name}
            currentUserAvatar={currentUser?.avatarUrl}
            currentUserId={currentUser?.id}
            currentUserRole={currentUser?.role}
            onCommentCountChange={(delta) =>
              setCommentCount((prev) => Math.max(0, prev + delta))
            }
          />
        </div>
      )}

      {/* Fullscreen Touch Lightbox Viewer */}
      {photosList.length > 0 && (
        <PhotoLightboxModal
          photos={photosList}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </Card>
  );
}