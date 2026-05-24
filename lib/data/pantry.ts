import { prisma } from "@/lib/db/client";
import { getCurrentOwnerId } from "@/lib/auth/context";
import type { PantryItem } from "./types";

// THE REPOSITORY — now backed by a real Postgres database via Prisma.
//
// Compare this with the previous version: the function NAMES, INPUTS, and
// RETURN TYPES are identical. Only the bodies changed — from array operations
// to database queries. That's why page.tsx and AddItemForm.tsx didn't need a
// single edit. This is the entire point of routing all data access through
// one layer.

// Return every pantry item belonging to the current owner, newest first.
export async function listPantry(): Promise<PantryItem[]> {
  const ownerId = getCurrentOwnerId();
  return prisma.pantryItem.findMany({
    where: { ownerId }, // only this owner's rows
    orderBy: { createdAt: "desc" },
  });
}

// Add a new item and return the created record.
export async function addPantryItem(input: {
  name: string;
  quantity: number;
  unit: string;
  brand?: string;
  kcal?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}): Promise<PantryItem> {
  const ownerId = getCurrentOwnerId();
  return prisma.pantryItem.create({
    data: { ownerId, ...input }, // Prisma generates the id and createdAt for us
  });
}

// Delete an item by id — but only if it belongs to the current owner.
// We use deleteMany (not delete) because it lets us filter on BOTH id AND
// ownerId. That ownership check is what stops one user deleting another's row
// once we add accounts.
export async function deletePantryItem(id: string): Promise<void> {
  const ownerId = getCurrentOwnerId();
  await prisma.pantryItem.deleteMany({
    where: { id, ownerId },
  });
}
