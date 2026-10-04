import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AcceptInviteForm from "@/app/components/invites/AcceptInviteForm";
import { AuthenticatedJoinCard } from "@/app/components/invites/AuthenticatedJoinCard";
import {
  AlreadyJoined,
  InvalidInvite,
} from "@/app/components/invites/InvalidInvite";
import { pool } from "@/app/lib/db";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // 1. Query invitation details
  const inviteRes = await pool.query(
    `
    SELECT i.*, f.name AS family_name
    FROM invites i
    JOIN families f ON f.id = i.family_id
    WHERE i.token = $1
      AND i.used_at IS NULL
      AND i.expires_at > now()
    `,
    [token]
  );

  if (!inviteRes.rowCount) {
    return <InvalidInvite />;
  }

  const invite = inviteRes.rows[0];

  // 2. Check real session authentication
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    // Check if user is already a member of this family
    const memberCheck = await pool.query(
      `SELECT role FROM family_members WHERE user_id = $1 AND family_id = $2`,
      [session.user.id, invite.family_id]
    );

    if (memberCheck.rowCount && memberCheck.rowCount > 0) {
      return <AlreadyJoined />;
    }

    // Authenticated user joining this family: render 1-click confirmation card
    return (
      <AuthenticatedJoinCard
        token={token}
        familyName={invite.family_name || "Your Family"}
        userName={session.user.name || undefined}
        userEmail={session.user.email || undefined}
      />
    );
  }

  // 3. Unauthenticated relative: render registration/join form
  return (
    <AcceptInviteForm
      token={token}
      familyName={invite.family_name || "your family"}
    />
  );
}
