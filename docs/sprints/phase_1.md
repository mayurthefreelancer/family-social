# Family Social – Phase 1 MVP

A **private, invite-only social network for families**, built with **Next.js App Router**, **PostgreSQL**, **Bun**, and **server-first architecture**.

This document describes **everything implemented in Phase 1 (MVP)**, the architectural decisions behind it, and how to run the project locally.

---

## 🎯 MVP Goals

Phase 1 focuses on building a **secure, closed, family-scoped social platform** with production-grade foundations.

### What Phase 1 Delivers

* Email + password authentication
* Session-based auth (HTTP-only cookies)
* Invite-only family join flow
* Family isolation (no data leakage)
* Family feed (server-rendered)
* Create posts
* Comment on posts
* Admin-controlled invite lifecycle
* Audit logging for critical actions
* Database migrations
* Middleware-based route protection

---

## 🧱 Tech Stack

* **Framework:** Next.js (App Router)
* **Runtime / Package Manager:** Bun
* **Database:** PostgreSQL
* **DB Driver:** pg
* **Migrations:** Drizzle Kit (schema + migrations only)
* **Sessions:** iron-session
* **Auth:** Custom email/password

---

## 🗂️ High-Level Architecture

```
Client (Browser)
   ↓
Next.js Server Components
   ↓
Server Actions (writes)
   ↓
PostgreSQL
```

### Architectural Principles

* Server Components for reads
* Server Actions for writes
* No API routes
* No client-side DB access
* All data scoped by `family_id`
* Defense-in-depth (middleware + server guards)

---

## 🔐 Authentication

### Features

* Email + password login
* Password hashing using bcrypt
* Encrypted session cookies (iron-session)
* Logout support
* Protected routes via middleware

### Auth Flow

1. User registers or logs in
2. Session cookie is created
3. Middleware guards protected routes
4. Server actions validate session on every write

---

## 👪 Families & Membership

### Family Model

* One family per user (MVP constraint)
* Family creator becomes admin
* Membership tracked in `family_members`

### Roles

* `admin`
* `member`

---

## ✉️ Invite-Only Join System

### Invite Lifecycle

* Admin generates invite
* Secure random token
* Token mapped to a family
* Token has expiration
* Token is single-use

### Behavior Rules

* Logged-out users → can register via invite
* Logged-in users:

  * Same family → redirected to feed
  * Different family → blocked
* Invite deleted after use

### Admin Controls

* List active invites
* See expiration
* Revoke invites

---

## 📰 Feed, Posts & Comments

### Feed

* Server-rendered
* Family-scoped
* Ordered by creation time

### Posts

* Text posts (image support reserved)
* Created via server actions

### Comments

* Comment per post
* Server-rendered list
* Server action for creation

### Revalidation

* Feed revalidates after post/comment creation

---

## 🛡️ Middleware & Route Protection

### Middleware Responsibilities

* Block unauthenticated access to protected routes
* Prevent logged-in users from visiting auth pages

### Protected Routes

* `/feed/*`
* `/create-family`
* `/family/*`

Invite routes are **handled server-side**, not in middleware.

---

## 🧾 Audit Logging

### Purpose

Track **who did what and when** for security and traceability.

### Logged Events

* Invite created
* Invite revoked
* Member joined family

### Audit Log Design

* Append-only
* Server-side only
* JSON metadata support
* Family-scoped

---

## 🗄️ Database & Migrations

### Schema Management

* Managed via Drizzle migrations
* Schema defined in `db/schema.ts`
* Migrations generated automatically

### Tables

* users
* families
* family_members
* posts
* comments
* invites
* audit_logs

### Migration Commands

```bash
bun run db:generate
bun run db:migrate
```

---

## 🧪 Local Development Setup

### Prerequisites

* Bun
* PostgreSQL

### Environment Variables

`.env`

```
DATABASE_URL=postgresql://user:password@localhost:5432/family_social
```

`.env.local`

```
DATABASE_URL=postgresql://user:password@localhost:5432/family_social
SESSION_SECRET=<64+ char random string>
```

### Run

```bash
bun install
bun dev
```

---

## 🚦 Current MVP Limitations (Intentional)

* Single family per user
* No image uploads yet
* No optimistic UI
* No email sending
* Minimal UI styling

---

## 🧭 Next Planned Phases

* Loading & optimistic UI
* Email-based invites
* Audit log UI
* Multi-family support
* Image uploads
* Role-based permissions

---

## ✅ Phase 1 Status

**Phase 1 MVP is COMPLETE and production-safe for early users.**

This codebase is intentionally conservative, secure, and extensible.
