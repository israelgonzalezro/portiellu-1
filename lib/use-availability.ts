"use client";

import { useCallback, useEffect, useState } from "react";
import type { CalendarApartment } from "../components/AvailabilityCalendar";
import { nightlyPrice, type PriceRules } from "./pricing";

export type AvailabilityData = {
  today: string;
  apartments: CalendarApartment[];
  prices?: PriceRules;
};

// Una sola petición compartida entre el buscador de la portada y la sección de reservas.
let pending: Promise<AvailabilityData> | null = null;

function fetchAvailability(force = false) {
  if (!pending || force) {
    pending = fetch("/api/disponibilidad", { cache: "no-store" }).then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json() as Promise<AvailabilityData>;
    });
    pending.catch(() => {
      pending = null;
    });
  }
  return pending;
}

export function useAvailability() {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [error, setError] = useState(false);

  const reload = useCallback(async (force = true) => {
    try {
      setData(await fetchAvailability(force));
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    reload(false);
  }, [reload]);

  return { data, error, reload };
}

// Noches no disponibles de cada apartamento (reservadas o cerradas).
export function unavailableNights(data: AvailabilityData | null) {
  return new Map((data?.apartments ?? []).map((apt) => [apt.id, new Set([...apt.busy, ...apt.closed])]));
}

// Noches en las que no queda ningún apartamento libre.
export function fullNights(data: AvailabilityData | null, unavailable: Map<string, Set<string>>) {
  if (!data) return undefined;
  const [first, ...rest] = data.apartments.map((apt) => unavailable.get(apt.id) ?? new Set<string>());
  return new Set([...(first ?? [])].filter((night) => rest.every((set) => set.has(night))));
}

// Precio más bajo de esa noche entre los apartamentos libres que caben los huéspedes.
export function lowestNightPrice(
  data: AvailabilityData | null,
  unavailable: Map<string, Set<string>>,
  date: string,
  guests = 1
) {
  let lowest: number | null = null;
  for (const apt of data?.apartments ?? []) {
    if (apt.capacity < guests || unavailable.get(apt.id)?.has(date)) continue;
    const price = nightlyPrice(data?.prices, apt.id, date);
    if (price !== null && (lowest === null || price < lowest)) lowest = price;
  }
  return lowest;
}
