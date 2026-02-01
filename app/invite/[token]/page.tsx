// app/invite/[token]/page.tsx
import { pool } from "@/app/lib/db";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;
  const res = await pool.query(
    `SELECT family_id, expires_at
     FROM invites
     WHERE token = $1`,
    [token]
  );

  if (res.rowCount === 0) {
    return <p>Invalid invite link</p>;
  }

  if (res.rows[0].expires_at < new Date()) {
    return <p>Invite expired</p>;
  }

  // Store token temporarily in URL → pass to register
  redirect(`/register?invite=${token}`);
}
