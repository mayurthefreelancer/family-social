export const dynamic = "force-dynamic";

import { FamilyMembersList } from "@/app/components/family/FamilyMembersList";
import GenerateInviteButton from "@/app/components/family/GenerateInviteButtons";
import { InviteList } from "@/app/components/invites/InviteList";
import { FamilySettingsCard } from "@/app/components/family/FamilySettingsCard";
import { requireUser } from "@/app/lib/auth";
import { pool } from "@/app/lib/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/components/ui/Card";

export default async function FamilyPage() {
  const user = await requireUser();

  const familyRes = await pool.query(
    `
    SELECT id, name, description, avatar_url, backdrop_url
    FROM families
    WHERE id = $1
    `,
    [user.family_id]
  );

  const family = familyRes.rows[0] ?? {
    id: user.family_id,
    name: user.familyName,
    description: null,
    avatar_url: null,
    backdrop_url: null,
  };

  const membersRes = await pool.query(
    `
    SELECT u.id, COALESCE(p.display_name, u.name) AS name, fm.role, COALESCE(p.avatar_url, u.avatar_url) AS avatar_url
    FROM family_members fm
    JOIN users u ON u.id = fm.user_id
    LEFT JOIN profiles p ON p.user_id = u.id AND p.family_id = fm.family_id
    WHERE fm.family_id = $1
    ORDER BY fm.role DESC, u.name ASC
    `,
    [user.family_id]
  );

  const invitesRes = await pool.query(
    `
    SELECT token, expires_at, created_at
    FROM invites
    WHERE family_id = $1
      AND used_at IS NULL
      AND expires_at > now()
    ORDER BY created_at DESC
    `,
    [user.family_id]
  );

  const isAdmin = user.role === "admin";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Admin Family Settings & Branding */}
      {isAdmin && (
        <FamilySettingsCard
          family={{
            id: family.id,
            name: family.name,
            description: family.description,
            avatarUrl: family.avatar_url,
            backdropUrl: family.backdrop_url,
          }}
        />
      )}

      {/* Family Directory */}
      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Family Members Directory
          </CardTitle>
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Relatives with direct, private access to this family sanctuary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FamilyMembersList
            members={membersRes.rows}
            isViewerAdmin={isAdmin}
            currentUserId={user.id}
          />
        </CardContent>
      </Card>

      {/* Admin Invites Management */}
      {isAdmin && (
        <Card className="border-zinc-200/80 dark:border-zinc-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Invite Loved Ones
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Only family admins can generate invitation links. Links expire automatically after 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <GenerateInviteButton />
            </div>

            <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Active Invitations ({invitesRes.rowCount})
              </h3>
              <InviteList invites={invitesRes.rows} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
