import { apartments } from "./apartments";
import { isISODate } from "./dates";
import { emptyPriceRules, type PriceRules } from "./pricing";
import { getSetting, saveSetting } from "./store";

const KEY = "precios";

export async function getPriceRules() {
  return (await getSetting<PriceRules>(KEY)) ?? emptyPriceRules;
}

function cleanPrices(input: unknown) {
  const prices: Record<string, number> = {};
  if (!input || typeof input !== "object") return prices;
  for (const apt of apartments) {
    const value = Number((input as Record<string, unknown>)[apt.id]);
    if (Number.isFinite(value) && value > 0 && value < 10000) prices[apt.id] = Math.round(value);
  }
  return prices;
}

// Valida lo que llega del panel antes de guardarlo.
export function sanitizePriceRules(input: unknown): PriceRules | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as { base?: unknown; seasons?: unknown };
  const seasons = Array.isArray(raw.seasons) ? raw.seasons : [];

  const clean: PriceRules = { base: cleanPrices(raw.base), seasons: [] };
  for (const item of seasons.slice(0, 50)) {
    const season = item as Record<string, unknown>;
    if (!isISODate(season.start) || !isISODate(season.end) || season.end < season.start) return null;
    clean.seasons.push({
      id: typeof season.id === "string" && season.id ? season.id.slice(0, 40) : crypto.randomUUID(),
      name: typeof season.name === "string" ? season.name.slice(0, 60) : "",
      start: season.start,
      end: season.end,
      prices: cleanPrices(season.prices)
    });
  }
  return clean;
}

export async function savePriceRules(rules: PriceRules) {
  await saveSetting(KEY, rules);
}
