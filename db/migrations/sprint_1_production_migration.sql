-- =========================================================================
-- KINSHIP: SPRINT 1 PRODUCTION DATABASE MIGRATION SCRIPT (IDEMPOTENT)
-- Safe to execute repeatedly in:
-- - Supabase SQL Editor
-- - Neon Console SQL Editor
-- - Vercel Postgres Storage Query Console
-- - pgAdmin / DBeaver / psql
-- =========================================================================

-- 1. Create post_photos table for multi-photo mosaic grid & lightboxes
CREATE TABLE IF NOT EXISTS "post_photos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "post_id" uuid NOT NULL REFERENCES "posts"("id") ON DELETE CASCADE,
  "family_id" uuid NOT NULL REFERENCES "families"("id") ON DELETE CASCADE,
  "url" text NOT NULL,
  "thumbnail_url" text,
  "caption" text,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "width" integer,
  "height" integer,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- 2. Create indices for post_photos for optimized feed reads
CREATE INDEX IF NOT EXISTS "idx_post_photos_post" ON "post_photos" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_post_photos_family" ON "post_photos" ("family_id");

-- 3. Add post edit tracking & audit timestamp columns to posts
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "is_edited" boolean DEFAULT false NOT NULL;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;

-- 4. Add comment edit tracking & audit timestamp columns to comments
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "is_edited" boolean DEFAULT false NOT NULL;
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;
