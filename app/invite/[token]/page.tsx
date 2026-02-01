import { pool } from "@/app/lib/db";
import { getUserFamilyWithRole } from "@/app/lib/family";
import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // 1️⃣ Validate invite
  const inviteRes = await pool.query(
    `
    SELECT family_id, expires_at
    FROM invites
    WHERE token = $1
    `,
    [token]
  );

  if (inviteRes.rowCount === 0) {
    return <p>Invalid invite link</p>;
  }

  if (inviteRes.rows[0].expires_at < new Date()) {
    return <p>Invite link has expired</p>;
  }

  const inviteFamilyId = inviteRes.rows[0].family_id;

  // 2️⃣ Check session (optional auth)
  const session = await getSession();

  if (!session.userId) {
    // Not logged in → continue to register
    redirect(`/register?invite=${token}`);
  }

  // 3️⃣ Logged-in user: check family membership
  const membership = await getUserFamilyWithRole(session.userId);

  if (!membership) {
    // Logged in but no family → allow join via register-less flow (optional)
    await pool.query(
      `
      INSERT INTO family_members (user_id, family_id, role)
      VALUES ($1, $2, 'member')
      `,
      [session.userId, inviteFamilyId]
    );

    await pool.query(
      `DELETE FROM invites WHERE token = $1`,
      [token]
    );

    redirect("/feed");
  }

  // 4️⃣ Already in SAME family → harmless reuse
  if (membership.family_id === inviteFamilyId) {
    redirect("/feed");
  }

  // 5️⃣ Logged in but DIFFERENT family → block
  return (
    <div>
      <h2>Invite cannot be used</h2>
      <p>
        You are already a member of another family.
        Please log out to join a different family.
      </p>
    </div>
  );
}
