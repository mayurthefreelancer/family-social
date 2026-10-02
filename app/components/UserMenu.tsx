"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { LogOut, User, Users, ShieldCheck } from "lucide-react";

export function UserMenu({
  displayName,
  avatarUrl,
  role,
  isSuperadmin,
  onLogout,
}: {
  displayName: string;
  avatarUrl: string | null;
  role?: string;
  isSuperadmin?: boolean;
  onLogout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on outside click for dropdown menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dismiss logout dialog on Escape
  useEffect(() => {
    if (!showLogoutDialog) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoggingOut) {
        setShowLogoutDialog(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLogoutDialog, isLoggingOut]);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch {
      await onLogout();
    }
  };

  return (
    <>
      <div ref={ref} className="relative">
        {/* Avatar Button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-0.5 rounded-full ring-2 ring-transparent hover:ring-zinc-300 dark:hover:ring-zinc-700 transition-all focus:outline-none cursor-pointer"
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
          <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-sm">
            <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-sm sm:text-base">
                {displayName}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Active Kin</p>
            </div>

            <div className="py-1.5">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setOpen(false)}
              >
                <User className="w-4 h-4 text-zinc-400" />
                <span>Your Profile</span>
              </Link>

              <Link
                href="/family"
                className="flex items-center gap-3 px-4 py-2.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setOpen(false)}
              >
                <Users className="w-4 h-4 text-zinc-400" />
                <span>{role === "admin" ? "Manage Family & Invites" : "Family Directory"}</span>
              </Link>

              {isSuperadmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Superadmin Console ↗</span>
                </Link>
              )}

              <Link
                href="/prototype"
                className="flex items-center gap-3 px-4 py-2.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setOpen(false)}
              >
                <span>Preview Prototype ↗</span>
              </Link>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setShowLogoutDialog(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>

      {/* Custom Kinship In-App Logout Confirmation Dialog - Portaled to document.body to avoid parent stacking context/backdrop-filter issues */}
      {mounted &&
        showLogoutDialog &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isLoggingOut) {
                setShowLogoutDialog(false);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[24px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto ring-4 ring-red-100/60 dark:ring-red-900/30">
                <LogOut className="w-5 h-5 stroke-[2]" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
                  Leave the Living Room?
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  You will be signed out of your family sanctuary. You can sign back in at any time.
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-full text-xs sm:text-sm h-10 font-medium cursor-pointer"
                  onClick={() => setShowLogoutDialog(false)}
                  disabled={isLoggingOut}
                >
                  Stay
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-full text-xs sm:text-sm h-10 bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700 dark:text-white font-semibold shadow-sm cursor-pointer"
                  onClick={handleConfirmLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Signing out…" : "Sign Out"}
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}