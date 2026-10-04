import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: (process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL || process.env.POSTGRES_URL)!,
  },
  dialect: "postgresql",
} satisfies Config;
