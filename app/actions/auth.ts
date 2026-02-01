// app/actions/auth.ts
"use server";
import { pool } from "../lib/db";
import { hashPassword } from "../lib/password";
import { getSession } from "../lib/session";
import { redirect } from "next/navigation";

export async function register(
  name: string,
  email: string,
  password: string,
  inviteToken?: string
) {
  const passwordHash = await hashPassword(password);

  const userRes = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [name, email, passwordHash]
  );

  const userId = userRes.rows[0].id;

  if (inviteToken) {
    const inviteRes = await pool.query(
      `SELECT family_id FROM invites
       WHERE token = $1 AND expires_at > now()`,
      [inviteToken]
    );

    if (inviteRes.rowCount === 0) {
      throw new Error("Invalid invite");
    }

    const familyId = inviteRes.rows[0].family_id;

    await pool.query(
      `INSERT INTO family_members (user_id, family_id, role)
       VALUES ($1, $2, 'member')`,
      [userId, familyId]
    );

    // Invalidate token
    await pool.query(
      `DELETE FROM invites WHERE token = $1`,
      [inviteToken]
    );
  }

  const session = await getSession();
  session.userId = userId;
  await session.save();

  redirect("/feed");
}
