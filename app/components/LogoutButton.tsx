// components/LogoutButton.tsx
"use client";

import { logout } from "@/app/actions/auth";

export function LogoutButton({ displayName, avatarUrl }: { displayName: string; avatarUrl: string | null }) {
  return (
    <form action={logout}>
      <div className="relative">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-9 w-9 rounded-full object-cover"
            loading="lazy"
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
            {displayName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <button type="submit">Logout</button>
    </form>
  );
}
