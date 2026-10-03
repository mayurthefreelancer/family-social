# 📖 Kinship: The Digital Living Room — Comprehensive User Handbook

> **Document Type:** Official User Guide & Platform Operations Handbook  
> **Audience:** Family Organizers, Relatives of all generations, and Platform Administrators  
> **Product Version:** 2.4.0  
> **Platform URL:** `http://localhost:3000` (Local)  

---

## 📑 Table of Contents

1. [Welcome to Kinship](#1-welcome-to-kinship)
   - [Why Kinship?](#why-kinship)
   - [Core Concepts & Terminology](#core-concepts--terminology)
2. [Getting Started as a Family Organizer (Founding Admin)](#2-getting-started-as-a-family-organizer-founding-admin)
   - [Step 1: Create Your Account](#step-1-create-your-account)
   - [Step 2: Establish Your Family Hearth](#step-2-establish-your-family-hearth)
   - [Step 3: Enter Your Living Room](#step-3-enter-your-living-room)
3. [Inviting Loved Ones into the Sanctuary](#3-inviting-loved-ones-into-the-sanctuary)
   - [How to Generate an Invitation Link](#how-to-generate-an-invitation-link)
   - [Choosing Member Roles: Family Member vs. Co-Organizer](#choosing-member-roles-family-member-vs-co-organizer)
   - [Sharing Your Invite Link](#sharing-your-invite-link)
   - [Managing & Revoking Active Links](#managing--revoking-active-links)
4. [Joining a Family (For Relatives)](#4-joining-a-family-for-relatives)
   - [Scenario A: Brand-New User](#scenario-a-brand-new-user)
   - [Scenario B: Existing Kinship User](#scenario-b-existing-kinship-user)
   - [Scenario C: Already Signed-In User (1-Click Acceptance)](#scenario-c-already-signed-in-user-1-click-acceptance)
5. [Tour of the Digital Living Room](#5-tour-of-the-digital-living-room)
   - [The Panoramic Hearth Canopy](#the-panoramic-hearth-canopy)
   - [The Architectural Vitals Tray](#the-architectural-vitals-tray)
   - [The Sized Tab Navigation System](#the-sized-tab-navigation-system)
   - [The 7:5 Desktop Living Room Layout](#the-75-desktop-living-room-layout)
6. [Sharing Memories & Family Stories](#6-sharing-memories--family-stories)
   - [Composing a Post in the Hearth Composer](#composing-a-post-in-the-hearth-composer)
   - [Attaching Photos & Media](#attaching-photos--media)
   - [Filtering Moments](#filtering-moments)
7. [Interacting: Kinship Reactions & Comments](#7-interacting-kinship-reactions--comments)
   - [Sending Tactile Heart & Categorized Reactions](#sending-tactile-heart--categorized-reactions)
   - [Commenting on Family Memories](#commenting-on-family-memories)
   - [Comment Moderation & Deletion](#comment-moderation--deletion)
8. [The Living Room Shelf (Right Column)](#8-the-living-room-shelf-right-column)
   - [“On This Day” Polaroid Keepsakes](#on-this-day-polaroid-keepsakes)
   - [Celebration Radar (Birthdays & Anniversaries)](#celebration-radar-birthdays--anniversaries)
   - [Potluck & Reunion Coordinator](#potluck--reunion-coordinator)
9. [Managing Your Profile & Avatar](#9-managing-your-profile--avatar)
   - [Viewing Your Profile](#viewing-your-profile)
   - [Editing Your Profile & Bio](#editing-your-profile--bio)
   - [Uploading a Custom Portrait Avatar](#uploading-a-custom-portrait-avatar)
10. [Family Directory, Branding & Settings](#10-family-directory-branding--settings)
    - [Managing Family Information & Branding](#managing-family-information--branding)
    - [Family Directory & Member Roles](#family-directory--member-roles)
11. [The Platform Superadmin Dashboard](#11-the-platform-superadmin-dashboard)
    - [Accessing the Superadmin Dashboard](#accessing-the-superadmin-dashboard)
    - [1. Platform Users Directory & Governance](#1-platform-users-directory--governance)
    - [2. Holistic Sovereign Families Directory](#2-holistic-sovereign-families-directory)
    - [3. Cross-Family Invitation Ledger](#3-cross-family-invitation-ledger)
    - [4. Cross-Platform Security & Audit Trail](#4-cross-platform-security--audit-trail)
12. [Theme Customization & Accessibility](#12-theme-customization--accessibility)
    - [Switching Light / Dark Theme](#switching-light--dark-theme)
    - [Generational Accessibility Features](#generational-accessibility-features)
13. [Security, Password Recovery & Safe Logout](#13-security-password-recovery--safe-logout)
    - [Forgot & Reset Password](#forgot--reset-password)
    - [In-App Logout Confirmation](#in-app-logout-confirmation)
14. [Frequently Asked Questions (FAQ)](#14-frequently-asked-questions-faq)

---

## 1. Welcome to Kinship

### Why Kinship?
Public social media is built for viral broadcasting, algorithmic engagement traps, and advertiser surveillance. For families, sharing sensitive pictures of children, intimate health updates of grandparents, or Sunday dinner recipes on public networks feels unsafe and cluttered.

**Kinship** is built from the ground up as a **Private Digital Living Room**:
- **Walled Sanctuary:** Every family exists in its own isolated database space (`family_id`). Only relatives with an invite can step through the door.
- **Pure Chronology:** No algorithms decide what you see. Every post, photo, and voice story appears in simple chronological order.
- **Generational Warmth:** Crafted to be comfortable for grandchildren, busy parents, and grandparents alike.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE KINSHIP SANCTUARY                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   🔒 100% Private      📅 Chronological     👵 Generational Comfort    │
│   Zero Public Feeds    No Algorithms        High-Contrast Legibility   │
│   Zero Advertisers     Pure Family Moments  Large 44px Touch Targets   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Concepts & Terminology
- **Sanctuary (Family Space):** Your private family environment. All memories and comments stay strictly inside.
- **The Hearth:** The central gathering canopy at the top of your screen, displaying your family crest, motto, member facepile, and live vitals.
- **The Stream (Left Column):** The continuous magazine-style feed where family members post memories, stories, and recipes.
- **The Living Room Shelf (Right Column):** The tactile sidebar displaying nostalgic “On This Day” polaroids, birthday radars, and potluck lists.
- **Kin:** A registered family member connected to your sanctuary.
- **Organizer (Admin):** Family member with privileges to invite kin, assign roles, and manage the family directory.

---

## 2. Getting Started as a Family Organizer (Founding Admin)

If your family does not yet have a Kinship sanctuary, you will be the **Founding Admin**. Setting up takes less than 2 minutes.

### Step 1: Create Your Account
1. Open [`http://localhost:3000`](http://localhost:3000) in your web browser.
2. Click **Start Your Family Sanctuary** or **Create Family** in the navigation bar.
3. You will arrive at [`/register`](file:///C:/Users/DELL/freelancing/family-social/app/(public)/register/page.tsx).
4. Fill in:
   - **Your Full Name:** (e.g. *Eleanor Vance* or *Uncle Raymond*)
   - **Email Address:** (e.g. *eleanor@example.com*)
   - **Password:** (At least 8 characters)
5. Click **Create Account & Continue →**.

> [!NOTE]
> Kinship automatically logs you in immediately upon account creation. You do not need to re-enter your email and password.

```
┌──────────────────────────────────────────────┐
│             Create Your Account              │
│  Join your loved ones in a private space.    │
├──────────────────────────────────────────────┤
│  YOUR FULL NAME: [ Eleanor Vance           ] │
│  EMAIL ADDRESS:  [ eleanor@example.com     ] │
│  CHOOSE PASSWORD:[ ••••••••••••••••        ] │
│                                              │
│  [ Create Account & Continue →             ] │
└──────────────────────────────────────────────┘
```

### Step 2: Establish Your Family Hearth
After registering, you are immediately routed to [`/create-family`](file:///C:/Users/DELL/freelancing/family-social/app/create-family/page.tsx):
1. Enter your **Family Name** (e.g., *The Miller Family*, *Hawthorne Clan*, *Sterling Kin*).
2. Click **Open Family Living Room →**.

### Step 3: Enter Your Living Room
Behind the scenes, Kinship atomically:
- Creates your family sanctuary with a unique identifier.
- Assigns you as the primary **Admin / Organizer**.
- Initializes your personal family profile.
- Opens your private living room feed at [`/feed`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/feed/page.tsx).

---

## 3. Inviting Loved Ones into the Sanctuary

Only family organizers and admins can generate invitation links, ensuring that strangers cannot enter uninvited.

```
┌────────────────────────────────────────────────────────┐
│                   INVITATION FLOW                      │
├────────────────────────────────────────────────────────┤
│  1. Organizer selects role (Member or Co-Admin)        │
│  2. Organizer clicks "Generate Invite Link"            │
│  3. Cryptographic token created with 7-day TTL         │
│  4. Link copied to clipboard                           │
│  5. Sent via WhatsApp, SMS, iMessage, or Email         │
│  6. Relative clicks link and accepts in 1 click        │
└────────────────────────────────────────────────────────┘
```

### How to Generate an Invitation Link
1. In the top navigation bar, click the **Invite** button with the `+` icon in the member facepile, OR go to your user avatar $\to$ click **Family Directory & Invites** ([`/family/invites`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/family/invites/page.tsx)).
2. Locate the **Invite Loved Ones** card.

### Choosing Member Roles: Family Member vs. Co-Organizer
Before clicking generate, select the target role:
- **Family Member:** Recommended for grandparents, aunts, uncles, and children. They can share memories, post recipes, comment, and RSVP.
- **Co-Organizer / Admin:** Recommended for spouses or tech-savvy relatives. They can generate invites, revoke links, and access administrative tools.

```
Target Role:  (•) Family Member    ( ) Co-Organizer / Admin
[ + Generate Member Invite Link ]
```

### Sharing Your Invite Link
- Click the **Generate Invite Link** button.
- The link is generated (e.g., `http://localhost:3000/invite/a9f4c8...`) and **automatically copied to your clipboard**.
- Paste the link directly into your family group chat on WhatsApp, Apple Messages, Signal, or via email:
  > *"Hey everyone! I set up our private family living room on Kinship so we can share photos and recipes away from public social media. Click here to join: [Invite Link]"*

### Managing & Revoking Active Links
- In [`/family/invites`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/family/invites/page.tsx), you can see all **Active Invitations**.
- Each card shows the expiration date (links are valid for 7 days).
- You can click **Copy Link** to re-copy it at any time.
- If you made a mistake or want to invalidate a link, click the red **Revoke** button to immediately delete the token.

---

## 4. Joining a Family (For Relatives)

When a relative receives and clicks an invite link, Kinship uses an intelligent state machine to provide the smoothest possible experience.

### Scenario A: Brand-New User
*For a relative who has never used Kinship before:*
1. The relative clicks the invitation link.
2. The page displays **Join [Family Name]**.
3. They enter their **Full Name**, **Email Address**, and choose a **Password**.
4. They click **Accept Invitation & Enter Living Room →**.
5. **Result:** Their account is created, they are added to the family, and they are **automatically signed in** directly to the feed. No unauthenticated redirect loops!

### Scenario B: Existing Kinship User
*For a relative who already registered on Kinship previously:*
1. They open the invitation link.
2. In the email field, they enter their existing account email and their current password.
3. They click **Accept Invitation & Enter Living Room →**.
4. **Result:** Kinship securely validates their password, binds them to the new family, and signs them in seamlessly without duplicate email errors.

### Scenario C: Already Signed-In User (1-Click Acceptance)
*For a relative who is already logged into Kinship on their device:*
1. They open the invite link.
2. The page recognizes them immediately:
   > *"Welcome back, [Name]! You are signed in as [email]. Would you like to connect with [Family Name]?"*
3. They click the single **Accept & Enter [Family Name] →** button.
4. **Result:** Instant 1-click entry! No forms, no typing.

---

## 5. Tour of the Digital Living Room

Once inside [`/feed`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/feed/page.tsx), you are greeted by the signature Kinship **Asymmetrical 7:5 Living Room Canvas**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PANORAMIC HEARTH CANOPY                         │
│  ┌───┐                                                                 │
│  │ M │  The Miller Family  [🛡️ Private Sanctuary]                     │
│  └───┘  Circle: [Grandma] [Dad] [Mom] [Lucas] [+ Invite]               │
├────────────────────────────────────────────────────────────────────────┤
│  01 42 Memories Shared │ 02 3 Generations Connected │ 03 Active Hearth │
└────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────┬─────────────────────────────┐
│  THE STREAM (7 Cols)                     │  THE LIVING ROOM SHELF      │
│                                          │                             │
│  [ Pill Filters: All | Milestones |... ] │  ┌────────────────────────┐ │
│  ┌────────────────────────────────────┐  │  │ ON THIS DAY POLAROID   │ │
│  │ ✨ Floating Hearth Composer        │  │  │ Whispering Pines 2023  │ │
│  │ "Share a memory with kin..."       │  │  └────────────────────────┘ │
│  └────────────────────────────────────┘  │  ┌────────────────────────┐ │
│  ┌────────────────────────────────────┐  │  │ CELEBRATION RADAR      │ │
│  │ Post Card (Photo + Recipe)         │  │  │ Rose's 78th Birthday   │ │
│  │ [❤️ 7 Reactions] [💬 4 Notes]      │  │  └────────────────────────┘ │
│  └────────────────────────────────────┘  │  ┌────────────────────────┐ │
│                                          │  │ POTLUCK COORDINATOR    │ │
│                                          │  └────────────────────────┘ │
└──────────────────────────────────────────┴─────────────────────────────┘
```

### The Panoramic Hearth Canopy
- **Monogram Crest:** High-contrast circular crest displaying the first letter of your family surname.
- **Sanctuary Badge:** Verified private status pill.
- **Family Circle Facepile:** Avatars of all connected relatives. Hover over any avatar to see their name and role.
- **Quick Invite Button:** 1-click button to copy a new invitation link.

### The Architectural Vitals Tray
Located directly below the canopy:
- **01 Memories Shared:** Lifetime counter of all family posts.
- **02 Generations Connected:** Visual indicator of generational depth.
- **03 Active Hearth:** Status pulse verifying end-to-end encryption and sanctuary isolation.

### The Sized Tab Navigation System
Under the vitals tray, tactile pill buttons allow you to switch views seamlessly without leaving your living room:
- **All Moments (Stream):** The full, active chronological memory feed with the Hearth Composer and live post stream.
- **Milestones:** Dedicated upcoming space for birthdays, graduations, and major milestones. Renders an interactive "Coming Soon" preview skeleton with a 1-click button to return to All Moments.
- **Audio Notes:** Future home for voice memos and oral history audio storytelling. Renders an interactive "Coming Soon" preview skeleton with descriptive details.
- **Recipes:** Upcoming family heirloom cookbook archive for treasured Sunday dinner recipes. Renders an interactive "Coming Soon" preview skeleton.
- **Vault:** Archival records, heirloom documents, and preserved treasures. Renders an interactive "Coming Soon" preview skeleton.

> [!NOTE]
> All specialized tabs maintain your current living room context and render interactive preview skeletons rather than navigating to separate prototype pages. You can return to **All Moments** at any time with a single click.

---

## 6. Sharing Memories & Family Stories

### Composing a Post in the Hearth Composer
At the top of the stream sits the **Hearth Composer**:
1. Click the text area (*"What's happening in the family today?"*).
2. Type your memory, update, or story.
3. You can paste an image URL or attach media.
4. Click **Publish Memory**.

> [!TIP]
> **Storytelling Ideas for Kin:**
> - Share old photographs from dusty photo albums.
> - Post Grandma's secret recipe card with handwritten notes.
> - Announce milestones: first steps, new jobs, report cards, or anniversaries.
> - Tell childhood stories about relatives for the younger generation.

### Filtering Moments
Above the composer, click any filter capsule to instantly refine the feed:
- **All Moments:** Shows everything in chronological sequence.
- **Milestones:** Only major life events.
- **Audio Notes:** Spoken family histories.
- **Recipes:** Cookware and dish creations.
- **Vault:** Archival keepsakes.

---

## 7. Interacting: Kinship Reactions & Comments

Kinship replaces generic public likes with intimate, family-oriented reactions.

### Sending Tactile Heart & Categorized Reactions
- **Quick Like:** Click the heart icon on any post card. The counter updates immediately.
- **Categorized Reaction Capsules:** Select from:
  - `❤️ Love` — For affectionate family moments.
  - `😂 Laugh` — For humorous childhood memories or candid mishaps.
  - `🌟 Proud` — For achievements and milestones.
  - `🤗 Hug` — For comfort, sympathy, or warm wishes.

### Commenting on Family Memories
1. At the bottom of any memory card, click the **Comment** area.
2. Type your note (e.g., *"I remember this picnic! Uncle Arthur brought the wrong cooler!"*).
3. Click **Post Note**.
4. The comment appears instantly with your **verified display name**, relative avatar, and timestamp.

### Comment Moderation & Deletion
- You can delete any comment you personally posted by clicking the small trash icon on your comment bubble.
- Family Organizers (Admins) have permission to remove any comment if needed.

---

## 8. The Living Room Shelf (Right Column)

The right-hand column of the desktop feed acts as a physical mantelpiece or refrigerator door, keeping active reminders and nostalgia close at hand.

### “On This Day” Polaroid Keepsakes
- Surfaces archival moments shared on this exact calendar day in previous years (e.g. *“3 Years Ago at Whispering Pines Lake”*).
- Framed in a sepia polaroid card with archival dates.

### Celebration Radar (Birthdays & Anniversaries)
- Displays upcoming birthdays and anniversaries for connected relatives.
- Shows live countdown pills (e.g. *“In 4 Days”*).
- Lets you know if secret group cards or celebration notes are open for relatives to sign.

### Potluck & Reunion Coordinator
- When your family plans a holiday dinner (Thanksgiving, Sunday Roast, Reunion), the coordinator lists dishes and supplies needed.
- Relatives can click **RSVP** (*“✓ Going”*, *“Tentative”*, *“Can't Make It”*) and claim specific potluck items.

---

## 9. Managing Your Profile, Avatar & Kinship Credentials

Every relative has a personalized identity within the family sanctuary.

### Viewing Your Profile
1. Click your circular avatar in the top-right corner of any screen.
2. Select **Your Profile** from the dropdown menu ([`/profile`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/profile/page.tsx)).
3. You will see your panoramic cover banner, your circular avatar with high-contrast dual ring, your current **Kin Tag**, your joined date, and all the memories you have contributed.

### Requesting a Relational Tag Change (e.g. Grandma, Uncle)
By default, relatives receive the `KIN` tag. You can request a personalized family tag:
1. On your profile page, locate your Kin Tag pill (e.g., `KIN`).
2. Click the **Change** button next to it.
3. In the modal, select a preset (e.g. `Grandma`, `Grandpa`, `Uncle`, `Aunt`, `Mom`, `Dad`, `Elder`, `Cousin`) or write in a custom moniker.
4. Add an optional justification note and click **Submit Tag Change Request**.
5. This automatically raises a `#TIK-XXXX` ticket under category `tag_change` on the Platform SuperAdmin Console. Once approved by SuperAdmin, your profile badge updates immediately.

### Requesting a Password Reset Code (Self-Service)
If you need to change or verify your password authorization:
1. On your profile page, navigate to the **Account Security** card.
2. Click **Request Reset Code**.
3. Confirm your email address and submit the request.
4. This dispatches an automated `#TIK-XXXX` ticket under category `password_reset` to the SuperAdmin workbench. The SuperAdmin will verify your identity and generate a single-use authorization token.

### Editing Your Profile & Bio
1. From your profile page, click **Edit Profile** ([`/profile/edit`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/profile/edit/page.tsx)).
2. Update your **Display Name** (e.g. change *David* to *Dad* or *Uncle Dave*).
3. Add a **Bio** (e.g. *“Gardener, vintage clock collector, grandfather of 4”*).
4. Click **Save Changes**.

### Modern Portrait Studio & Avatar Upload
1. In the edit profile screen, you will find the overhauled **Living Room Portrait Studio**.
2. **Interactive Controls:**
   - Hover your mouse over the circular avatar frame to reveal the camera overlay.
   - Click either the frame, the anchored camera badge, or drag and drop an image file (JPEG, PNG, WebP up to 5MB).
3. **Instant Live Preview:**
   - The selected image is previewed instantly within the circular frame before saving.
4. **Save or Cancel:**
   - Click **Apply Portrait** to save. The file is uploaded to [`public/uploads/avatar/`](file:///C:/Users/DELL/freelancing/family-social/public/uploads/avatar/) and immediately updates the Hearth facepile, your post cards, and comments.
   - Click **Cancel Preview** to discard changes and revert to your previous avatar.

> [!NOTE]
> If you don't upload a photograph, Kinship automatically generates a high-contrast monogram circle using your initials surrounded by an aspect-locked circular ring.

---

## 10. Family Directory, Branding & Settings

Family Organizers (Admins) have full authority to personalize the family's digital identity and manage membership.

### Managing Family Information & Branding
Accessible at [`/family#settings`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/family/page.tsx) or via the **Edit Family** badge on the living room header canopy:

1. **Family Name:**
   - Change your family sanctuary title at any time (e.g. from *The Millers* to *The Miller Family Hearth*).
   - Updates across all navigation bars, page titles, and invitation headers immediately.
2. **Family Bio & Motto:**
   - Add a warm motto, guiding heritage phrase, or living room description (e.g., *"Cherishing small moments, holding close across every distance."*).
   - Displayed prominently under your family title on the canopy banner.
3. **Family Crest Emblem / Avatar:**
   - Upload a custom family crest, coat of arms, or heirloom photo (PNG, JPG, WebP up to 3MB).
   - Replaces the default monogram initial with your custom emblem on the canopy header.
4. **Canopy Banner Backdrop Image:**
   - Upload a panoramic landscape or scenic vacation photograph (up to 8MB).
   - Rendered as an atmospheric cover backdrop behind the header canopy with an intelligent gradient overlay that preserves WCAG AAA text legibility in both light and dark themes.

### Family Directory, Member Roles & Removal Requests
- Visit [`/family`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/family/page.tsx) to see every connected relative with their profile avatar, display name, and role.
- Relatives hold either:
  - **Family Admin:** Full control over invitations, branding settings, and member moderation.
  - **Family Member:** Full access to share memories, comment, react, and RSVP to gatherings.
- **Requesting Member Removal (Family Admin Only):**
  - If a relative departs or an account needs to be deactivated, Family Admins can click the **Request Removal** button next to any family member.
  - In the confirmation modal, specify the reason (e.g., *“Requested account deactivation”*).
  - Submitting raises a high-priority `#TIK-XXXX` ticket under category `member_removal` directly to the Platform SuperAdmin Console for authorized execution and permanent audit logging.

---

## 11. The Platform Superadmin Console & Ticket-Based Governance

Kinship implements a strict separation of powers between **Family Admins** (who manage their individual family sanctuary) and the **Platform Superadmin** (who exercises multi-tenant governance across the entire application).

### Understanding the Two Admin Types

| Attribute | Family Admin (Organizer) | Platform Superadmin (Root Operator) |
| :--- | :--- | :--- |
| **Scope** | Single sovereign family sanctuary | Entire Kinship multi-tenant platform |
| **Family Membership** | Member of their family (`family_members`) | **Zero family attachment** (0 memberships, 0 profiles) |
| **Interface & Route** | Living Room Hearth (`/feed`, `/family`) | Dedicated NOC Operations Console (`/admin`) |
| **Shared Layout** | Shared canopy, facepile, and family shelf | **Completely isolated** (no canopy, no family headers) |
| **Capabilities** | Family name, motto, banner, avatar, invites | Multi-family oversight, member interventions via tickets |

---

### Default Root Superadmin Credentials

For local testing and platform administration, Kinship ships with a default pre-provisioned superuser:

- **Login URL:** [`/login`](file:///C:/Users/DELL/freelancing/family-social/app/(public)/login/page.tsx)
- **Email:** `admin@kinship.local`
- **Password:** `AdminPassword123!`
- **Access Level:** Root Superadmin (`users.is_superadmin = true`)

Upon signing in, this account is automatically routed directly to [`/admin`](file:///C:/Users/DELL/freelancing/family-social/app/admin/page.tsx) without being prompted to create or join a family.

```
┌────────────────────────────────────────────────────────────────────────┐
│             KINSHIP CONSOLE // ROOT OPERATIONS (/admin)                │
├────────────────────────────────────────────────────────────────────────┤
│  [Pending Tickets: 3]  [Families: 12]  [Users: 48]  [Active Invites: 8]│
├────────────────────────────────────────────────────────────────────────┤
│  (•) TICKETS WORKBENCH   ( ) FAMILIES   ( ) USERS   ( ) INVITES LEDGER │
│                                                                        │
│  [+ LOG GOVERNANCE TICKET]     Filter: [All Statuses ▼] [All SLA ▼]    │
│                                                                        │
│  #TIK-1001  [CRITICAL SLA]  [OPEN]  MEMBER REMOVAL                     │
│  Subject: Remove Inactive Relative Account (Sarah Robinson)            │
│  Family: Robinson Hearth   Requester: organizer@kinship.local          │
│  Actions: [Execute Member Removal]  [Update Status & Note]             │
└────────────────────────────────────────────────────────────────────────┘
```

---

### Managing Members & Families Through Raised Tickets

To uphold absolute security, data integrity, and accountability, platform superadmins execute governance interventions **strictly through Raised Tickets** (`admin_tickets`):

#### 1. Member Removal Governance
- When a family organizer requests removal of an inactive or compromised account, a ticket is raised with category `member_removal`.
- The superadmin reviews the ticket and clicks **"Execute Member Removal"**.
- This performs an atomic database mutation:
  - Deletes the target user from `family_members` for that specific family.
  - Automatically marks the ticket as `RESOLVED`.
  - Appends an immutable record to `audit_logs` capturing the executor, target user, and family scope.

#### 2. Organizer Handover & Role Reassignment
- When leadership transitions occur or permissions need adjustment, tickets are filed under `organizer_handover` or `access_control`.
- The superadmin selects **"Reassign Family Role"** to promote a member to `admin` or demote an admin to `member`.

#### 3. Access Control & Superadmin Elevation
- Superadmins can inspect all platform accounts under the **Users & Roles** tab and grant or revoke root platform privileges with single-click safety guards that prevent accidental removal of the last superadmin.

#### 4. Password Reset Code Issuance
- When relatives request a password reset code from their profile, an automated ticket is filed under `password_reset`.
- The superadmin reviews the requester's identity and clicks **"Issue Reset Code"**.
- This generates a single-use verification token, automatically resolves the ticket, and logs an audit trail event.

#### 5. Custom Kin Tag Approval
- When relatives request a custom family relationship label (e.g. `Grandma`, `Uncle`, `Elder`), an automated ticket is filed under `tag_change`.
- The superadmin clicks **"Approve Tag Change"** (optionally editing or verifying the tag string).
- This updates `profiles.custom_tag` for that user within their designated family living room and marks the ticket as `RESOLVED`.

#### 6. Family Decommissioning
- Compliance or archiving requests filed under `family_deletion` allow superadmins to safely quarantine or decommission an entire family space with cascading cleanup.

#### 7. Logging New Governance Tickets
- Superadmins or system alerts can log new operational tickets at any time using the **"+ LOG GOVERNANCE TICKET"** button:
  - Select Target Family (or Platform-wide)
  - Choose Category (`password_reset`, `tag_change`, `member_removal`, `access_control`, `organizer_handover`, `family_deletion`, `general_support`)
  - Set Priority SLA (`Critical SLA`, `High`, `Medium`, `Low`)
  - Specify Requester Email, Target Entity ID, Subject, and Description.

---

### Dashboard Telemetry & Directory Tabs

1. **Tickets Workbench:** Real-time stream of all open, in-progress, and resolved governance requests with priority badges, monospace identifiers, and 1-click execution modals.
2. **Sovereign Families Directory:** Complete directory of all multi-tenant living rooms with member counts, memory counts, active invites, and quick links to raise tickets.
3. **Users & Roles Directory:** Cross-family user ledger displaying registered emails, linked families, activity telemetry (posts and comments), and Superadmin status toggles.
4. **Invites Ledger:** Complete audit of generated invitation tokens, expiration dates, claiming timestamps, and 1-click token copying.
5. **Security Audit Trail:** Immutable streaming ledger of every administrative and security event executed across the platform.

---

## 12. Theme Customization & Accessibility

Kinship respects your device preferences and offers high-contrast visual themes designed to avoid eye strain.

### Switching Light / Dark Theme
- In the bottom-right corner of every screen sits the floating **Theme Switcher** (sun/moon icon).
- Click it at any time to toggle between:
  - ☀️ **Light Mode (Warm Chalk & Zinc):** High-contrast editorial style with clean white card surfaces on `#fbfbfd` warm background.
  - 🌙 **Dark Mode (Imperial Obsidian):** Deep `#09090b` canvas with soft `#141417` card surfaces and titanium text. Pure-white glare has been eliminated to ensure late-night reading comfort.
- **Universal Admin Support:** The entire SuperAdmin Operations Console ([`/admin`](file:///C:/Users/DELL/freelancing/family-social/app/admin/page.tsx)) features paired adaptive light and dark styling—ensuring all telemetry metrics, ticket cards, and data tables remain crisp and legible in either mode.

### Generational Accessibility Features
- **High-Contrast Text:** Text adheres to WCAG AAA contrast guidelines.
- **Large Touch Targets:** Buttons and interactive pills are a minimum of 44px tall for easy tapping on tablets, iPads, and mobile phones.
- **Readable Typography:** 15px/1.65 body font size with generous line-height so elders can read effortlessly without squinting.

---

## 13. Security, Password Recovery & Safe Logout

### Forgot & Reset Password
If you or an elder relative forgets their password:
1. On the login screen ([`/login`](file:///C:/Users/DELL/freelancing/family-social/app/(public)/login/page.tsx)), click **Forgot password?**.
2. Enter the registered email address and click **Send Reset Link**.
3. Kinship generates a secure, single-use password reset token with a 1-hour expiration.
4. Follow the reset link to choose a new password and immediately sign back in.

### In-App Logout Confirmation
To prevent accidental logouts:
1. Click your avatar and select **Sign out**.
2. A custom in-app modal appears: *"Leave the Living Room?"*.
3. Click **Stay** to cancel, or click the red **Sign Out** button to securely clear your session cookies.

---

## 14. Frequently Asked Questions (FAQ)

#### Q1: Can outsiders or strangers see our family photos?
**No.** All photos, stories, and comments require an active database session bound to your specific `family_id`. There is no public URL, no search engine indexing, and zero third-party visibility.

#### Q2: What happens if an invitation link expires?
Invitations automatically expire after 7 days for security. If an aunt or cousin didn't open the link in time, any Family Organizer can go to [`/family/invites`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/family/invites/page.tsx) and click **Generate New Invite Link** to send them a fresh link.

#### Q3: Can a relative belong to more than one family sanctuary?
**Yes.** When an existing user opens an invite link for another family, Kinship welcomes them back and lets them join with 1 click. Their account is linked to both families.

#### Q4: How do I make another relative a Family Organizer?
When generating an invite in [`/family/invites`](file:///C:/Users/DELL/freelancing/family-social/app/(app)/family/invites/page.tsx), toggle the target role from **Family Member** to **Co-Organizer / Admin** before generating the link. When they accept, they will have administrative powers.

#### Q5: Where are our uploaded avatar photos stored?
Avatars are safely stored directly in your server's local storage directory at `public/uploads/avatar/` and served through the internal image proxy. They are never uploaded to public commercial cloud feeds.

#### Q6: How do I test the app from scratch?
If you want to clear test data and start over:
1. Ensure your local PostgreSQL database is running.
2. Truncate the database tables using the automated cleanup script.
3. Visit `http://localhost:3000/register` to create your founding admin account!

---

*Kinship: The Digital Living Room — Cherishing small moments, holding close across every distance.*
