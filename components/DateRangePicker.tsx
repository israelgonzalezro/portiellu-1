"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, formatDate, nightsBetween, parseISODate, toISODate } from "../lib/dates";
import { site } from "../lib/site";
import Icon from "./Icons";

export type DateRange = { start: string; end: string };

type DateRangePickerProps = {
  today: string;
  value: Partial<DateRange>;
  onChange: (value: Partial<DateRange>) => void;
  lang?: "es" | "en";
  labels: { checkIn: string; checkOut: string; placeholder: string };
  // Noches en las que no queda ningún apartamento libre
  fullNights?: Set<string>;
  // Precio orientativo de cada noche ("desde")
  nightPrice?: (date: string) => number | null;
};

function monthStart(date: string) {
  return `${date.slice(0, 7)}-01`;
}

function addMonths(month: string, count: number) {
  const date = parseISODate(month);
  date.setUTCMonth(date.getUTCMonth() + count);
  return toISODate(date);
}

export default function DateRangePicker({
  today,
  value,
  onChange,
  lang = "es",
  labels,
  fullNights,
  nightPrice
}: DateRangePickerProps) {
  const isEn = lang === "en";
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(monthStart(value.start ?? today));
  const locale = isEn ? "en-GB" : "es-ES";

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const weekdays = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
    // 2024-01-01 fue lunes
    return Array.from({ length: 7 }, (_, i) => formatter.format(parseISODate(`2024-01-0${i + 1}`)));
  }, [locale]);

  const monthTitle = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const choosingEnd = Boolean(value.start && !value.end);
  const earliestEnd = value.start ? addDays(value.start, site.minNights) : "";

  function pick(date: string) {
    if (!choosingEnd || date <= value.start!) {
      onChange({ start: date, end: undefined });
      return;
    }
    if (date < earliestEnd) return;
    onChange({ start: value.start, end: date });
    setOpen(false);
  }

  function renderMonth(first: string) {
    const offset = (parseISODate(first).getUTCDay() + 6) % 7;
    const days: (string | null)[] = Array.from({ length: offset }, () => null);
    for (let day = first; day.slice(0, 7) === first.slice(0, 7); day = addDays(day, 1)) days.push(day);

    return (
      <div className="drp-month" key={first}>
        <p className="drp-title">{capitalize(monthTitle.format(parseISODate(first)))}</p>
        <div className="drp-grid">
          {weekdays.map((name, i) => (
            <span key={i} className="drp-weekday">
              {name}
            </span>
          ))}
          {days.map((day, i) => {
            if (!day) return <span key={`e${i}`} />;
            const past = day < today;
            const tooShort = choosingEnd && day > value.start! && day < earliestEnd;
            const inRange = value.start && value.end && day > value.start && day < value.end;
            const edge = day === value.start || day === value.end;
            const full = fullNights?.has(day);
            const price = !past && !full ? nightPrice?.(day) : null;
            return (
              <button
                key={day}
                type="button"
                disabled={past || tooShort}
                className={`drp-day${inRange ? " in-range" : ""}${edge ? " edge" : ""}${full ? " full" : ""}`}
                onClick={() => pick(day)}
              >
                <span>{parseISODate(day).getUTCDate()}</span>
                {price ? <small>{price}€</small> : null}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const canGoBack = month > monthStart(today);
  const nights = value.start && value.end ? nightsBetween(value.start, value.end).length : 0;
  const hint = choosingEnd
    ? isEn
      ? `Now choose your check-out day (minimum ${site.minNights} nights).`
      : `Ahora elige el día de salida (mínimo ${site.minNights} noches).`
    : isEn
      ? `Choose your check-in day. Minimum stay ${site.minNights} nights.`
      : `Elige el día de llegada. Estancia mínima de ${site.minNights} noches.`;

  return (
    <div className="drp">
      <button type="button" className="drp-trigger" onClick={() => setOpen(true)} aria-expanded={open}>
        <Icon name="calendar" size={20} />
        <span className="drp-field">
          <small>{labels.checkIn}</small>
          <strong>{value.start ? formatDate(value.start, lang) : labels.placeholder}</strong>
        </span>
        <span className="drp-arrow">→</span>
        <span className="drp-field">
          <small>{labels.checkOut}</small>
          <strong>{value.end ? formatDate(value.end, lang) : "—"}</strong>
        </span>
      </button>

      {open ? (
        <>
          <div className="drp-backdrop" onClick={() => setOpen(false)} />
          <div className="drp-pop" role="dialog" aria-modal="true">
            <div className="drp-head">
              <p>{hint}</p>
              <button type="button" className="drp-close" onClick={() => setOpen(false)} aria-label={isEn ? "Close" : "Cerrar"}>
                ×
              </button>
            </div>
            <div className="drp-body">
              <div className="drp-nav">
                <button type="button" disabled={!canGoBack} onClick={() => setMonth(addMonths(month, -1))} aria-label="‹">
                  ‹
                </button>
                <button type="button" onClick={() => setMonth(addMonths(month, 1))} aria-label="›">
                  ›
                </button>
              </div>
              <div className="drp-months">
                {renderMonth(month)}
                {renderMonth(addMonths(month, 1))}
              </div>
            </div>
            <div className="drp-foot">
              <span>
                {nightPrice
                  ? isEn
                    ? "Prices from, per night"
                    : "Precios desde, por noche"
                  : ""}
              </span>
              {nights ? <strong>{isEn ? `${nights} nights` : `${nights} noches`}</strong> : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
