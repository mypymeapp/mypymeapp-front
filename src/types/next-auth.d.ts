import NextAuth, { DefaultSession, User } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    accessToken?: string;
    company?: {
      id: string;
      name: string;
    } | null;
    role?: string;
    companyId?: string | null;
    companyName?: string | null;
    logoUrl?: string | null; // <-- LA PROPIEDAD QUE FALTABA
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
      companyId?: string | null;
      companyName?: string | null;
      logoUrl?: string | null; // <-- LA PROPIEDAD QUE FALTABA
    } & DefaultSession["user"];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    companyId?: string | null;
    companyName?: string | null;
    accessToken?: string;
    logoUrl?: string | null; // <-- LA PROPIEDAD QUE FALTABA
  }
}