import React from "react";
import { cn } from "@/app/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "pill";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-zinc-900 text-zinc-50 border-transparent dark:bg-zinc-50 dark:text-zinc-900 rounded-md",
    secondary:
      "bg-zinc-100 text-zinc-900 border-transparent dark:bg-zinc-800 dark:text-zinc-50 rounded-md",
    outline:
      "border border-zinc-200 text-zinc-800 dark:border-zinc-800 dark:text-zinc-200 rounded-md",
    pill:
      "border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 rounded-full font-mono text-[10px] tracking-wide uppercase px-2.5 py-0.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-950",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
