# 🏡 Kinship: The Digital Living Room – System Documentation & Architecture Guide

> **Version:** 2.4.0  
> **Status:** Production Ready  
> **Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS v4, PostgreSQL (`pg`), NextAuth.js (JWT Strategy)  
> **Architecture Pattern:** Multi-Tenant Intimate Sanctuary isolated by `family_id` with Standalone Zero-Family Superadmin Governance  

---

## 📑 Table of Contents

1. [Product Overview & Architectural Philosophy](#1-product-overview--architectural-philosophy)
2. [Core Feature Breakdown](#2-core-feature-breakdown)
   - [2.1 Streamlined Founding Admin Onboarding](#21-streamlined-founding-admin-onboarding)
   - [2.2 Robust Kinship Invitation Engine](#22-robust-kinship-invitation-engine)
   - [2.3 Family Sanctuary Branding & Admin Management](#23-family-sanctuary-branding--admin-management)
   - [2.4 Sovereign Platform Superadmin & Operations Console (New)](#24-sovereign-platform-superadmin--operations-console-new)
   - [2.5 Ticket-Based Governance & Administrative Interventions (New)](#25-ticket-based-governance--administrative-interventions-new)
   - [2.6 Asymmetrical Living Room Feed & Chronological Stream](#26-asymmetrical-living-room-feed--chronological-stream)
   - [2.7 Memory Preservation, Reactions & Comments](#27-memory-preservation-reactions--comments)
   - [2.8 High-Contrast Monochrome Dark Theme System](#28-high-contrast-monochrome-dark-theme-system)
3. [Relational Data Model](#3-relational-data-model)
4. [Security, Session & Privacy Architecture](#4-security-session--privacy-architecture)
5. [Comprehensive Changelog](#5-comprehensive-changelog)

---

## 1. Product Overview & Architectural Philosophy

Consumer social platforms are optimized for engagement algorithms, viral outrage, and public data extraction. **Kinship** re-imagines family social connectivity as a private, sovereign sanctuary called **The Digital Living Room**.

### Guiding Principles:
1. **Strict Data Sovereignty:** Absolute database-level multi-tenant isolation. All posts, comments, profiles, and media are strictly scoped to a `family_id`. There are zero public discovery feeds, zero algorithms, and zero third-party tracking pixels.
2. **Generational Inclusivity:** Optimized for family members spanning 8 to 80+ years old with high WCAG AAA contrast, minimum 44px touch targets, clear typography, and zero-friction onboarding.
3. **Tactile Monochrome Elegance:** Grounded in a bespoke Shadcn Zinc palette that eliminates color clutter, allowing personal memories and family photos to take center stage.

---

## 2. Core Feature Breakdown

### 2.1 Streamlined Founding Admin Onboarding
- **Zero-Friction Signup:** Eliminates the legacy 4-step sequence (Register $\to$ Redirect $\to$ Login $\to$ Create Family $\to$ Feed).
- **Automatic Client-Side Session Minting:** Upon submitting name, email, and password at [`/register`](file:///C:/Users/DELL/freelancing/family-social/app/(public)/register/page.tsx), NextAuth automatically authenticates the user via `signIn("credentials")` and routes directly to [`/create-family`](file:///C:/Users/DELL/freelancing/family-social/app/create-family/page.tsx).
- **Atomic Family Genesis:** Submitting the family name executes an atomic database transaction that creates the `families` record, assigns `'admin'` role to the founder in `family_members`, establishes the initial `profiles` row, and lands the founder directly in their private living room.

### 2.2 Robust Kinship Invitation Engine
Resolves all onboarding drop-offs and session race conditions:
- **Role-Aware Invitations:** Organizers can generate links with pre-assigned roles:
  - `Family Member`: Standard access for sharing memories, commenting, and viewing milestones.
  - `Co-Organizer / Admin`: Elevated administrative privileges for generating invites, moderating content, and managing the directory.
- **Smart 1-Click Acceptance for Authenticated Users:**
  - When an already logged-in relative clicks `/invite/[token]`, the system immediately detects their active session via `getServerSession(authOptions)`.
  - If they are already a member, it presents an *"Already in the Family"* banner with a direct link to `/feed`.
  - If they are joining a new family circle, it displays [`AuthenticatedJoinCard`](file:///C:/Users/DELL/freelancing/family-social/app/components/invites/AuthenticatedJoinCard.tsx), enabling a single-click *"Accept & Enter"* experience without re-registering.
- **Graceful Handling of Existing Unauthenticated Users:**
  - If a relative already has an account, entering their existing credentials on the invite form verifies their password hash against `users.password_hash` and safely binds them to `family_members` and `profiles` without triggering duplicate email constraint violations.
- **Automatic Authentication Post-Acceptance:**
  - New relatives are automatically authenticated in NextAuth immediately upon form submission, preventing unauthenticated redirect loops.
- **Cryptographic Security & Audit Logging:**
  - Generates 32-byte cryptographic hex tokens with 7-day expiration.
  - All token events (`invite_created`, `invite_revoked`, `member_joined`) are appended to `audit_logs`.

### 2.3 Family Sanctuary Branding & Admin Management
Located at [`/family#settings`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/family/page.tsx) and managed by family administrators:
- **Family Hearth Identity:** Live editable Family Name and Custom Bio / Motto displayed under the canopy banner.
- **Family Avatar Crest:** Dedicated image upload pipeline via [`saveFamilyAvatar()`](file:///C:/Users/DELL/freelancing/family-social/app/lib/family-storage.ts) writing to `public/uploads/family/[familyId]/avatar.jpg`. Replaces the monogram initial with a custom family crest or emblem.
- **Panoramic Canopy Banner Backdrop:** Dedicated image upload pipeline via [`saveFamilyBackdrop()`](file:///C:/Users/DELL/freelancing/family-social/app/lib/family-storage.ts) displaying an atmospheric panoramic cover image behind the living room header canopy with intelligent high-contrast gradient overlays.
- **Quick Canopy Access:** An "Edit Family" badge appears on the living room canopy for verified family organizers for single-click access to settings.

### 2.4 Sovereign Platform Superadmin & Operations Console (New)
Accessible at [`/admin`](file:///C:/Users/DELL/freelancing/family-social/app/admin/page.tsx) for platform superadmins:
- **Default Sovereign Superadmin:** Pre-provisioned default superuser account:
  - **Email:** `admin@kinship.local`
  - **Password:** `AdminPassword123!`
  - **Zero-Family Sovereignty:** The superadmin has zero entries in `family_members` and zero `profiles`. They are not tied to any family and have **zero shared layout** with standard family members or family organizers.
- **Dedicated Standalone Layout:** Completely independent route tree outside of `(app)`:
  - Located in [`app/admin/layout.tsx`](file:///C:/Users/DELL/freelancing/family-social/app/admin/layout.tsx).
  - Features an enterprise NOC (Network Operations Center) aesthetic: deep obsidian palette, telemetry ping indicators, kernel status bars, and real-time SLA trackers.
  - Zero presence of personal family canopies, family member circles, or personal feeds.
- **Holistic KPI Gauges & Platform Telemetry:** Real-time metrics for Total Sovereign Families, Total Registered Users, Active Family Memberships, Shared Memories, Comments Count, Active Invites, and Pending Governance Tickets.
- **Sovereign Families Directory:** Comprehensive listing of all family sanctuaries with their custom avatar crests, mottos, founding creators, membership counts, memory counts, and creation dates.
- **Platform Users Governance:** Search and filter all registered platform users, view their contact information, inspect multi-family memberships and assigned roles, observe content activity (posts and comments counts), and grant or revoke Superadmin privileges on the fly with safety checks preventing removal of the final superadmin.
- **Cross-Family Invites Ledger:** Real-time audit of all invitation tokens, expiration countdowns, redemption states, and 1-click link copying.
- **Security & Platform Audit Trail:** Immutable streaming log of security-sensitive events across the platform with actor identification and timestamps.

### 2.5 Ticket-Based Governance & Administrative Interventions (New)
Operational governance and administrative actions are performed strictly through **Raised Tickets** to enforce accountability and immutable audit trails:
- **Relational Ticket Ledger (`admin_tickets`):**
  - Schema captures `ticket_code` (`#TIK-XXXX`), `family_id`, `requester_email`, `category`, `priority`, `status`, `subject`, `description`, `target_entity_type`, `target_entity_id`, `resolution_note`, `resolved_by`, `resolved_at`, and timestamps.
  - Multi-tier priorities: `CRITICAL SLA`, `HIGH`, `MEDIUM`, `LOW`.
  - Categories: `member_removal`, `access_control`, `organizer_handover`, `family_deletion`, `general_support`.
- **Administrative Capabilities Through Tickets:**
  1. **Execute Member Removal:** When relatives request member removal (e.g., account deactivation, departure), superadmins execute 1-click removal directly through the ticket. This deletes the user from `family_members` for that family and records a structured audit entry.
  2. **Role Reassignment & Organizer Handover:** Superadmins can promote a relative to family `admin` or demote to standard `member`.
  3. **Access Control Intervention:** Adjust platform superadmin status for any account.
  4. **Family Decommissioning:** Purge or quarantine a family and associated records per compliance requests.
  5. **Status & Resolution Lifecycle:** Track tickets through `OPEN` $\to$ `IN PROGRESS` $\to$ `RESOLVED` / `CLOSED` with required resolution notes.
- **Interactive Workbench:** Filter tickets by status, SLA priority, category, or full-text search. Includes a dedicated modal for logging new operational tickets directly from the console.

### 2.6 Asymmetrical Living Room Feed & Chronological Stream
- **Panoramic Hearth Canopy:** Architectural header tracking family identity, crest monogram, generation count, and live member count.
- **Asymmetrical 7:5 Desktop Canvas:**
  - **Left 7-Column Stream:** Chronological feed of memories, recipes, milestone celebrations, and voice notes.
  - **Right 5-Column Living Room Shelf:**
    - *On This Day Polaroid:* Historical sepia keepsakes from past years.
    - *Celebration Radar:* Upcoming birthdays and anniversaries with days-remaining countdowns.
    - *Potluck & Reunion Coordinator:* Event coordination and dish RSVP management.
- **Topic Filter Pills:** Instant filtering by `All Moments`, `Milestones`, `Audio Notes`, `Recipes`, and `Vault`.

### 2.6 Memory Preservation, Reactions & Comments
- **Rich Memory Composer:** Post text stories and memories with multi-image support.
- **Kinship Comments:** Threaded discussions with verified author names (`display_name`), relative avatars, and secure delete permissions restricted to authors and family organizers.
- **Tactile Reactions:** Full heart toggle and categorized reaction capsules (`❤️ Love`, `😂 Laugh`, `🌟 Proud`, `🤗 Hug`).

### 2.7 High-Contrast Monochrome Dark Theme System
- Grounded in WCAG AAA accessibility standards:
  - Light Canvas: `#fbfbfd` with `#ffffff` elevated card surfaces and `#09090b` primary typography.
  - Dark Canvas: `#09090b` with `#141417` elevated card surfaces and `#fafafa` primary typography.
- Eliminated all low-contrast gray text and stark white glare blocks in dark mode.
- Custom Tailwind `@theme` properties registered in [`app/globals.css`](file:///C:/Users/DELL/freelancing/family-social/app/globals.css) for `--color-zinc-750: #23232a` and `--color-zinc-850: #18181e`.

---

## 3. Relational Data Model

```sql
-- 1. Identity & Credentials
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  avatar_url TEXT,
  is_superadmin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 2. Sovereign Family Sanctuaries
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  backdrop_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 3. Multi-Tenant Membership Graph
CREATE TABLE family_members (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin' | 'member'
  joined_at TIMESTAMP DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id, family_id)
);

-- 4. Scoped Profiles
CREATE TABLE profiles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  PRIMARY KEY (user_id)
);

-- 5. Cryptographic Invitations
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now() NOT NULL
);

-- 6. Immutable Security Audit Log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now() NOT NULL
);
```

---

## 4. Security, Session & Privacy Architecture

- **Session Handling:** Stateless JWT token strategy via NextAuth.js. Session tokens store `userId`, `familyId`, `role`, and `accessToken`.
- **Row-Level Concurrency:** Invitation redemption locks rows using `SELECT ... FOR UPDATE` to guarantee that tokens cannot be claimed simultaneously across concurrent network requests.
- **Zero-Knowledge Super Admin Governance:** The platform admin dashboard operates solely on structural metadata (family counts, storage sizes, token status) without exposing private family photos, journal notes, or voice recordings.

---

## 5. Comprehensive Changelog

### Version 2.4.0 (Current Release)
- **Automated Self-Service & Admin Ticket Workflows:**
  - **Self-Service Password Reset Request:** Any authenticated family member can request a single-use password reset authorization code from [ProfileView](file:///C:/Users/DELL/freelancing/family-social/app/components/profile/ProfileView.tsx). Dispatches an automated `#TIK-XXXX` ticket under category `password_reset` to the SuperAdmin workbench.
  - **Custom Kin Tag Change Request:** Relatives can request to change their relational profile tag (e.g., `KIN` $\to$ `Grandma`, `Uncle`, `Elder`) directly from their profile banner. Dispatches an automated `#TIK-XXXX` ticket under category `tag_change` to the SuperAdmin workbench.
  - **Family Admin Member Removal Requests:** Family organizers can initiate structured removal requests directly from [FamilyMembersRow](file:///C:/Users/DELL/freelancing/family-social/app/components/family/FamilyMembersRow.tsx) in the Family Directory. Dispatches a high-priority `#TIK-XXXX` ticket under category `member_removal` with target user and family metadata.
  - **Automated SuperAdmin Execution Engine:** Updated `executeTicketAction` in [admin.ts](file:///C:/Users/DELL/freelancing/family-social/app/actions/admin.ts) and [AdminDashboardView](file:///C:/Users/DELL/freelancing/family-social/app/components/admin/AdminDashboardView.tsx) with 1-click execution triggers:
    - `generate_reset_code`: Issues and logs a secure reset token directly in the ticket resolution.
    - `approve_tag_change`: Automatically updates `profiles.custom_tag` in PostgreSQL and records the audit event.
    - `remove_member`: Deletes membership from `family_members` and logs security audit logs.
- **Admin View Full Theme Switch Compatibility:**
  - Overhauled [app/admin/layout.tsx](file:///C:/Users/DELL/freelancing/family-social/app/admin/layout.tsx) and [AdminDashboardView.tsx](file:///C:/Users/DELL/freelancing/family-social/app/components/admin/AdminDashboardView.tsx) with paired Tailwind light and dark classes (`bg-slate-50 dark:bg-[#080a0f]`, `text-slate-900 dark:text-slate-100`, `bg-white dark:bg-[#0e131f]`, `border-slate-200 dark:border-slate-800`).
  - Completely eliminates unreadable or invisible text when switching themes in the SuperAdmin console.
- **Geometrically Perfect Avatar Double-Rings:**
  - Refactored [HearthHeader.tsx](file:///C:/Users/DELL/freelancing/family-social/app/components/navigation/HearthHeader.tsx) and [ProfileView.tsx](file:///C:/Users/DELL/freelancing/family-social/app/components/profile/ProfileView.tsx) to enforce strict 1:1 circular aspect ratio with `aspect-square`, rounded ring padding, and dual contrast borders (`ring-4 ring-white dark:ring-zinc-900 shadow-xl`), preventing oval clipping and subpixel distortion.
- **Profile Portrait Section Overhaul:**
  - Redesigned [AvatarUploadForm.tsx](file:///C:/Users/DELL/freelancing/family-social/app/components/profile/AvatarUploadForm.tsx) following modern UX best practices:
    - Centered prominent circular avatar preview with hover camera overlay.
    - Anchored action badge with camera icon for instant file picking.
    - Drag-and-drop file upload target supporting JPEG, PNG, WebP up to 5MB.
    - Instant client-side live preview before saving with dedicated Save and Cancel controls.
- **Living Room Feed Tabs "Coming Soon" Skeletons:**
  - Implemented [FeedStreamView.tsx](file:///C:/Users/DELL/freelancing/family-social/app/components/feed/FeedStreamView.tsx) to manage main screen feed tabs (`All Moments`, `Milestones`, `Audio Notes`, `Recipes`, and `Vault`).
  - Non-"all" tabs render elegant in-place animated skeletons explaining the upcoming feature with a 1-click "Return to All Moments" button, keeping users engaged without navigating away to prototype dead-ends.

### Version 2.3.0
- **Sovereign Default Superadmin Provisioning:**
  - Seeded default root superuser credentials:
    - **Email:** `admin@kinship.local`
    - **Password:** `AdminPassword123!`
  - **Zero-Family Sovereignty:** The superadmin is isolated from all family memberships (0 records in `family_members`, 0 profiles). They operate with global oversight without being forced into `/create-family` or tied to a private hearth.
  - **Standalone NOC Operations Console Layout:** Migrated `/admin` into its own isolated route group [`app/admin/layout.tsx`](file:///C:/Users/DELL/freelancing/family-social/app/admin/layout.tsx) with a high-density, mission-critical console aesthetic, kernel health monitors, live SLA telemetry, and zero shared layout with standard family members or family organizers.
- **Ticket-Based Governance Engine:**
  - Provisioned relational `admin_tickets` schema and PostgreSQL migration (`0014_admin_tickets.sql`).
  - Implemented full administrative intervention capabilities through tickets:
    - **Member Removal Execution:** Safely removes designated relatives from families with audit logging.
    - **Organizer Handover & Role Reassignment:** Alters member roles (`admin` $\leftrightarrow$ `member`).
    - **Access Control Intervention:** Grants or revokes platform superadmin status.
    - **Family Decommissioning:** Securely purges or quarantines families and associated posts/invites.
    - **Status & Resolution Lifecycle:** Progresses tickets through `OPEN` $\to$ `IN PROGRESS` $\to$ `RESOLVED` / `CLOSED` with mandatory resolution documentation.
  - Interactive workbench in [`AdminDashboardView.tsx`](file:///C:/Users/DELL/freelancing/family-social/app/components/admin/AdminDashboardView.tsx) supporting multi-factor filtering, monospace IDs, and quick-action intervention modals.
  - Modal form for logging new governance tickets with category, priority SLA, target family, and requester tracking.

### Version 2.2.0
- **Family Sanctuary Branding & Administration:**
  - Added full management suite for Family Admins in [`/family#settings`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/family/page.tsx) via [`FamilySettingsCard.tsx`](file:///C:/Users/DELL/freelancing/family-social/app/components/family/FamilySettingsCard.tsx).
  - Admins can edit Family Name and Custom Bio / Motto.
  - Dedicated upload pipeline for Family Avatar Crests (`public/uploads/family/[familyId]/avatar.jpg`) replacing default monograms with custom family emblems.
  - Dedicated upload pipeline for Canopy Banner Backdrops (`public/uploads/family/[familyId]/backdrop.jpg`) rendering scenic atmospheric cover photos with dynamic high-contrast gradient overlays in [`HearthHeader.tsx`](file:///C:/Users/DELL/freelancing/family-social/app/components/navigation/HearthHeader.tsx).
  - Quick "Edit Family" badge on the living room header canopy for organizers.
- **Platform Superadmin Dashboard & Multi-Tenant Governance:**
  - Expanded [`/admin`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/admin/page.tsx) with a dedicated **Platform Users Directory & Roles** tab.
  - Superadmins can search all registered accounts across all families, inspect user emails, observe multi-family memberships and roles, and view user contribution stats (posts and comments counts).
  - Introduced granular platform Superadmin privilege governance with 1-click status elevation/demotion (`toggleSuperadmin`).
  - Added new telemetry metrics: Total Platform Users, Total Comments, and Active vs. Lifetime Invites.
- **Header & Modal Fixes:**
  - Resolved sign-out confirmation dialog clipping and sticky header positioning via React Portal (`createPortal`) mounting directly to `document.body` with `z-[100]`.

### Version 2.1.0
- **Onboarding Pipeline Overhaul:**
  - Resolved unauthenticated redirect loop: `acceptInvite` now returns structured confirmation, allowing `AcceptInviteForm` to automatically mint the NextAuth session cookie before transitioning to `/feed`.
  - Resolved unique email collision: Existing registered users can now accept invites without database crashes; credentials are authenticated and family membership is bound idempotently.
  - Implemented session detection on `/invite/[token]`: Authenticated users receive an intuitive 1-click join confirmation via [`AuthenticatedJoinCard`](file:///C:/Users/DELL/freelancing/family-social/app/components/invites/AuthenticatedJoinCard.tsx).
  - Streamlined Founding Registration: Newly registered admins on `/register` are automatically authenticated and routed directly to `/create-family`.
  - Added Role Selection in [`GenerateInviteButtons.tsx`](file:///C:/Users/DELL/freelancing/family-social/app/components/family/GenerateInviteButtons.tsx): Organizers can generate links for `Family Member` or `Co-Organizer / Admin`.
- **Platform Admin Dashboard Launched:**
  - Created [`/admin`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/admin/page.tsx) and [`AdminDashboardView.tsx`](file:///C:/Users/DELL/freelancing/family-social/app/components/admin/AdminDashboardView.tsx).
  - Surfaces real-time KPI metrics, holistic family directory, cross-family invitation ledger, and platform security audit trail.
  - Added dedicated navigation entry in [`UserMenu.tsx`](file:///C:/Users/DELL/freelancing/family-social/app/components/UserMenu.tsx) with shield badge for administrators.
- **Dark Mode Aesthetics Overhaul:**
  - Fixed low-contrast text across comment boxes, inputs, reaction chips, and living room shelf polaroids.
  - Replaced glaring pure-white badges and buttons with refined dark pill elements (`dark:bg-zinc-100 dark:text-zinc-950`).
  - Added `--color-zinc-750` and `--color-zinc-850` definitions in `app/globals.css`.
- **Comment Author Correction:**
  - Fixed author name resolution so comments correctly display the posting user's `display_name` instead of fallback placeholders.
- **Avatar Storage & Proxying:**
  - Implemented local image upload pipeline writing to `public/uploads/avatar/` with local HTTP proxying via `app/uploads/[...path]/route.ts`.

### Version 2.0.0 (Living Room Revamp)
- Complete UI transformation to Shadcn Monochrome Zinc system.
- Implemented Asymmetrical 7:5 Living Room desktop grid.
- Panoramic Hearth Header with multi-generational vitals and member facepile.
- Tactile Pill Architecture for navigation, filters, and categorical badges.