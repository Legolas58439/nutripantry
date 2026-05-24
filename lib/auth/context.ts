import { auth } from "@/auth";

// THE AUTH SEAM — now backed by real sign-in.
//
// Every data function asks this helper "who is the current owner?". It used to
// return the constant "local"; now it returns the signed-in user's id. Because
// every query already routes through here, flipping this one function made the
// whole app per-user. (Protected routes require a session via middleware, so in
// practice a session always exists when this runs.)
export async function getCurrentOwnerId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return session.user.id;
}
