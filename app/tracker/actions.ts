"use server";

import { revalidatePath } from "next/cache";
import { deleteConsumption, logConsumption } from "@/lib/data/consumption";
import { saveGoals } from "@/lib/data/goals";
import { searchFood, type FoodResult } from "@/lib/nutrition/openfoodfacts";

const round1 = (n: number) => Math.round(n * 10) / 10;

function num(value: FormDataEntryValue | null): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function optionalNum(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// Reused by the "Log food" dialog's search box.
export async function searchFoodAction(query: string): Promise<FoodResult[]> {
  return searchFood(query);
}

// Log a food that isn't (necessarily) in the pantry. The form provides per-100g
// values + grams; we compute and store the absolute consumed macros.
export async function logFoodAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const grams = num(formData.get("grams"));
  if (!name || grams <= 0) return;

  const factor = grams / 100;
  const brand = String(formData.get("brand") ?? "").trim() || null;
  await logConsumption({
    name,
    brand,
    grams,
    kcal: round1(num(formData.get("kcal")) * factor),
    protein: round1(num(formData.get("protein")) * factor),
    carbs: round1(num(formData.get("carbs")) * factor),
    fat: round1(num(formData.get("fat")) * factor),
  });

  revalidatePath("/tracker");
}

export async function deleteConsumptionAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteConsumption(id);
  revalidatePath("/tracker");
}

// Save daily targets (any field left blank clears that target).
export async function saveGoalsAction(formData: FormData) {
  await saveGoals({
    kcal: optionalNum(formData.get("kcal")),
    protein: optionalNum(formData.get("protein")),
    carbs: optionalNum(formData.get("carbs")),
    fat: optionalNum(formData.get("fat")),
  });
  revalidatePath("/tracker");
}
