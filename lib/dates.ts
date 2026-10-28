// Fechas como texto "YYYY-MM-DD" para evitar problemas de zona horaria.

export function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseISODate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

export function isISODate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return toISODate(parseISODate(value)) === value;
}

export function addDays(value: string, days: number) {
  const date = parseISODate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return toISODate(date);
}

// Noches entre la entrada (incluida) y la salida (excluida).
export function nightsBetween(start: string, end: string) {
  const nights: string[] = [];
  for (let day = start; day < end; day = addDays(day, 1)) {
    nights.push(day);
  }
  return nights;
}

export function todayInSpain() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
}

export function formatDate(value: string, lang: "es" | "en" = "es") {
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  }).format(parseISODate(value));
}
