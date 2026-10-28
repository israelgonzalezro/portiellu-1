"use client";

import { useMemo, useState } from "react";
import { addDays, parseISODate, toISODate } from "../lib/dates";
import { nightlyPrice } from "../lib/pricing";
import { site } from "../lib/site";
import type { AvailabilityData } from "../lib/use-availability";

type MonthAvailabilityProps = {
  data: AvailabilityData;
  aptId: string;
  onAptChange: (aptId: string) => void;
  range: { start?: string; end?: string };
  onRange: (range: { start?: string; end?: string }) => void;
  lang?: "es" | "en";
};

function monthStart(date: string) {
  return `${date.slice(0, 7)}-01`;
}

function addMonths(month: string, count: number) {
  const date = parseISODate(month);
  date.setUTCMonth(date.getUTCMonth() + count);
  return toISODate(date);
}

// Calendario mensual de un apartamento: libre, reservado o cerrado, con el precio de cada noche.
export default function MonthAvailability({ data, aptId, onAptChange, range, onRange, lang = "es" }: MonthAvailabilityProps) {
  const isEn = lang === "en";
  const locale = isEn ? "en-GB" : "es-ES";
  const [month, setMonth] = useState(monthStart(range.start ?? data.today));
  const apt = data.apartments.find((item) => item.id === aptId) ?? data.apartments[0];
  const busy = useMemo(() => new Set(apt.busy), [apt]);
  const closed = useMemo(() => new Set(apt.closed), [apt]);

  const weekdays = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    return Array.from({ length: 7 }, (_, i) => formatter.format(parseISODate(`2024-01-0${i + 1}`)));
  }, [locale]);
  const monthTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });

  const unavailable = (day: string) => busy.has(day) || closed.has(day);
  const choosingEnd = Boolean(range.start && !range.end);

  // Salida válida: al menos el mínimo de noches y sin noches ocupadas entre medias.
  function validCheckout(day: string) {
    if (!range.start || day < addDays(range.start, site.minNights)) return false;
    for (let night = range.start; night < day; night = addDays(night, 1)) {
      if (unavailable(night)) return false;
    }
    return true;
  }

  function pick(day: string) {
    if (choosingEnd && validCheckout(day)) {
      onRange({ start: range.start, end: day });
      return;
    }
    if (unavailable(day)) return;
    onRange({ start: day, end: undefined });
  }

  function renderMonth(first: string) {
    const offset = (parseISODate(first).getUTCDay() + 6) % 7;
    const days: (string | null)[] = Array.from({ length: offset }, () => null);
    for (let day = first; day.slice(0, 7) === first.slice(0, 7); day = addDays(day, 1)) days.push(day);

    return (
      <div className="ma-month" key={first}>
        <p className="ma-title">{capitalize(monthTitle.format(parseISODate(first)))}</p>
        <div className="ma-grid">
          {weekdays.map((name, i) => (
            <span key={i} className="ma-weekday">
              {name.replace(".", "")}
            </span>
          ))}
          {days.map((day, i) => {
            if (!day) return <span key={`e${i}`} />;
            const past = day < data.today;
            const isBusy = busy.has(day);
            const isClosed = !isBusy && closed.has(day);
            const inRange = range.start && range.end && day >= range.start && day < range.end;
            const isStart = day === range.start;
            const isEnd = day === range.end;
            const checkoutOk = choosingEnd && validCheckout(day);
            const price = !past && !isBusy && !isClosed ? nightlyPrice(data.prices, apt.id, day) : null;
            const state = past ? "past" : isBusy ? "busy" : isClosed ? "closed" : "free";
            const clickable = !past && (checkoutOk || state === "free");
            return (
              <button
                key={day}
                type="button"
                disabled={!clickable}
                onClick={() => pick(day)}
                className={`ma-day ${state}${inRange || isStart ? " picked" : ""}${isEnd ? " checkout" : ""}${
                  checkoutOk ? " can-end" : ""
                }`}
              >
                <strong>{parseISODate(day).getUTCDate()}</strong>
                {price ? <small>{price}€</small> : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="ma">
      <div className="ma-tabs" role="tablist">
        {data.apartments.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === apt.id}
            className={item.id === apt.id ? "active" : ""}
            onClick={() => onAptChange(item.id)}
          >
            {isEn ? item.nameEn : item.name}
            <small>{isEn ? `up to ${item.capacity}` : `hasta ${item.capacity}`}</small>
          </button>
        ))}
      </div>

      <div className="ma-body">
        <div className="ma-nav">
          <button type="button" disabled={month <= monthStart(data.today)} onClick={() => setMonth(addMonths(month, -1))} aria-label="‹">
            ‹
          </button>
          <button type="button" onClick={() => setMonth(addMonths(month, 1))} aria-label="›">
            ›
          </button>
        </div>
        <div className="ma-months">
          {renderMonth(month)}
          {renderMonth(addMonths(month, 1))}
        </div>
      </div>

      <div className="ma-legend">
        <span>
          <i className="dot free" /> {isEn ? "Available" : "Libre"}
        </span>
        <span>
          <i className="dot busy" /> {isEn ? "Booked" : "Reservado"}
        </span>
        <span>
          <i className="dot closed" /> {isEn ? "Closed" : "Cerrado"}
        </span>
        <span className="ma-hint">
          {choosingEnd
            ? isEn
              ? `Now pick your check-out day (min. ${site.minNights} nights).`
              : `Ahora elige el día de salida (mín. ${site.minNights} noches).`
            : isEn
              ? "Pick your check-in day."
              : "Elige el día de llegada."}
        </span>
      </div>
    </div>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
