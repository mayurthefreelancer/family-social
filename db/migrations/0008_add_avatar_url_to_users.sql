ALTER TABLE "users" ADD COLUMN "avatar_url" text;
--> statement-breakpoint
UPDATE "users" u
SET "avatar_url" = p."avatar_url"
FROM "profiles" p
WHERE p."user_id" = u."id"
  AND p."avatar_url" IS NOT NULL;
