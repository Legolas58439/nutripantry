"use server";

import { revalidatePath } from "next/cache";
import { addPantryItem, deletePantryItem } from "@/lib/data/pantry";
import { searchFood, type FoodResult } from "@/lib/nutrition/openfoodfacts";

// Called from the browser (the search box) to look up foods on OpenFoodFacts.
// The actual network request runs here, on the server, then the results are
// sent back to the client component that called it.
export async function searchFoodAction(query: string): Promise<FoodResult[]> {
  return searchFood(query);
}

// Helper: turn a form field into a number, or undefined if it's blank/invalid.
function optionalNumber(value: FormDataEntryValue | null): number | undefined {
  if (value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

// SERVER ACTIONS.
//
// The "use server" line at the very top marks every function in this file as a
// Server Action: code that runs ON THE SERVER but can be called straight from a
// <form> in the browser. Next.js wires up the network call for you — no manual
// fetch(), no API route to write. This is the modern Next.js way to handle form
// submissions.
//
// A form submission hands us a `FormData` object containing the field values.

export async function addItemAction(formData: FormData) {
  // formData.get("name") returns the value of <input name="name">.
  // It can be null, so we default to "" and trim whitespace.
  const name = String(formData.get("name") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 0);
  const unit = String(formData.get("unit") ?? "").trim();

  // Hand-written validation. (In a later phase we'll swap this for a library
  // called Zod, but doing it by hand first shows you what validation actually is.)
  if (!name || Number.isNaN(quantity) || quantity <= 0 || !unit) {
    return; // ignore an invalid submission for now
  }

  // Optional nutrition fields. These are only present if the user picked an
  // OpenFoodFacts result — they ride along in hidden inputs on the form.
  const brand = String(formData.get("brand") ?? "").trim() || undefined;
  const kcal = optionalNumber(formData.get("kcal"));
  const protein = optionalNumber(formData.get("protein"));
  const carbs = optionalNumber(formData.get("carbs"));
  const fat = optionalNumber(formData.get("fat"));

  await addPantryItem({ name, quantity, unit, brand, kcal, protein, carbs, fat });

  // Tell Next.js "the data behind /pantry changed" so it re-renders the page
  // with the new item. Without this, you'd see stale data until a manual reload.
  revalidatePath("/pantry");
}

export async function deleteItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deletePantryItem(id);
  revalidatePath("/pantry");
}
