import { listPantry } from "@/lib/data/pantry";
import { deleteItemAction } from "./actions";
import AddItemForm from "./AddItemForm";

// THE PANTRY PAGE.
//
// This is a React Server Component (the default in the App Router). Because it
// runs on the server, it can be `async` and `await` data directly — no useState,
// no useEffect, no loading spinner plumbing. By the time the HTML reaches the
// browser, the data is already in it.
//
// Putting this file at app/pantry/page.tsx is what creates the URL "/pantry".
export default async function PantryPage() {
  const items = await listPantry();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold text-emerald-700">Pantry</h1>
      <p className="mt-1 text-zinc-600">What you have on hand.</p>

      {/* The add form */}
      <AddItemForm />

      {/* The list of items */}
      <table className="mt-8 w-full border-collapse text-left">
        <thead>
          <tr className="border-b text-sm uppercase text-zinc-500">
            <th className="py-2">Name</th>
            <th className="py-2">Qty</th>
            <th className="py-2">Unit</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center text-zinc-400">
                Nothing in your pantry yet. Add something above.
              </td>
            </tr>
          ) : (
            // .map() turns each item in the array into a table row.
            // The `key` prop helps React track rows efficiently — always give
            // lists a stable, unique key (the item id is perfect).
            items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 font-medium">{item.name}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">{item.unit}</td>
                <td className="py-2 text-right">
                  {/* A tiny form whose only job is to submit this item's id
                      to the delete action. The id rides along in a hidden input. */}
                  <form action={deleteItemAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
