import fs from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

export type BookingStatus = "pendiente" | "confirmada" | "rechazada" | "bloqueo";

export type Booking = {
  id: string;
  apt: string;
  start: string;
  end: string;
  status: BookingStatus;
  nombre?: string;
  email?: string;
  telefono?: string;
  huespedes?: number;
  mensaje?: string;
  nota?: string;
  lang?: "es" | "en";
  createdAt: string;
  updatedAt?: string;
};

type KeyValueStore = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  keys(): Promise<string[]>;
};

function runningOnNetlify() {
  return Boolean(process.env.NETLIFY || process.env.SITE_ID || process.env.NETLIFY_BLOBS_CONTEXT);
}

function netlifyStore(): KeyValueStore {
  const store = getStore({ name: "reservas", consistency: "strong" });
  return {
    get: (key) => store.get(key, { type: "text" }),
    set: async (key, value) => {
      await store.set(key, value);
    },
    delete: (key) => store.delete(key),
    keys: async () => (await store.list()).blobs.map((blob) => blob.key)
  };
}

// En local guardamos las reservas en .data/reservas (no se sube a GitHub).
function fileStore(): KeyValueStore {
  const dir = path.join(process.cwd(), ".data", "reservas");
  const file = (key: string) => path.join(dir, `${key.replace(/[^a-zA-Z0-9_-]/g, "_")}.json`);
  return {
    get: (key) => fs.readFile(file(key), "utf8").catch(() => null),
    set: async (key, value) => {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(file(key), value);
    },
    delete: (key) => fs.rm(file(key), { force: true }),
    keys: async () => {
      const names = await fs.readdir(dir).catch(() => [] as string[]);
      return names.filter((name) => name.endsWith(".json")).map((name) => name.slice(0, -5));
    }
  };
}

function kv(): KeyValueStore {
  try {
    return netlifyStore();
  } catch (error) {
    if (runningOnNetlify()) throw error;
    return fileStore();
  }
}

export async function listBookings() {
  const store = kv();
  const keys = await store.keys();
  const items = await Promise.all(keys.map((key) => store.get(key)));
  return items
    .filter((item): item is string => Boolean(item))
    .map((item) => JSON.parse(item) as Booking)
    .sort((a, b) => a.start.localeCompare(b.start));
}

export async function getBooking(id: string) {
  const raw = await kv().get(id);
  return raw ? (JSON.parse(raw) as Booking) : null;
}

export async function saveBooking(booking: Booking) {
  await kv().set(booking.id, JSON.stringify(booking));
}

export async function deleteBooking(id: string) {
  await kv().delete(id);
}

export function newBookingId() {
  return `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
}
