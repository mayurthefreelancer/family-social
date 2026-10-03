import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      familyId?: string | null;
      role?: string | null;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      isSuperadmin?: boolean;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    familyId?: string | null;
    role?: string | null;
    isSuperadmin?: boolean;
    accessToken?: string;
  }
}
