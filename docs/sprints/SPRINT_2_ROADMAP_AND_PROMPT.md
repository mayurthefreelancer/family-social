# 🚀 Kinship: Sprint 2 Master Implementation Roadmap & Autonomous LLM Execution Prompt

> **Target Sprint:** Sprint 2 — Frictionless Auth, Lineage Tree & Celebrations  
> **Target Platform Version:** `2.6.0`  
> **Status:** Ready for Autonomous Execution  
> **Prerequisites:** Sprint 1 Delivered & Verified (`v2.5.0`)  
> **Key Scopes Covered:**  
> 1. **Proposal 3:** Frictionless Family Auth (6-Digit PIN, QR Device Pairing & Communal Living Room Mode)  
> 2. **Proposal 2:** Kinship Lineage Discovery & Family Tree Data Enrichment (3-Step Micro Onboarding & Interactive Tree)  
> 3. **Proposal 7:** Dynamic Celebrations Radar & Secret Digital Greeting Cards (Countdown & Time-Locked Messages)  

---

```markdown
# 🤖 TASK: Implement Sprint 2 (Frictionless Auth, Lineage Tree & Celebrations) for Kinship

You are tasked with autonomously implementing **Sprint 2** for **Kinship: The Digital Living Room** (`family-social`).

---

## ⚠️ MANDATORY USER CONSTRAINTS & BEHAVIORAL RULES

1. **Token Naming Convention:** Always use `accessToken` (never generic `token`) when handling authentication tokens, session objects, or JWT callbacks.
2. **No Test Execution or Modifications:** Do NOT run, modify, or suggest any changes related to tests until explicitly specified by the user.
3. **Zero Shell Commands:** Do NOT run shell commands such as `npm install`, `npm run dev`, or database pushes. Ask the user to run them in their terminal instead.
4. **Clickable Links:** You MUST create clickable markdown links using the `file:///` scheme with forward slashes for all referenced files and code symbols (e.g. [`db/schema.ts`](file:///C:/Users/DELL/freelancing/Work/family-social/db/schema.ts)).
5. **No Dead Links:** Do not link to `/prototype` from the application UI. `/prototype` is a dark development route accessible only by direct URL entry.
6. **Multi-Tenant Isolation:** Every single database query, mutation, and storage operation MUST be strictly scoped and authorized by `family_id`.
7. **English-Only UI:** All user-facing text, button labels, notifications, and indicators must be in clean, accessible English (no Marathi or Devanagari numerals/dialects).
8. **Hydration Reliability:** Ensure all components are safe for Next.js 16 App Router server rendering: use `mounted` client state guards for browser-specific APIs (camera, localStorage, window dimensions) and apply `suppressHydrationWarning` where dynamic timestamps or theme attributes are rendered.
9. **Perfect Circular Geometry:** All avatars, circular action icons, and badge buttons must enforce strict 1:1 circular aspect ratio: `aspect-square shrink-0 rounded-full overflow-hidden`.
10. **Zero Paid Dependencies:** Camera scanning, QR generation, and confetti animations must rely on standard browser APIs (`navigator.mediaDevices`, HTML5 Canvas/SVG) or lightweight zero-cost utilities.

---

## 🎯 Sprint 2 Architectural Objectives

