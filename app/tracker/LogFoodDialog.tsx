"use client";

import { useState } from "react";
import { toast } from "sonner";
import { logFoodAction, searchFoodAction } from "./actions";
import type { FoodResult } from "@/lib/nutrition/openfoodfacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const round1 = (n: number) => Math.round(n * 10) / 10;

export default function LogFoodDialog() {
  const [open, setOpen] = useState(false);

  // search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  // editable fields (per-100g, like the rest of the app)
  const [name, setName] = useState("");
  const [grams, setGrams] = useState("100");
  const [brand, setBrand] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

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
      if (found.length === 0) setError("No matches found.");
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

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

  function reset() {
    setQuery("");
    setResults([]);
    setError("");
    setName("");
    setGrams("100");
    setBrand("");
    setKcal("");
    setProtein("");
    setCarbs("");
    setFat("");
  }

  const g = Number(grams) || 0;
  const factor = g / 100;
  const preview = {
    kcal: Math.round((Number(kcal) || 0) * factor),
    protein: round1((Number(protein) || 0) * factor),
    carbs: round1((Number(carbs) || 0) * factor),
    fat: round1((Number(fat) || 0) * factor),
  };

  async function handleLog(formData: FormData) {
    await logFoodAction(formData);
    toast.success(`Logged ${g}g ${name} — ${preview.kcal} kcal`);
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Log food</Button>} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Log food</DialogTitle>
          <DialogDescription>
            Search the database or enter values by hand. Macros are per 100g.
          </DialogDescription>
        </DialogHeader>

        {/* search */}
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="log-search">Search (optional)</Label>
            <Input
              id="log-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="e.g. banana"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? "…" : "Search"}
          </Button>
        </div>
        {error && <p className="text-sm text-amber-600">{error}</p>}
        {results.length > 0 && (
          <ul className="max-h-40 divide-y overflow-auto rounded-md border">
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
                    {food.kcal != null ? `${food.kcal} kcal` : "no kcal"} / 100g
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <form action={handleLog} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="log-name">Name</Label>
              <Input
                id="log-name"
                name="name"
                required
                placeholder="e.g. Banana"
                {...field(name, setName)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-grams">Amount (grams)</Label>
              <Input
                id="log-grams"
                name="grams"
                type="number"
                min="1"
                step="any"
                required
                {...field(grams, setGrams)}
              />
            </div>
          </div>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Nutrition per 100g
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="log-kcal">kcal</Label>
              <Input id="log-kcal" name="kcal" type="number" min="0" step="any" {...field(kcal, setKcal)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-protein">Protein</Label>
              <Input id="log-protein" name="protein" type="number" min="0" step="any" {...field(protein, setProtein)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-carbs">Carbs</Label>
              <Input id="log-carbs" name="carbs" type="number" min="0" step="any" {...field(carbs, setCarbs)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="log-fat">Fat</Label>
              <Input id="log-fat" name="fat" type="number" min="0" step="any" {...field(fat, setFat)} />
            </div>
          </div>

          {/* brand rides along hidden (set when you pick a search result) */}
          <input type="hidden" name="brand" value={brand} />

          <div className="grid grid-cols-4 gap-2 rounded-md border bg-muted/40 p-3 text-center text-sm">
            <Stat label="kcal" value={preview.kcal} />
            <Stat label="Protein" value={preview.protein} />
            <Stat label="Carbs" value={preview.carbs} />
            <Stat label="Fat" value={preview.fat} />
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Log it</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
