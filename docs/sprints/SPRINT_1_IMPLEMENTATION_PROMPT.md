# 🚀 Kinship: Sprint 1 Master Implementation Prompt for Autonomous LLM

> **Target Sprint:** Sprint 1 — Mobile Shell & Photo Core  
> **Status:** Ready for Autonomous Execution  
> **Platform Version Target:** `2.5.0`  
> **Target Scope:**  
> 1. Proposal 4: Mobile-First Progressive Web App (PWA) & Native Living Room Shell  
> 2. Proposal 1: Rich Multi-Photo Sharing & Mosaic Lightbox Gallery Engine  
> 3. Proposal 8: Privacy-First Client-Side EXIF Metadata Sanitizer  

---

```markdown
# 🤖 TASK: Implement Sprint 1 (Mobile Shell & Photo Core) for Kinship

You are tasked with implementing **Sprint 1: Mobile Shell & Photo Core** for **Kinship: The Digital Living Room** (`family-social`).

## ⚠️ MANDATORY USER CONSTRAINTS & BEHAVIORAL RULES
1. **Token Naming Convention:** Always use `accessToken` (never generic `token`) when handling authentication tokens, session tokens, or JWT callbacks.
2. **No Test Execution or Modifications:** Do NOT run, modify, or propose any test files until explicitly asked by the user.
3. **Zero Shell Commands:** Do NOT execute shell commands like `npm install`, `npm run dev`, or database pushes. Instead, provide clear instructions for the USER to execute them in their terminal.
4. **Clickable Links:** You MUST create clickable markdown links using the `file:///` scheme with forward slashes for all referenced files and code symbols (e.g. [`db/schema.ts`](file:///C:/Users/DELL/freelancing/Work/family-social/db/schema.ts)).
5. **No Dead Links:** Do not link to `/prototype` from the application. `/prototype` is a dark link accessible only by direct URL entry.
6. **Multi-Tenant Isolation:** Every single database query, insert, and update MUST strictly enforce and scope by `family_id`.

---

## 🎯 Sprint 1 Objectives

1. **Client-Side EXIF Metadata Sanitizer:** Scrub geolocation (GPS) coordinates and camera serial numbers from user photos in the browser before upload to protect family home privacy.
2. **Mobile-First PWA Shell & Bottom Navigation:** Deliver a native app-like experience on mobile with a Web App Manifest (`manifest.json`), viewport safe areas, and a fixed bottom navigation bar (`🏠 बैठक`, `🌳 वंशावळ`, `✈️ सहल`, `👤 प्रोफाइल`).
3. **Rich Multi-Photo Sharing & Mosaic Grid:** Support uploading up to 6 photos per memory post, rendered in an adaptive editorial mosaic grid (1 hero, 50/50 split, 3-photo layout, 4+ grid with `+N` badge) with a fullscreen touch lightbox viewer.

---

## 📁 File-by-File Implementation Plan

### Step 1: Client-Side EXIF Metadata Sanitizer
* **Create File:** `app/lib/exif-sanitizer.ts`
* **Purpose:** Canvas 2D client-side binary sanitizer that strips GPS and camera metadata before upload.
* **Specification:**
```typescript
/**
 * Strips EXIF metadata (GPS coordinates, camera serials) from image files
 * by redrawing onto an HTML5 Canvas and exporting as modern WebP/JPEG blob.
 */
export async function sanitizeImage(file: File, maxDimension = 2000, quality = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 2D context unavailable"));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Image sanitization failed"))),
        "image/webp",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for sanitization"));
    };
    img.src = url;
  });
}
```

---

### Step 2: Progressive Web App Manifest & Mobile Viewport
* **Create File:** `public/manifest.json`
* **Specification:**
```json
{
  "name": "Kinship: The Digital Living Room",
  "short_name": "Kinship",
  "description": "Private, sovereign family sanctuary for intimate memories and gatherings.",
  "start_url": "/feed",
  "display": "standalone",
  "background_color": "#09090b",
  "theme_color": "#09090b",
  "icons": [
    {
      "src": "/favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ]
}
```
* **Edit File:** [`app/layout.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/layout.tsx)
* **Instructions:**
  - Update `metadata` export to include `manifest: "/manifest.json"`, `appleWebApp: { capable: true, statusBarStyle: "default", title: "Kinship" }`.
  - Add viewport configuration: `viewport-fit=cover` to support notch and iOS home indicator.

---

### Step 3: Fixed Mobile Bottom Navigation Bar
* **Create File:** `app/components/navigation/MobileBottomNav.tsx`
* **Component Specification:**
  - Client component (`"use client"`).
  - Visible only on mobile screens (`block lg:hidden`), anchored to bottom: `fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)]`.
  - Four navigation items with active highlight:
    1. `बैठक (Feed)`: Links to `/feed`, icon `Layers`.
    2. `वंशावळ (Tree)`: Links to `/family`, icon `GitFork`.
    3. `सहल व नियोजन (Events)`: Links to `/feed#trips`, icon `Calendar`.
    4. `माझं प्रोफाइल (Profile)`: Links to `/profile`, icon `User`.
