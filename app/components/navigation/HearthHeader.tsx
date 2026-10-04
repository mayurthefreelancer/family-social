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

export interface HearthHeaderProps {
  familyName: string;
  familyDescription?: string | null;
  familyAvatarUrl?: string | null;
  familyBackdropUrl?: string | null;
  user: {
    displayName: string;
    avatarUrl: string | null;
    role: string;
    isSuperadmin?: boolean;
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
  familyDescription,
  familyAvatarUrl,
  familyBackdropUrl,
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
            <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-transparent dark:border-zinc-700 flex items-center justify-center text-zinc-50 dark:text-zinc-100 font-bold text-xs shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800 transition-transform group-hover:scale-105">
              {initial}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                Kinship
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
                {familyName}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <UserMenu
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              role={user.role}
              isSuperadmin={user.isSuperadmin}
              onLogout={onLogout}
            />
          </div>
        </div>
      </header>

      {/* Panoramic Hearth Header Canopy */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <section className="relative rounded-[28px] border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden transition-colors">
          {/* Panoramic Canopy Cover Banner */}
          {familyBackdropUrl && (
            <div className="relative h-32 sm:h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img
                src={familyBackdropUrl}
                alt={`${familyName} banner`}
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle Gradient Fade to Card Surface */}
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 via-white/30 dark:via-zinc-900/30 to-transparent" />
            </div>
          )}

          <div
            className={`relative z-10 px-6 sm:px-8 pb-6 sm:pb-7 flex flex-col lg:flex-row ${
              familyBackdropUrl
                ? "-mt-10 sm:-mt-12 lg:items-end"
                : "pt-6 sm:pt-8 lg:items-center"
            } justify-between gap-6`}
          >
            {/* Monogram Crest or Avatar + Family Identity */}
            <div className="flex items-start sm:items-end gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-full p-1 bg-white dark:bg-zinc-900 shadow-xl ring-4 ring-white dark:ring-zinc-900 flex items-center justify-center">
                  {familyAvatarUrl ? (
                    <img
                      src={familyAvatarUrl}
                      alt={familyName}
                      className="w-full h-full rounded-full object-cover aspect-square"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-zinc-900 dark:bg-zinc-800 text-zinc-50 flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold">
                      {initial}
                    </div>
                  )}
                </div>
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] text-white font-bold shadow-sm"
                  title="Hearth active"
                >
                  ✓
                </div>
              </div>

              <div className="space-y-1.5 pb-0.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-bold text-2xl sm:text-3xl tracking-[-0.03em] text-zinc-950 dark:text-zinc-50 leading-tight">
                    {familyName}
                  </h1>
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-800/90 text-zinc-600 dark:text-zinc-300 inline-flex items-center gap-1.5 backdrop-blur-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Private Sanctuary</span>
                  </span>
                  {user.role === "admin" && (
                    <Link
                      href="/family#settings"
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 transition-colors inline-flex items-center gap-1"
                      title="Manage family name, description, avatar and banner"
                    >
                      <span>Edit Family</span>
                    </Link>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 italic font-normal leading-relaxed max-w-xl">
                  &ldquo;{familyDescription || "Cherishing small moments, holding close across every distance."}&rdquo;
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

                <button
                  type="button"
                  onClick={copyInvite}
                  className="h-8 px-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition ml-1 shadow-sm"
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
              </div>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {totalMembersCount} Family Members Connected &bull; 0 Outsiders
              </span>
            </div>
          </div>

          {/* Lower Architectural Vitals Tray */}
          <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-zinc-800/40 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 dark:text-zinc-500 font-mono text-xs font-bold">
                  01
                </span>
                <div>
                  <span className="font-bold block text-sm sm:text-base leading-none text-zinc-900 dark:text-zinc-100">
                    {memoriesCount}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Memories Shared
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 dark:text-zinc-500 font-mono text-xs font-bold">
                  02
                </span>
                <div>
                  <span className="font-bold block text-sm sm:text-base leading-none text-zinc-900 dark:text-zinc-100">
                    3
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Generations Connected
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400 dark:text-zinc-500 font-mono text-xs font-bold">
                  03
                </span>
                <div>
                  <span className="font-bold block text-sm sm:text-base leading-none text-zinc-900 dark:text-zinc-100">
                    Active
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Hearth Sanctuary
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hidden md:inline">
                Living Room Space:
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 shadow-sm flex items-center gap-1.5">
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
            <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10 hidden sm:inline">
              {memoriesCount}
            </span>
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
            <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10 hidden sm:inline">
              {totalMembersCount}
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
