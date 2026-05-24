import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-12 text-center">
      <h1 className="text-5xl font-bold text-emerald-700">Nutripantry</h1>
      <p className="mt-4 text-lg text-zinc-600">Your pantry, with nutrition.</p>
      {/* <Link> is Next.js's navigation link. Unlike a plain <a>, it moves
          between pages without a full browser reload — faster and smoother. */}
      <Link
        href="/pantry"
        className="mt-8 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-700"
      >
        Open my pantry →
      </Link>
    </main>
  );
}
