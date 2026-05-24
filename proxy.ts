import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Next.js "proxy" (formerly "middleware") — runs on the matched routes below to
// enforce authentication. It uses the edge-safe Auth.js config (no database),
// and the `authorized` callback in auth.config redirects signed-out users to
// /login.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Guard the private app sections only. Home (/) and /login stay public.
  matcher: ["/pantry/:path*", "/tracker/:path*", "/foods/:path*"],
};
