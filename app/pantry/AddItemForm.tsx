"use client";

import { useState } from "react";
import { addItemAction, searchFoodAction } from "./actions";
import type { FoodResult } from "@/lib/nutrition/openfoodfacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function AddItemForm() {
  // search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  // editable form fields (all strings — that's what <input> works with)
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  // Returns the value/onChange props every controlled input needs (DRY helper).
  function field(value: string, setValue: (v: string) => void) {
    return {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value),
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

  // Picking a result pre-fills the editable fields; you can then tweak them.
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

  function clearForm() {
    setName("");
    setQuantity("");
    setBrand("");
    setKcal("");
    setProtein("");
    setCarbs("");
    setFat("");
    setResults([]);
    setError("");
  }

  // Client form action: run the server action to save, then clear the form.
  async function handleAdd(formData: FormData) {
    await addItemAction(formData);
    clearForm();
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        {/* ---- Search box (optional) ---- */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="food-search">
              Search nutrition database (optional)
            </Label>
            <Input
              id="food-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="e.g. broccoli"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? "Searching…" : "Search"}
          </Button>
        </div>

        {error && <p className="text-sm text-amber-600">{error}</p>}

        {/* ---- Results ---- */}
        {results.length > 0 && (
          <ul className="divide-y rounded-md border">
            {results.map((food, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => choose(food)}
                  className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-muted"
                >
                  <span className="font-medium">{food.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {food.brand ? `${food.brand} · ` : ""}
                    {food.kcal != null ? `${food.kcal} kcal` : "no kcal data"} /
                    100g
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* ---- The add form ---- */}
        <form action={handleAdd} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g. Chicken breast"
                {...field(name, setName)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Amount (g)</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="any"
                required
                placeholder="1000"
                {...field(quantity, setQuantity)}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Nutrition per 100g (optional — edit freely)
            </p>
            <div className="grid gap-4 sm:grid-cols-5">
              <div className="space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  placeholder="—"
                  {...field(brand, setBrand)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kcal">kcal</Label>
                <Input
                  id="kcal"
                  name="kcal"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="34"
                  {...field(kcal, setKcal)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="protein">Protein</Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="2.8"
                  {...field(protein, setProtein)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="carbs">Carbs</Label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="7"
                  {...field(carbs, setCarbs)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fat">Fat</Label>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.4"
                  {...field(fat, setFat)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit">Add item</Button>
            <Button type="button" variant="outline" onClick={clearForm}>
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
