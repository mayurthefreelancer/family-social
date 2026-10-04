import pg from 'pg';
import bcrypt from 'bcryptjs';

/**
 * Kinship Production Database Migration & Provisioning Script
 * 
 * Usage:
 *   node scripts/migrate_production.mjs [DATABASE_URL]
 * 
 * If DATABASE_URL is not passed as an argument, it reads process.env.DATABASE_URL.
 */

const connectionString =
  process.argv[2] ||
  process.env.DATABASE_URL ||
  process.env.DATABASE_POSTGRES_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_POSTGRES_PRISMA_URL ||
  (!process.env.VERCEL && !process.env.CI && !process.env.AWS_LAMBDA_FUNCTION_NAME
    ? 'postgresql://family_user:root@localhost:5432/family_social'
    : null);

if (!connectionString) {
  console.error('❌ Migration aborted: No database connection string found.');
  console.error('👉 Please configure DATABASE_URL or DATABASE_POSTGRES_URL in your Vercel Project Settings > Environment Variables.');
  process.exit(1);
}

// Enable SSL if connecting to remote databases (e.g. Supabase, Neon, AWS RDS)
const isRemote = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');
const pool = new pg.Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

async function runMigration() {
  console.log('🔄 Connecting to target database...');
  const client = await pool.connect();

  try {
    console.log('🚀 Starting idempotent production schema migration...');

    // 1. Users table updates
    console.log('1️⃣ Migrating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        avatar_url TEXT,
        is_superadmin BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_superadmin BOOLEAN DEFAULT false NOT NULL;
    `);

    // 2. Families table updates
    console.log('2️⃣ Migrating families table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS families (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        avatar_url TEXT,
        backdrop_url TEXT,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      ALTER TABLE families ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE families ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE families ADD COLUMN IF NOT EXISTS backdrop_url TEXT;
      ALTER TABLE families ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    `);

    // 3. Family members table
    console.log('3️⃣ Migrating family_members table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS family_members (
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
        PRIMARY KEY (user_id, family_id)
      );
    `);

    // 4. Profiles table updates
    console.log('4️⃣ Migrating profiles table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        display_name TEXT NOT NULL,
        email TEXT NOT NULL,
        username TEXT,
        bio TEXT,
        avatar_url TEXT,
        custom_tag VARCHAR(64) DEFAULT 'KIN',
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_tag VARCHAR(64) DEFAULT 'KIN';
    `);

    // 5. Invites table
    console.log('5️⃣ Migrating invites table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS invites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        used_at TIMESTAMP,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // 6. Posts and Comments tables
    console.log('6️⃣ Migrating posts and comments tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        family_id UUID REFERENCES families(id) ON DELETE CASCADE,
        userId UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT,
        image_url TEXT,
        is_edited BOOLEAN DEFAULT false NOT NULL,
        updated_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false NOT NULL;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_edited BOOLEAN DEFAULT false NOT NULL,
        updated_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false NOT NULL;
      ALTER TABLE comments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
    `);

    // 7. Multi-Photo Mosaic table (Sprint 1)
    console.log('7️⃣ Migrating post_photos table (Sprint 1)...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS post_photos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        thumbnail_url TEXT,
        caption TEXT,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        width INTEGER,
        height INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_post_photos_post ON post_photos(post_id);
      CREATE INDEX IF NOT EXISTS idx_post_photos_family ON post_photos(family_id);
    `);

    // 8. Post Likes table
    console.log('8️⃣ Migrating post_likes table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        CONSTRAINT post_likes_post_user_uniq UNIQUE (post_id, user_id)
      );
    `);

    // 9. Password reset tokens table
    console.log('9️⃣ Migrating password_reset_tokens table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        family_id UUID REFERENCES families(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        used_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // 10. Audit logs table
    console.log('🔟 Migrating audit_logs table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        family_id UUID REFERENCES families(id) ON DELETE CASCADE,
        actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // 11. Admin tickets table
    console.log('1️⃣1️⃣ Migrating admin_tickets table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_tickets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_code VARCHAR(32) NOT NULL UNIQUE,
        family_id UUID REFERENCES families(id) ON DELETE SET NULL,
        requester_email VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        priority VARCHAR(32) NOT NULL DEFAULT 'medium',
        status VARCHAR(32) NOT NULL DEFAULT 'open',
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        target_entity_type VARCHAR(64),
        target_entity_id VARCHAR(255),
        resolution_note TEXT,
        resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
        resolved_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // 12. Seed / verify default platform superadmin
    console.log('1️⃣2️⃣ Provisioning root superadmin: admin@kinship.local ...');
    const adminEmail = 'admin@kinship.local';
    const plainPassword = 'AdminPassword123!';
    const hash = await bcrypt.hash(plainPassword, 10);

    const userRes = await client.query('SELECT id, is_superadmin FROM users WHERE email = $1', [adminEmail]);

    let superadminId;
    if (userRes.rows.length === 0) {
      const createRes = await client.query(
        `INSERT INTO users (id, name, email, password_hash, is_superadmin, created_at)
         VALUES (gen_random_uuid(), 'Kinship Superadmin', $1, $2, true, NOW())
         RETURNING id`,
        [adminEmail, hash]
      );
      superadminId = createRes.rows[0].id;
      console.log('   ✅ Created default superadmin account (id:', superadminId, ')');
    } else {
      superadminId = userRes.rows[0].id;
      await client.query(
        `UPDATE users SET is_superadmin = true, password_hash = $1 WHERE id = $2`,
        [hash, superadminId]
      );
      console.log('   ✅ Updated existing account to root superadmin (id:', superadminId, ')');
    }

    // Ensure 0 family links for superadmin
    await client.query('DELETE FROM family_members WHERE user_id = $1', [superadminId]);
    await client.query('DELETE FROM profiles WHERE user_id = $1', [superadminId]);
    console.log('   ✅ Guaranteed zero family links for tenant-isolated superadmin.');

    console.log('\n✨ Database migration & superadmin provisioning completed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
