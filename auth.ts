import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/client";
import authConfig from "./auth.config";

// The full Auth.js setup (runs in the Node runtime, not the edge): the
// edge-safe config + the Prisma adapter that persists users/accounts.
// We use JWT sessions so middleware can check auth without a database call.
export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma as any),
  session: { strategy: "jwt" },
  ...authConfig,
});
