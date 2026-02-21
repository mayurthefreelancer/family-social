import '../lib/server-only';

import { Pool } from "pg";

export const pool = new Pool({
  connectionString: "postgresql://family_user:root@localhost:5432/family_social",
});