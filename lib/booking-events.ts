// Comunica el buscador de la portada con la sección de reservas.
export type SearchDetail = { start?: string; end?: string; guests?: number; apt?: string };

const EVENT = "portiellu:search";

export function emitSearch(detail: SearchDetail) {
  window.dispatchEvent(new CustomEvent<SearchDetail>(EVENT, { detail }));
  document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function onSearch(handler: (detail: SearchDetail) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<SearchDetail>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