### 1. Frictionless Family Auth Engine (Proposal 3)
Eliminate login friction for elderly grandparents and young relatives who struggle with long alphanumeric passwords on mobile screens:
- **Mode A (6-Digit Numeric Passcode / PIN):** Provide a memorable 6-digit numeric PIN alternative. Feature a large touch-first numeric keypad (0–9) on mobile with haptic/visual tap feedback.
- **Mode B (WhatsApp-Style QR Device Pairing):** Enable an already logged-in relative to display a time-limited (90-second) QR code from their settings. A new device scans the QR code with their camera to instantly mint a valid NextAuth session cookie (`accessToken`) with zero typing.
- **Passcode Management:** Add options in [`ProfileView.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/components/profile/ProfileView.tsx) to set or change the 6-digit PIN.

### 2. Kinship Lineage Discovery & Family Tree (Proposal 2)
Transform the blank `/family` directory into an intimate, generational living family tree:
- **Founding Admin Ancestor Builder:** Modal allowing family organizers to seed departed founding ancestors (Tier 1: Patriarchs & Matriarchs) with memorial badges (`🕊️ In Loving Memory`), birth/death years, and portrait photos.
- **3-Step Micro Onboarding Wizard:** When an invited relative joins the family hearth, present a 30-second micro-modal:
  1. *"Who are your parents in this family?"* (Dropdown of existing relatives + option to add a name).
  2. *"Who is your spouse or partner?"* (Optional selector).
  3. *"What year were you born?"* (Automatically assigns `generation_tier` without exposing exact sensitive birth dates).
- **Interactive Family Tree Explorer:** Render a multi-generational visual hierarchy (Tier 1: Grandparents, Tier 2: Parents/Aunts/Uncles, Tier 3: Children/Cousins) with relationship lines, kinship tags, and direct profile navigation.

### 3. Celebrations Radar & Secret Digital Greeting Cards (Proposal 7)
Automate family milestones and create emotional anticipation:
- **Celebrations Scheduler:** Support scheduling birthdays, wedding anniversaries, and family milestones with automatic yearly recurrence (`is_recurring_yearly`).
- **Living Room Radar Widget:** Display upcoming events in the desktop sidebar (`LivingRoomSidebar.tsx`) and mobile feed header with countdown badges (*"In 3 days"*, *"Tomorrow"*, *"Today! 🎉"*).
- **Secret Digital Greeting Cards:** Relatives can write secret affectionate messages and sign the card prior to the celebration date. The celebrant cannot see the messages until the date arrives (*"Locked until Oct 12 🔒"*). On the event date, the card unfolds on the feed with celebratory confetti animations, revealing all family signatures and notes.

---

## 📁 File-by-File Implementation Plan

### Step 1: Database Schema Expansion
* **Target File:** [`db/schema.ts`](file:///C:/Users/DELL/freelancing/Work/family-social/db/schema.ts)
* **Changes:**
  1. Add `passcodeHash` to `users`:
     ```typescript
     passcodeHash: text("passcode_hash"),
     ```
  2. Add `devicePairingTokens` table:
     ```typescript
     export const devicePairingTokens = pgTable("device_pairing_tokens", {
       id: uuid("id").defaultRandom().primaryKey(),
       userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
       familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
       token: text("token").notNull().unique(),
       expiresAt: timestamp("expires_at").notNull(),
       usedAt: timestamp("used_at"),
       createdAt: timestamp("created_at").defaultNow().notNull(),
     });
     ```
  3. Verify existing `familyTreeNodes`, `celebrations`, and `celebrationMessages` tables in [`db/schema.ts`](file:///C:/Users/DELL/freelancing/Work/family-social/db/schema.ts) are fully active and typed.
* **Migration File:** Create `db/migrations/0017_sprint_2_core.sql` capturing DDL for `passcode_hash` and `device_pairing_tokens`.

---

### Step 2: NextAuth & Frictionless Auth Actions
* **Create File:** `app/actions/frictionless-auth.ts`
  - `setPasscode(passcode: string)`: Validates 6 numeric digits, hashes via bcrypt, updates `users.passcode_hash`, returns `{ success: true }`.
  - `generatePairingToken()`: Authenticated server action creating a 32-byte cryptographic hex token in `device_pairing_tokens` with 90-second expiration.
  - `pollPairingStatus(token: string)`: Checks if a generated pairing token has been claimed.
  - `claimPairingToken(token: string)`: Validates token expiration and `used_at IS NULL`, marks `used_at = now()`, returns a single-use exchange grant.
* **Edit File:** [`app/lib/auth.ts`](file:///C:/Users/DELL/freelancing/Work/family-social/app/lib/auth.ts)
  - Update NextAuth `CredentialsProvider` authorize handler to accept either:
    1. Standard `email` + `password`
    2. `email` + `passcode` (verified against `users.passcode_hash`)
    3. `pairingExchangeGrant` (authenticates instantly and returns user session with `accessToken`)
* **Create File:** `app/components/auth/NumericKeypad.tsx`
  - Accessible touch keypad with digits `1-9`, `0`, backspace (`Delete`), and clear (`C`).
  - Minimum 56px touch target size with tactile depression effects and audio/haptic click feedback.
  - Masked 6-digit circular bullet indicators (`● ● ● ○ ○ ○`).
* **Create File:** `app/components/auth/PasscodeLoginForm.tsx`
  - Quick toggle button on login screen: *"Sign in with 6-Digit PIN"* vs *"Sign in with Email & Password"*.
  - User selects or inputs their email/name and enters their PIN via `NumericKeypad`.
* **Create File:** `app/components/auth/QrPairingModal.tsx`
  - Accessible from user profile or family settings: *"Pair a Family Tablet or Phone"*.
  - Renders an SVG QR code encoding the ephemeral pairing URL/token, accompanied by a 90-second countdown ring and a manual 6-character backup code.
* **Create File:** `app/components/auth/QrScannerModal.tsx`
  - Accessible on login screen: *"Scan QR Code to Enter"*.
  - Accesses webcam/smartphone camera via `navigator.mediaDevices.getUserMedia`.
  - Scans QR frame or allows entering the 6-character fallback code.
  - Calls `claimPairingToken` and triggers `signIn("credentials")` automatically.

---

### Step 3: Kinship Lineage Discovery & Family Tree
* **Create File:** `app/actions/lineage.ts`
  - `getFamilyTree(familyId: string)`: Fetches all `family_tree_nodes` for the family, augmented with user profile avatars.
  - `saveRelativeLineage(data: { parent1Id?: string; parent2Id?: string; spouseId?: string; birthYear?: string })`: Upserts `family_tree_nodes` record for the authenticated relative and calculates `generationTier`.
  - `createAncestorNode(data: { fullName: string; relationLabel: string; generationTier: number; birthYear?: string; deathYear?: string; isDeceased: boolean; bio?: string })`: Admin-only action to seed founding ancestors.
  - `updateTreeNode(nodeId: string, data: Partial<TreeNode>)`: Admin/self update action.
  - `deleteTreeNode(nodeId: string)`: Admin-only delete action.
* **Create File:** `app/components/onboarding/LineageMicroWizard.tsx`
  - Client modal displayed when an invited member signs in if their `family_tree_nodes` entry is incomplete.
  - 3-step progressive questionnaire:
    - Step 1: *"Who are your parents in this family?"*
    - Step 2: *"Who is your spouse or partner?"*
    - Step 3: *"What year were you born?"*
  - *"Skip for now"* option so onboarding is never blocking.
* **Create File:** `app/components/family/AdminTreeBuilderModal.tsx`
  - Modal in [`FamilySettingsCard.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/components/family/FamilySettingsCard.tsx) allowing admins to seed Tier 1 ancestors.
  - Inputs for full name, relation tag, birth year, death year, memorial tribute badge toggle (`🕊️ In Loving Memory`), and photo upload.
