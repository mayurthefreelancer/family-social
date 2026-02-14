"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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
        className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-border)]"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div
            className="
              h-9 w-9 rounded-full
              bg-[var(--color-border)]
              flex items-center justify-center
              text-xs font-semibold
              text-[var(--color-text-muted)]
            "
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-48
            rounded-md border border-[var(--color-border)]
            bg-[var(--color-surface)]
            shadow-lg
            py-1
            z-50
          "
        >
          <Link
            href="/profile"
            className="
              block px-4 py-2 text-sm
              text-[var(--color-text-primary)]
              hover:bg-[var(--color-border)]
            "
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>

          <Link
            href="/family"
            className="
              block px-4 py-2 text-sm
              text-[var(--color-text-primary)]
              hover:bg-[var(--color-border)]
            "
            onClick={() => setOpen(false)}
          >
            Family
          </Link>

          <div className="border-t border-[var(--color-border)] my-1" />

          <form action={onLogout}>
            <button
              type="submit"
              className="
                w-full text-left px-4 py-2 text-sm
                text-red-500
                hover:bg-[var(--color-border)]
              "
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}