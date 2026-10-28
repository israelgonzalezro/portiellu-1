import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "portiellu_admin";

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function sessionToken(password: string) {
  return createHash("sha256").update(`elportiellu-admin:${password}`).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function passwordMatches(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(sessionToken(password), sessionToken(expected!));
}

export function expectedSessionToken() {
  return sessionToken(process.env.ADMIN_PASSWORD ?? "");
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  return safeEqual(value, expectedSessionToken());
}
