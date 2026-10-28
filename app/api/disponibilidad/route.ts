import { NextResponse } from "next/server";
import { apartments } from "../../../lib/apartments";
import { getAvailability } from "../../../lib/availability";
import { todayInSpain } from "../../../lib/dates";
import { getPriceRules } from "../../../lib/prices-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const [availability, prices] = await Promise.all([getAvailability(), getPriceRules()]);

  return NextResponse.json(
    {
      today: todayInSpain(),
      prices,
      apartments: apartments.map((apt) => {
        const info = availability.find((item) => item.id === apt.id);
        return {
          id: apt.id,
          name: apt.name,
          nameEn: apt.nameEn,
          capacity: apt.capacity,
          summary: apt.summary,
          summaryEn: apt.summaryEn,
          synced: info?.synced ?? false,
          busy: [...(info?.busy ?? [])].sort(),
          closed: [...(info?.closed ?? [])].sort()
        };
      })
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
