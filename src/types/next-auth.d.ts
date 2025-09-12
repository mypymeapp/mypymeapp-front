import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    companyId?: string | null;
    companyName?: string | null;
    accessToken?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      companyId?: string | null;
      companyName?: string | null;
    } & DefaultSession["user"];
    accessToken?: string;
  }
}