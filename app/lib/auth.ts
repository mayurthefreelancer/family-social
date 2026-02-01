// lib/auth.ts
import { getSession } from "./session";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await getSession();
  if (!session.userId) redirect("/login");
  return session.userId;
}
