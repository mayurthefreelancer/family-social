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
CREATE INDEX IF NOT EXISTS "idx_post_photos_post" ON "post_photos" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_post_photos_family" ON "post_photos" ("family_id");
