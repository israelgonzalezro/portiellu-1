import type { Apartment } from "./apartments";
import { formatDate, nightsBetween } from "./dates";
import { formatEuros } from "./pricing";
import { site } from "./site";
import type { Booking } from "./store";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function adminLink(bookingId: string) {
  return `${site.url}/admin#solicitud-${bookingId}`;
}

function buildEmail(booking: Booking, apt: Apartment) {
  const nights = nightsBetween(booking.start, booking.end).length;
  const link = adminLink(booking.id);
  const rows: [string, string][] = [
    ["Apartamento", apt.name],
    ["Entrada", formatDate(booking.start)],
    ["Salida", formatDate(booking.end)],
    ["Noches", String(nights)],
    ["Huéspedes", String(booking.huespedes ?? "-")],
    ["Precio estimado", booking.total ? formatEuros(booking.total) : "Sin precio configurado"],
    ["Nombre", booking.nombre ?? "-"],
    ["Teléfono", booking.telefono ?? "-"],
    ["Email", booking.email ?? "-"],
    ["Idioma", booking.lang === "en" ? "Inglés" : "Español"],
    ["Mensaje", booking.mensaje || "-"]
  ];

  const subject = `Nueva solicitud: ${apt.name}, ${formatDate(booking.start)} → ${formatDate(booking.end)}`;

  const text = [
    "Nueva solicitud de reserva en elportiellu.com",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Aceptar o rechazar: ${link}`
  ].join("\n");

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#121512;max-width:560px">
  <h2 style="font-family:Georgia,serif;margin:0 0 12px">Nueva solicitud de reserva</h2>
  <table style="border-collapse:collapse;width:100%">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#4f594f;width:40%">${escapeHtml(
            label
          )}</td><td style="padding:6px 10px;border-bottom:1px solid #eee"><strong>${escapeHtml(value)}</strong></td></tr>`
      )
      .join("")}
  </table>
  <p style="margin:22px 0">
    <a href="${link}" style="background:#1f4034;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Ver solicitud y aceptar o rechazar</a>
  </p>
  <p style="color:#4f594f;font-size:13px">Si respondes a este correo, la respuesta irá directamente al cliente.</p>
</div>`;

  return { subject, text, html };
}

async function sendWithResend(to: string, replyTo: string | undefined, email: ReturnType<typeof buildEmail>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "Web El Portiellu <onboarding@resend.dev>",
      to: [to],
      reply_to: replyTo,
      subject: email.subject,
      html: email.html,
      text: email.text
    }),
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${(await response.text()).slice(0, 240)}`);
  }
}

async function sendWithFormSubmit(to: string, replyTo: string | undefined, email: ReturnType<typeof buildEmail>) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: site.url,
      Referer: `${site.url}/`
    },
    body: JSON.stringify({
      _subject: email.subject,
      _replyto: replyTo,
      _template: "box",
      _captcha: "false",
      message: email.text
    }),
    signal: AbortSignal.timeout(10000)
  });
  const data = (await response.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  if (!response.ok || String(data.success) === "false") {
    throw new Error(`FormSubmit ${response.status}: ${data.message ?? "sin detalle"}`);
  }
}

// Avisa por email de una nueva solicitud. Devuelve si se pudo enviar.
export async function notifyNewRequest(booking: Booking, apt: Apartment) {
  const to = process.env.RESERVAS_EMAIL ?? site.email;
  const email = buildEmail(booking, apt);

  try {
    if (process.env.RESEND_API_KEY) {
      await sendWithResend(to, booking.email, email);
    } else {
      await sendWithFormSubmit(to, booking.email, email);
    }
    return true;
  } catch (error) {
    console.error("No se pudo enviar el aviso por email:", error, { bookingId: booking.id });
    return false;
  }
}
