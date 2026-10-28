"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import MonthAvailability from "./MonthAvailability";
import DateRangePicker, { type DateRange } from "./DateRangePicker";
import Icon from "./Icons";
import { onSearch } from "../lib/booking-events";
import { content, type Lang } from "../lib/content";
import { formatDate, nightsBetween } from "../lib/dates";
import { photos } from "../lib/photos";
import { formatEuros, stayTotal } from "../lib/pricing";
import { site } from "../lib/site";
import { fullNights as findFullNights, lowestNightPrice, unavailableNights, useAvailability } from "../lib/use-availability";

type GuestForm = {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  website: string;
  privacidad: boolean;
  mascota: boolean;
};

const emptyForm: GuestForm = {
  nombre: "",
  email: "",
  telefono: "",
  mensaje: "",
  website: "",
  privacidad: false,
  mascota: false
};

export default function BookingWidget({ lang = "es" }: { lang?: Lang }) {
  const t = content[lang].booking;
  const isEn = lang === "en";
  const { data, error: loadError, reload: load } = useAvailability();
  const [range, setRange] = useState<Partial<DateRange>>({});
  const [guests, setGuests] = useState(2);
  const [selectedApt, setSelectedApt] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarApt, setCalendarApt] = useState("el-portiellu");
  const [form, setForm] = useState<GuestForm>(emptyForm);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; error?: boolean } | null>(null);
  const startedAtRef = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  // Búsqueda lanzada desde la portada o desde el botón "Reservar" de un apartamento.
  useEffect(
    () =>
      onSearch((detail) => {
        if (detail.start !== undefined || detail.end !== undefined) setRange({ start: detail.start, end: detail.end });
        if (detail.guests) setGuests(detail.guests);
        setSelectedApt(detail.apt ?? null);
        if (detail.apt) setCalendarApt(detail.apt);
        setFeedback(null);
      }),
    []
  );

  const unavailable = useMemo(() => unavailableNights(data), [data]);
  const hasPrices = Boolean(data?.prices && (Object.keys(data.prices.base).length || data.prices.seasons.length));

  // Noches sin ningún apartamento libre: se marcan en el selector de fechas.
  const fullNights = useMemo(() => findFullNights(data, unavailable), [data, unavailable]);

  const nights = range.start && range.end ? nightsBetween(range.start, range.end) : [];
  const hasDates = nights.length >= site.minNights;

  const results = (data?.apartments ?? []).map((apt) => {
    const free = hasDates && nights.every((night) => !unavailable.get(apt.id)?.has(night));
    const fits = guests <= apt.capacity;
    const total = hasDates ? stayTotal(data?.prices, apt.id, range.start!, range.end!) : null;
    return { apt, free, fits, total, bookable: free && fits };
  });

  const selected = results.find((result) => result.apt.id === selectedApt && result.bookable);
  const petSupplement = selected?.apt.pets && form.mascota ? site.petFee * nights.length : 0;
  const selectedTotal = selected?.total != null ? selected.total + petSupplement : null;

  function choose(aptId: string) {
    setSelectedApt(aptId);
    setCalendarApt(aptId);
    setFeedback(null);
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  // Fechas elegidas en el calendario mensual de un apartamento concreto.
  function onMonthRange(next: { start?: string; end?: string }) {
    setRange(next);
    setFeedback(null);
    if (next.start && next.end) {
      setSelectedApt(calendarApt);
      const apt = data?.apartments.find((item) => item.id === calendarApt);
      if (apt && guests > apt.capacity) setGuests(apt.capacity);
      window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } else {
      setSelectedApt(null);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || !range.start || !range.end) return;
    setSending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          mascota: selected.apt.pets && form.mascota,
          huespedes: String(guests),
          apartamento: selected.apt.id,
          fechaEntrada: range.start,
          fechaSalida: range.end,
          lang,
          formStartedAt: startedAtRef.current
        })
      });
      const result = (await response.json().catch(() => ({}))) as { message?: string; unavailable?: boolean };
      if (!response.ok) {
        setFeedback({ text: result.message ?? (isEn ? "Could not send your request." : "No se pudo enviar la solicitud."), error: true });
        if (result.unavailable) {
          setSelectedApt(null);
          load();
        }
        return;
      }
      setFeedback({
        text: isEn
          ? "Request sent! We will reply soon to confirm your booking."
          : "¡Solicitud enviada! Te responderemos en breve para confirmar la reserva."
      });
      setForm(emptyForm);
      setSelectedApt(null);
      setRange({});
      startedAtRef.current = Date.now();
    } catch {
      setFeedback({
        text: isEn ? "Network error. Please try again." : "Error de red. Inténtalo de nuevo.",
        error: true
      });
    } finally {
      setSending(false);
    }
  }

  const update = <K extends keyof GuestForm>(key: K, value: GuestForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (!data) {
    return <p className="booking-status">{loadError ? t.error : t.loading}</p>;
  }

  return (
    <div className="booking">
      <div className="booking-bar">
        <DateRangePicker
          today={data.today}
          value={range}
          onChange={(value) => {
            setRange(value);
            setFeedback(null);
          }}
          lang={lang}
          labels={{ checkIn: t.checkIn, checkOut: t.checkOut, placeholder: t.datesPlaceholder }}
          fullNights={fullNights}
          nightPrice={hasPrices ? (date) => lowestNightPrice(data, unavailable, date, guests) : undefined}
        />
        <label className="guests-field">
          <Icon name="users" size={20} />
          <span>
            <small>{t.guests}</small>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </span>
        </label>
      </div>

      {feedback && !selected ? (
        <p className={`feedback ${feedback.error ? "error" : "ok"} booking-feedback`}>{feedback.text}</p>
      ) : null}

      {!hasDates ? (
        <p className="booking-hint">{t.pickDatesFirst}</p>
      ) : (
        <>
          <h3 className="booking-results-title">
            {t.results} · {formatDate(range.start!, lang)} → {formatDate(range.end!, lang)} ·{" "}
            {t.nights(nights.length)}
          </h3>
          {results.every((result) => !result.bookable) ? <p className="booking-hint">{t.nothingAvailable}</p> : null}
          <div className="result-list">
            {results.map(({ apt, free, fits, total, bookable }) => (
              <article
                key={apt.id}
                className={`result-card${bookable ? "" : " disabled"}${selectedApt === apt.id && bookable ? " selected" : ""}`}
              >
                <div className="result-photo">
                  <Image
                    src={photos.apartments[apt.id]?.[0] ?? photos.hero}
                    alt={isEn ? apt.nameEn : apt.name}
                    fill
                    sizes="(max-width: 760px) 100vw, 260px"
                  />
                </div>
                <div className="result-body">
                  <h4>{isEn ? apt.nameEn : apt.name}</h4>
                  <p>{isEn ? apt.summaryEn : apt.summary}</p>
                  <p className={`result-status${bookable ? " ok" : ""}`}>
                    {!free ? t.unavailable : !fits ? t.tooSmall(apt.capacity) : t.available}
                  </p>
                  <p className="result-pets">
                    {apt.pets
                      ? isEn
                        ? `Pets welcome (+${site.petFee} €/night)`
                        : `Admite mascotas (+${site.petFee} €/noche)`
                      : isEn
                        ? "No pets"
                        : "No se admiten mascotas"}
                  </p>
                </div>
                <div className="result-side">
                  {bookable && total ? (
                    <p className="result-price">
                      <small>{t.total}</small>
                      <strong>{formatEuros(total, lang)}</strong>
                    </p>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-green"
                    disabled={!bookable}
                    onClick={() => choose(apt.id)}
                  >
                    {selectedApt === apt.id && bookable ? t.selected : t.select}
                  </button>
                </div>
              </article>
            ))}
          </div>
          {results.some((result) => result.bookable && result.total) ? (
            <p className="booking-note">{t.priceNote}</p>
          ) : null}
        </>
      )}

      <button type="button" className="link-button calendar-toggle" onClick={() => setShowCalendar((v) => !v)}>
        <Icon name="calendar" size={18} /> {showCalendar ? t.hideCalendar : t.showCalendar}
      </button>
      {showCalendar ? (
        <div className="booking-calendar">
          <MonthAvailability
            data={data}
            aptId={calendarApt}
            onAptChange={(id) => {
              setCalendarApt(id);
              setSelectedApt(null);
              setRange({});
            }}
            range={range}
            onRange={onMonthRange}
            lang={lang}
          />
        </div>
      ) : null}

      {selected ? (
        <form ref={formRef} className="reserva-form guest-form" onSubmit={submit}>
          <div className="stay-summary">
            <div>
              <p className="eyebrow">{t.yourDetails}</p>
              <strong>{isEn ? selected.apt.nameEn : selected.apt.name}</strong>
              <span>
                {formatDate(range.start!, lang)} → {formatDate(range.end!, lang)} · {t.nights(nights.length)} ·{" "}
                {guests} {t.guests.toLowerCase()}
              </span>
              {selectedTotal ? (
                <span className="stay-total">
                  {t.total}: <strong>{formatEuros(selectedTotal, lang)}</strong>
                  {petSupplement ? (
                    <small>
                      {isEn ? "Includes pet supplement" : "Incluye suplemento de mascota"}: {formatEuros(petSupplement, lang)}
                    </small>
                  ) : null}
                </span>
              ) : null}
            </div>
          </div>

          <div className="hp-field" aria-hidden="true">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} />
            </label>
          </div>

          <div className="grid">
            <label>
              {isEn ? "Full name" : "Nombre completo"}
              <input required autoComplete="name" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} />
            </label>
            <label>
              {isEn ? "Email address" : "Correo electrónico"}
              <input
                required
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </label>
            <label>
              {isEn ? "Phone" : "Teléfono"}
              <input
                required
                type="tel"
                autoComplete="tel"
                value={form.telefono}
                onChange={(e) => update("telefono", e.target.value)}
              />
            </label>
          </div>
          <label>
            {isEn ? "Message (optional)" : "Mensaje (opcional)"}
            <textarea
              rows={3}
              value={form.mensaje}
              onChange={(e) => update("mensaje", e.target.value)}
              placeholder={
                isEn
                  ? "Estimated arrival time, children, any special needs..."
                  : "Hora aproximada de llegada, si viajas con niños, necesidades especiales..."
              }
            />
          </label>
          {selected.apt.pets ? (
            <label className="check">
              <input type="checkbox" checked={form.mascota} onChange={(e) => update("mascota", e.target.checked)} />
              <span>
                {isEn
                  ? `I'm travelling with a pet (+${site.petFee} € per night)`
                  : `Viajo con mascota (+${site.petFee} € por noche)`}
              </span>
            </label>
          ) : (
            <p className="booking-note">
              {isEn
                ? `Pets are not allowed in ${selected.apt.nameEn}. They are welcome in El Portiellu.`
                : `En ${selected.apt.name} no se admiten mascotas. Puedes venir con ella a El Portiellu.`}
            </p>
          )}

          <label className="check">
            <input
              required
              type="checkbox"
              checked={form.privacidad}
              onChange={(e) => update("privacidad", e.target.checked)}
            />
            <span>
              {isEn ? "I have read and accept the " : "He leído y acepto la "}
              <a href="/privacidad" target="_blank" rel="noopener">
                {isEn ? "privacy policy" : "política de privacidad"}
              </a>
            </span>
          </label>
          <button type="submit" className="btn btn-gold" disabled={sending}>
            {sending
              ? isEn
                ? "Sending..."
                : "Enviando..."
              : isEn
                ? "Send booking request"
                : "Enviar solicitud de reserva"}
          </button>
          {feedback ? <p className={`feedback ${feedback.error ? "error" : "ok"}`}>{feedback.text}</p> : null}
        </form>
      ) : null}
    </div>
  );
}
