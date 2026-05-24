import { prisma } from "@/lib/db/client";
import { getCurrentOwnerId } from "@/lib/auth/context";

// THE CONSUMPTION REPOSITORY — the food diary.
// Same pattern as lib/data/pantry.ts: every query is scoped to the current
// owner via getCurrentOwnerId(), so adding accounts later stays a one-file change.

export type ConsumptionInput = {
  name: string;
  brand?: string | null;
  grams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  pantryItemId?: string | null;
  consumedAt?: Date;
};

// Record one "I ate this" event.
export async function logConsumption(input: ConsumptionInput) {
  const ownerId = await getCurrentOwnerId();
  return prisma.consumptionLog.create({
    data: {
      ownerId,
      name: input.name,
      brand: input.brand ?? null,
      grams: input.grams,
      kcal: input.kcal,
      protein: input.protein,
      carbs: input.carbs,
      fat: input.fat,
      pantryItemId: input.pantryItemId ?? null,
      consumedAt: input.consumedAt ?? new Date(),
    },
  });
}

// All entries for the current owner within [from, to), newest first.
export async function listConsumption(range: { from: Date; to: Date }) {
  const ownerId = await getCurrentOwnerId();
  return prisma.consumptionLog.findMany({
    where: {
      ownerId,
      consumedAt: { gte: range.from, lt: range.to },
    },
    orderBy: { consumedAt: "desc" },
  });
}

// Delete one entry — owner-scoped (can't delete someone else's row).
export async function deleteConsumption(id: string) {
  const ownerId = await getCurrentOwnerId();
  await prisma.consumptionLog.deleteMany({ where: { id, ownerId } });
}

export type Totals = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

// Sum kcal + macros across a set of entries.
export function sumTotals(
  entries: { kcal: number; protein: number; carbs: number; fat: number }[],
): Totals {
  return entries.reduce<Totals>(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );
}
