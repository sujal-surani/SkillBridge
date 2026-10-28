import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Community Persona or Email",
      credentials: {
        memberId: { label: "Member ID", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const memberId = credentials.memberId as string | undefined;
        const email = credentials.email as string | undefined;

        // 1. Look up directly in database by memberId (e.g. "member-1", "member-2", etc.)
        if (memberId) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: memberId },
            });
            if (dbUser) {
              return {
                id: dbUser.id,
                name: dbUser.fullName || dbUser.name || "Community Member",
                email: dbUser.email,
                image: dbUser.avatarUrl || dbUser.image,
                role: dbUser.role,
              };
            }
          } catch (e) {
            console.error("Authorize lookup by memberId failed:", e);
          }
        }

        // 2. Look up directly in database by email
        if (email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: email.toLowerCase() },
            });
            if (dbUser) {
              return {
                id: dbUser.id,
                name: dbUser.fullName || dbUser.name || "Community Member",
                email: dbUser.email,
                image: dbUser.avatarUrl || dbUser.image,
                role: dbUser.role,
              };
            }
          } catch (e) {
            console.error("Authorize lookup by email failed:", e);
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "MEMBER";
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) || session.user.id;
        (session.user as any).role = token.role || "MEMBER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "skillbridge_super_secret_session_key_2026",
});
