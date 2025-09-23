import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

type UserRole = 'OWNER' | 'EMPLOYEE' | 'SUPERADMIN'; 
type SubscriptionStatus = 'FREE' | 'PREMIUM';

declare module "next-auth" {
  interface User {
    accessToken?: string;
    avatarUrl?: string | null;
    company?: {
      id: string;
      name: string;
      logoUrl?: string | null;
      subscriptionStatus?: SubscriptionStatus;
    } | null;
    role?: UserRole;
    companyId?: string | null;
    companyName?: string | null;
    logoUrl?: string | null; 
    subscriptionStatus?: SubscriptionStatus;
  }

  interface Session {
    user: {
      id?: string;
      role?: UserRole;
      companyId?: string | null;
      companyName?: string | null;
      logoUrl?: string | null; 
      subscriptionStatus?: SubscriptionStatus;
    } & DefaultSession["user"];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
    companyId?: string | null;
    companyName?: string | null;
    logoUrl?: string | null;
    subscriptionStatus?: SubscriptionStatus;
    accessToken?: string;
  }
}