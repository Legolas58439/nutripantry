import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-12 text-center">
      <div className="space-y-3">
        <h1 className="text-5xl font-bold tracking-tight text-emerald-700">
          Nutripantry
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your pantry — and what you actually eat.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Base UI's `render` prop makes the Button render as the given element
            (a Next.js Link here) while keeping the button's styling. */}
        <Button render={<Link href="/pantry" />} size="lg">
          Open my pantry
        </Button>
        <Button render={<Link href="/tracker" />} size="lg" variant="outline">
          View tracker
        </Button>
      </div>
    </main>
  );
}
