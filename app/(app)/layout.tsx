import Link from "next/link";
import { logout } from "../actions/auth";
import { UserMenu } from "../components/UserMenu";
import { requireLoggedInUser } from "../lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireLoggedInUser();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      
      {/* Header */}
      <header
        className="
          sticky top-0 z-50
          backdrop-blur-xl
          border-b border-[var(--border)]
          bg-[var(--surface)]/80
        "
      >
        <div
          className="
            mx-auto max-w-[720px]
            px-5 py-4
            flex items-center justify-between
          "
        >
          <h1 className="text-[var(--text-lg)] font-semibold tracking-tight">
            <Link
              href="/feed"
              className="transition-opacity hover:opacity-80"
            >
              Family Social
            </Link>
          </h1>

          <nav className="flex items-center gap-4">
            <UserMenu
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              onLogout={logout}
            />
          </nav>
        </div>
      </header>

      {/* Main */}
      <main
        className="
          mx-auto
          w-full max-w-[720px]
          px-5
          py-8
        "
      >
        <div className="surface-1 rounded-2xl p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
