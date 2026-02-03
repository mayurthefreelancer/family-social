// app/actions/auth.ts
"use server";
import { redirect } from "next/navigation";
import { pool } from "../lib/db";
import { verifyPassword } from "../lib/password";
import { getSession } from "../lib/session";
import { createUser } from "../lib/user";

export async function register(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: "Invalid form submission" };
  }

  const result = await createUser({ name, email, password });

  if (!result.success) {
    return { error: result.error };
  }

  redirect("/create-family");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form submission" };
  }

  const result = await authenticateUser(email, password);

  if (!result.success) {
    return { error: "Invalid email or password" };
  }

  redirect("/feed");
}

export async function authenticateUser(
  email: string,
  password: string
) {
  const normalizedEmail = email.toLowerCase().trim();

  const { rows } = await pool.query(
    `
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = $1
    `,
    [normalizedEmail]
  );

  const user = rows[0];
  if (!user) {
    return { success: false };
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return { success: false };
  }

  // Create session
  const session = await getSession();
  session.userId = user.id;
  await session.save();

  return { success: true };
}

export async function createSession(userId: string) {
  const session = await getSession();
  session.userId = userId;
  await session.save();
}