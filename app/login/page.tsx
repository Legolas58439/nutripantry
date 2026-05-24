import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-12 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-emerald-700">
          Sign in to Nutripantry
        </h1>
        <p className="text-muted-foreground">
          Your pantry and food diary are private to you.
        </p>
      </div>
      {/* An inline server action runs the Google sign-in flow. */}
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/pantry" });
        }}
      >
        <Button type="submit" size="lg">
          Sign in with Google
        </Button>
      </form>
    </main>
  );
}
