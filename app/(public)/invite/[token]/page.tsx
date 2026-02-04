import AcceptInviteForm from "@/app/components/invites/AcceptInviteForm";
import { AlreadyJoined, InvalidInvite, WrongFamily } from "@/app/components/invites/InvalidInvite";
import { pool } from "@/app/lib/db";
import { getOptionalUser } from "@/app/lib/user";

// app/invite/[token]/page.tsx
export default async function InvitePage({ params }: { params: { token: string } }) {
  const { token } = await params;

  const inviteRes = await pool.query(
    `
    SELECT *
    FROM invites
    WHERE token = $1
      AND used_at IS NULL
      AND expires_at > now()
    `,
    [token]
  );

  if (!inviteRes.rowCount) {
    return <InvalidInvite />;
  }

  const invite = inviteRes.rows[0];

  const user = await getOptionalUser();

  // Already logged in
  if (user) {
    // Same family → idempotent
    if (user.family_id === invite.family_id) {
      return <AlreadyJoined />;
    }

    // Different family → block
    return <WrongFamily />;
  }

  // Not logged in → show register form
  return <AcceptInviteForm token={token} />;
}
