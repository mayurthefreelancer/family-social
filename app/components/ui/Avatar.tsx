"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
}

export function Avatar({
  src,
  alt = "Avatar",
  fallbackText,
  fallback,
  size = "md",
  online,
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const displayText = fallbackText || fallback || alt || "?";
  const initial = displayText.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "relative inline-block rounded-full shrink-0 select-none",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-semibold text-zinc-700 dark:text-zinc-200">
          {initial}
        </div>
      )}

      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-zinc-900",
            size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5",
            online ? "bg-emerald-500" : "bg-zinc-400"
          )}
        />
      )}
    </div>
  );
}
