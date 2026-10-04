"use client";

import { uploadAvatar } from "@/app/actions/profile";
import { useActionState, useState, useRef, useTransition } from "react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Image as ImageIcon,
} from "lucide-react";

export function AvatarUploadForm({
  avatar,
  name,
}: {
  avatar?: string | null;
  name: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(file: File | null) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFeedback({
        type: "error",
        message: "Please choose an image file (JPEG, PNG, WebP).",
      });
      return;
    }

    if (file.size > 2_000_000) {
      setFeedback({
        type: "error",
        message: "Avatar image must be under 2MB.",
      });
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setFeedback(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file || null);
  }

  function handleCancelPreview() {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSaveAvatar() {
    if (!selectedFile) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      const res = await uploadAvatar(formData);

      if (res?.success) {
        setFeedback({
          type: "success",
          message: "Profile portrait updated successfully!",
        });
        setSelectedFile(null);
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({
          type: "error",
          message: res?.error || "Failed to upload avatar.",
        });
      }
    });
  }

  const currentDisplayAvatar = preview || avatar;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center sm:items-start gap-6">
      {/* Interactive Avatar Ring with Camera Trigger */}
      <div
        className="relative group cursor-pointer shrink-0"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div
          className={`w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-full p-1 bg-white dark:bg-zinc-800 shadow-xl ring-4 transition-all flex items-center justify-center overflow-hidden ${
            isDragging
              ? "ring-emerald-500 scale-105"
              : preview
              ? "ring-emerald-400 dark:ring-emerald-500"
              : "ring-zinc-200 dark:ring-zinc-700 group-hover:ring-zinc-300 dark:group-hover:ring-zinc-600"
          }`}
        >
          {currentDisplayAvatar ? (
            <img
              src={currentDisplayAvatar}
              alt={name}
              className="w-full h-full rounded-full object-cover aspect-square"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-zinc-900 dark:bg-zinc-800 text-zinc-50 flex items-center justify-center font-bold text-2xl sm:text-3xl">
              {name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Hover Overlay with Camera Icon */}
          <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs">
            <Camera className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Change</span>
          </div>
        </div>

        {/* Anchored Camera Button Badge */}
        <button
          type="button"
          aria-label="Upload new portrait photo"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
      </div>

      {/* Control Actions & Guidance */}
      <div className="flex-1 space-y-3 text-center sm:text-left">
        <div>
          <h4 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
            Profile Portrait Photo
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
            Click your avatar or drag a photo to update how relatives see you in memories, celebrations, and recipe notes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
          {preview ? (
            <>
              <Button
                type="button"
                onClick={handleSaveAvatar}
                disabled={isPending}
                className="h-8.5 px-4 rounded-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Portrait...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Apply New Avatar</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancelPreview}
                disabled={isPending}
                className="h-8.5 px-3.5 rounded-full text-xs cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8.5 px-4 rounded-full text-xs font-semibold border-zinc-200 dark:border-zinc-750 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-500" />
              <span>Choose Photo</span>
            </Button>
          )}

          <span className="text-[11px] text-zinc-400 block sm:inline">
            PNG, JPG, or WebP. Max 2MB.
          </span>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
              feedback.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
