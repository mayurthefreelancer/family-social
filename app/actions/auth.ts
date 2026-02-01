// app/actions/auth.ts
"use server";
import { redirect } from "next/navigation";
import { AuthFormState } from "../lib/auth-type";
import { pool } from "../lib/db";
import { hashPassword, verifyPassword } from "../lib/password";
import { getSession } from "../lib/session";

export async function register(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const inviteToken = formData.get("invite")?.toString();

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    const userRes = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [name, email, await hashPassword(password)]
    );

    const userId = userRes.rows[0].id;

    if (inviteToken) {
      const inviteRes = await pool.query(
        `SELECT family_id FROM invites
         WHERE token = $1 AND expires_at > now()`,
        [inviteToken]
      );

      if (inviteRes.rowCount === 0) {
        return { error: "Invalid or expired invite link" };
      }

      await pool.query(
        `INSERT INTO family_members (user_id, family_id, role)
         VALUES ($1, $2, 'member')`,
        [userId, inviteRes.rows[0].family_id]
      );

      await pool.query(
        `DELETE FROM invites WHERE token = $1`,
        [inviteToken]
      );
    }

    const session = await getSession();
    session.userId = userId;
    await session.save();

    redirect("/feed");
  } catch (err: any) {
    if (err.code === "23505") {
      return { error: "Email already registered" };
    }

    return { error: "Something went wrong. Try again." };
  }
}


export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const res = await pool.query(
    `SELECT id, password_hash FROM users WHERE email = $1`,
    [email]
  );

  if (res.rowCount === 0) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(password, res.rows[0].password_hash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  const session = await getSession();
  session.userId = res.rows[0].id;
  await session.save();

  redirect("/feed");
}