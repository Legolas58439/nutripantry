import { addItemAction } from "./actions";

// A form for adding a pantry item.
//
// Notice `action={addItemAction}` — we hand the Server Action straight to the
// form's `action`. When you submit, the browser packages the inputs into
// FormData and Next.js runs addItemAction on the server. No onSubmit handler,
// no fetch, no useState needed.
//
// Each <input> has a `name`. That name is the key we read in the action with
// formData.get("name"), formData.get("quantity"), etc.
export default function AddItemForm() {
  return (
    <form
      action={addItemAction}
      className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4"
    >
      <label className="flex flex-col text-sm text-zinc-700">
        Name
        <input
          name="name"
          required
          placeholder="e.g. Rice"
          className="mt-1 rounded border bg-white px-2 py-1 text-zinc-900 placeholder:text-zinc-400"
        />
      </label>

      <label className="flex flex-col text-sm text-zinc-700">
        Quantity
        <input
          name="quantity"
          type="number"
          min="0"
          step="any"
          required
          placeholder="500"
          className="mt-1 w-24 rounded border bg-white px-2 py-1 text-zinc-900 placeholder:text-zinc-400"
        />
      </label>

      <label className="flex flex-col text-sm text-zinc-700">
        Unit
        <input
          name="unit"
          required
          placeholder="g"
          className="mt-1 w-28 rounded border bg-white px-2 py-1 text-zinc-900 placeholder:text-zinc-400"
        />
      </label>

      <button
        type="submit"
        className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
      >
        Add
      </button>
    </form>
  );
}
