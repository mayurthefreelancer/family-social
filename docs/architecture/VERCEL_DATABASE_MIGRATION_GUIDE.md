# 🚀 Vercel Production Database Migration Guide (Sprint 1)

> **Context:** The Kinship application is hosted serverless on Vercel. Because Vercel functions execute in ephemeral, stateless containers, there is no persistent SSH terminal to run interactive terminal commands like `npx drizzle-kit push` directly inside Vercel.  
> **Target Release:** Sprint 1 (`v2.5.0`)  
> **Schema Changes to Apply:**  
> 1. `post_photos` table (relational multi-photo storage with cascade delete and sort order).  
> 2. `posts` table additions: `is_edited` (`boolean`) and `updated_at` (`timestamp`).  
> 3. `comments` table additions: `is_edited` (`boolean`) and `updated_at` (`timestamp`).  

---

## 📑 Summary of Available Migration Methods

| Method | Best For | Prerequisites | Speed |
| :--- | :--- | :--- | :--- |
| **[Method 1: Local Terminal with Prod URL](#method-1-local-terminal-pointing-to-production-database_url-recommended)** | Developers with local terminal open | Production `DATABASE_URL` string | ⚡ 5 seconds |
| **[Method 2: Web SQL Editor (Supabase / Neon / Vercel)](#method-2-web-sql-editor-zero-cli-zero-local-setup)** | Zero-CLI, 100% web-based | Access to database web dashboard | ⚡ 10 seconds |
| **[Method 3: Automated Vercel Build Step (CI/CD)](#method-3-automated-vercel-build-step-cicd-migration)** | Permanent hands-free automation | Vercel Project Settings access | 🤖 Automatic on every git push |
| **[Method 4: Vercel CLI Environment Sync](#method-4-vercel-cli-environment-pull)** | Teams using Vercel CLI workflow | Vercel CLI installed locally | ⚡ 15 seconds |

---

## Method 1: Local Terminal Pointing to Production DATABASE_URL (Recommended)

Cloud PostgreSQL databases (Supabase, Neon, Vercel Postgres, AWS RDS, Railway) accept remote SSL connections over the internet. You do **not** need a terminal inside Vercel — you can run the migration command directly from your local terminal by supplying the production connection string.

### Step 1: Copy your production `DATABASE_URL`
1. Open your **Vercel Dashboard** $\to$ select the **Family Social** project.
2. Go to **Settings** $\to$ **Environment Variables**.
3. Locate `DATABASE_URL` (or `POSTGRES_URL`), click the copy icon, or reveal its value.  
   *(It will look like `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require`)*

### Step 2: Run the automated migration script
Open PowerShell or your terminal in the project root directory and execute:

```powershell
node scripts/migrate_production.mjs "PASTE_YOUR_PRODUCTION_DATABASE_URL_HERE"
```

> [!NOTE]
> The script automatically detects remote cloud hosts and applies `ssl: { rejectUnauthorized: false }`. All statements use `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ADD COLUMN IF NOT EXISTS`, making the migration completely safe and idempotent.

Alternatively, you can run Drizzle Kit directly against production:

```powershell
$env:DATABASE_URL="PASTE_YOUR_PRODUCTION_DATABASE_URL_HERE"
npx drizzle-kit push
```

---

## Method 2: Web SQL Editor (Zero CLI, Zero Local Setup)

If you do not want to use a local terminal, you can run the exact SQL migration script directly in your database provider's web console.

### The Sprint 1 SQL Script
The idempotent SQL script is prepared at [`db/migrations/sprint_1_production_migration.sql`](file:///C:/Users/DELL/freelancing/Work/family-social/db/migrations/sprint_1_production_migration.sql):

```sql
-- =========================================================================
-- SPRINT 1 PRODUCTION MIGRATION SCRIPT (IDEMPOTENT)
-- =========================================================================

-- 1. Create post_photos table for multi-photo mosaic grid
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

-- 2. Create indices for fast chronological feed lookups
CREATE INDEX IF NOT EXISTS "idx_post_photos_post" ON "post_photos" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_post_photos_family" ON "post_photos" ("family_id");

-- 3. Add edit tracking columns to posts
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "is_edited" boolean DEFAULT false NOT NULL;
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;

-- 4. Add edit tracking columns to comments
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "is_edited" boolean DEFAULT false NOT NULL;
ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "updated_at" timestamp;
```

### Provider-Specific Walkthroughs:

#### Option A: Supabase Web Dashboard
1. Log in to [supabase.com/dashboard](https://supabase.com/dashboard) and select your project.
2. In the left sidebar, click the **SQL Editor** icon (`>_`).
3. Click **+ New Query**.
4. Paste the SQL block above.
5. Click **Run** (or press `Ctrl + Enter`).
6. You will see: `Success. No rows returned`.

#### Option B: Neon Console
1. Log in to [console.neon.tech](https://console.neon.tech) and select your project.
2. In the left navigation, click **SQL Editor**.
3. Paste the SQL block above into the query editor.
4. Click **Run**.

#### Option C: Vercel Postgres (Neon-backed Storage)
1. Go to your **Vercel Dashboard** $\to$ select your project.
2. Click the **Storage** tab at the top.
3. Select your linked PostgreSQL database.
4. Click the **Query** tab in the database navigation.
5. Paste the SQL block above and click **Execute Query**.

---

## Method 3: Automated Vercel Build Step (CI/CD Migration)

You can configure Vercel so that **every time you push code to GitHub/Vercel**, Vercel automatically runs the migration script before building your Next.js application.

### How to configure in Vercel:
1. Open your **Vercel Project Dashboard**.
2. Go to **Settings** $\to$ **General**.
3. Scroll down to **Build & Development Settings**.
4. Turn **ON** the toggle next to **Build Command**.
5. Set the Build Command to:
   ```bash
   node scripts/migrate_production.mjs && next build
   ```
6. Click **Save**.

### Why this works seamlessly:
- When Vercel triggers a deployment, it executes `node scripts/migrate_production.mjs` first.
- The build container already has access to `process.env.DATABASE_URL`.
- The script checks and applies all tables and columns idempotently in 2 seconds.
- Once migration succeeds with exit code `0`, Vercel proceeds with `next build`.
- If a migration ever fails, the build halts immediately, preventing broken deployments from going live.

---

## Method 4: Vercel CLI Environment Pull

If you have the Vercel CLI installed (`npm i -g vercel`):

1. Link your local project to your Vercel project:
   ```bash
   vercel link
   ```
2. Pull production environment variables to a local temporary file:
   ```bash
   vercel env pull .env.production.local
   ```
3. Run the migration script using `dotenv-cli` pointing to that environment file:
   ```bash
   npx dotenv -e .env.production.local -- node scripts/migrate_production.mjs
   ```
4. Securely delete the local temporary file once complete:
   ```bash
   Remove-Item .env.production.local
   ```

---

## 🔍 How to Verify the Migration Succeeded

Run the following verification query in your database SQL console or terminal:

```sql
-- 1. Check if post_photos table exists
SELECT count(*) FROM information_schema.tables 
WHERE table_name = 'post_photos';
-- Expected result: 1

-- 2. Check if is_edited columns exist on posts and comments
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('posts', 'comments') 
  AND column_name IN ('is_edited', 'updated_at');
-- Expected result: 4 rows (is_edited & updated_at for posts and comments)
```

---

## 🛡️ Safety & Idempotency Guarantee

- All scripts use `IF NOT EXISTS`.
- If `post_photos`, `is_edited`, or `updated_at` already exist, the migration skips them safely without errors.
- Existing family posts, profiles, photos, and members will **never** be dropped or overwritten.
