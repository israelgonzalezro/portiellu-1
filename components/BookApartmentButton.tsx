"use client";

import { emitSearch } from "../lib/booking-events";

export default function BookApartmentButton({ apt, label }: { apt: string; label: string }) {
  return (
    <button type="button" className="btn btn-gold" onClick={() => emitSearch({ apt })}>
      {label}
    </button>
  );
}
