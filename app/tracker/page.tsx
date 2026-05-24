// Placeholder — the full tracker (totals, period tabs, chart, goals) is built
// in phase 2.0-D. This exists so the "Tracker" nav link doesn't 404 meanwhile.
export const dynamic = "force-dynamic";

export default function TrackerPage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-bold text-emerald-700">Tracker</h1>
      <p className="mt-1 text-muted-foreground">
        Calorie &amp; macro tracking — coming together.
      </p>
    </main>
  );
}
