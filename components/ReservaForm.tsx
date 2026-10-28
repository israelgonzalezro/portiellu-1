"use client";

import { useRef, useState } from "react";

type FormState = {
  nombre: string;
  email: string;
  telefono: string;
  fechaEntrada: string;
  fechaSalida: string;
  huespedes: string;
  mensaje: string;
  website: string;
  privacidad: boolean;
};

type ReservaFormProps = {
  lang?: "es" | "en";
};

const initialState: FormState = {
  nombre: "",
  email: "",
  telefono: "",
  fechaEntrada: "",
  fechaSalida: "",
  huespedes: "2",
  mensaje: "",
  website: "",
  privacidad: false
};

export default function ReservaForm({ lang = "es" }: ReservaFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const startedAtRef = useRef<number>(Date.now());
  const isEn = lang === "en";

  const t = {
    invalidDate: isEn
      ? "Check-out date must be after check-in date."
      : "La fecha de salida debe ser posterior a la de entrada.",
    genericError: isEn
      ? "Could not send your request."
      : "No se pudo enviar la solicitud.",
    success: isEn
      ? "Request sent. We will contact you soon."
      : "Solicitud enviada. Te responderemos para confirmar disponibilidad.",
    networkError: isEn
      ? "Network error. Please try again in a few minutes."
      : "Error de red. Intentalo de nuevo en unos minutos.",
    fullName: isEn ? "Full name" : "Nombre completo",
    email: isEn ? "Email address" : "Correo electrónico",
    phone: isEn ? "Phone" : "Teléfono",
    guests: isEn ? "Guests" : "Huéspedes",
    checkIn: isEn ? "Check-in" : "Entrada",
    checkOut: isEn ? "Check-out" : "Salida",
    message: isEn ? "Message (optional)" : "Mensaje (opcional)",
    placeholder: isEn
      ? "Tell us about your trip, estimated arrival time, or any specific needs..."
      : "Cuéntanos si viajas con niños, necesidades especiales, hora aproximada de llegada...",
    privacyBefore: isEn ? "I have read and accept the " : "He leído y acepto la ",
    privacyLink: isEn ? "privacy policy" : "política de privacidad",
    sending: isEn ? "Sending..." : "Enviando...",
    send: isEn ? "Send booking request" : "Enviar solicitud de reserva",
    activationError: isEn
      ? "The destination inbox needs form activation first (check the activation email)."
      : "El correo de destino necesita activación inicial del formulario (revisa el email de activación)."
  };

  async function fallbackDirectSubmit() {
    const directPayload = {
      name: form.nombre,
      email: form.email,
      _subject: "Nueva solicitud de reserva - Casa Rural",
      message: [
        `Nombre: ${form.nombre}`,
        `Email: ${form.email}`,
        `Teléfono: ${form.telefono}`,
        `Entrada: ${form.fechaEntrada}`,
        `Salida: ${form.fechaSalida}`,
        `Huéspedes: ${form.huespedes}`,
        `Mensaje: ${form.mensaje || "-"}`,
        `Fecha envio: ${new Date().toISOString()}`
      ].join("\n"),
      _template: "table",
      _captcha: "false",
      _replyto: form.email
    };

    const response = await fetch("https://formsubmit.co/ajax/apartamentoselportiellu@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(directPayload)
    });

    const data = (await response.json().catch(() => ({}))) as {
      success?: string;
      message?: string;
    };

    return {
      ok: response.ok && data.success !== "false",
      message: data.message
    };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    setError(false);

    const entrada = new Date(form.fechaEntrada);
    const salida = new Date(form.fechaSalida);
    if (salida <= entrada) {
      setLoading(false);
      setError(true);
      setFeedback(t.invalidDate);
      return;
    }

    const endpoint = "/api/reservas";
    const payload = {
      ...form,
      formStartedAt: startedAtRef.current
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        const fallback = await fallbackDirectSubmit().catch(() => ({
          ok: false,
          message: t.genericError
        }));

        if (fallback.ok) {
          setFeedback(t.success);
          setForm(initialState);
          startedAtRef.current = Date.now();
          return;
        }

        const fallbackNeedsActivation = (fallback.message ?? "")
          .toLowerCase()
          .includes("activation");
        setError(true);
        setFeedback(
          fallbackNeedsActivation
            ? t.activationError
            : fallback.message ?? data.message ?? t.genericError
        );
        return;
      }

      setFeedback(t.success);
      setForm(initialState);
      startedAtRef.current = Date.now();
    } catch {
      const fallback = await fallbackDirectSubmit().catch(() => ({
        ok: false,
        message: t.networkError
      }));

      if (fallback.ok) {
        setFeedback(t.success);
        setForm(initialState);
        startedAtRef.current = Date.now();
      } else {
        setError(true);
        setFeedback(fallback.message ?? t.networkError);
      }
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

      <div className="grid">
        <label>
          {t.fullName}
          <input
            required
            value={form.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
          />
        </label>
        <label>
          {t.email}
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </label>
        <label>
          {t.phone}
          <input
            required
            type="tel"
            value={form.telefono}
            onChange={(e) => updateField("telefono", e.target.value)}
          />
        </label>
        <label>
          {t.guests}
          <input
            required
            min={1}
            max={12}
            type="number"
            value={form.huespedes}
            onChange={(e) => updateField("huespedes", e.target.value)}
          />
        </label>
        <label>
          {t.checkIn}
          <input
            required
            type="date"
            value={form.fechaEntrada}
            onChange={(e) => updateField("fechaEntrada", e.target.value)}
          />
        </label>
        <label>
          {t.checkOut}
          <input
            required
            type="date"
            value={form.fechaSalida}
            onChange={(e) => updateField("fechaSalida", e.target.value)}
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
