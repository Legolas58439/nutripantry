import { pantryItems } from "./store";
import { getCurrentOwnerId } from "@/lib/auth/context";
import type { PantryItem } from "./types";

// THE REPOSITORY.
//
// Every read/write of pantry data goes through these three functions. The rest
// of the app (pages, forms) NEVER touches the `pantryItems` array directly.
//
// Why bother? Because in Phase 4 we rewrite the INSIDES of these functions to
// talk to a real database — but their names and inputs/outputs stay identical,
// so no page code has to change. This is the single most valuable habit in here.
//
// They're `async` even though an array lookup is instant, because database
// calls ARE async. Writing them async now means the page code already does
// `await listPantry()` and won't change when the database arrives.

// Return every pantry item belonging to the current owner.
export async function listPantry(): Promise<PantryItem[]> {
  const ownerId = getCurrentOwnerId();
  return pantryItems.filter((item) => item.ownerId === ownerId);
}

// Add a new item and return the created record.
export async function addPantryItem(input: {
  name: string;
  quantity: number;
  unit: string;
}): Promise<PantryItem> {
  const newItem: PantryItem = {
    id: crypto.randomUUID(), // built-in random unique id generator
    ownerId: getCurrentOwnerId(),
    name: input.name,
    quantity: input.quantity,
    unit: input.unit,
  };
  pantryItems.push(newItem);
  return newItem;
}

// Delete an item by id — but ONLY if it belongs to the current owner.
// (That ownership check is what makes this safe once multiple users exist.)
export async function deletePantryItem(id: string): Promise<void> {
  const ownerId = getCurrentOwnerId();
  const index = pantryItems.findIndex(
    (item) => item.id === id && item.ownerId === ownerId,
  );
  if (index !== -1) {
    pantryItems.splice(index, 1); // remove 1 item at that position
  }
}
