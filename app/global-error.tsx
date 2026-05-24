"use client";

// A GLOBAL ERROR BOUNDARY. If something throws at the very top level of the app
// (even in the root layout), Next.js renders this instead of a blank crash.
//
// Two rules Next.js requires for this special file:
//   1. It must be a Client Component ("use client").
//   2. It must render its own <html> and <body>, because it replaces the
//      entire document when a top-level error happens.
//
// Defining our own also sidesteps a known Next.js 16 build bug that crashes
// while prerendering its built-in fallback error page.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void; // calling this asks Next.js to try rendering again
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-2xl font-bold text-red-700">Something went wrong</h2>
        <p className="text-zinc-600">An unexpected error occurred in Nutripantry.</p>
        <button
          onClick={() => reset()}
          className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
