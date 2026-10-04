-- Migration: 0013_family_branding_and_superadmin.sql
-- Adds description, avatar_url, backdrop_url, updated_at to families
-- Adds is_superadmin to users

ALTER TABLE "families" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "families" ADD COLUMN IF NOT EXISTS "avatar_url" text;
ALTER TABLE "families" ADD COLUMN IF NOT EXISTS "backdrop_url" text;
ALTER TABLE "families" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_superadmin" boolean DEFAULT false NOT NULL;