* **Create File:** `app/components/family/FamilyTreeExplorer.tsx`
  - Visual hierarchical tree viewer mounted in [`app/(app)/family/page.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/(app)/family/page.tsx) under the "Tree" tab.
  - Structured generational tiers:
    - **Tier 1:** Ancestors & Grandparents (with memorial halos for deceased members).
    - **Tier 2:** Parents, Aunts & Uncles.
    - **Tier 3:** Children & Cousins.
  - Responsive pan/zoom or scrollable grid with connecting lines, relative avatar chips, relation tags, and click-to-profile drawer.

---

### Step 4: Celebrations Radar & Secret Digital Cards
* **Create File:** `app/actions/celebrations.ts`
  - `getCelebrations(familyId: string)`: Fetches upcoming celebrations sorted by nearest upcoming date.
  - `createCelebration(data: { title: string; celebrationType: string; eventDate: Date; isRecurringYearly: boolean; userId?: string; note?: string })`: Schedules a milestone.
  - `signCelebrationCard(celebrationId: string, content: string)`: Inserts greeting into `celebration_messages`.
  - `getCelebrationCardDetails(celebrationId: string)`: Retrieves celebrant details, event date, and signed messages. If the current user is the celebrant and today is BEFORE `eventDate`, returns `{ isLocked: true, messageCount: N }` without exposing message content.
* **Create File:** `app/components/celebrations/CelebrationsRadarCard.tsx`
  - Compact widget mounted in [`LivingRoomSidebar.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/components/feed/LivingRoomSidebar.tsx).
  - Displays list of upcoming birthdays and anniversaries with days-remaining pills (*"In 4 days"*, *"Tomorrow"*, *"Today! 🎂"*).
  - Includes a *"Schedule Celebration"* button for family members and a *"Sign Secret Card"* button for upcoming events.
