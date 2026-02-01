// app/actions/test-db.ts
"use server";

import { pool } from "../lib/db";

export async function testDb() {
  const res = await pool.query("SELECT 1");
  return res.rows;
}
    