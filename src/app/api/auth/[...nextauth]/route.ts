import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { User } from "next-auth"

interface NextAuthUser extends User {
  accessToken: string;
  companyName: string | null;
  companyId: string | null;
  role: string;
}

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
    async jwt({ token, user }) {
      const typedUser = user as NextAuthUser;
      if (typedUser) {
        token.id = typedUser.id;
        token.name = typedUser.name;
        token.email = typedUser.email;
        token.accessToken = typedUser.accessToken;
        token.companyId = typedUser.companyId;
        token.companyName = typedUser.companyName;
        token.role = typedUser.role;
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

  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }