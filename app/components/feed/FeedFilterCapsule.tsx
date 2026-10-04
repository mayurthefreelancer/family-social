"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Cake, Mic, Utensils, Archive } from "lucide-react";

export function FeedFilterCapsule({ totalCount }: { totalCount: number }) {
  const [filter, setFilter] = useState<"all" | "milestones" | "audio" | "recipes" | "vault">("all");

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
      <button
        type="button"
        onClick={() => setFilter("all")}
        className={`h-8 px-3.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
          filter === "all"
            ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>All Moments</span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-black/10 dark:border-white/10">
          {totalCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => setFilter("milestones")}
        className={`h-8 px-3.5 rounded-full font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
          filter === "milestones"
            ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        }`}
      >
        <Cake className="w-3.5 h-3.5 text-zinc-500" />
        <span>Milestones</span>
      </button>

      <button
        type="button"
        onClick={() => setFilter("audio")}
        className={`h-8 px-3.5 rounded-full font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
          filter === "audio"
            ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        }`}
      >
        <Mic className="w-3.5 h-3.5 text-zinc-500" />
        <span>Audio Notes</span>
      </button>

      <button
        type="button"
        onClick={() => setFilter("recipes")}
        className={`h-8 px-3.5 rounded-full font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
          filter === "recipes"
            ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        }`}
      >
        <Utensils className="w-3.5 h-3.5 text-zinc-500" />
        <span>Recipes</span>
      </button>

      <button
        type="button"
        onClick={() => setFilter("vault")}
        className={`h-8 px-3.5 rounded-full font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
          filter === "vault"
            ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
        }`}
      >
        <Archive className="w-3.5 h-3.5 text-zinc-500" />
        <span>Vault</span>
      </button>
    </div>
  );
}
