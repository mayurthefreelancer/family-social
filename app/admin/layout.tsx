export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireSuperadmin } from "@/app/lib/auth";
import { logout } from "@/app/actions/auth";
import {
  Terminal,
  LogOut,
  ArrowRight,
  Server,
} from "lucide-react";

export default async function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const superadmin = await requireSuperadmin();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080a0f] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {/* Top Operations Console Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-[#080a0f]/95 border-b border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-2xl">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Security Console Identity */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 via-teal-700 to-slate-950 border border-emerald-400/40 flex items-center justify-center font-mono font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-all">
                <Terminal className="w-5 h-5 text-emerald-300 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base tracking-tight text-slate-900 dark:text-white leading-none">
                    KINSHIP
                  </span>
                  <span className="font-mono text-[10px] font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    CONSOLE // ROOT
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span>SYSTEM OPERATIONAL // SLA 99.98%</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Telemetry & Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* If superadmin has an optional family, link back */}
            {superadmin.familyId && (
              <Link
                href="/feed"
                className="text-xs font-mono font-semibold px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Family Hearth ({superadmin.familyName})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Zero-family Superadmin Badge */}
            {!superadmin.familyId && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <Server className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>TENANT-ISOLATED / ZERO-FAMILY SOVEREIGN</span>
              </div>
            )}

            {/* Superadmin identity indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {superadmin.email}
              </span>
            </div>

            {/* Logout */}
            <form action={logout}>
              <button
                type="submit"
                className="text-xs font-mono font-bold px-3 py-1.5 rounded border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-400 dark:hover:border-red-500/50 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Terminate root session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">TERMINATE</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Console Container */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
