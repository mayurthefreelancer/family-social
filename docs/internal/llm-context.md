# LLM CONTINUATION CONTEXT – FAMILY SOCIAL MVP (PHASE 1)

This document captures **full technical and product context** so an LLM can continue work in a new session **without any context loss**.

---

## 🧠 Project Overview

A **private, invite-only social media app for families**, built with **Next.js App Router**, **PostgreSQL**, and **Bun**.

Architecture is **server-first**, avoiding API routes and client-side data access.

---

## 🏗️ Tech Stack (Locked-In Decisions)

* Next.js App Router (latest)
* Bun runtime + package manager
* PostgreSQL (local + prod)
* pg (node-postgres) for DB access
* Drizzle ORM **only for migrations/schema**
* iron-session for encrypted cookie sessions

---

## 🧱 Core Architectural Rules

1. Server Components for data reads
2. Server Actions for all writes
3. No API routes
4. No client-side DB access
5. All queries must be scoped by `family_id`
6. Middleware = coarse auth guard only
7. Fine-grained authorization enforced server-side

---

## 🔐 Authentication System

* Custom email/password auth
* Password hashing via bcrypt
* Session stored in HTTP-only encrypted cookie
* `requireUser()` helper used everywhere
* Logout implemented via server action

Middleware:

* Blocks unauthenticated users from protected routes
* Redirects logged-in users away from `/login` and `/register`

---

## 👪 Family Model

Tables:

* families
* family_members (user_id, family_id, role)

Rules:

* One family per user (MVP constraint)
* Creator is admin
* Roles: admin, member

---

## ✉️ Invite System (Critical Context)

* Invites stored in `invites` table
* Secure random token (hex)
* Token → family_id mapping
* Expiration enforced
* Single-use

Invite handling logic:

* Handled **server-side in invite page**, not middleware
* Logged-in reuse is idempotent
* Different-family reuse is blocked

Admin features:

* Generate invite
* List active invites
* Revoke invite

---

## 📰 Feed / Posts / Comments

* Feed is family-scoped and server-rendered
* Posts and comments created via server actions
* Feed revalidated using `revalidatePath`
* No optimistic UI yet

---

## 🧾 Audit Logging

Table: `audit_logs`

Logged events:

* invite_created
* invite_revoked
* member_joined

Design:

* Append-only
* Server-side only
* Includes metadata JSON
* Family-scoped

Helper:

* `logAuditEvent()` centralizes all writes

---

## 🗄️ Database & Migrations

* Schema defined in `db/schema.ts`
* Migrations generated via `drizzle-kit`
* Existing DB schema reconciled carefully (no data loss)
* `.env` used for migration tooling
* `.env.local` used for Next.js

---

## ⚠️ Known Constraints / Intentional Omissions

* Single family per user
* No email sending yet
* No audit log UI
* No optimistic UI
* Minimal styling

---

## 🧭 Recommended Next Steps (Priority Order)

1. Audit log UI (admin-only)
2. Loading & disabled submit states
3. Optimistic UI for comments
4. Email-based invite sending
5. Multi-family support
6. Role & permissions expansion

---

## 🛑 Important Gotchas (Learned Lessons)

* Never call `pool.end()` in app code
* `params` and `searchParams` are Promises
* Middleware must stay lightweight
* Drizzle schema must match DB exactly
* Data-loss warnings must be resolved intentionally

---

## 🎯 Overall State

Phase 1 MVP is **complete, secure, and production-ready for early usage**.

The codebase is clean, conservative, and extensible.

This document should be loaded as **context memory** for any future LLM session.
