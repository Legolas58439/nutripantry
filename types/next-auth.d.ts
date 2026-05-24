import type { DefaultSession } from "next-auth";

// Tell TypeScript that our session/JWT carry a user `id` (we set it in the
// jwt/session callbacks in auth.config.ts).
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
