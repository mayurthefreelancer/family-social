"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, GitFork, Calendar, User } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: typeof Layers;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Living Room",
    href: "/feed",
    icon: Layers,
  },
  {
    name: "Family Tree",
    href: "/family",
    icon: GitFork,
  },
  {
    name: "Events",
    href: "/feed#trips",
    icon: Calendar,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            mounted &&
            (item.href === "/feed#trips"
              ? false
              : pathname === item.href ||
                (item.href !== "/feed" && pathname?.startsWith(item.href)));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? "text-zinc-950 dark:text-white font-semibold"
                  : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 font-normal"
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-8 h-8 aspect-square shrink-0 rounded-full transition-colors ${
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                    : ""
                }`}
              >
                <Icon className="w-4 h-4 transition-transform" />
                {isActive && (
                  <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-amber-600 dark:bg-amber-400" />
                )}
              </div>
              <span className="text-[11px] leading-tight mt-0.5 tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
