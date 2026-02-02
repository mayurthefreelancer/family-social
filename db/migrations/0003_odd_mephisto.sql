-- 1. Add column as nullable first
ALTER TABLE "comments"
ADD COLUMN "family_id" uuid;

-- 2. Backfill family_id from posts
UPDATE "comments" c
SET "family_id" = p."family_id"
FROM "posts" p
WHERE c."post_id" = p."id";

-- 3. Enforce NOT NULL
ALTER TABLE "comments"
ALTER COLUMN "family_id" SET NOT NULL;

-- 4. Add index for performance
CREATE INDEX "idx_comments_family_id"
ON "comments" ("family_id");
