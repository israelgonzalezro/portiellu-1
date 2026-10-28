import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminConfigured,
  expectedSessionToken,
  passwordMatches
} from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { message: "Falta configurar ADMIN_PASSWORD en Netlify." },
      { status: 503 }
    );
  }

  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !passwordMatches(password)) {
    // Pequeña espera para frenar intentos repetidos.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({ message: "Contraseña incorrecta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, expectedSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
