import { nightsBetween } from "./dates";

export type Season = {
  id: string;
  name: string;
  // Noches desde start hasta end, ambas incluidas (YYYY-MM-DD)
  start: string;
  end: string;
  prices: Record<string, number>;
};

export type PriceRules = {
  base: Record<string, number>;
  seasons: Season[];
};

export const emptyPriceRules: PriceRules = { base: {}, seasons: [] };

function validPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

// Precio de una noche: la última temporada que la incluya manda; si no, el precio base.
export function nightlyPrice(rules: PriceRules | null | undefined, aptId: string, date: string) {
  if (!rules) return null;
  for (let i = rules.seasons.length - 1; i >= 0; i--) {
    const season = rules.seasons[i];
    if (date >= season.start && date <= season.end && validPrice(season.prices[aptId])) {
      return season.prices[aptId];
    }
  }
  return validPrice(rules.base[aptId]) ? rules.base[aptId] : null;
}

// Total de la estancia, o null si alguna noche no tiene precio.
export function stayTotal(
  rules: PriceRules | null | undefined,
  aptId: string,
  start: string,
  end: string
) {
  let total = 0;
  for (const night of nightsBetween(start, end)) {
    const price = nightlyPrice(rules, aptId, night);
    if (price === null) return null;
    total += price;
  }
  return total;
}

export function formatEuros(amount: number, lang: "es" | "en" = "es") {
  return new Intl.NumberFormat(lang === "en" ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(amount);
}
