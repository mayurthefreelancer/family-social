import { redirect } from "next/navigation";
import { pool } from "../lib/db";
import { verifyPassword } from "../lib/password";
import { getSession } from "../lib/session";

export async function login(email: string, password: string) {
  const res = await pool.query(
    `SELECT id, password_hash FROM users WHERE email = $1`,
    [email]
  );

  if (res.rowCount === 0) throw new Error("Invalid credentials");

  const valid = await verifyPassword(password, res.rows[0].password_hash);
  if (!valid) throw new Error("Invalid credentials");

  const session = await getSession();
  session.userId = res.rows[0].id;
  await session.save();
  redirect("/feed");
}
