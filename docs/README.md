# 📚 Kinship Documentation Hub & Navigation Map

Welcome to the central documentation hub for **Kinship: The Digital Living Room**. This directory is structured into functional categories to help engineers, product managers, and autonomous agents navigate the codebase with clarity and confidence.

---

## 🗂️ Documentation Taxonomy

```
docs/
├── architecture/          # System design, data models, components & deep-dives
│   ├── documentation.md
│   ├── COMPONENTS.md
│   ├── FAMILY_ONBOARDING_AND_ADMIN_ANALYSIS.md
│   └── VERCEL_DATABASE_MIGRATION_GUIDE.md
├── product/               # Product specifications, feature roadmaps & proposals
│   ├── DELIVERED_AND_PROPOSED_FEATURES.md
│   └── REVAMP_PROPOSAL.md
├── sprints/               # Sprint execution prompts, implementation guides & histories
│   ├── SPRINT_1_IMPLEMENTATION_PROMPT.md
│   ├── SPRINT_2_ROADMAP_AND_PROMPT.md
│   └── phase_1.md
├── user-guides/           # Operational handbooks, admin guides & user documentation
│   └── USER_HANDBOOK.md
├── audits/                # Bugfix reports, hydration audits & QA tracking
│   └── BUGFIX_AUDIT.md
└── internal/              # Agent continuation prompts & developer context
    └── llm-context.md
```

---

## 📑 Directory Index & Quick References

### 1. 🏛️ Architecture & System Design (`docs/architecture/`)
Deep technical specifications, relational database schemas, component trees, and system invariants.
- **[System Architecture & Documentation](architecture/documentation.md):** The core architectural guide for Kinship (v2.5.0), containing multi-tenant relational data models (Drizzle/PostgreSQL), session security (`accessToken` JWT strategy), ticket-based platform governance, and comprehensive version changelogs.
- **[Component Architecture & Dependency Diagrams](architecture/COMPONENTS.md):** Mermaid dependency trees, parent-child component hierarchy, and functional descriptions for auth, feed, photo grids, lightboxes, and profiles.
- **[Family Onboarding & Admin Analysis](architecture/FAMILY_ONBOARDING_AND_ADMIN_ANALYSIS.md):** Deep-dive technical analysis of multi-tenant onboarding flows, session concurrency locking, cryptographic invite acceptance, and error state mitigations.
- **[Vercel Production Database Migration Guide](architecture/VERCEL_DATABASE_MIGRATION_GUIDE.md):** Step-by-step procedures for deploying PostgreSQL schema changes (Sprint 1: `post_photos`, `is_edited`, `updated_at`) to cloud databases (Supabase, Neon, Vercel Postgres) without SSH access.

### 2. 💡 Product Specifications & Roadmaps (`docs/product/`)
Functional scope, feature matrices, living roadmaps, and architectural blueprints.
- **[Delivered Functionalities & Proposed Features Specification](product/DELIVERED_AND_PROPOSED_FEATURES.md):** The living Single Source of Truth (SSOT). Tracks delivered features (v1.0.0 – v2.5.0), functionality traceability matrix, shelved/discarded items (Google OAuth, potluck), and amended multi-sprint proposals.
- **[Kinship Living Room Revamp Proposal](product/REVAMP_PROPOSAL.md):** The original design manifesto and UX vision that re-imagined Kinship from a generic feed into an intimate, high-contrast, generational digital hearth.

### 3. 🏃 Sprints & Autonomous Implementation Prompts (`docs/sprints/`)
Step-by-step implementation playbooks and master instructions for engineering execution.
- **[Sprint 1 Master Implementation Prompt](sprints/SPRINT_1_IMPLEMENTATION_PROMPT.md):** Autonomous LLM execution guide for Sprint 1 ("Mobile Shell & Photo Core"), delivering PWA shell, EXIF canvas sanitizer, multi-photo mosaic grid, touch lightbox, and English localization.
- **[Sprint 2 Roadmap & Implementation Prompt](sprints/SPRINT_2_ROADMAP_AND_PROMPT.md):** Execution roadmap and master prompt for Sprint 2 ("Frictionless Auth, Lineage Tree & Celebrations"), delivering 6-digit PIN login, QR device pairing, interactive family tree builder, and celebration greeting cards.
- **[Phase 1 MVP Architecture](sprints/phase_1.md):** Historical milestone record and initial MVP specifications.

### 4. 📖 User Guides & Operations Manuals (`docs/user-guides/`)
Customer-facing documentation, admin guides, and step-by-step user instructions.
- **[User Handbook & Operations Manual](user-guides/USER_HANDBOOK.md):** Illustrated guide for family members and founding organizers. Covers signup, creating a family, generating invite tokens, uploading custom family crests/canopy banners, filing member tickets, and viewing family memories.

### 5. 🛡️ Audits & Reliability Reports (`docs/audits/`)
Quality assurance records, bug fixes, theme contrast audits, and hydration diagnostics.
- **[UI & Hydration Sanity Audit Report](audits/BUGFIX_AUDIT.md):** Diagnostic review resolving React 19 / Next.js 16 SSR hydration mismatches, monochrome theme contrast tokens, button circularity clipping, and responsive viewport padding.

### 6. 🤖 Internal & Agent Context (`docs/internal/`)
Context preservation for developer tooling and autonomous agent continuation.
- **[LLM Technical Continuation Context](internal/llm-context.md):** Context prompt containing key conventions (e.g. `accessToken` naming, multi-tenant isolation rules, test avoidance guidelines).

---

## 🔒 Architectural Rules for Contributors

1. **Multi-Tenant Isolation:** All database transactions and queries must strictly scope to `family_id`.
2. **Session Naming:** Always use `accessToken` for JWT authentication tokens.
3. **Generational Accessibility:** Minimum 44px (preferably 48px–56px) touch targets, high WCAG contrast, and zero external third-party tracking.
4. **Zero Paid Dependencies:** Camera scanning, image optimization, and animations must rely on standard browser APIs or zero-cost libraries.
