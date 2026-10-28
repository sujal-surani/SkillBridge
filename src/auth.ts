import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { INITIAL_MEMBERS } from "@/lib/data/mock-data";

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

        // 1. Look up by memberId (e.g. "member-1", "member-2", etc.)
        let matchedMember = INITIAL_MEMBERS.find((m) => m.id === memberId);

        // 2. Or look up by email
        if (!matchedMember && email) {
          matchedMember = INITIAL_MEMBERS.find(
            (m) => m.email.toLowerCase() === email.toLowerCase()
          );
        }

        // If matched to a predefined community persona, ensure they exist in PostgreSQL
        if (matchedMember) {
          try {
            const upserted = await prisma.user.upsert({
              where: { email: matchedMember.email },
              update: {
                fullName: matchedMember.fullName,
                avatarUrl: matchedMember.avatarUrl,
                image: matchedMember.avatarUrl,
                occupationOrInterest: matchedMember.occupationOrInterest,
                neighborhood: matchedMember.neighborhood,
                city: matchedMember.city,
                bio: matchedMember.bio,
                skillPointsBalance: matchedMember.skillPointsBalance,
              },
              create: {
                id: matchedMember.id,
                email: matchedMember.email,
                name: matchedMember.fullName,
                fullName: matchedMember.fullName,
                avatarUrl: matchedMember.avatarUrl,
                image: matchedMember.avatarUrl,
                occupationOrInterest: matchedMember.occupationOrInterest,
                neighborhood: matchedMember.neighborhood,
                city: matchedMember.city,
                bio: matchedMember.bio,
                modePreference: matchedMember.modePreference,
                spokenLanguages: JSON.stringify(matchedMember.spokenLanguages),
                availability: JSON.stringify(matchedMember.availability),
                skillPointsBalance: matchedMember.skillPointsBalance,
                averageRating: matchedMember.averageRating,
                totalSessions: matchedMember.totalSessions,
                role: "MEMBER",
              },
            });
            return {
              id: upserted.id,
              name: upserted.fullName || upserted.name,
              email: upserted.email,
              image: upserted.avatarUrl || upserted.image,
              role: upserted.role,
            };
          } catch (e) {
            console.warn("Could not sync member with database, returning mock:", e);
            return {
              id: matchedMember.id,
              name: matchedMember.fullName,
              email: matchedMember.email,
              image: matchedMember.avatarUrl,
              role: "MEMBER",
            };
          }
        }

        // 3. Fallback: look up in database by email
        if (email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email },
            });
            if (dbUser) {
              return {
                id: dbUser.id,
                name: dbUser.fullName || dbUser.name,
                email: dbUser.email,
                image: dbUser.avatarUrl || dbUser.image,
                role: dbUser.role,
              };
            }
          } catch (e) {
            console.error("Database query failed:", e);
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