* **Create File:** `app/components/celebrations/SecretCardSignModal.tsx`
  - Modal allowing family members to write their secret greeting, choose an affectionate emoji capsule, and submit their signature beforehand.
* **Create File:** `app/components/celebrations/CelebrationFeedBanner.tsx`
  - When today matches an active celebration date, renders a celebratory banner at the top of the Living Room feed.
  - Displays animated celebration confetti, celebrant portrait, and an unfolding card revealing all family signatures, notes, and avatars.

---

### Step 5: Interface Wiring & Navigation
* **Edit File:** [`app/(app)/family/page.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/(app)/family/page.tsx)
  - Add a dedicated **Family Tree** tab linking directly to `<FamilyTreeExplorer />`.
  - Wire `<AdminTreeBuilderModal />` into family settings for organizers.
* **Edit File:** [`app/components/feed/LivingRoomSidebar.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/components/feed/LivingRoomSidebar.tsx)
  - Replace static placeholder celebrations with `<CelebrationsRadarCard />`.
* **Edit File:** [`app/(app)/feed/page.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/(app)/feed/page.tsx)
  - Fetch today's celebrations and render `<CelebrationFeedBanner />` when milestones occur.
* **Edit File:** [`app/(public)/login/page.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/(public)/login/page.tsx)
  - Add tabs/buttons for 6-Digit PIN keypad login and QR Code device pairing scanner.
* **Edit File:** [`app/components/profile/ProfileView.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/components/profile/ProfileView.tsx)
  - Add "Security & Devices" card with:
    - *"Set / Update 6-Digit Passcode"* modal trigger.
    - *"Pair a Family Device (Show QR Code)"* modal trigger.

---

## ✅ Acceptance Criteria & Quality Gates

1. **6-Digit PIN Login:** A user can set a 6-digit PIN in their profile, log out, and successfully log in using only their email/name and numeric PIN via the on-screen keypad.
2. **QR Device Pairing:** An authenticated user on Device A can generate a QR pairing code; Device B scans the code and is authenticated automatically into the same family hearth.
3. **Ancestor Seeding:** Family admins can add deceased ancestors with birth/death years and tribute badges (`🕊️ In Loving Memory`) which render in Tier 1 of the tree.
4. **Lineage Micro-Wizard:** Newly accepted members see the 3-step prompt, and submitted relationships correctly bind into `family_tree_nodes`.
5. **Celebration Radar & Secret Cards:**
   - Upcoming milestones display live countdown badges in the sidebar.
   - Relatives can sign a card before the event date.
   - The celebrant cannot inspect secret greetings prior to the milestone date.
   - On the event date, the card unlocks on the feed with all signatures visible.
6. **Multi-Tenant Security:** All queries to `celebrations`, `celebration_messages`, `family_tree_nodes`, and `device_pairing_tokens` strictly verify `family_id`.
7. **Session Convention:** All NextAuth callbacks and session minting maintain the `accessToken` token property.
8. **Responsive & Circular:** The numeric keypad and tree explorer scale down gracefully to mobile screen widths (`< 640px`), and all avatars maintain 1:1 circular aspect ratio.
```

---

## 🛠️ Post-Sprint 2 Verification Instructions for User

Instruct the user to run the following in their PowerShell terminal after implementation:

```powershell
# 1. Apply database schema changes for passcodes, pairing tokens, and tree relations
npx drizzle-kit push

# 2. Launch development server
npm run dev
```
