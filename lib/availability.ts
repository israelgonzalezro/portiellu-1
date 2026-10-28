import { apartments, type Apartment } from "./apartments";
import { addDays, nightsBetween, todayInSpain } from "./dates";
import { parseIcal, type CalendarEvent } from "./ical";
import { listBookings, type Booking } from "./store";

const CACHE_MS = 5 * 60 * 1000;
const DAYS_AHEAD = 365;

type CacheEntry = { at: number; events: CalendarEvent[] };
const bookingCache = new Map<string, CacheEntry>();

// Lee el calendario iCal que exporta Booking para un apartamento.
async function fetchBookingEvents(apt: Apartment) {
  const url = process.env[apt.icalEnv];
  if (!url) return { events: [] as CalendarEvent[], synced: false };

  const cached = bookingCache.get(apt.id);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return { events: cached.events, synced: true };
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "ElPortiellu-Web/1.0" },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const events = parseIcal(await response.text());
    bookingCache.set(apt.id, { at: Date.now(), events });
    return { events, synced: true };
  } catch (error) {
    console.error(`No se pudo leer el iCal de Booking de ${apt.id}:`, error);
    // Si falla, usamos la última copia aunque esté caducada.
    return cached ? { events: cached.events, synced: true } : { events: [], synced: false };
  }
}

// Reservas que ocupan fechas en la web: confirmadas y bloqueos manuales.
export function blocksDates(booking: Booking) {
  return booking.status === "confirmada" || booking.status === "bloqueo";
}

export type ApartmentAvailability = {
  id: string;
  busy: Set<string>;
  synced: boolean;
};

export async function getAvailability(options: { excludeId?: string } = {}) {
  const today = todayInSpain();
  const until = addDays(today, DAYS_AHEAD);
  const localBookings = (await listBookings()).filter(
    (booking) => blocksDates(booking) && booking.id !== options.excludeId
  );

  return Promise.all(
    apartments.map(async (apt): Promise<ApartmentAvailability> => {
      const { events, synced } = await fetchBookingEvents(apt);
      const busy = new Set<string>();
      const ranges = [
        ...events,
        ...localBookings.filter((booking) => booking.apt === apt.id)
      ];

      for (const range of ranges) {
        const start = range.start < today ? today : range.start;
        const end = range.end > until ? until : range.end;
        for (const night of nightsBetween(start, end)) busy.add(night);
      }

      return { id: apt.id, busy, synced };
    })
  );
}

export async function isRangeFree(
  aptId: string,
  start: string,
  end: string,
  options: { excludeId?: string } = {}
) {
  const availability = await getAvailability(options);
  const apt = availability.find((item) => item.id === aptId);
  if (!apt) return false;
  return nightsBetween(start, end).every((night) => !apt.busy.has(night));
}
