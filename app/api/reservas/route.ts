import { NextResponse } from "next/server";
import { findApartment } from "../../../lib/apartments";
import { isRangeFree } from "../../../lib/availability";
import { isISODate, todayInSpain } from "../../../lib/dates";
import { newBookingId, saveBooking } from "../../../lib/store";

type ReservaPayload = {
  nombre?: string;
  email?: string;
  telefono?: string;
  fechaEntrada?: string;
  fechaSalida?: string;
  huespedes?: string;
  mensaje?: string;
  apartamento?: string;
  lang?: string;
  website?: string;
  formStartedAt?: number;
};

type RateEntry = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __reservasRateLimit: Map<string, RateEntry> | undefined;
}

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 6;
const MIN_FILL_TIME_MS = 2500;
const MAX_FILL_TIME_MS = 2 * 60 * 60 * 1000;

function getRateStore() {
  if (!globalThis.__reservasRateLimit) {
    globalThis.__reservasRateLimit = new Map<string, RateEntry>();
  }
  return globalThis.__reservasRateLimit;
}

function rateLimitClient(clientKey: string) {
  const now = Date.now();
  const store = getRateStore();

  if (store.size > 2000) {
    for (const [key, value] of store.entries()) {
      if (value.resetAt <= now) store.delete(key);
    }
  }

  const current = store.get(clientKey);
  if (!current || current.resetAt <= now) {
    store.set(clientKey, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { blocked: false, retryAfterSeconds: 0 };
  }

  if (current.count >= RATE_MAX_REQUESTS) {
    return {
      blocked: true,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    };
  }

  current.count += 1;
  store.set(clientKey, current);
  return { blocked: false, retryAfterSeconds: 0 };
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isOriginAllowed(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return true;

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPhoneValid(phone: string) {
  return /^[+0-9\s().-]{7,20}$/.test(phone);
}

function asSafeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (!isOriginAllowed(request)) {
    return NextResponse.json({ message: "Solicitud no permitida." }, { status: 403 });
  }

  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite && !["same-origin", "same-site", "none"].includes(secFetchSite)) {
    return NextResponse.json({ message: "Solicitud no permitida." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const clientKey = `${ip}:${userAgent.slice(0, 120)}`;
  const rateCheck = rateLimitClient(clientKey);
  if (rateCheck.blocked) {
    return NextResponse.json(
      { message: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) }
      }
    );
  }

  const data = (await request.json()) as ReservaPayload;

  // Honeypot anti-bot: respondemos 200 para no dar pistas a bots.
  if (asSafeText(data.website)) {
    return NextResponse.json({
      message:
        "Solicitud recibida correctamente. Te contactaremos en menos de 24 horas."
    });
  }

  const now = Date.now();
  const startedAt = Number(data.formStartedAt ?? 0);
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return NextResponse.json({ message: "Solicitud invalida." }, { status: 400 });
  }

  const fillTime = now - startedAt;
  if (fillTime < MIN_FILL_TIME_MS || fillTime > MAX_FILL_TIME_MS) {
    return NextResponse.json({ message: "Solicitud invalida." }, { status: 400 });
  }

  const reserva = {
    nombre: asSafeText(data.nombre),
    email: asSafeText(data.email),
    telefono: asSafeText(data.telefono),
    fechaEntrada: asSafeText(data.fechaEntrada),
    fechaSalida: asSafeText(data.fechaSalida),
    huespedes: asSafeText(data.huespedes),
    mensaje: asSafeText(data.mensaje),
    apartamento: asSafeText(data.apartamento),
    createdAt: new Date().toISOString()
  };

  const requiredFields = [
    reserva.nombre,
    reserva.email,
    reserva.telefono,
    reserva.fechaEntrada,
    reserva.fechaSalida,
    reserva.huespedes
  ];

  if (requiredFields.some((value) => !value)) {
    return NextResponse.json({ message: "Faltan campos obligatorios." }, { status: 400 });
  }

  if (!isEmailValid(reserva.email)) {
    return NextResponse.json({ message: "Correo electrónico no válido." }, { status: 400 });
  }

  if (!isPhoneValid(reserva.telefono)) {
    return NextResponse.json({ message: "Teléfono no válido." }, { status: 400 });
  }

  if (reserva.nombre.length > 120 || reserva.mensaje.length > 2000) {
    return NextResponse.json({ message: "Contenido demasiado largo." }, { status: 400 });
  }

  const apt = findApartment(reserva.apartamento);
  if (!apt) {
    return NextResponse.json({ message: "Elige un apartamento en el calendario." }, { status: 400 });
  }

  const huespedesNum = Number.parseInt(reserva.huespedes, 10);
  if (!Number.isFinite(huespedesNum) || huespedesNum < 1 || huespedesNum > apt.capacity) {
    return NextResponse.json(
      { message: `${apt.name} admite hasta ${apt.capacity} huéspedes.` },
      { status: 400 }
    );
  }

  if (!isISODate(reserva.fechaEntrada) || !isISODate(reserva.fechaSalida)) {
    return NextResponse.json({ message: "Fechas no validas." }, { status: 400 });
  }
  if (reserva.fechaSalida <= reserva.fechaEntrada) {
    return NextResponse.json(
      { message: "La fecha de salida debe ser posterior a la de entrada." },
      { status: 400 }
    );
  }
  if (reserva.fechaEntrada < todayInSpain()) {
    return NextResponse.json({ message: "La fecha de entrada ya ha pasado." }, { status: 400 });
  }

  if (!(await isRangeFree(apt.id, reserva.fechaEntrada, reserva.fechaSalida))) {
    return NextResponse.json(
      { message: "Esas fechas acaban de ocuparse. Elige otras en el calendario.", unavailable: true },
      { status: 409 }
    );
  }

  const bookingId = newBookingId();
  try {
    await saveBooking({
      id: bookingId,
      apt: apt.id,
      start: reserva.fechaEntrada,
      end: reserva.fechaSalida,
      status: "pendiente",
      nombre: reserva.nombre,
      email: reserva.email,
      telefono: reserva.telefono,
      huespedes: huespedesNum,
      mensaje: reserva.mensaje || undefined,
      lang: data.lang === "en" ? "en" : "es",
      createdAt: reserva.createdAt
    });
  } catch (error) {
    console.error("Error guardando la solicitud:", error);
    return NextResponse.json(
      { message: "No se pudo guardar la solicitud. Intenta de nuevo." },
      { status: 500 }
    );
  }

  const recipientEmail = process.env.RESERVAS_EMAIL ?? "apartamentoselportiellu@gmail.com";
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const requestOrigin =
    request.headers.get("origin") ?? (host ? `https://${host}` : "https://elportiellu.com");
  const requestReferer = request.headers.get("referer") ?? requestOrigin;

  const payload = {
    name: "Web El Portiellu",
    email: "reservas@elportiellu.com",
    _subject: `Nueva solicitud: ${apt.name} del ${reserva.fechaEntrada} al ${reserva.fechaSalida}`,
    message: [
      `Apartamento: ${apt.name}`,
      `Nombre: ${reserva.nombre}`,
      `Email: ${reserva.email}`,
      `Teléfono: ${reserva.telefono}`,
      `Entrada: ${reserva.fechaEntrada}`,
      `Salida: ${reserva.fechaSalida}`,
      `Huéspedes: ${huespedesNum}`,
      `Mensaje: ${reserva.mensaje || "-"}`,
      `Fecha envio: ${reserva.createdAt}`,
      `IP: ${ip}`,
      "",
      `Confirmar o rechazar: ${requestOrigin}/admin`
    ].join("\n"),
    _captcha: "false",
    _template: "table",
    _replyto: reserva.email
  };

  try {
    const formPayload = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) {
      formPayload.append(key, value);
    }

    const relayResponse = await fetch(
      `https://formsubmit.co/${encodeURIComponent(recipientEmail)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          Origin: requestOrigin,
          Referer: requestReferer
        },
        body: formPayload.toString()
      }
    );

    if (!relayResponse.ok) {
      const responseText = await relayResponse.text().catch(() => "");
      console.error("Error enviando solicitud por relay:", {
        status: relayResponse.status,
        statusText: relayResponse.statusText,
        bodyPreview: responseText.slice(0, 240),
        bookingId
      });
    }
  } catch (error) {
    // La solicitud ya está guardada y aparece en /admin aunque falle el aviso por email.
    console.error("Error de red enviando aviso por email:", error, { bookingId });
  }

  return NextResponse.json({
    message: "Solicitud recibida correctamente. Te contactaremos en menos de 24 horas."
  });
}
