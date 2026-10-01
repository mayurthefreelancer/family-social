"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/app/components/ui/Avatar";
import { LogOut, User, Users } from "lucide-react";

export function UserMenu({
  displayName,
  avatarUrl,
  onLogout,
}: {
  displayName: string;
  avatarUrl: string | null;
  onLogout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-0.5 rounded-full ring-2 ring-transparent hover:ring-zinc-300 dark:hover:ring-zinc-700 transition-all focus:outline-none"
        title={displayName}
      >
        <Avatar
          src={avatarUrl ?? undefined}
          fallback={displayName}
          size="sm"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
          <div className="px-3.5 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-zinc-500">Active Kin</p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 px-3.5 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              onClick={() => setOpen(false)}
            >
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Your Profile</span>
            </Link>

            <Link
              href="/family"
              className="flex items-center gap-2.5 px-3.5 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              onClick={() => setOpen(false)}
            >
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              <span>Family Directory & Invites</span>
            </Link>

            <Link
              href="/prototype"
              className="flex items-center gap-2.5 px-3.5 py-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              onClick={() => setOpen(false)}
            >
              <span>Preview Prototype ↗</span>
            </Link>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

          <form action={onLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}