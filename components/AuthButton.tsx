import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

// Server component: shows the signed-in user + a sign-out button, or a sign-in
// link when signed out.
export default async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
        className="flex items-center gap-3"
      >
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {session.user.email}
        </span>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    );
  }

  return (
    <Button render={<Link href="/login" />} size="sm">
      Sign in
    </Button>
  );
}
