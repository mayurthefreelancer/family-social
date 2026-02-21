// app/actions/auth.ts — CLEANED UP
"use server";
import { redirect } from "next/navigation";
import { createUser } from "../lib/user";

export async function register(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form submission" };
  }

  const result = await createUser({ name, email, password });
  if (!result.success) return { error: result.error };

  redirect("/login"); // Redirect to login, not create-family (user must sign in first)
}

export async function logout() {
  redirect("/api/auth/signout");
}