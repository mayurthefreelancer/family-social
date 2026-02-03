// app/actions/family.ts
"use server";

import { requireUserId } from "../lib/auth";
import { pool } from "../lib/db";
import { redirect } from "next/navigation";

export async function createFamily(name: string) {
  const userId = await requireUserId();
  console.log("Creating family for user:", userId);

  const familyRes = await pool.query(
    `INSERT INTO families (name, created_by)
     VALUES ($1, $2)
     RETURNING id`,
    [name, userId]
  );

  await pool.query(
    `INSERT INTO family_members (user_id, family_id, role)
     VALUES ($1, $2, 'admin')`,
    [userId, familyRes.rows[0].id]
  );

  redirect(`/feed`);
}
