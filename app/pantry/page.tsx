import { listPantry } from "@/lib/data/pantry";
import { deleteItemAction } from "./actions";
import AddItemForm from "./AddItemForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Render fresh on every request — pantry contents live in the database.
export const dynamic = "force-dynamic";

export default async function PantryPage() {
  const items = await listPantry();

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6 sm:p-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-700">Pantry</h1>
        <p className="mt-1 text-muted-foreground">What you have on hand.</p>
      </div>

      <AddItemForm />

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>Nutrition values are per 100g.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">kcal</TableHead>
                <TableHead className="text-right">Protein</TableHead>
                <TableHead className="text-right">Carbs</TableHead>
                <TableHead className="text-right">Fat</TableHead>
                <TableHead className="w-0"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Nothing in your pantry yet. Add something above.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name}
                      {item.brand ? (
                        <span className="block text-xs font-normal text-muted-foreground">
                          {item.brand}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="text-right">{item.kcal ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      {item.protein ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">{item.carbs ?? "—"}</TableCell>
                    <TableCell className="text-right">{item.fat ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <form action={deleteItemAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <Button
                          type="submit"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Nutrition data sourced from{" "}
        <a
          href="https://world.openfoodfacts.org"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenFoodFacts
        </a>
        .
      </p>
    </main>
  );
}
