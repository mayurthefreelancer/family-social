import 'server-only';
import { pool } from "./db";
import { hashPassword } from "./password";
import { getSession } from "./session";

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  // Normalize email
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user exists
  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [normalizedEmail]
  );

  if (existing.rowCount!= null && existing.rowCount > 0) {
    return {
      success: false,
      error: "An account with this email already exists",
    };
  }

  const passwordHash = await hashPassword(password);
  const userId = globalThis.crypto.randomUUID();

  await pool.query(
    `
    INSERT INTO users (id, name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    `,
    [userId, name.trim(), normalizedEmail, passwordHash]
  );

  // Create session
  const session = await getSession();
  session.userId = userId;
  await session.save();

  return { success: true };
}

export async function getOptionalUser() {
  const session = await getSession();
  if (!session.userId) return null;

  const res = await pool.query(
    `
    SELECT id, name, email
    FROM users
    WHERE id = $1
    `,
    [session.userId]
  );

  return res.rows[0] ?? null;
}