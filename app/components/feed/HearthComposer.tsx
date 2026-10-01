"use client";

import { useState } from "react";
import { Camera, Mic, Utensils, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { createPost } from "@/app/actions/post";

export function HearthComposer({
  profile,
}: {
  profile: {
    avatar_url?: string | null;
    display_name?: string | null;
  };
}) {
  const [content, setContent] = useState("");
  const [pending, setPending] = useState(false);
  const [isRecipe, setIsRecipe] = useState(false);
  const [hasPhotoPrompt, setHasPhotoPrompt] = useState(false);
  const [hasAudioPrompt, setHasAudioPrompt] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || pending) return;

    setPending(true);
    try {
      let finalContent = content.trim();
      if (isRecipe) {
        finalContent = `[🍲 Family Recipe] ${finalContent}`;
      }
      await createPost(finalContent);
      setContent("");
      setIsRecipe(false);
      setHasPhotoPrompt(false);
      setHasAudioPrompt(false);
    } catch (err) {
      console.error("Failed to post moment:", err);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Selected Mode Badges */}
        {(isRecipe || hasPhotoPrompt || hasAudioPrompt) && (
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
            {hasPhotoPrompt && (
              <span className="text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                📷 Photo collage mode
                <button
                  type="button"
                  onClick={() => setHasPhotoPrompt(false)}
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
          </div>
        )}

        {/* Footer with tactile pills and submit button */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setHasPhotoPrompt(!hasPhotoPrompt)}
              className="h-8 px-3 rounded-full border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setHasAudioPrompt(!hasAudioPrompt)}
              className="h-8 px-3 rounded-full border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Note</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRecipe(!isRecipe)}
              className={`h-8 px-3 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isRecipe
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  : "border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
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
              disabled={pending || !content.trim()}
              className="h-9 px-4 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 text-xs font-semibold shadow-sm transition-all"
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
