import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/admin-auth";
import { findApartment } from "../../../../lib/apartments";
import { isRangeFree } from "../../../../lib/availability";
import { isISODate } from "../../../../lib/dates";
import {
  deleteBooking,
  getBooking,
  listBookings,
  newBookingId,
  saveBooking
} from "../../../../lib/store";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ message: "No autorizado." }, { status: 401 });
}

export async function GET() {
  if (!(await isAdmin())) return unauthorized();

  const bookings = await listBookings();
  const withConflicts = await Promise.all(
    bookings.map(async (booking) => ({
      ...booking,
      conflict:
        booking.status === "pendiente"
          ? !(await isRangeFree(booking.apt, booking.start, booking.end, { excludeId: booking.id }))
          : false
    }))
  );

  return NextResponse.json({ bookings: withConflicts }, { headers: { "Cache-Control": "no-store" } });
}

type AdminAction =
  | { action: "confirmar"; id: string; force?: boolean }
  | { action: "rechazar"; id: string }
  | { action: "eliminar"; id: string }
  | { action: "bloquear"; apt: string; start: string; end: string; nota?: string };

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();

  const body = (await request.json().catch(() => null)) as AdminAction | null;
  if (!body) return NextResponse.json({ message: "Petición no válida." }, { status: 400 });

  const now = new Date().toISOString();

  if (body.action === "bloquear") {
    if (!findApartment(body.apt) || !isISODate(body.start) || !isISODate(body.end) || body.end <= body.start) {
      return NextResponse.json({ message: "Revisa el apartamento y las fechas." }, { status: 400 });
    }
    await saveBooking({
      id: newBookingId(),
      apt: body.apt,
      start: body.start,
      end: body.end,
      status: "bloqueo",
      nota: typeof body.nota === "string" ? body.nota.slice(0, 200) : undefined,
      createdAt: now
    });
    return NextResponse.json({ ok: true });
  }

  const booking = await getBooking(body.id);
  if (!booking) return NextResponse.json({ message: "Reserva no encontrada." }, { status: 404 });

  if (body.action === "eliminar") {
    await deleteBooking(booking.id);
    return NextResponse.json({ ok: true });
  }

  if (body.action === "confirmar") {
    const free = await isRangeFree(booking.apt, booking.start, booking.end, { excludeId: booking.id });
    if (!free && !body.force) {
      return NextResponse.json(
        { message: "Esas fechas ya están ocupadas (en Booking o en otra reserva).", conflict: true },
        { status: 409 }
      );
    }
    await saveBooking({ ...booking, status: "confirmada", updatedAt: now });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "rechazar") {
    await saveBooking({ ...booking, status: "rechazada", updatedAt: now });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ message: "Acción no válida." }, { status: 400 });
}
