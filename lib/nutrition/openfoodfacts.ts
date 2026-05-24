// Talks to the free OpenFoodFacts search service
// (https://search.openfoodfacts.org). No API key, no signup.
//
// We use the modern "search-a-licious" endpoint rather than the older
// /cgi/search.pl one, because the old endpoint is slow and frequently returns
// transient 503 errors. The new one is faster and gives more relevant results,
// especially for whole foods like "broccoli".
//
// All nutrition numbers from OpenFoodFacts are "per 100g" of the product.

// The clean, simplified shape we hand back to the rest of the app. The raw API
// response has dozens of messy fields; we pick out only what we need.
export type FoodResult = {
  name: string;
  brand: string;
  kcal: number | null; // null means "this product has no value for it"
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

export async function searchFood(query: string): Promise<FoodResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // URLSearchParams safely encodes the query (spaces, accents, etc.).
  const url =
    "https://search.openfoodfacts.org/search?" +
    new URLSearchParams({
      q: trimmed,
      page_size: "5", // only the top 5 matches
      fields: "product_name,brands,nutriments",
    }).toString();

  // The service occasionally blips, so try twice before giving up.
  const data = await fetchJsonWithRetry(url, 2);

  // Results live under "hits" in this API's response.
  const hits: unknown[] = Array.isArray(data.hits) ? data.hits : [];

  return hits
    .map((raw): FoodResult => {
      // We don't trust the shape of each hit, so we read defensively.
      const p = raw as Record<string, unknown>;
      const n = (p.nutriments ?? {}) as Record<string, unknown>;
      return {
        name: typeof p.product_name === "string" ? p.product_name : "",
        brand: typeof p.brands === "string" ? p.brands : "",
        kcal: numberOrNull(n["energy-kcal_100g"]),
        protein: numberOrNull(n["proteins_100g"]),
        carbs: numberOrNull(n["carbohydrates_100g"]),
        fat: numberOrNull(n["fat_100g"]),
      };
    })
    .filter((r) => r.name.length > 0); // drop entries with no usable name
}

// --- helpers -------------------------------------------------------------

// Try fetchJson up to `attempts` times. Retrying smooths over the occasional
// transient error (like a 503) that succeeds on a second attempt.
async function fetchJsonWithRetry(
  url: string,
  attempts: number,
): Promise<Record<string, unknown>> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchJson(url);
    } catch (err) {
      lastError = err; // remember it, then loop and try again
    }
  }
  throw lastError; // all attempts failed — let the caller handle it
}

// Fetch a URL and parse JSON, with an 8-second timeout so a hung request can't
// freeze the search forever.
async function fetchJson(url: string): Promise<Record<string, unknown>> {
  // AbortController is the standard way to cancel a fetch. We start a timer
  // that aborts the request after 8s.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Nutripantry/0.1 (learning project)" },
      cache: "no-store", // always fetch fresh search results
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`OpenFoodFacts request failed: ${res.status}`);
    }
    return (await res.json()) as Record<string, unknown>;
  } finally {
    clearTimeout(timeout); // always clean up the timer
  }
}

// Convert an unknown value to a number, or null if it isn't a real number.
function numberOrNull(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
