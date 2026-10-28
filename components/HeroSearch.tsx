"use client";

import { useState } from "react";
import DateRangePicker, { type DateRange } from "./DateRangePicker";
import Icon from "./Icons";
import { emitSearch } from "../lib/booking-events";
import { content, type Lang } from "../lib/content";
import { todayInSpain } from "../lib/dates";

export default function HeroSearch({ lang = "es" }: { lang?: Lang }) {
  const t = content[lang].booking;
  const [range, setRange] = useState<Partial<DateRange>>({});
  const [guests, setGuests] = useState(2);

  return (
    <form
      className="hero-search"
      onSubmit={(event) => {
        event.preventDefault();
        emitSearch({ start: range.start, end: range.end, guests });
      }}
    >
      <DateRangePicker
        today={todayInSpain()}
        value={range}
        onChange={setRange}
        lang={lang}
        labels={{ checkIn: t.checkIn, checkOut: t.checkOut, placeholder: t.datesPlaceholder }}
      />
      <label className="guests-field">
        <Icon name="users" size={20} />
        <span>
          <small>{t.guests}</small>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </span>
      </label>
      <button type="submit" className="btn btn-gold">
        {t.search}
      </button>
    </form>
  );
}