* **Edit File:** [`app/(app)/layout.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/(app)/layout.tsx)
  - Mount `<MobileBottomNav />` inside the authenticated living room layout.
  - Add `pb-20 lg:pb-0` to the main container so content doesn't get hidden behind the bottom bar.

---

### Step 4: Relational Multi-Photo Database Schema
* **Edit File:** [`db/schema.ts`](file:///C:/Users/DELL/freelancing/Work/family-social/db/schema.ts)
* **Add Table:** `post_photos`
```typescript
/* ================= POST PHOTOS (MULTI-IMAGE MOSAIC) ================= */
export const postPhotos = pgTable("post_photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  familyId: uuid("family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  caption: text("caption"),
  sortOrder: integer("sort_order").default(0).notNull(),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```
* **Migration SQL:** Create `db/migrations/0015_post_photos.sql`:
```sql
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
```
* **User Instruction:** Note in final output for user: run `npx drizzle-kit push` or execute SQL migration.

---

### Step 5: Multi-Photo Storage & Server Action Pipeline
* **Create File:** `app/lib/post-photo-storage.ts`
  - Function `savePostPhoto(familyId: string, postId: string, file: File, index: number)`:
  - Writes to `public/uploads/posts/[familyId]/[postId]_[index]_[uuid].webp`.
  - Returns public URL `/uploads/posts/[familyId]/[postId]_[index]_[uuid].webp`.
* **Edit File:** [`app/actions/post.ts`](file:///C:/Users/DELL/freelancing/Work/family-social/app/actions/post.ts)
  - Update `createPost(formData: FormData)`:
    - Extracts `files = formData.getAll("photos") as File[]`.
    - Inserts `posts` record first inside transaction.
    - Saves each photo file via `savePostPhoto`.
    - Inserts each record into `post_photos` with incremental `sortOrder`.
    - Returns `{ success: true, postId }` and calls `revalidatePath("/feed")`.
* **Edit File:** [`app/lib/feed.ts`](file:///C:/Users/DELL/freelancing/Work/family-social/app/lib/feed.ts)
  - Update post query to fetch associated photos from `post_photos` ordered by `sort_order ASC` and attach as `post.photos: { id, url, caption }[]`.

---

### Step 6: Multi-Photo Composer with Client-Side Sanitization
* **Edit File:** [`app/components/feed/HearthComposer.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/components/feed/HearthComposer.tsx)
* **Capabilities:**
  - File input allows `multiple` and accepts `image/*`.
  - When photos are selected, each photo is processed through `sanitizeImage(file)`.
  - Displays a responsive thumbnail strip of selected photos with a small `✕` remove button on each thumbnail.
  - Limits selection to a maximum of 6 photos per post.
  - Submits `photos` to `createPost` Server Action using `FormData`.

---

### Step 7: Adaptive Photo Mosaic Grid Component
* **Create File:** `app/components/feed/PhotoMosaicGrid.tsx`
* **Specification:**
  - Client component (`"use client"`).
  - Takes `photos: { id: string; url: string; caption?: string }[]`.
  - Layout behavior:
    - **1 Photo:** Full width, `max-h-[460px]`, `rounded-2xl`, object cover.
    - **2 Photos:** Two equal columns (`grid grid-cols-2 gap-2 h-72`), `rounded-2xl`.
    - **3 Photos:** Split layout: Left column spans 1 hero image; right column contains 2 stacked images (`grid grid-cols-2 gap-2 h-80`).
    - **4+ Photos:** 2x2 grid (`grid grid-cols-2 gap-2 h-80`). If more than 4 photos exist, the 4th cell shows an overlay badge: `+{photos.length - 3} अधिक फोटो` (or `+{photos.length - 3} more`).
  - Clicking any image triggers `onPhotoClick(index)` to launch the Fullscreen Touch Lightbox.

---

### Step 8: Fullscreen Touch Lightbox Viewer
* **Create File:** `app/components/feed/PhotoLightboxModal.tsx`
* **Specification:**
  - Renders via React Portal (`createPortal`) mounting to `document.body` with `z-[100]`.
  - Fullscreen dark backdrop (`bg-black/95`).
  - Left / Right chevron buttons on desktop, touch swipe detection on mobile (`onTouchStart`, `onTouchMove`, `onTouchEnd`).
  - Top bar with photo index indicator (`२ / ४`) and close button (`X`).
  - Double-tap or pinch-to-zoom support for examining fine family details.
  - Keyboard listeners for `Escape`, `ArrowLeft`, `ArrowRight`.

---

### Step 9: PostCard Integration & Verification
* **Edit File:** [`app/components/feed/PostCard.tsx`](file:///C:/Users/DELL/freelancing/Work/family-social/app/components/feed/PostCard.tsx)
  - Replace single `<img src={post.imageUrl} />` with `<PhotoMosaicGrid photos={post.photos || (post.imageUrl ? [{ id: '1', url: post.imageUrl }] : [])} />`.
  - Maintain the existing Heart reaction toggle and comment thread below the mosaic.

---

## ✅ Acceptance Criteria & Verification

1. **EXIF Privacy:** Photo uploads are verified to strip EXIF GPS metadata client-side before transmission.
2. **Multi-Photo Layout:** Uploading 1, 2, 3, or 4+ images renders the adaptive mosaic correctly without layout breakage or overflow.
3. **Mobile Lightbox:** Clicking any photo opens the fullscreen viewer with navigation between multiple photos.
4. **Mobile Navigation:** On viewport `< 1024px`, the bottom navigation bar appears, stays fixed above iOS safe areas, and provides clean switching.
5. **No Dead Links:** Verify zero occurrences of `/prototype` links across all modified components.
6. **Token Integrity:** All authentication and session handling preserves `accessToken`.
```

---

## 🛠️ Post-Sprint 1 Verification Script for User

Instruct the user to run the following in their PowerShell terminal after implementation:

```powershell
# 1. Apply database schema changes for multi-photo support
npx drizzle-kit push

# 2. Start development server
npm run dev
```
