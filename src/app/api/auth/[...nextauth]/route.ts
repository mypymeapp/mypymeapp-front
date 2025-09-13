import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { User } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          user: { type: "text" },
        },
        async authorize(credentials) {
            if (!credentials?.user) return null;
            try {
                const user = JSON.parse(credentials.user);
                if (user) return user;
                return null;
            } catch (error) {
                return null;
            }
        }
    })
  ],
  
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              avatarUrl: user.image,
            }),
          });
          
          if (!res.ok) return false;

          const backendData = await res.json();
          
          user.accessToken = backendData.token;
          user.id = backendData.user.id;
          user.role = backendData.user.role;
          user.company = backendData.user.company;
          
          return true;
        } catch (error) {
          console.error("Error en signIn de Google:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.companyId = user.company?.id || user.companyId || null;
        token.companyName = user.company?.name || user.companyName || null;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) { 
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.companyId = token.companyId;
        session.user.companyName = token.companyName;
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },

  pages: { signIn: '/login', error: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }