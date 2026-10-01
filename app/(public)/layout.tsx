import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 flex flex-col justify-between transition-colors duration-200">
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-zinc-50 dark:text-zinc-900 font-bold text-sm shadow-sm ring-2 ring-zinc-200 dark:ring-zinc-800 ring-offset-2 ring-offset-[#fbfbfd] dark:ring-offset-[#09090b] transition-transform group-hover:scale-105">
            K
          </div>
          <div>
            <div className="font-semibold text-base tracking-tight leading-none">Kinship</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">The Digital Living Room</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/prototype"
            className="text-xs px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            Preview Prototype ↗
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </main>

      <footer className="w-full py-6 text-center text-xs text-zinc-500 dark:text-zinc-500 border-t border-zinc-200/40 dark:border-zinc-800/40">
        Private • End-to-End Family Sanctuary • Zero Data Profiling
      </footer>

      <ThemeToggle />
    </div>
  );
}
