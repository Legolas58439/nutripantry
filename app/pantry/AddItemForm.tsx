"use client";

// "use client" makes this a CLIENT COMPONENT: it runs in the browser and can
// use interactive features (onClick, onChange) and the useState hook.

import { useState } from "react";
import { addItemAction, searchFoodAction } from "./actions";
import type { FoodResult } from "@/lib/nutrition/openfoodfacts";

export default function AddItemForm() {
  // --- search state ---
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  // --- the editable form fields ---
  // We keep every field in state as a STRING (that's what <input> works with).
  // Empty string means "blank". Storing them in state is what lets us pre-fill
  // them from a search result AND let you edit them afterwards.
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [brand, setBrand] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  // A small helper so we don't write "value=… onChange=…" by hand every time.
  // It returns the props every controlled text/number input needs.
  function field(value: string, setValue: (v: string) => void) {
    return {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    };
  }

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    try {
      const found = await searchFoodAction(query);
      setResults(found);
      if (found.length === 0) setError("No matches found. Try a different name.");
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  // Clicking a search result PRE-FILLS the editable fields. You can then tweak
  // any of them before saving — e.g. change "Frozen broccoli" kcal to raw.
  function choose(food: FoodResult) {
    setName(food.name);
    setBrand(food.brand);
    setKcal(food.kcal != null ? String(food.kcal) : "");
    setProtein(food.protein != null ? String(food.protein) : "");
    setCarbs(food.carbs != null ? String(food.carbs) : "");
    setFat(food.fat != null ? String(food.fat) : "");
    setResults([]);
    setQuery("");
  }

  // Reset every field back to empty.
  function clearForm() {
    setName("");
    setQuantity("");
    setUnit("");
    setBrand("");
    setKcal("");
    setProtein("");
    setCarbs("");
    setFat("");
    setResults([]);
    setError("");
  }

  // This runs when the form is submitted. It's a CLIENT function, so after the
  // server action finishes saving, we can clear the form here. FormData carries
  // all the named inputs' current values to addItemAction.
  async function handleAdd(formData: FormData) {
    await addItemAction(formData);
    clearForm();
  }

  const inputClass =
    "mt-1 rounded border bg-white px-2 py-1 text-zinc-900 placeholder:text-zinc-400";

  return (
    <div className="mt-6 rounded-lg border bg-white p-4">
      {/* ---- Search box (optional) ---- */}
      <div className="flex items-end gap-2">
        <label className="flex flex-1 flex-col text-sm text-zinc-700">
          Search nutrition database (optional)
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="e.g. broccoli"
            className={inputClass}
          />
        </label>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="rounded bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {searching ? "Searching…" : "Search"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-amber-700">{error}</p>}

      {/* ---- Results list ---- */}
      {results.length > 0 && (
        <ul className="mt-2 divide-y rounded border">
          {results.map((food, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => choose(food)}
                className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-zinc-50"
              >
                <span className="font-medium text-zinc-900">{food.name}</span>
                <span className="text-xs text-zinc-500">
                  {food.brand ? `${food.brand} · ` : ""}
                  {food.kcal != null ? `${food.kcal} kcal` : "no kcal data"} / 100g
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ---- The add form ---- */}
      <form action={handleAdd} className="mt-4">
        {/* Row 1: the basics */}
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-sm text-zinc-700">
            Name
            <input name="name" required placeholder="e.g. Broccoli" className={inputClass} {...field(name, setName)} />
          </label>
          <label className="flex flex-col text-sm text-zinc-700">
            Quantity
            <input name="quantity" type="number" min="0" step="any" required placeholder="500" className={`${inputClass} w-24`} {...field(quantity, setQuantity)} />
          </label>
          <label className="flex flex-col text-sm text-zinc-700">
            Unit
            <input name="unit" required placeholder="g" className={`${inputClass} w-28`} {...field(unit, setUnit)} />
          </label>
        </div>

        {/* Row 2: nutrition, all optional and editable (per 100g) */}
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
          Nutrition per 100g (optional — edit freely)
        </p>
        <div className="mt-1 flex flex-wrap items-end gap-3">
          <label className="flex flex-col text-sm text-zinc-700">
            Brand
            <input name="brand" placeholder="—" className={`${inputClass} w-40`} {...field(brand, setBrand)} />
          </label>
          <label className="flex flex-col text-sm text-zinc-700">
            kcal
            <input name="kcal" type="number" min="0" step="any" placeholder="34" className={`${inputClass} w-24`} {...field(kcal, setKcal)} />
          </label>
          <label className="flex flex-col text-sm text-zinc-700">
            Protein
            <input name="protein" type="number" min="0" step="any" placeholder="2.8" className={`${inputClass} w-24`} {...field(protein, setProtein)} />
          </label>
          <label className="flex flex-col text-sm text-zinc-700">
            Carbs
            <input name="carbs" type="number" min="0" step="any" placeholder="7" className={`${inputClass} w-24`} {...field(carbs, setCarbs)} />
          </label>
          <label className="flex flex-col text-sm text-zinc-700">
            Fat
            <input name="fat" type="number" min="0" step="any" placeholder="0.4" className={`${inputClass} w-24`} {...field(fat, setFat)} />
          </label>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
            Add
          </button>
          <button type="button" onClick={clearForm} className="rounded border px-4 py-2 text-zinc-700 hover:bg-zinc-50">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
