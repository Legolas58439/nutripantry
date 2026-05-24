"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveGoalsAction } from "./actions";
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

type Goals = {
  kcal: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
} | null;

export default function GoalsDialog({ goals }: { goals: Goals }) {
  const [open, setOpen] = useState(false);

  async function handleSave(formData: FormData) {
    await saveGoalsAction(formData);
    toast.success("Goals saved");
    setOpen(false);
  }

  const def = (v: number | null | undefined) => (v != null ? String(v) : "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline">Goals</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Daily goals</DialogTitle>
          <DialogDescription>
            Set your daily targets. Leave a field blank to skip it.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="g-kcal">kcal</Label>
              <Input
                id="g-kcal"
                name="kcal"
                type="number"
                min="0"
                step="any"
                defaultValue={def(goals?.kcal)}
                placeholder="2000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-protein">Protein (g)</Label>
              <Input
                id="g-protein"
                name="protein"
                type="number"
                min="0"
                step="any"
                defaultValue={def(goals?.protein)}
                placeholder="150"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-carbs">Carbs (g)</Label>
              <Input
                id="g-carbs"
                name="carbs"
                type="number"
                min="0"
                step="any"
                defaultValue={def(goals?.carbs)}
                placeholder="200"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-fat">Fat (g)</Label>
              <Input
                id="g-fat"
                name="fat"
                type="number"
                min="0"
                step="any"
                defaultValue={def(goals?.fat)}
                placeholder="70"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save goals</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
