import NextAuth, { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "@/app/lib/db";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" as const },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.toString().toLowerCase().trim();
        const client = await pool.connect();
        try {
          const result = await client.query(
            `SELECT id, email, password_hash FROM users WHERE email = $1`,
            [email]
          );
          if (!result.rows.length) return null;
          const user = result.rows[0];
          if (!user.password_hash) return null;
          const valid = await bcrypt.compare(credentials.password.toString(), user.password_hash);
          if (!valid) return null;
          console.log("[authorize] returning user id:", user.id);
          return { id: user.id, email: user.email };
        } finally {
          client.release();
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      console.log("[signIn] provider:", account?.provider, "user.email:", user.email);
      if (account?.provider === "credentials") return true;

      const client = await pool.connect();
      try {
        const existing = await client.query(`SELECT id FROM users WHERE email = $1`, [user.email]);
        console.log("[signIn] existing user rows:", existing.rows.length);

        if (!existing.rows.length) {
          const name = user.name?.trim() || user.email?.split("@")[0] || "New User";
          const insertResult = await client.query(
            `INSERT INTO users (email, name, avatar_url) VALUES ($1, $2, $3) RETURNING id`,
            [user.email, name, user.image ?? null]
          );
          console.log("[signIn] inserted new user, DB id:", insertResult.rows[0]?.id);
        } else {
          console.log("[signIn] existing user DB id:", existing.rows[0]?.id);
        }
        return true;
      } catch (err) {
        console.error("[signIn] ERROR:", err);
        return false;
      } finally {
        client.release();
      }
    },

    async jwt({ token, user, trigger }) {
      console.log("[jwt] trigger:", trigger, "has user:", !!user, "token.userId:", token.userId);

      if (user) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            `SELECT u.id, u.email, fm.family_id, fm.role
             FROM users u
             LEFT JOIN family_members fm ON fm.user_id = u.id
             WHERE u.email = $1`,
            [user.email]
          );
          const row = result.rows[0];
          console.log("[jwt] DB lookup by email:", user.email, "→ row:", row ? { id: row.id, family_id: row.family_id } : "NOT FOUND");
          if (row) {
            token.userId = row.id;
            token.email = row.email;
            token.familyId = row.family_id ?? null;
            token.role = row.role ?? null;
          }
        } finally {
          client.release();
        }
      } else if (trigger === "update" && token.userId) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            `SELECT fm.family_id, fm.role FROM family_members fm WHERE fm.user_id = $1`,
            [token.userId]
          );
          const row = result.rows[0];
          console.log("[jwt:update] userId:", token.userId, "→ family_id:", row?.family_id ?? "NOT FOUND");
          if (row) {
            token.familyId = row.family_id;
            token.role = row.role;
          }
        } finally {
          client.release();
        }
      }

      console.log("[jwt] returning token.userId:", token.userId, "token.familyId:", token.familyId);
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.userId;
      session.user.familyId = token.familyId;
      session.user.role = token.role;
      console.log("[session] session.user.id:", session.user.id, "familyId:", session.user.familyId);
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };