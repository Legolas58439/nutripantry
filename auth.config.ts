import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// EDGE-SAFE Auth.js config (no database imports), so it can run in middleware.
// The full config in auth.ts adds the Prisma adapter on top of this.
//
// Auth.js v5 reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET from the environment
// automatically, so the Google provider needs no arguments.
const allowedEmail = process.env.ALLOWED_EMAIL?.toLowerCase();

export default {
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // ALLOWLIST: only let the one approved Google account in.
    signIn({ profile }) {
      const email = profile?.email?.toLowerCase();
      return Boolean(email && email === allowedEmail);
    },
    // Put the database user id onto the JWT at sign-in so we can read it later.
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // Expose the user id on the session (this becomes our ownerId).
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
    // Route protection: middleware (matcher below) only runs this for protected
    // paths; require a signed-in user there.
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
  },
} satisfies NextAuthConfig;
