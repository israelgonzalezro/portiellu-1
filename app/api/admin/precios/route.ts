import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/admin-auth";
import { getPriceRules, sanitizePriceRules, savePriceRules } from "../../../../lib/prices-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }
  return NextResponse.json(await getPriceRules(), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const rules = sanitizePriceRules(await request.json().catch(() => null));
  if (!rules) {
    return NextResponse.json(
      { message: "Revisa las fechas de las temporadas: la de fin debe ser igual o posterior a la de inicio." },
      { status: 400 }
    );
  }

  await savePriceRules(rules);
  return NextResponse.json(rules);
}
