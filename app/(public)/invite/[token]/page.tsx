import AcceptInviteForm from "@/app/components/invites/AcceptInviteForm";
import {
  AlreadyJoined,
  InvalidInvite,
  WrongFamily,
} from "@/app/components/invites/InvalidInvite";
import { pool } from "@/app/lib/db";
import { getOptionalUser } from "@/app/lib/user";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

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
  return (
    <AcceptInviteForm
      token={token}
      familyName={invite.family_name || "your family"}
    />
  );
}
