// Date helpers for the tracker's Day / Week / Month views.
// Everything is computed in the server's local time. (Timezone handling is a
// known simplification for v2 — see the plan's "decide-later" section.)

export type Period = "day" | "week" | "month";

export function isPeriod(v: string | undefined | null): v is Period {
  return v === "day" || v === "week" || v === "month";
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Week starts on Monday.
function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  const dayMonday0 = (x.getDay() + 6) % 7; // Sun=6, Mon=0, ...
  x.setDate(x.getDate() - dayMonday0);
  return x;
}

function startOfMonth(d: Date): Date {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

export type PeriodRange = { from: Date; to: Date; label: string };

// Resolve a period + offset (0 = current, -1 = previous, +1 = next) into a
// concrete [from, to) date range plus a human label.
export function getPeriodRange(
  period: Period,
  offset: number,
  now: Date = new Date(),
): PeriodRange {
  if (period === "day") {
    const from = startOfDay(now);
    from.setDate(from.getDate() + offset);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    return {
      from,
      to,
      label: from.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    };
  }

  if (period === "week") {
    const from = startOfWeek(now);
    from.setDate(from.getDate() + offset * 7);
    const to = new Date(from);
    to.setDate(to.getDate() + 7);
    const last = new Date(to);
    last.setDate(last.getDate() - 1);
    return { from, to, label: `${fmtShort(from)} – ${fmtShort(last)}` };
  }

  // month
  const from = startOfMonth(now);
  from.setMonth(from.getMonth() + offset);
  const to = new Date(from);
  to.setMonth(to.getMonth() + 1);
  return {
    from,
    to,
    label: from.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    }),
  };
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// How many days the range spans (used to scale a daily goal to the period).
export function daysInRange(range: { from: Date; to: Date }): number {
  return Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000);
}

// Group entries into per-day kcal totals across the range, for the bar chart.
export function dailyKcal(
  entries: { consumedAt: Date; kcal: number }[],
  range: { from: Date; to: Date },
): { date: string; kcal: number }[] {
  const days: { date: string; kcal: number }[] = [];
  const cursor = new Date(range.from);
  while (cursor < range.to) {
    days.push({
      date: cursor.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      kcal: 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  for (const e of entries) {
    const idx = Math.floor(
      (startOfDay(new Date(e.consumedAt)).getTime() - range.from.getTime()) /
        86_400_000,
    );
    if (idx >= 0 && idx < days.length) {
      days[idx].kcal = Math.round((days[idx].kcal + e.kcal) * 10) / 10;
    }
  }
  return days;
}
