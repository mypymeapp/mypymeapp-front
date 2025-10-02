/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { 
        backendResponse: { type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.backendResponse) {
          return null;
        }
        try {
          const { token, user } = JSON.parse(credentials.backendResponse);
          if (token && user) {
            return { ...user, accessToken: token };
          }
          return null;
        } catch (error) {
          console.error("Error al autorizar credenciales:", error);
          return null;
        }
      },
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
  },
  jwt: {
    maxAge: 8 * 60 * 60, // 8 horas
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: user.name, email: user.email, avatarUrl: user.image }),
          });
          if (!res.ok) return false;

          const backendData = await res.json();
          
          user.accessToken = backendData.token;
          user.id = backendData.user.id;
          user.role = backendData.user.role;
          user.company = backendData.user.company;
          user.image = backendData.user.avatarUrl;
          // Datos de admin
          (user as any).isAdmin = backendData.user.isAdmin || false;
          (user as any).adminRole = backendData.user.adminRole || null;
          (user as any).adminDepartment = backendData.user.adminDepartment || null;
          
          // Guardar en user para usar en redirect callback
          (user as any).shouldRedirectToAdmin = backendData.user.isAdmin;
          
          return true;
        } catch (error) { 
          console.error("Error en signIn de Google:", error);
          return false; 
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Si la URL ya tiene un destino específico, usarlo
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      
      // Por defecto, redirigir al dashboard de pymes
      return `${baseUrl}/pymes`;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl || user.image,
          role: user.role,
          accessToken: user.accessToken,
          companyId: user.company?.id || null,
          companyName: user.company?.name || null,
          logoUrl: user.company?.logoUrl || null,
          subscriptionStatus: user.company?.subscriptionStatus || 'FREE',
          // Datos de admin
          isAdmin: (user as any).isAdmin || false,
          adminRole: (user as any).adminRole || null,
          adminDepartment: (user as any).adminDepartment || null,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.image;
      session.user.role = token.role;
      session.user.companyId = token.companyId;
      session.user.companyName = token.companyName;
      session.user.logoUrl = token.logoUrl;
      session.user.subscriptionStatus = token.subscriptionStatus;
      // Datos de admin
      (session.user as any).isAdmin = token.isAdmin;
      (session.user as any).adminRole = token.adminRole;
      (session.user as any).adminDepartment = token.adminDepartment;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };