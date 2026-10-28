import { findApartment } from "../../../../lib/apartments";
import { blocksDates } from "../../../../lib/availability";
import { buildIcal } from "../../../../lib/ical";
import { listBookings } from "../../../../lib/store";

export const dynamic = "force-dynamic";

// Calendario que importa Booking: solo reservas de la web y bloqueos manuales.
// No incluye datos personales, solo las fechas ocupadas.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ apt: string }> }
) {
  const { apt: aptParam } = await params;
  const apt = findApartment(aptParam.replace(/\.ics$/, ""));
  if (!apt) {
    return new Response("Apartamento no encontrado", { status: 404 });
  }

  const events = (await listBookings())
    .filter((booking) => booking.apt === apt.id && blocksDates(booking))
    .map((booking) => ({
      uid: booking.id,
      start: booking.start,
      end: booking.end,
      summary: booking.status === "bloqueo" ? "No disponible" : "Reserva web"
    }));

  return new Response(buildIcal(`El Portiellu - ${apt.name}`, events), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
