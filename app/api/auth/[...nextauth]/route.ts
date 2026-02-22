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
          return { id: user.id, email: user.email };
        } finally {
          client.release();
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true;

      const client = await pool.connect();
      try {
        const existing = await client.query(`SELECT id FROM users WHERE email = $1`, [user.email]);

        if (!existing.rows.length) {
          const name = user.name?.trim() || user.email?.split("@")[0] || "New User";
          const insertResult = await client.query(
            `INSERT INTO users (email, name, avatar_url) VALUES ($1, $2, $3) RETURNING id`,
            [user.email, name, user.image ?? null]
          );
        } else {
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
          if (row) {
            token.familyId = row.family_id;
            token.role = row.role;
          }
        } finally {
          client.release();
        }
      }

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.userId;
      session.user.familyId = token.familyId;
      session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };