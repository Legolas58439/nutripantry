"use client";

import { useState } from "react";
import { toast } from "sonner";
import { eatPantryItemAction } from "./actions";
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

type Props = {
  id: string;
  name: string;
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

const round1 = (n: number) => Math.round(n * 10) / 10;

export default function EatDialog({
  id,
  name,
  kcal,
  protein,
  carbs,
  fat,
}: Props) {
  const [open, setOpen] = useState(false);
  const [grams, setGrams] = useState("100");

  // Live preview of the macros for the entered amount (per-100g × grams/100).
  const g = Number(grams) || 0;
  const factor = g / 100;
  const preview = {
    kcal: Math.round((kcal ?? 0) * factor),
    protein: round1((protein ?? 0) * factor),
    carbs: round1((carbs ?? 0) * factor),
    fat: round1((fat ?? 0) * factor),
  };

  async function handleEat(formData: FormData) {
    await eatPantryItemAction(formData);
    toast.success(`Logged ${g}g ${name} — ${preview.kcal} kcal`);
    setOpen(false);
    setGrams("100");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Eat
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eat {name}</DialogTitle>
          <DialogDescription>
            Log how much you ate — macros are calculated from the per-100g values.
          </DialogDescription>
        </DialogHeader>

        <form action={handleEat} className="space-y-4">
          <input type="hidden" name="id" value={id} />
          <div className="space-y-1.5">
            <Label htmlFor={`grams-${id}`}>Amount (grams)</Label>
            <Input
              id={`grams-${id}`}
              name="grams"
              type="number"
              min="1"
              step="any"
              required
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-4 gap-2 rounded-md border bg-muted/40 p-3 text-center">
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
