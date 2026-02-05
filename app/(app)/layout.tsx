import Link from "next/link";
import { requireUser } from "../lib/auth";
import { LogoutButton } from "../components/LogoutButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen">
      {/* App Header */}
      <header className="
        border-b border-[var(--color-border)]
        bg-[var(--color-surface)]
      ">
        <div className="
          mx-auto max-w-[1024px]
          px-4 py-3
          flex items-center justify-between
        ">
          <Link
            href="/feed"
            className="text-sm font-medium"
          >
            Family Social
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/family"
              className="text-sm text-[var(--color-text-muted)]
                         hover:text-[var(--color-text-primary)]"
            >
              Family
            </Link>

            <Link
              href="/profile"
              className="text-sm text-[var(--color-text-muted)]
                         hover:text-[var(--color-text-primary)]"
            >
              Profile
            </Link>

            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="mx-auto max-w-[720px] px-4 py-8">
        {children}
      </main>
    </div>
  );
}
