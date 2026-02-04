ALTER TABLE "family_members" DROP CONSTRAINT "family_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "family_members" DROP CONSTRAINT "family_members_family_id_families_id_fk";
--> statement-breakpoint
ALTER TABLE "family_members" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "family_members" ALTER COLUMN "family_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "family_members" ALTER COLUMN "joined_at" SET NOT NULL;