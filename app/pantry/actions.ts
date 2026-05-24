"use server";

import { revalidatePath } from "next/cache";
import {
  addPantryItem,
  deletePantryItem,
  getPantryItem,
  updatePantryItemQuantity,
} from "@/lib/data/pantry";
import { logConsumption } from "@/lib/data/consumption";
import { searchFood, type FoodResult } from "@/lib/nutrition/openfoodfacts";

// Round to one decimal place — keeps logged macros tidy.
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

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
  // Everything is gram-based now, so the unit is always grams.
  const unit = "g";

  // Hand-written validation. (In a later phase we'll swap this for a library
  // called Zod, but doing it by hand first shows you what validation actually is.)
  if (!name || Number.isNaN(quantity) || quantity <= 0) {
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

// "Eat" a number of grams of a pantry item: record it in the food diary and
// deduct it from pantry stock.
export async function eatPantryItemAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const grams = Number(formData.get("grams") ?? 0);
  if (!id || !Number.isFinite(grams) || grams <= 0) return;

  const item = await getPantryItem(id);
  if (!item) return;

  // Nutrition is stored per 100g, so scale by grams/100.
  const factor = grams / 100;
  await logConsumption({
    name: item.name,
    brand: item.brand,
    grams,
    kcal: round1((item.kcal ?? 0) * factor),
    protein: round1((item.protein ?? 0) * factor),
    carbs: round1((item.carbs ?? 0) * factor),
    fat: round1((item.fat ?? 0) * factor),
    pantryItemId: item.id,
  });

  // Pantry quantities are in grams, so deduct the grams eaten directly. Round to
  // one decimal to avoid floating-point noise, and clamp at zero.
  const newQuantity = Math.max(0, Math.round((item.quantity - grams) * 10) / 10);
  await updatePantryItemQuantity(id, newQuantity);

  revalidatePath("/pantry");
  revalidatePath("/tracker");
}
