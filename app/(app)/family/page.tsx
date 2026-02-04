import { FamilyMembersList } from "@/app/components/family/FamilyMembersList";
import GenerateInviteButton from "@/app/components/family/GenerateInviteButtons";
import { InviteList } from "@/app/components/invites/InviteList";
import { requireUser } from "@/app/lib/auth";
import { pool } from "@/app/lib/db";
export const dynamic = "force-dynamic";

export default async function FamilyPage() {
    const user = await requireUser();

    const membersRes = await pool.query(
        `
    SELECT u.id, u.name, fm.role
    FROM family_members fm
    JOIN users u ON u.id = fm.user_id
    WHERE fm.family_id = $1
    ORDER BY fm.role DESC
    `,
        [user.family_id]
    );

    const invitesRes = await pool.query(
        `
    SELECT token, expires_at
    FROM invites
    WHERE family_id = $1
      AND used_at IS NULL
      AND expires_at > now()
    ORDER BY created_at DESC
    `,
        [user.family_id]
    );

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">Family</h1>

            {/* Members */}
            <section className="space-y-6">
                <header>
                    <h1 className="text-lg font-medium">
                        Family members
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        People who have access to this family space
                    </p>
                </header>

                <FamilyMembersList members={membersRes.rows} />
            </section>

            {/* Invites */}
            <section className="space-y-6">
                <h2 className="text-lg font-medium">Invites</h2>

                <header>
                    <h1 className="text-lg font-medium">
                        Active Invites
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        People who have been invited but haven't joined yet
                    </p>
                </header>
                {invitesRes.rowCount === 0 && (
                    <p className="text-sm text-gray-500">
                        No active invites
                    </p>
                )}
                <InviteList invites={invitesRes.rows} />
            </section>

            <section className="space-y-2">
                <h2 className="text-lg font-medium">Generate Invite Link</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Generate a new invite link to share with others
                </p>
                {/* Admin-only */}
                {user.role === "admin" && (
                    <div className="mt-4">
                        <GenerateInviteButton />
                    </div>
                )}
            </section>
        </div>
    );
}
