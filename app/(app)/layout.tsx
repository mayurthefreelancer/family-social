import { requireFamilyUser } from "../lib/auth";
import { logout } from "../actions/auth";
import { HearthHeader } from "../components/navigation/HearthHeader";
import { pool } from "../lib/db";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireFamilyUser();

  // Query member facepile
  const membersRes = await pool.query(
    `
    SELECT
      COALESCE(p.display_name, u.name) AS name,
      COALESCE(p.avatar_url, u.avatar_url) AS avatar_url,
      fm.role
    FROM family_members fm
    JOIN users u ON u.id = fm.user_id
    LEFT JOIN profiles p ON p.user_id = u.id AND p.family_id = fm.family_id
    WHERE fm.family_id = $1
    ORDER BY fm.role DESC, u.name ASC
    LIMIT 8
    `,
    [user.family_id]
  );

  // Query total counts
  const countsRes = await pool.query(
    `
    SELECT
      (SELECT COUNT(*) FROM family_members WHERE family_id = $1) AS members_count,
      (SELECT COUNT(*) FROM posts WHERE family_id = $1) AS posts_count
    `,
    [user.family_id]
  );

  const totalMembersCount = Number(countsRes.rows[0]?.members_count || 1);
  const memoriesCount = Number(countsRes.rows[0]?.posts_count || 0);

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 transition-colors duration-200">
      <HearthHeader
        familyName={user.familyName}
        familyDescription={user.familyDescription}
        familyAvatarUrl={user.familyAvatarUrl}
        familyBackdropUrl={user.familyBackdropUrl}
        user={{
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          role: user.role,
          isSuperadmin: user.isSuperadmin,
        }}
        members={membersRes.rows}
        totalMembersCount={totalMembersCount}
        memoriesCount={memoriesCount}
        onLogout={logout}
      />

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
