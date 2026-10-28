"use client";

import { useMemo, useRef } from "react";
import { addDays, nightsBetween, parseISODate } from "../lib/dates";

export type CalendarApartment = {
  id: string;
  name: string;
  nameEn: string;
  capacity: number;
  summary: string;
  summaryEn: string;
  synced: boolean;
  busy: string[];
};

export type CalendarSelection = {
  apt: string;
  start: string;
  end?: string;
};

type AvailabilityCalendarProps = {
  today: string;
  apartments: CalendarApartment[];
  selection?: CalendarSelection | null;
  onSelect?: (selection: CalendarSelection | null) => void;
  lang?: "es" | "en";
  days?: number;
};

const SCROLL_DAYS = 7;

export default function AvailabilityCalendar({
  today,
  apartments,
  selection,
  onSelect,
  lang = "es",
  days = 240
}: AvailabilityCalendarProps) {
  const isEn = lang === "en";
  const scrollerRef = useRef<HTMLDivElement>(null);
  const locale = isEn ? "en-GB" : "es-ES";

  const dates = useMemo(
    () => Array.from({ length: days }, (_, index) => addDays(today, index)),
    [today, days]
  );

  const busyByApt = useMemo(
    () => new Map(apartments.map((apt) => [apt.id, new Set(apt.busy)])),
    [apartments]
  );

  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });

  // Primer día ocupado después de la entrada: es la salida más tardía posible.
  function lastCheckout(aptId: string, start: string) {
    const busy = busyByApt.get(aptId) ?? new Set<string>();
    let day = addDays(start, 1);
    const limit = dates[dates.length - 1];
    while (day <= limit && !busy.has(day)) day = addDays(day, 1);
    return day;
  }

  const choosingCheckout = selection && !selection.end ? selection : null;
  const maxCheckout = choosingCheckout ? lastCheckout(choosingCheckout.apt, choosingCheckout.start) : null;

  function cellState(aptId: string, date: string) {
    const busy = busyByApt.get(aptId)?.has(date) ?? false;
    const selected =
      selection?.apt === aptId &&
      (selection.end
        ? date >= selection.start && date < selection.end
        : date === selection.start);
    const isCheckout = selection?.apt === aptId && selection.end === date;
    const validCheckout =
      choosingCheckout?.apt === aptId && date > choosingCheckout.start && date <= (maxCheckout ?? "");
    const clickable = Boolean(onSelect) && (!busy || validCheckout);
    return { busy, selected, isCheckout, validCheckout, clickable };
  }

  function handleClick(aptId: string, date: string) {
    if (!onSelect) return;
    const { busy, validCheckout } = cellState(aptId, date);

    if (choosingCheckout && validCheckout) {
      onSelect({ apt: aptId, start: choosingCheckout.start, end: date });
      return;
    }
    if (busy) return;
    onSelect({ apt: aptId, start: date });
  }

  function scrollBy(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    const cell = scroller?.querySelector<HTMLElement>(".cal-day");
    if (!scroller || !cell) return;
    scroller.scrollBy({ left: direction * cell.offsetWidth * SCROLL_DAYS, behavior: "smooth" });
  }

  return (
    <div className="cal">
      <div className="cal-toolbar">
        <div className="cal-legend">
          <span>
            <i className="dot free" /> {isEn ? "Available" : "Libre"}
          </span>
          <span>
            <i className="dot busy" /> {isEn ? "Booked" : "Ocupado"}
          </span>
          {onSelect ? (
            <span>
              <i className="dot picked" /> {isEn ? "Your stay" : "Tu estancia"}
            </span>
          ) : null}
        </div>
        <div className="cal-nav">
          <button type="button" onClick={() => scrollBy(-1)} aria-label={isEn ? "Previous week" : "Semana anterior"}>
            ‹
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label={isEn ? "Next week" : "Semana siguiente"}>
            ›
          </button>
        </div>
      </div>

      <div className="cal-scroller" ref={scrollerRef}>
        <table className="cal-grid">
          <thead>
            <tr className="cal-months">
              <th className="cal-apt" />
              {dates.map((date) =>
                date === today || date.endsWith("-01") ? (
                  <th key={date} className="cal-month" colSpan={1}>
                    <span>{capitalize(monthName.format(parseISODate(date)))}</span>
                  </th>
                ) : (
                  <th key={date} />
                )
              )}
            </tr>
            <tr>
              <th className="cal-apt" />
              {dates.map((date) => {
                const day = parseISODate(date);
                const weekend = day.getUTCDay() === 0 || day.getUTCDay() === 6;
                return (
                  <th key={date} className={`cal-day${weekend ? " weekend" : ""}`}>
                    <small>{weekday.format(day)}</small>
                    <strong>{day.getUTCDate()}</strong>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) => (
              <tr key={apt.id}>
                <th scope="row" className="cal-apt">
                  <strong>{isEn ? apt.nameEn : apt.name}</strong>
                  <small>{isEn ? apt.summaryEn : apt.summary}</small>
                </th>
                {dates.map((date) => {
                  const state = cellState(apt.id, date);
                  const classes = [
                    "cal-cell",
                    state.busy ? "busy" : "free",
                    state.selected ? "picked" : "",
                    state.isCheckout ? "checkout" : "",
                    state.validCheckout ? "can-checkout" : ""
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const label = `${isEn ? apt.nameEn : apt.name}, ${date}: ${
                    state.busy ? (isEn ? "booked" : "ocupado") : isEn ? "available" : "libre"
                  }`;
                  return (
                    <td key={date} className={classes}>
                      {onSelect ? (
                        <button
                          type="button"
                          disabled={!state.clickable}
                          onClick={() => handleClick(apt.id, date)}
                          aria-label={label}
                          aria-pressed={state.selected}
                        />
                      ) : (
                        <span aria-label={label} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {onSelect ? (
        <p className="cal-hint">
          {choosingCheckout
            ? isEn
              ? "Now tap your check-out day."
              : "Ahora pulsa el día de salida."
            : isEn
              ? "Tap your check-in day on the apartment you want, then your check-out day."
              : "Pulsa el día de entrada en el apartamento que quieras y después el día de salida."}
        </p>
      ) : null}
    </div>
  );
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function countNights(selection: CalendarSelection | null | undefined) {
  return selection?.end ? nightsBetween(selection.start, selection.end).length : 0;
}
