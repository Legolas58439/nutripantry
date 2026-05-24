import { prisma } from "@/lib/db/client";
import { getCurrentOwnerId } from "@/lib/auth/context";

// THE GOALS REPOSITORY — one set of daily nutrition targets per owner.

export type GoalInput = {
  kcal?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
};

// Return the current owner's goals, or null if they haven't set any.
export async function getGoals() {
  const ownerId = getCurrentOwnerId();
  return prisma.nutritionGoal.findUnique({ where: { ownerId } });
}

// Create or update the owner's goals. `upsert` = "update if it exists, else
// create" — perfect for a single settings row keyed by ownerId.
export async function saveGoals(input: GoalInput) {
  const ownerId = getCurrentOwnerId();
  const data = {
    kcal: input.kcal ?? null,
    protein: input.protein ?? null,
    carbs: input.carbs ?? null,
    fat: input.fat ?? null,
  };
  return prisma.nutritionGoal.upsert({
    where: { ownerId },
    create: { ownerId, ...data },
    update: data,
  });
}
