import type { PantryItem } from "./types";

// This array lives in the SERVER'S MEMORY. It is the fake "database" for now.
//
// Important consequence: it resets to exactly this list every time the dev
// server restarts, because memory is wiped when the process stops. That's the
// limitation a real database fixes — which is exactly what Phase 4 does.
//
// We seed it with a few items so the page isn't empty the first time you open it.
export const pantryItems: PantryItem[] = [
  { id: "1", ownerId: "local", name: "Olive oil", quantity: 1, unit: "bottle" },
  { id: "2", ownerId: "local", name: "Spaghetti", quantity: 500, unit: "g" },
  { id: "3", ownerId: "local", name: "Canned tomatoes", quantity: 3, unit: "cans" },
];
