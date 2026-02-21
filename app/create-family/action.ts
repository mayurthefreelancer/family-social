"use server"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { pool } from "../lib/db"

export async function createFamily(
  familyName: string
): Promise<{ success: boolean; error?: string }> {
  console.log("[createFamily] called with familyName:", familyName);

  if (!familyName?.trim()) {
    return { success: false, error: "Family name is required" }
  }

  const session = await getServerSession(authOptions)
  console.log("[createFamily] session.user:", session?.user);
  console.log("[createFamily] session.user.id:", session?.user?.id);

  if (!session?.user?.id) {
    console.log("[createFamily] No session user id — redirecting to login");
    redirect("/login")
  }

  const userId = session.user.id
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const familyResult = await client.query(
      `INSERT INTO families (name, created_by) VALUES ($1, $2) RETURNING id`,
      [familyName.trim(), userId]
    )
    const familyId = familyResult.rows[0].id
    console.log("[createFamily] inserted family id:", familyId);

    await client.query(
      `INSERT INTO family_members (user_id, family_id, role) VALUES ($1, $2, 'admin')`,
      [userId, familyId]
    )
    console.log("[createFamily] inserted family_members");

    await client.query(
      `INSERT INTO profiles (user_id, family_id, display_name, email)
       SELECT id, $1, name, email FROM users WHERE id = $2
       ON CONFLICT (user_id) DO UPDATE SET family_id = EXCLUDED.family_id`,
      [familyId, userId]
    )
    console.log("[createFamily] inserted/updated profiles");

    await client.query("COMMIT")
    console.log("[createFamily] COMMITTED. Returning success.");
    return { success: true }
  } catch (e: any) {
    await client.query("ROLLBACK")
    console.error("[createFamily] DB ERROR:", e?.message, e?.code);
    return { success: false, error: e?.message ?? "Failed to create family" }
  } finally {
    client.release()
  }
}