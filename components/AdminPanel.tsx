"use client";

import { useCallback, useEffect, useState } from "react";
import AvailabilityCalendar, { type CalendarApartment } from "./AvailabilityCalendar";
import { formatDate, nightsBetween } from "../lib/dates";

type AdminBooking = {
  id: string;
  apt: string;
  start: string;
  end: string;
  status: "pendiente" | "confirmada" | "rechazada" | "bloqueo";
  nombre?: string;
  email?: string;
  telefono?: string;
  huespedes?: number;
  mensaje?: string;
  nota?: string;
  createdAt: string;
  conflict?: boolean;
};

type Availability = { today: string; apartments: CalendarApartment[] };

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [block, setBlock] = useState({ apt: "apto-1", start: "", end: "", nota: "" });
  const [origin, setOrigin] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/reservas", { cache: "no-store" });
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    const data = (await response.json()) as { bookings: AdminBooking[] };
    setBookings(data.bookings);
    setAuthed(true);
    const availabilityResponse = await fetch("/api/disponibilidad", { cache: "no-store" });
    if (availabilityResponse.ok) setAvailability((await availabilityResponse.json()) as Availability);
  }, []);

  useEffect(() => {
    setOrigin(window.location.origin);
    load();
  }, [load]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    setBusy(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      setMessage({ text: data.message ?? "No se pudo entrar.", error: true });
      return;
    }
    setPassword("");
    load();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  }

  async function act(body: Record<string, unknown>, success: string) {
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/admin/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = (await response.json().catch(() => ({}))) as { message?: string; conflict?: boolean };
    setBusy(false);

    if (response.status === 409 && data.conflict) {
      if (window.confirm(`${data.message}\n\n¿Quieres confirmarla de todas formas?`)) {
        return act({ ...body, force: true }, success);
      }
      return;
    }
    if (!response.ok) {
      setMessage({ text: data.message ?? "Algo ha fallado.", error: true });
      return;
    }
    setMessage({ text: success });
    load();
  }

  function aptName(id: string) {
    return availability?.apartments.find((apt) => apt.id === id)?.name ?? id;
  }

  if (authed === null) {
    return <p className="section">Cargando…</p>;
  }

  if (!authed) {
    return (
      <section className="section form-wrap admin">
        <p className="eyebrow">Zona privada</p>
        <h1>Gestión de reservas</h1>
        <form className="reserva-form admin-login" onSubmit={login}>
          <label>
            Contraseña
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" disabled={busy}>
            Entrar
          </button>
          {message ? <p className={message.error ? "feedback error" : "feedback ok"}>{message.text}</p> : null}
        </form>
      </section>
    );
  }

  const today = availability?.today ?? new Date().toISOString().slice(0, 10);
  const pending = bookings.filter((b) => b.status === "pendiente" && b.end >= today);
  const active = bookings.filter((b) => (b.status === "confirmada" || b.status === "bloqueo") && b.end >= today);
  const rejected = bookings.filter((b) => b.status === "rechazada").slice(-10).reverse();
  const unsynced = availability?.apartments.filter((apt) => !apt.synced) ?? [];

  return (
    <div className="admin">
      <section className="section form-wrap">
        <div className="admin-head">
          <div>
            <p className="eyebrow">Zona privada</p>
            <h1>Gestión de reservas</h1>
          </div>
          <button type="button" className="link-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
        {message ? <p className={message.error ? "feedback error" : "feedback ok"}>{message.text}</p> : null}
        {unsynced.length ? (
          <p className="feedback error">
            Sin conexión con Booking: {unsynced.map((apt) => apt.name).join(", ")}. Revisa los enlaces iCal en Netlify.
          </p>
        ) : null}
        {availability ? (
          <AvailabilityCalendar today={availability.today} apartments={availability.apartments} days={120} />
        ) : null}
      </section>

      <section className="section form-wrap">
        <h2>Solicitudes pendientes ({pending.length})</h2>
        {pending.length === 0 ? <p>No hay solicitudes pendientes.</p> : null}
        <div className="admin-list">
          {pending.map((b) => (
            <article key={b.id} className={`admin-card${b.conflict ? " conflict" : ""}`}>
              <header>
                <strong>{aptName(b.apt)}</strong>
                <span>
                  {formatDate(b.start)} → {formatDate(b.end)} · {nightsBetween(b.start, b.end).length} noches ·{" "}
                  {b.huespedes} huéspedes
                </span>
              </header>
              {b.conflict ? <p className="feedback error">⚠ Estas fechas ya están ocupadas.</p> : null}
              <p>
                {b.nombre} · <a href={`tel:${b.telefono}`}>{b.telefono}</a> ·{" "}
                <a href={`mailto:${b.email}`}>{b.email}</a>
              </p>
              {b.mensaje ? <p className="admin-msg">“{b.mensaje}”</p> : null}
              <div className="admin-actions">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => act({ action: "confirmar", id: b.id }, "Reserva confirmada. Booking la verá en su próxima sincronización.")}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="secondary"
                  disabled={busy}
                  onClick={() => act({ action: "rechazar", id: b.id }, "Solicitud rechazada.")}
                >
                  Rechazar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section form-wrap">
        <h2>Bloquear fechas</h2>
        <p>Para reservas por teléfono, mantenimiento o cuando un apartamento no se alquila.</p>
        <form
          className="reserva-form"
          onSubmit={(event) => {
            event.preventDefault();
            act({ action: "bloquear", ...block }, "Fechas bloqueadas.").then(() =>
              setBlock((prev) => ({ ...prev, start: "", end: "", nota: "" }))
            );
          }}
        >
          <div className="grid">
            <label>
              Apartamento
              <select value={block.apt} onChange={(e) => setBlock({ ...block, apt: e.target.value })}>
                {(availability?.apartments ?? []).map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Entrada
              <input type="date" required value={block.start} onChange={(e) => setBlock({ ...block, start: e.target.value })} />
            </label>
            <label>
              Salida
              <input type="date" required value={block.end} onChange={(e) => setBlock({ ...block, end: e.target.value })} />
            </label>
            <label>
              Nota (opcional)
              <input value={block.nota} onChange={(e) => setBlock({ ...block, nota: e.target.value })} />
            </label>
          </div>
          <button type="submit" disabled={busy}>
            Bloquear
          </button>
        </form>
      </section>

      <section className="section form-wrap">
        <h2>Reservas web y bloqueos</h2>
        {active.length === 0 ? <p>No hay reservas web ni bloqueos próximos.</p> : null}
        <div className="admin-list">
          {active.map((b) => (
            <article key={b.id} className="admin-card">
              <header>
                <strong>
                  {aptName(b.apt)} · {b.status === "bloqueo" ? "Bloqueo" : "Reserva web"}
                </strong>
                <span>
                  {formatDate(b.start)} → {formatDate(b.end)}
                </span>
              </header>
              {b.nombre ? (
                <p>
                  {b.nombre} · <a href={`tel:${b.telefono}`}>{b.telefono}</a>
                </p>
              ) : null}
              {b.nota ? <p className="admin-msg">{b.nota}</p> : null}
              <div className="admin-actions">
                <button
                  type="button"
                  className="secondary"
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm("¿Eliminar y liberar estas fechas?")) {
                      act({ action: "eliminar", id: b.id }, "Fechas liberadas.");
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
        {rejected.length ? (
          <details className="admin-rejected">
            <summary>Rechazadas recientes ({rejected.length})</summary>
            {rejected.map((b) => (
              <p key={b.id}>
                {aptName(b.apt)} · {formatDate(b.start)} → {formatDate(b.end)} · {b.nombre}
              </p>
            ))}
          </details>
        ) : null}
      </section>

      <section className="section form-wrap">
        <h2>Enlaces para importar en Booking</h2>
        <p>
          En la extranet de Booking, en cada apartamento: Tarifas y disponibilidad → Sincronizar calendarios →
          Importar calendario, y pega su enlace.
        </p>
        <div className="admin-list">
          {(availability?.apartments ?? []).map((apt) => {
            const url = `${origin}/api/ical/${apt.id}.ics`;
            return (
              <div key={apt.id} className="admin-ical">
                <strong>{apt.name}</strong>
                <code>{url}</code>
                <button type="button" className="secondary" onClick={() => navigator.clipboard.writeText(url)}>
                  Copiar
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
