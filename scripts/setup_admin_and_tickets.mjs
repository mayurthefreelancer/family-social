import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE_POSTGRES_URL ||
  process.env.POSTGRES_URL ||
  'postgresql://family_user:root@localhost:5432/family_social';

const isRemote = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');
const pool = new pg.Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

async function main() {
  console.log('Connecting to database...');
  const client = await pool.connect();
  try {
    console.log('1. Ensuring admin_tickets table exists...');
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
    console.log('admin_tickets table checked/created.');

    console.log('2. Ensuring default superadmin exists: admin@kinship.local ...');
    const adminEmail = 'admin@kinship.local';
    const plainPassword = 'AdminPassword123!';
    const hash = await bcrypt.hash(plainPassword, 10);

    const existingUser = await client.query('SELECT id, email, is_superadmin FROM users WHERE email = $1', [adminEmail]);

    let superadminId;
    if (existingUser.rows.length === 0) {
      const insertRes = await client.query(
        `INSERT INTO users (id, name, email, password_hash, is_superadmin, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, true, NOW())
         RETURNING id`,
        ['Kinship Superadmin', adminEmail, hash]
      );
      superadminId = insertRes.rows[0].id;
      console.log('Created default superadmin with id:', superadminId);
    } else {
      superadminId = existingUser.rows[0].id;
      await client.query(
        `UPDATE users SET is_superadmin = true, password_hash = $1 WHERE id = $2`,
        [hash, superadminId]
      );
      console.log('Updated existing user to superadmin with id:', superadminId);
    }

    console.log('3. Guaranteeing 0 family associations for superadmin...');
    await client.query('DELETE FROM family_members WHERE user_id = $1', [superadminId]);
    await client.query('DELETE FROM profiles WHERE user_id = $1', [superadminId]);
    console.log('Cleared all family links for default superadmin.');

    console.log('4. Checking if test tickets exist...');
    const ticketCount = await client.query('SELECT COUNT(*)::int as count FROM admin_tickets');
    if (ticketCount.rows[0].count === 0) {
      console.log('Seeding sample operational tickets...');
      // Get a family and user if one exists for references
      const sampleFamily = await client.query('SELECT id, name FROM families LIMIT 1');
      const sampleUser = await client.query('SELECT id, email FROM users WHERE id != $1 LIMIT 1', [superadminId]);

      const famId = sampleFamily.rows[0]?.id || null;
      const targetUserId = sampleUser.rows[0]?.id || null;
      const targetUserEmail = sampleUser.rows[0]?.email || 'sarah@kinship.local';

      await client.query(`
        INSERT INTO admin_tickets (ticket_code, family_id, requester_email, category, priority, status, subject, description, target_entity_type, target_entity_id)
        VALUES
        (
          'TIK-1001',
          $1,
          'organizer@kinship.local',
          'member_removal',
          'high',
          'open',
          'Urgent: Remove Inactive Relative Account',
          'Member has changed phone number and requested their old account be removed from our family hearth immediately.',
          'user',
          $2
        ),
        (
          'TIK-1002',
          $1,
          'elena@kinship.local',
          'access_control',
          'critical',
          'open',
          'Audit Discrepancy & Permission Escalation',
          'Member mistakenly assigned admin role; needs demotion back to standard member status.',
          'access_control',
          $2
        ),
        (
          'TIK-1003',
          $1,
          'support@kinship.local',
          'general_support',
          'medium',
          'in_progress',
          'Heritage Archive Recovery Assistance',
          'Requesting verification of family archive metadata after migration from legacy vault.',
          'family',
          $1
        );
      `, [famId, targetUserId]);
      console.log('Seeded sample tickets: TIK-1001, TIK-1002, TIK-1003.');
    } else {
      console.log(`Found ${ticketCount.rows[0].count} existing tickets.`);
    }

    console.log('Setup finished successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Error running setup:', err);
  process.exit(1);
});
