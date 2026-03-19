import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";
import { env, warnIfCriticalEnvMissing } from "@/lib/env";

warnIfCriticalEnvMissing();

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const email = credentials.email.trim().toLowerCase();
        const user = await db.user.findUnique({
          where: { email },
          include: { coupleMembers: { orderBy: { createdAt: "desc" } } },
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        const activeMembership = user.coupleMembers[0];
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          coupleId: activeMembership?.coupleId,
        } as never;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as { role?: Role }).role;
        token.coupleId = (user as { coupleId?: string }).coupleId;
      }
      const nextCoupleId = (session as { coupleId?: string } | undefined)?.coupleId;
      if (trigger === "update" && nextCoupleId) {
        const membership = await db.coupleMember.findFirst({
          where: { userId: token.sub, coupleId: nextCoupleId },
          select: { coupleId: true },
        });
        if (membership?.coupleId) {
          token.coupleId = membership.coupleId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as Role;
        session.user.coupleId = token.coupleId as string | undefined;
      }
      return session;
    },
  },
};
