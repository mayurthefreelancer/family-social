"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Layers,
  Cake,
  GitFork,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { UserMenu } from "@/app/components/UserMenu";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export interface HearthHeaderProps {
  familyName: string;
  user: {
    displayName: string;
    avatarUrl: string | null;
    role: string;
  };
  members: Array<{
    name: string;
    avatar_url: string | null;
    role: string;
  }>;
  totalMembersCount: number;
  memoriesCount: number;
  onLogout: () => Promise<void>;
}

export function HearthHeader({
  familyName,
  user,
  members,
  totalMembersCount,
  memoriesCount,
  onLogout,
}: HearthHeaderProps) {
  const pathname = usePathname();
  const [inviteCopied, setInviteCopied] = useState(false);

  const initial = familyName.replace(/^The\s+/i, "").charAt(0).toUpperCase() || "K";

  const copyInvite = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/family`);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2500);
    }
  };

  return (
    <div className="w-full">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#fbfbfd]/80 dark:bg-[#09090b]/80 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-zinc-50 dark:text-zinc-900 font-bold text-xs shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 transition-transform group-hover:scale-105">
              {initial}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                Kinship
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">
                {familyName}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/prototype"
              className="text-xs px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors hidden sm:inline-flex"
            >
              Prototype Preview ↗
            </Link>

            <UserMenu
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              onLogout={onLogout}
            />
          </div>
        </div>
      </header>

      {/* Panoramic Hearth Header Canopy */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <section className="rounded-[28px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden transition-colors">
          <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Monogram Crest + Family Identity */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shadow-md ring-4 ring-zinc-100 dark:ring-zinc-850 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900">
                  {initial}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] text-white font-bold" title="Hearth active">
                  ✓
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-bold text-2xl sm:text-3xl tracking-[-0.03em] text-zinc-950 dark:text-zinc-50 leading-tight">
                    {familyName}
                  </h1>
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Private Sanctuary</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 italic font-normal leading-relaxed">
                  &ldquo;Cherishing small moments, holding close across every distance.&rdquo;
                </p>
              </div>
            </div>

            {/* Member Facepile & Invite Kin Pill */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0 pt-2 lg:pt-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                  Circle:
                </span>
                <div className="flex -space-x-2.5 overflow-hidden py-1">
                  {members.slice(0, 6).map((m, idx) => (
                    <div
                      key={idx}
                      title={`${m.name} (${m.role})`}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[11px] font-bold text-zinc-700 dark:text-zinc-200 hover:-translate-y-1 transition duration-150 cursor-pointer"
                    >
                      {m.avatar_url ? (
                        <img
                          src={m.avatar_url}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{m.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  ))}
                </div>

                <Link href="/family">
                  <button
                    onClick={copyInvite}
                    className="h-8 px-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition ml-1 shadow-sm"
                  >
                    {inviteCopied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 stroke-[2]" />
                        <span>Invite</span>
                      </>
                    )}
                  </button>
                </Link>
              </div>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                {totalMembersCount} Family Members Connected &bull; 0 Outsiders
              </span>
            </div>
          </div>

          {/* Lower Architectural Vitals Tray */}
          <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-zinc-850/50 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[11px] font-bold">
                  01
                </span>
                <div>
                  <span className="font-bold block text-sm leading-none text-zinc-900 dark:text-zinc-100">
                    {memoriesCount}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Memories Shared
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[11px] font-bold">
                  02
                </span>
                <div>
                  <span className="font-bold block text-sm leading-none text-zinc-900 dark:text-zinc-100">
                    3
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Generations Connected
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 dark:text-zinc-600 font-mono text-[11px] font-bold">
                  03
                </span>
                <div>
                  <span className="font-bold block text-sm leading-none text-zinc-900 dark:text-zinc-100">
                    Active
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Hearth Sanctuary
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hidden md:inline">
                Living Room Space:
              </span>
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow-sm flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Private Family Feed</span>
              </span>
            </div>
          </div>
        </section>

        {/* Upgraded Sized Tab System (Matching verified prototype) */}
        <nav className="p-1.5 mt-5 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/70 flex items-center shadow-sm gap-1 overflow-x-auto">
          <Link
            href="/feed"
            className={`flex-1 h-10 px-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em] ${
              pathname === "/feed"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Layers className="w-4 h-4 stroke-[1.8]" />
            <span>Stream</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10 hidden sm:inline">
              {memoriesCount}
            </span>
          </Link>

          <Link
            href="/prototype?tab=moments"
            className="flex-1 h-10 px-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <Cake className="w-4 h-4 stroke-[1.8]" />
            <span>Milestones</span>
          </Link>

          <Link
            href="/prototype?tab=gatherings"
            className="flex-1 h-10 px-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <Calendar className="w-4 h-4 stroke-[1.8]" />
            <span>Gatherings</span>
          </Link>

          <Link
            href="/prototype?tab=tree"
            className="flex-1 h-10 px-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <GitFork className="w-4 h-4 stroke-[1.8]" />
            <span>Family Tree</span>
          </Link>

          <Link
            href="/family"
            className={`flex-1 h-10 px-3 rounded-full transition-all duration-150 flex items-center justify-center gap-2 text-sm font-semibold tracking-[-0.01em] ${
              pathname === "/family"
                ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <Users className="w-4 h-4 stroke-[1.8]" />
            <span>Directory</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10 hidden sm:inline">
              {totalMembersCount}
            </span>
          </Link>
        </nav>
      </div>

      <ThemeToggle />
    </div>
  );
}
