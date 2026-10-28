"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AvailabilityCalendar, {
  countNights,
  type CalendarApartment,
  type CalendarSelection
} from "./AvailabilityCalendar";
import { formatDate } from "../lib/dates";

type FormState = {
  nombre: string;
  email: string;
  telefono: string;
  huespedes: string;
  mensaje: string;
  website: string;
  privacidad: boolean;
};

type ReservaFormProps = {
  lang?: "es" | "en";
};

type AvailabilityData = {
  today: string;
  apartments: CalendarApartment[];
};

const initialState: FormState = {
  nombre: "",
  email: "",
  telefono: "",
  huespedes: "2",
  mensaje: "",
  website: "",
  privacidad: false
};

export default function ReservaForm({ lang = "es" }: ReservaFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [selection, setSelection] = useState<CalendarSelection | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const startedAtRef = useRef<number>(Date.now());
  const isEn = lang === "en";

  const t = {
    pickDates: isEn
      ? "Choose an apartment and your dates in the calendar."
      : "Elige un apartamento y tus fechas en el calendario.",
    genericError: isEn
      ? "Could not send your request."
      : "No se pudo enviar la solicitud.",
    success: isEn
      ? "Request sent. We will reply soon to confirm availability."
      : "Solicitud enviada. Te responderemos para confirmar la reserva.",
    networkError: isEn
      ? "Network error. Please try again in a few minutes."
      : "Error de red. Inténtalo de nuevo en unos minutos.",
    loadingCalendar: isEn ? "Loading availability..." : "Cargando disponibilidad...",
    calendarError: isEn
      ? "Availability could not be loaded. Please reload the page or call us on +34 616 924 075."
      : "No se pudo cargar la disponibilidad. Recarga la página o llámanos al 616 924 075.",
    yourStay: isEn ? "Your stay" : "Tu estancia",
    checkIn: isEn ? "Check-in" : "Entrada",
    checkOut: isEn ? "Check-out" : "Salida",
    nights: (n: number) => (isEn ? `${n} night${n === 1 ? "" : "s"}` : `${n} noche${n === 1 ? "" : "s"}`),
    change: isEn ? "Clear" : "Borrar",
    fullName: isEn ? "Full name" : "Nombre completo",
    email: isEn ? "Email address" : "Correo electrónico",
    phone: isEn ? "Phone" : "Teléfono",
    guests: isEn ? "Guests" : "Huéspedes",
    message: isEn ? "Message (optional)" : "Mensaje (opcional)",
    placeholder: isEn
      ? "Tell us about your trip, estimated arrival time, or any specific needs..."
      : "Cuéntanos si viajas con niños, necesidades especiales, hora aproximada de llegada...",
    privacyBefore: isEn ? "I have read and accept the " : "He leído y acepto la ",
    privacyLink: isEn ? "privacy policy" : "política de privacidad",
    sending: isEn ? "Sending..." : "Enviando...",
    send: isEn ? "Send booking request" : "Enviar solicitud de reserva"
  };

  const loadAvailability = useCallback(async () => {
    try {
      const response = await fetch("/api/disponibilidad", { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      setAvailability((await response.json()) as AvailabilityData);
      setAvailabilityError(false);
    } catch {
      setAvailabilityError(true);
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const selectedApt = availability?.apartments.find((apt) => apt.id === selection?.apt);
  const maxGuests = selectedApt?.capacity ?? 5;
  const nights = countNights(selection);

  function onSelect(next: CalendarSelection | null) {
    setSelection(next);
    setFeedback(null);
    const apt = availability?.apartments.find((item) => item.id === next?.apt);
    if (apt && Number(form.huespedes) > apt.capacity) {
      updateField("huespedes", String(apt.capacity));
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setError(false);

    if (!selection?.end) {
      setError(true);
      setFeedback(t.pickDates);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          ...form,
          apartamento: selection.apt,
          fechaEntrada: selection.start,
          fechaSalida: selection.end,
          lang,
          formStartedAt: startedAtRef.current
        })
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
        unavailable?: boolean;
      };

      if (!response.ok) {
        setError(true);
        setFeedback(data.message ?? t.genericError);
        if (data.unavailable) {
          setSelection(null);
          loadAvailability();
        }
        return;
      }

      setFeedback(t.success);
      setForm(initialState);
      setSelection(null);
      startedAtRef.current = Date.now();
    } catch {
      setError(true);
      setFeedback(t.networkError);
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form className="reserva-form" onSubmit={onSubmit}>
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">
          Website
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
          />
        </label>
      </div>

      {availability ? (
        <AvailabilityCalendar
          today={availability.today}
          apartments={availability.apartments}
          selection={selection}
          onSelect={onSelect}
          lang={lang}
        />
      ) : (
        <p className="cal-status">{availabilityError ? t.calendarError : t.loadingCalendar}</p>
      )}

      {selection && selectedApt ? (
        <div className="stay-summary" aria-live="polite">
          <div>
            <p className="eyebrow">{t.yourStay}</p>
            <strong>{isEn ? selectedApt.nameEn : selectedApt.name}</strong>
            <span>
              {t.checkIn}: {formatDate(selection.start, lang)}
              {selection.end ? (
                <>
                  {" · "}
                  {t.checkOut}: {formatDate(selection.end, lang)} · {t.nights(nights)}
                </>
              ) : null}
            </span>
          </div>
          <button type="button" className="link-button" onClick={() => onSelect(null)}>
            {t.change}
          </button>
        </div>
      ) : null}

      <div className="grid">
        <label>
          {t.fullName}
          <input
            required
            autoComplete="name"
            value={form.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
          />
        </label>
        <label>
          {t.email}
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </label>
        <label>
          {t.phone}
          <input
            required
            type="tel"
            autoComplete="tel"
            value={form.telefono}
            onChange={(e) => updateField("telefono", e.target.value)}
          />
        </label>
        <label>
          {t.guests}
          <input
            required
            min={1}
            max={maxGuests}
            type="number"
            value={form.huespedes}
            onChange={(e) => updateField("huespedes", e.target.value)}
          />
        </label>
      </div>

      <label>
        {t.message}
        <textarea
          rows={4}
          value={form.mensaje}
          onChange={(e) => updateField("mensaje", e.target.value)}
          placeholder={t.placeholder}
        />
      </label>

      <label className="check">
        <input
          required
          type="checkbox"
          checked={form.privacidad}
          onChange={(e) => updateField("privacidad", e.target.checked)}
        />
        <span>
          {t.privacyBefore}
          <a href="/privacidad" target="_blank" rel="noopener">
            {t.privacyLink}
          </a>
        </span>
      </label>

      <button disabled={loading} type="submit">
        {loading ? t.sending : t.send}
      </button>

      {feedback ? (
        <p className={error ? "feedback error" : "feedback ok"}>{feedback}</p>
      ) : null}
    </form>
  );
}
