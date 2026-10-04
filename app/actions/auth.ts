// app/actions/auth.ts
"use server";
import { redirect } from "next/navigation";
import { createUser } from "../lib/user";

export async function register(
  formData: FormData
): Promise<{ success: boolean; error?: string; email?: string }> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    return { success: false, error: "Invalid form submission. All fields are required." };
  }

  const result = await createUser({ name, email, password });
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, email: email.toLowerCase().trim() };
}

export async function logout() {
  redirect("/login");
}