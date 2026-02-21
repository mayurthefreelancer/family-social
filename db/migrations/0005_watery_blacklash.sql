ALTER TABLE "invites" DROP CONSTRAINT "invites_family_id_families_id_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'invites'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "invites" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "invites" ALTER COLUMN "family_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ALTER COLUMN "expires_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "used_at" timestamp;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "created_by" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_token_unique" UNIQUE("token");