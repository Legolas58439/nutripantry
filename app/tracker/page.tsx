import Link from "next/link";
import { cn } from "@/lib/utils";
import { listConsumption, sumTotals } from "@/lib/data/consumption";
import { getGoals } from "@/lib/data/goals";
import {
  type Period,
  isPeriod,
  getPeriodRange,
  daysInRange,
  dailyKcal,
} from "@/lib/date";
import { deleteConsumptionAction } from "./actions";
import LogFoodDialog from "./LogFoodDialog";
import GoalsDialog from "./GoalsDialog";
import KcalChart from "./KcalChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const PERIODS: Period[] = ["day", "week", "month"];
const round = (n: number) => Math.round(n);

export default async function TrackerPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; offset?: string }>;
}) {
  const sp = await searchParams;
  const period: Period = isPeriod(sp.period) ? sp.period : "day";
  const offset = Number.parseInt(sp.offset ?? "0", 10) || 0;

  const range = getPeriodRange(period, offset);
  const [entries, goals] = await Promise.all([
    listConsumption({ from: range.from, to: range.to }),
    getGoals(),
  ]);

  const totals = sumTotals(entries);
  const days = daysInRange(range);
  // A daily goal scales to the whole period (e.g. 2000 kcal/day × 7 days).
  const target = (daily: number | null | undefined) =>
    daily != null ? daily * days : null;

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">Tracker</h1>
          <p className="mt-1 text-muted-foreground">
            Calories &amp; macros over time.
          </p>
        </div>
        <div className="flex gap-2">
          <GoalsDialog goals={goals} />
          <LogFoodDialog />
        </div>
      </div>

      {/* Period selector + prev/next */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border p-0.5">
          {PERIODS.map((p) => (
            <Link
              key={p}
              href={`/tracker?period=${p}&offset=0`}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors",
                p === period
                  ? "bg-emerald-600 text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/tracker?period=${period}&offset=${offset - 1}`} />}
          >
            ‹
          </Button>
          <span className="min-w-40 text-center text-sm font-medium">
            {range.label}
          </span>
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/tracker?period=${period}&offset=${offset + 1}`} />}
          >
            ›
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Calories" unit="kcal" total={totals.kcal} target={target(goals?.kcal)} />
        <StatCard label="Protein" unit="g" total={totals.protein} target={target(goals?.protein)} />
        <StatCard label="Carbs" unit="g" total={totals.carbs} target={target(goals?.carbs)} />
        <StatCard label="Fat" unit="g" total={totals.fat} target={target(goals?.fat)} />
      </div>

      {/* Per-day chart (week & month only) */}
      {period !== "day" && (
        <Card>
          <CardHeader>
            <CardTitle>Calories per day</CardTitle>
          </CardHeader>
          <CardContent>
            <KcalChart data={dailyKcal(entries, range)} />
          </CardContent>
        </Card>
      )}

      {/* Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food</TableHead>
                <TableHead className="text-right">Grams</TableHead>
                <TableHead className="text-right">kcal</TableHead>
                <TableHead className="text-right">P</TableHead>
                <TableHead className="text-right">C</TableHead>
                <TableHead className="text-right">F</TableHead>
                <TableHead>When</TableHead>
                <TableHead className="w-0"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Nothing logged for this period. Use “Log food”, or “Eat”
                    something from your pantry.
                  </TableCell>
                </TableRow>
              ) : (
                entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">
                      {e.name}
                      {e.brand ? (
                        <span className="block text-xs font-normal text-muted-foreground">
                          {e.brand}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">{e.grams}</TableCell>
                    <TableCell className="text-right">{e.kcal}</TableCell>
                    <TableCell className="text-right">{e.protein}</TableCell>
                    <TableCell className="text-right">{e.carbs}</TableCell>
                    <TableCell className="text-right">{e.fat}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(e.consumedAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <form action={deleteConsumptionAction}>
                        <input type="hidden" name="id" value={e.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

function StatCard({
  label,
  unit,
  total,
  target,
}: {
  label: string;
  unit: string;
  total: number;
  target: number | null;
}) {
  const pct =
    target && target > 0 ? Math.min(100, Math.round((total / target) * 100)) : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-bold">
          {round(total)}
          <span className="text-base font-normal text-muted-foreground">
            {" "}
            {unit}
          </span>
        </div>
        {target != null ? (
          <>
            <Progress value={pct ?? 0} className="mt-3" />
            <div className="mt-1 text-xs text-muted-foreground">
              {round(total)} / {round(target)} {unit} · {pct}%
            </div>
          </>
        ) : (
          <div className="mt-3 text-xs text-muted-foreground">No goal set</div>
        )}
      </CardContent>
    </Card>
  );
}
