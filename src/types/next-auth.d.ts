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
  }
  
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

declare module "next-auth/jwt" {
 
  interface JWT {
    id?: string;
    role?: string;
    companyId?: string | null;
    companyName?: string | null;
    accessToken?: string;
  }
}