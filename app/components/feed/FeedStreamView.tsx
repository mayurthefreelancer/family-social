"use client";

import { useState } from "react";
import { HearthComposer } from "./HearthComposer";
import { PostList } from "./PostList";
import {
  Sparkles,
  Cake,
  Mic,
  Utensils,
  Archive,
  ArrowLeft,
  Clock,
  Radio,
  BookOpen,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Badge } from "@/app/components/ui/Badge";

type TabType = "all" | "milestones" | "audio" | "recipes" | "vault";

export function FeedStreamView({
  posts,
  profile,
}: {
  posts: any[];
  profile: any;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  return (
    <div className="space-y-6">
      {/* Category Filter Pills (No external navigation) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`h-8 px-3.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeTab === "all"
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
              : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Moments</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-black/10 dark:border-white/10">
            {posts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("milestones")}
          className={`h-8 px-3.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeTab === "milestones"
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
              : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <Cake className="w-3.5 h-3.5 text-zinc-500" />
          <span>Milestones</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audio")}
          className={`h-8 px-3.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeTab === "audio"
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
              : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-zinc-500" />
          <span>Audio Notes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("recipes")}
          className={`h-8 px-3.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeTab === "recipes"
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
              : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <Utensils className="w-3.5 h-3.5 text-zinc-500" />
          <span>Recipes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("vault")}
          className={`h-8 px-3.5 rounded-full font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
            activeTab === "vault"
              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
              : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <Archive className="w-3.5 h-3.5 text-zinc-500" />
          <span>Vault</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === "all" ? (
        <>
          <HearthComposer profile={profile} />
          <PostList posts={posts} currentUser={profile} />
        </>
      ) : (
        <ComingSoonSkeleton
          tab={activeTab}
          onReset={() => setActiveTab("all")}
        />
      )}
    </div>
  );
}

function ComingSoonSkeleton({
  tab,
  onReset,
}: {
  tab: TabType;
  onReset: () => void;
}) {
  const meta: Record<
    Exclude<TabType, "all">,
    {
      title: string;
      subtitle: string;
      description: string;
      icon: any;
      skeletonLabel: string;
    }
  > = {
    milestones: {
      title: "Family Milestones & Anniversaries",
      subtitle: "Generational Timeline & Celebrations",
      description:
        "We are building a chronological timeline to commemorate weddings, graduations, retirement celebrations, and little ones' first steps in your living room.",
      icon: Cake,
      skeletonLabel: "Graduation Keepsake & Anniversary Timeline",
    },
    audio: {
      title: "Spoken Family Stories & Audio Notes",
      subtitle: "Oral Heritage Recordings",
      description:
        "Preserve grandparents' bedtime stories, Sunday dinner laughter, and oral family memories in relatives' authentic voices with wave sound clips.",
      icon: Mic,
      skeletonLabel: "Voice Keepsake & Sunday Supper Audio Capsule",
    },
    recipes: {
      title: "Family Heirloom Recipes",
      subtitle: "The Family Cookery & Traditions",
      description:
        "Save grandma's secret pasta sauce, Thanksgiving stuffing recipes, and holiday baking traditions with step-by-step ingredients and photos.",
      icon: Utensils,
      skeletonLabel: "Sunday Roast & Holiday Pie Recipe Index",
    },
    vault: {
      title: "Historical Heritage Vault",
      subtitle: "Permanent Document & Letter Archive",
      description:
        "High-resolution digital preservation for handwritten heirloom letters, vintage passport stamps, historical deeds, and ancestral certificates.",
      icon: Archive,
      skeletonLabel: "Ancestral Archive & Vintage Letters",
    },
  };

  const current = meta[tab as Exclude<TabType, "all">];
  const Icon = current.icon;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Informational Header Card */}
      <div className="p-6 sm:p-8 rounded-[28px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 mx-auto flex items-center justify-center shadow-xs">
          <Icon className="w-6 h-6 stroke-[1.8]" />
        </div>

        <div className="space-y-1.5 max-w-md mx-auto">
          <Badge
            variant="outline"
            className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300"
          >
            Coming Soon to Kinship
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            {current.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {current.description}
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="rounded-full text-xs font-semibold gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Moments</span>
          </Button>
        </div>
      </div>

      {/* Animated Skeleton Placeholders */}
      <div className="space-y-3 opacity-60">
        {[1, 2].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-[24px] border border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 space-y-3 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-2.5 w-20 rounded bg-zinc-100 dark:bg-zinc-850" />
              </div>
              <div className="h-5 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800" />
            </div>

            <div className="space-y-2 pt-1">
              <div className="h-3 w-full rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
              <div className="h-3 w-4/5 rounded bg-zinc-200/70 dark:bg-zinc-800/70" />
            </div>

            <div className="h-32 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-850 border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              <span className="text-[11px] font-mono text-zinc-400">
                {current.skeletonLabel} (Placeholder #{idx})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
