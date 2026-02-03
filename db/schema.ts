import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

/* ================= USERS ================= */

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
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
    userId: uuid("user_id").references(() => users.id),
    familyId: uuid("family_id").references(() => families.id),
    role: text("role").notNull(),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.familyId),
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
