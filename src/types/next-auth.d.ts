import { DefaultSession } from "next-auth"

type UserRole = 'OWNER' | 'EMPLOYEE' | 'SUPERADMIN'; 
type AdminRole = 'SUPER_ADMIN' | 'MANAGER' | 'SUPPORT';
type AdminDepartment = 'TECNICO' | 'VENTAS' | 'FINANZAS' | 'MARKETING' | 'ADMINISTRATIVO';
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
    // Campos de admin
    isAdmin?: boolean;
    adminRole?: AdminRole | null;
    adminDepartment?: AdminDepartment | null;
  }

  interface Session {
    user: {
      id?: string;
      role?: UserRole;
      companyId?: string | null;
      companyName?: string | null;
      logoUrl?: string | null; 
      subscriptionStatus?: SubscriptionStatus;
      // Campos de admin
      isAdmin?: boolean;
      adminRole?: AdminRole | null;
      adminDepartment?: AdminDepartment | null;
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
    // Campos de admin
    isAdmin?: boolean;
    adminRole?: AdminRole | null;
    adminDepartment?: AdminDepartment | null;
  }
}