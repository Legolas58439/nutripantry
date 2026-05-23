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
};
