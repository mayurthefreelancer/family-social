"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cake,
  Calendar,
  ChevronRight,
  GitFork,
  Heart,
  Mic,
  Sparkles,
  Utensils,
  Check,
} from "lucide-react";
import { Card } from "@/app/components/ui/Card";
import { Badge } from "@/app/components/ui/Badge";
import { buttonVariants } from "@/app/components/ui/Button";

export function LivingRoomSidebar() {
  const [rsvp, setRsvp] = useState<"going" | "maybe" | "declined" | null>("going");
  const [saladClaimed, setSaladClaimed] = useState(false);

  return (
    <aside className="space-y-6">
      {/* 1. "On This Day" Archival Polaroid Card */}
      <Card className="rounded-[24px] border-zinc-200/80 dark:border-zinc-800 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3 relative overflow-hidden bg-white dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className="text-xs font-mono uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full"
          >
            On This Day &bull; 2023
          </Badge>
          <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            3 Years Ago
          </span>
        </div>

        {/* Polaroid Photo Frame */}
        <div className="p-2.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-750 bg-zinc-50 dark:bg-zinc-800/60 shadow-sm space-y-2">
          <div className="overflow-hidden rounded-xl h-44 bg-zinc-200 dark:bg-zinc-800">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              alt="Archival memory"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <p className="text-xs sm:text-sm font-medium px-2 py-1 leading-relaxed text-zinc-800 dark:text-zinc-200 italic">
            &ldquo;Family weekend camping at Whispering Pines Lake. Arthur made the bonfire pancakes.&rdquo;
          </p>
        </div>

        <Link
          href="/prototype?tab=vault"
          className="w-full text-center text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center justify-center gap-1 pt-1"
        >
          <span>Open Family Vault</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </Card>

      {/* 2. Celebration Radar */}
      <Card className="rounded-[24px] border-zinc-200/80 dark:border-zinc-800 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 bg-white dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base tracking-tight flex items-center gap-2 text-zinc-950 dark:text-zinc-50">
            <Cake className="w-4 h-4 text-zinc-500" />
            <span>Celebration Radar</span>
          </h3>
          <Badge variant="outline" className="text-xs font-mono uppercase px-2.5 py-0.5">
            October
          </Badge>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl border border-zinc-200/70 dark:border-zinc-750 bg-zinc-50/70 dark:bg-zinc-800/50 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Rose&apos;s 78th Birthday
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:border dark:border-zinc-700 font-bold">
                In 4 Days
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Digital card is open. 5 relatives have written secret messages.
            </p>
            <div className="pt-1">
              <Link
                href="/prototype?tab=moments"
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "h-8 px-3.5 text-xs font-semibold rounded-full border-zinc-300 dark:border-zinc-700",
                })}
              >
                Sign Card ✨
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Sunday Gathering & Potluck Checklist */}
      <Card className="rounded-[24px] border-zinc-200/80 dark:border-zinc-800 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 bg-white dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base tracking-tight flex items-center gap-2 text-zinc-950 dark:text-zinc-50">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <span>Next Gathering</span>
          </h3>
          <Badge variant="secondary" className="text-xs font-mono px-2.5 py-0.5">
            Oct 12
          </Badge>
        </div>

        <div className="space-y-1.5">
          <p className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
            Sunday Lawn Roast &amp; Potluck
          </p>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Sunday, 4:00 PM &bull; Maple Ridge Garden
          </p>
        </div>

        {/* RSVP Pill Buttons */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
            Your RSVP
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRsvp("going")}
              className={`flex-1 h-8 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                rsvp === "going"
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-200"
                  : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-750 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
              }`}
            >
              ✓ Coming (4)
            </button>
            <button
              type="button"
              onClick={() => setRsvp("maybe")}
              className={`flex-1 h-8 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                rsvp === "maybe"
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-200"
                  : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-750 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
              }`}
            >
              Maybe (2)
            </button>
            <button
              type="button"
              onClick={() => setRsvp("declined")}
              className={`flex-1 h-8 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                rsvp === "declined"
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-200"
                  : "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-750 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
              }`}
            >
              Can&apos;t Go
            </button>
          </div>
        </div>

        {/* Potluck Items */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
            Potluck Checklist
          </span>
          <div className="space-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-750 bg-zinc-50/50 dark:bg-zinc-800/50">
              <span className="text-zinc-800 dark:text-zinc-200">Apple skillet tart</span>
              <span className="text-xs text-zinc-500 font-medium">✓ Rose Miller</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-750 bg-zinc-50/50 dark:bg-zinc-800/50">
              <span className="text-zinc-800 dark:text-zinc-200">Marinated brisket</span>
              <span className="text-xs text-zinc-500 font-medium">✓ Mark Miller</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-750 bg-zinc-50/50 dark:bg-zinc-800/50">
              <span className="text-zinc-800 dark:text-zinc-200">Roasted corn salad</span>
              {saladClaimed ? (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> You claimed
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setSaladClaimed(true)}
                  className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
                >
                  Claim +
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Living Heritage Tree Card */}
      <Card className="rounded-[24px] border-zinc-200/80 dark:border-zinc-800 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3 bg-white dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-base tracking-tight flex items-center gap-2 text-zinc-950 dark:text-zinc-50">
            <GitFork className="w-4 h-4 text-zinc-500" />
            <span>Living Heritage Tree</span>
          </h3>
          <Badge variant="outline" className="text-xs font-mono px-2.5 py-0.5">
            3 Tiers
          </Badge>
        </div>

        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Mapping 3 connected generations across your direct and extended family branches.
        </p>

        <Link
          href="/prototype?tab=tree"
          className="w-full text-center text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center justify-center gap-1 pt-1"
        >
          <span>Explore Generational Tree</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </Card>
    </aside>
  );
}
