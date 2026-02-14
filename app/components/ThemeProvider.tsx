"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");

    if (stored) {
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute(
        "data-theme",
        prefersDark ? "dark" : "light"
      );
    }

    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}