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
    <div className="flex-1 mx-auto w-full max-w-[720px] px-4 py-6">
      {/* App Header */}
      <header
        className="
    sticky top-0 z-50
    backdrop-blur-md
    bg-[var(--color-surface)]/80
    border-b border-[var(--color-border)]
  "
      >

        <div className="
          mx-auto max-w-[1024px]
          px-4 py-3
          flex items-center justify-between
        ">
          <h1 className="text-lg font-semibold tracking-tight">
            <Link href="/feed">Family Social</Link>
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

      {/* Page Content */}
      <main className="
  mx-auto
  w-full
  max-w-[720px]
  px-4
  py-6
  sm:px-6
  sm:py-8
">

        {children}
      </main>
    </div>
  );
}
