// lib/invite.ts
import crypto from "crypto";
import { pool } from "./db";

export function generateInviteToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function getActiveInvites(familyId: string) {
  const res = await pool.query(
    `
    SELECT
      token,
      expires_at,
      created_at
    FROM invites
    WHERE family_id = $1
      AND expires_at > now()
    ORDER BY created_at DESC
    `,
    [familyId]
  );

  return res.rows;
}
