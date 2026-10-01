import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

/* ================= USERS ================= */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= FAMILIES ================= */

export const families = pgTable("families", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= FAMILY MEMBERS ================= */

export const familyMembers = pgTable(
  "family_members",
  {
    userId: uuid("user_id").notNull(),
    familyId: uuid("family_id").notNull(),
    role: text("role").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.familyId] }),
  })
);

/* ================= POSTS ================= */

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id").references(() => families.id),
  userId: uuid("user_id").references(() => users.id),
  content: text("content"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ================= COMMENTS ================= */

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey(),
  postId: uuid("post_id").notNull(),
  userId: uuid("user_id").notNull(),
  familyId: uuid("family_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= INVITES ================= */

export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyId: uuid("family_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdBy: uuid("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================= AUDIT LOGS ================= */

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),

  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id),

  actorUserId: uuid("actor_user_id")
    .references(() => users.id),

  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),

  metadata: jsonb("metadata"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ================= POST LIKES ================= //
export const postLikes = pgTable(
  "post_likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id").notNull(),
    userId: uuid("user_id").notNull(),
    familyId: uuid("family_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    postUserUnique: unique("post_likes_post_user_uniq").on(
      table.postId,
      table.userId
    ),
  })
);

// ================= PROFILES ================= //
export const profiles = pgTable("profiles", {
  user_id: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),

  family_id: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),

  display_name: text("display_name").notNull(),
  email: text("email").notNull(),
  username: text("username"), // optional, family-unique later
  bio: text("bio"),
  avatar_url: text("avatar_url"),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// ================= PASSWORD RESET TOKENS ================= //
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  family_id: uuid("family_id").references(() => families.id),
  userId: uuid("user_id").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/* ========================================================================= */
/*                   KINSHIP REVAMP SCHEMAS (PHASE 0)                        */
/* ========================================================================= */

// ================= 1. CELEBRATIONS & MILESTONES ================= //
export const celebrations = pgTable("celebrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id), // Celebrant relative (optional)
  title: text("title").notNull(),
  celebrationType: text("celebration_type").notNull(), // 'birthday', 'anniversary', 'milestone'
  eventDate: timestamp("event_date").notNull(),
  note: text("note"),
  isRecurringYearly: boolean("is_recurring_yearly").default(false).notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ================= 2. CELEBRATION MESSAGES (DIGITAL CARDS) ================= //
export const celebrationMessages = pgTable("celebration_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  celebrationId: uuid("celebration_id")
    .notNull()
    .references(() => celebrations.id, { onDelete: "cascade" }),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ================= 3. GATHERINGS & REUNIONS ================= //
export const gatherings = pgTable("gatherings", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ================= 4. GATHERING RSVPS ================= //
export const gatheringRsvps = pgTable(
  "gathering_rsvps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    gatheringId: uuid("gathering_id")
      .notNull()
      .references(() => gatherings.id, { onDelete: "cascade" }),
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    status: text("status").notNull(), // 'going', 'declined', 'tentative'
    guestCount: integer("guest_count").default(1).notNull(),
    note: text("note"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    gatheringUserUnique: unique("gathering_user_unique").on(
      table.gatheringId,
      table.userId
    ),
  })
);

// ================= 5. GATHERING POTLUCK ITEMS ================= //
export const gatheringPotluckItems = pgTable("gathering_potluck_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  gatheringId: uuid("gathering_id")
    .notNull()
    .references(() => gatherings.id, { onDelete: "cascade" }),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  assignedUserId: uuid("assigned_user_id").references(() => users.id),
  isClaimed: boolean("is_claimed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ================= 6. GENERATIONAL FAMILY TREE NODES ================= //
export const familyTreeNodes = pgTable("family_tree_nodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id), // If relative has an account
  fullName: text("full_name").notNull(),
  relationLabel: text("relation_label").notNull(), // 'Grandmother', 'Mother', 'Son'
  generationTier: integer("generation_tier").notNull(), // 1 = Grandparents, 2 = Parents, 3 = Children
  birthYear: text("birth_year"),
  deathYear: text("death_year"),
  isDeceased: boolean("is_deceased").default(false).notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  parent1Id: uuid("parent1_id"),
  parent2Id: uuid("parent2_id"),
  spouseId: uuid("spouse_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ================= 7. MEDIA ASSETS (PHOTOS, AUDIO STORIES, VIDEOS) ================= //
export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  familyId: uuid("family_id")
    .notNull()
    .references(() => families.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  mediaType: text("media_type").notNull(), // 'photo', 'audio', 'video'
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  durationSeconds: integer("duration_seconds"),
  caption: text("caption"),
  isExifScrubbed: boolean("is_exif_scrubbed").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ================= 8. EXTENDED POST REACTIONS ================= //
export const postReactions = pgTable(
  "post_reactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    reactionType: text("reaction_type").notNull(), // 'love', 'laugh', 'proud', 'hug', 'recipe'
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    postUserReactionUnique: unique("post_user_reaction_unique").on(
      table.postId,
      table.userId,
      table.reactionType
    ),
  })
);
