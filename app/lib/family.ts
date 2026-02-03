// lib/family.ts
"use server";
import { pool } from "./db";

export async function getUserFamily(userId: string) {
  console.log("😊Getting family for userId:", userId);
  const res = await pool.query(
    `SELECT family_id FROM family_members WHERE user_id = $1`,
    [userId]
  );

  console.log("👋🏼 Family query result:", res.rows);
  return res.rows[0]?.family_id;
}

export async function getUserFamilyWithRole(userId: string) {
  const res = await pool.query(
    `
    SELECT family_id, role
    FROM family_members
    WHERE user_id = $1
    `,
    [userId]
  );

  return res.rows[0] ?? null;
}

export async function getFamilyMembers(familyId: string) {
  const res = await pool.query(
    `
    SELECT u.id, u.name, fm.role
    FROM users u
    JOIN family_members fm ON fm.user_id = u.id
    WHERE fm.family_id = $1
    `,
    [familyId]
  );

  console.log("👋🏼 res.rows for familyId", familyId, "is", res.rows);
  return res.rows;
}