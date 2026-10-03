"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Upload } from "lucide-react";

export function AvatarPreviewInput({
  currentAvatar,
  name = "User",
  onFileSelect,
}: {
  currentAvatar?: string | null;
  name?: string;
  onFileSelect?: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  // If currentAvatar changes (e.g. after upload), update preview
  useEffect(() => {
    if (currentAvatar) {
      setPreview(null);
    }
  }, [currentAvatar]);

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/40 shadow-sm"
          />
        ) : (
          <Avatar
            src={currentAvatar}
            alt={name}
            fallbackText={name}
            size="xl"
            className="w-16 h-16 border-2 border-zinc-200 dark:border-zinc-700"
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="avatar-file-input"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/70 cursor-pointer transition-colors shadow-xs w-fit"
        >
          <Upload className="w-3.5 h-3.5 text-zinc-500" />
          Choose photo
        </label>
        <input
          id="avatar-file-input"
          type="file"
          name="avatar"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPreview(URL.createObjectURL(file));
              onFileSelect?.();
            }
          }}
        />
        <span className="text-[11px] text-zinc-400">
          PNG, JPG, or WebP up to 2MB
        </span>
      </div>
    </div>
  );
}
