// lib/invite.ts
import { pool } from "./db";

export function generateInviteToken() {
  return randomHex(32);
}

function randomHex(bytes = 32) {
  const array = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(array);

  return Array.from(array, (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
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
