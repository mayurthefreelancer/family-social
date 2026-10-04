ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "is_edited" boolean DEFAULT false NOT NULL;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;

ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "is_edited" boolean DEFAULT false NOT NULL;
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;
