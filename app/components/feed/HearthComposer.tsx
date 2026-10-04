"use client";

import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Mic,
  Utensils,
  ShieldCheck,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { createPost } from "@/app/actions/post";
import { sanitizeImageToFile } from "@/app/lib/exif-sanitizer";

interface SelectedPhoto {
  id: string;
  file: File;
  previewUrl: string;
}

export function HearthComposer({
  profile,
}: {
  profile: {
    avatar_url?: string | null;
    display_name?: string | null;
  };
}) {
  const [content, setContent] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<SelectedPhoto[]>([]);
  const [isSanitizing, setIsSanitizing] = useState(false);
  const [pending, setPending] = useState(false);
  const [isRecipe, setIsRecipe] = useState(false);
  const [hasAudioPrompt, setHasAudioPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      selectedPhotos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, [selectedPhotos]);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    const availableSlots = 6 - selectedPhotos.length;
    if (availableSlots <= 0) {
      setErrorMsg("Maximum 6 photos allowed per post");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
      setErrorMsg(`Only ${availableSlots} more photo(s) could be added (max 6)`);
    }

    setIsSanitizing(true);
    try {
      const sanitizedBatch: SelectedPhoto[] = [];
      for (const file of filesToProcess) {
        // Strip EXIF metadata via canvas redraw
        const sanitizedFile = await sanitizeImageToFile(file);
        const previewUrl = URL.createObjectURL(sanitizedFile);
        sanitizedBatch.push({
          id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          file: sanitizedFile,
          previewUrl,
        });
      }

      setSelectedPhotos((prev) => [...prev, ...sanitizedBatch]);
    } catch (err) {
      console.error("EXIF sanitization failed:", err);
      setErrorMsg("Failed to prepare one or more photos");
    } finally {
      setIsSanitizing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleRemovePhoto(id: string) {
    setSelectedPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if ((!content.trim() && selectedPhotos.length === 0) || pending || isSanitizing) {
      return;
    }

    setPending(true);
    setErrorMsg(null);
    try {
      let finalContent = content.trim();
      if (isRecipe && finalContent) {
        finalContent = `[🍲 Family Recipe] ${finalContent}`;
      }

      const formData = new FormData();
      formData.append("content", finalContent);
      for (const item of selectedPhotos) {
        formData.append("photos", item.file);
      }

      await createPost(formData);

      // Clean up previews
      selectedPhotos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setSelectedPhotos([]);
      setContent("");
      setIsRecipe(false);
      setHasAudioPrompt(false);
    } catch (err) {
      console.error("Failed to post moment:", err);
      setErrorMsg("Failed to share memory with family. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden Multi-Photo Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoSelect}
          disabled={pending || isSanitizing || selectedPhotos.length >= 6}
        />

        <div className="flex items-start gap-3.5">
          <Avatar
            src={profile.avatar_url ?? undefined}
            fallback={profile.display_name ?? "Me"}
            size="md"
          />

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What moment, memory, or recipe are you sharing with the family today?"
              disabled={pending}
              rows={3}
              className="w-full resize-none bg-transparent text-[15px] leading-[1.65] text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Selected Mode Badges & Sanitization Status */}
        {(isRecipe || hasAudioPrompt || isSanitizing || errorMsg) && (
          <div className="flex items-center gap-2 pl-12 flex-wrap">
            {isRecipe && (
              <span className="text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                🍲 Recipe Card tagged
                <button
                  type="button"
                  onClick={() => setIsRecipe(false)}
                  className="hover:opacity-70 ml-1 text-xs"
                >
                  ×
                </button>
              </span>
            )}
            {hasAudioPrompt && (
              <span className="text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                🎙️ Voice story attached
                <button
                  type="button"
                  onClick={() => setHasAudioPrompt(false)}
                  className="hover:opacity-70 ml-1 text-xs"
                >
                  ×
                </button>
              </span>
            )}
            {isSanitizing && (
              <span className="text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse">
                <ShieldCheck className="w-3.5 h-3.5" />
                Scrubbing EXIF metadata...
              </span>
            )}
            {errorMsg && (
              <span className="text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                ⚠️ {errorMsg}
              </span>
            )}
          </div>
        )}

        {/* Multi-Photo Thumbnail Strip */}
        {selectedPhotos.length > 0 && (
          <div className="pl-12 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <ImageIcon className="w-3.5 h-3.5" />
                {selectedPhotos.length} / 6 photos selected
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> EXIF GPS Scrubbed
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {selectedPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 shadow-sm"
                >
                  <img
                    src={photo.previewUrl}
                    alt={`Selected upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 aspect-square shrink-0 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer p-0 border-0 m-0 leading-none overflow-hidden"
                    aria-label="Remove photo"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.2 bg-black/60 text-white rounded text-[10px] font-mono leading-tight">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer with tactile pills and submit button */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSanitizing || selectedPhotos.length >= 6}
              className={`h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                selectedPhotos.length > 0
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>
                {selectedPhotos.length > 0
                  ? `Photos (${selectedPhotos.length})`
                  : "Photo"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setHasAudioPrompt(!hasAudioPrompt)}
              className="h-8 px-3 rounded-full border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Note</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRecipe(!isRecipe)}
              className={`h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isRecipe
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  : "border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Recipe</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Family Only
            </span>

            <Button
              type="submit"
              disabled={
                pending ||
                isSanitizing ||
                (!content.trim() && selectedPhotos.length === 0)
              }
              className="h-9 px-4 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              {pending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Sharing...</span>
                </>
              ) : (
                <span>Share with Family</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
