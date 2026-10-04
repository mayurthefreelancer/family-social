import pg from "pg";
import bcrypt from "bcryptjs";

/**
 * Kinship Database Truncate & Clean Reset Script
 *
 * Usage:
 *   node scripts/truncate_db.mjs [DATABASE_URL]
 *
 * Truncates all tables with CASCADE and re-provisions the root superadmin account.
 */

const connectionString =
  process.argv[2] ||
  process.env.DATABASE_URL ||
  process.env.DATABASE_POSTGRES_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_POSTGRES_PRISMA_URL ||
  (!process.env.VERCEL && !process.env.CI && !process.env.AWS_LAMBDA_FUNCTION_NAME
    ? "postgresql://family_user:root@localhost:5432/family_social"
    : null);

if (!connectionString) {
  console.error("❌ Reset aborted: No database connection string found.");
  console.error("👉 Please configure DATABASE_URL or DATABASE_POSTGRES_URL in environment variables.");
  process.exit(1);
}

const isRemote =
  !connectionString.includes("localhost") &&
  !connectionString.includes("127.0.0.1");

const pool = new pg.Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

async function truncateDatabase() {
  console.log("🔄 Connecting to target database...");
  const client = await pool.connect();

  try {
    console.log("🧹 Truncating all application tables with CASCADE...");

    // Query all tables in the public schema excluding drizzle migrations
    const tablesRes = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE '__drizzle_%'
    `);

    const tableNames = tablesRes.rows.map((r) => `"${r.tablename}"`);

    if (tableNames.length > 0) {
      await client.query(`TRUNCATE TABLE ${tableNames.join(", ")} CASCADE;`);
      console.log(`   ✅ Truncated ${tableNames.length} tables:`);
      console.log(`      ${tablesRes.rows.map((r) => r.tablename).join(", ")}`);
    } else {
      console.log("   ℹ️ No tables found to truncate.");
    }

    // Clean up local uploads directory files if needed
    console.log("\n👑 Re-provisioning root superadmin: admin@kinship.local ...");
    const adminEmail = "admin@kinship.local";
    const plainPassword = "AdminPassword123!";
    const hash = await bcrypt.hash(plainPassword, 10);

    const createRes = await client.query(
      `INSERT INTO users (id, name, email, password_hash, is_superadmin, created_at)
       VALUES (gen_random_uuid(), 'Kinship Superadmin', $1, $2, true, NOW())
       RETURNING id`,
      [adminEmail, hash]
    );
    console.log(
      `   ✅ Created clean root superadmin (id: ${createRes.rows[0].id})`
    );
    console.log(`      Email:    admin@kinship.local`);
    console.log(`      Password: AdminPassword123!`);

    console.log("\n✨ Database reset complete! Ready for fresh testing.");
  } catch (err) {
    console.error("\n❌ Truncate failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

truncateDatabase();
