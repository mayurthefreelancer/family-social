-- =========================================================================
-- KINSHIP: ALL-IN-ONE PRODUCTION DATABASE SCHEMA MIGRATION
-- Run this script in your Cloud PostgreSQL SQL Editor (Supabase / Neon / Vercel Postgres / Railway)
-- =========================================================================

-- 1. Ensure required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Users table (add avatar_url and is_superadmin)
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

-- 3. Families table (add description, avatar_url, backdrop_url, updated_at)
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

-- 4. Family members table
CREATE TABLE IF NOT EXISTS family_members (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, family_id)
);

-- 5. Profiles table (add custom_tag)
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

-- 6. Invites table
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 7. Posts and Comments tables
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 8. Post Likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT post_likes_post_user_uniq UNIQUE (post_id, user_id)
);

-- 9. Password Reset Tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 10. Audit Logs table
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

-- 11. Admin Tickets table
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

-- 12. Provision / verify default superadmin: admin@kinship.local (password: AdminPassword123!)
INSERT INTO users (id, name, email, password_hash, is_superadmin, created_at)
VALUES (
  gen_random_uuid(),
  'Kinship Superadmin',
  'admin@kinship.local',
  -- bcrypt hash for 'AdminPassword123!'
  '$2b$10$vO8q83H0pT5E0qE0w9QZ1ecW2k/4sK04gE.i9EepU41H2FwM9aR9e',
  true,
  NOW()
)
ON CONFLICT (email) DO UPDATE
SET is_superadmin = true;

-- Ensure zero family memberships for default superadmin
DELETE FROM family_members WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@kinship.local');
DELETE FROM profiles WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@kinship.local');
