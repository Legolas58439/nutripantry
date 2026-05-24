// A "type" describes the SHAPE of a piece of data. It doesn't run — it exists
// purely so the TypeScript compiler and your editor can catch mistakes (a typo'd
// field name, a missing property, a number where a string belongs) BEFORE you
// ever run the code.
//
// A PantryItem is one thing sitting in your pantry.
export type PantryItem = {
  id: string;        // unique identifier for this item
  ownerId: string;   // who owns this row — always "local" until we add accounts
  name: string;      // e.g. "Spaghetti"
  quantity: number;  // e.g. 500
  unit: string;      // free text for now: "g", "cans", "pieces"...

  // Optional nutrition info (per 100g), attached from OpenFoodFacts when the
  // user picks a search result. The "?" means "this field may be absent" —
  // items added before nutrition existed, or added by hand, simply won't have it.
  brand?: string;
  kcal?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};
