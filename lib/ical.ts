import { addDays } from "./dates";

export type CalendarEvent = {
  uid?: string;
  start: string;
  end: string;
  summary: string;
};

function icalDate(value: string) {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : undefined;
}

export function parseIcal(text: string): CalendarEvent[] {
  // Las líneas largas se parten con un salto seguido de espacio.
  const lines = text
    .replace(/\r?\n[ \t]/g, "")
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim());
  const events: CalendarEvent[] = [];
  let current: Partial<CalendarEvent> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
    } else if (line === "END:VEVENT") {
      if (current?.start) {
        const end = current.end && current.end > current.start ? current.end : addDays(current.start, 1);
        events.push({ uid: current.uid, start: current.start, end, summary: current.summary ?? "" });
      }
      current = null;
    } else if (current) {
      const separator = line.indexOf(":");
      if (separator < 0) continue;
      const name = line.slice(0, separator).split(";")[0].toUpperCase();
      const value = line.slice(separator + 1).trim();
      if (name === "DTSTART") current.start = icalDate(value);
      else if (name === "DTEND") current.end = icalDate(value);
      else if (name === "SUMMARY") current.summary = value;
      else if (name === "UID") current.uid = value;
    }
  }

  return events;
}

function icalDay(value: string) {
  return value.replaceAll("-", "");
}

function escapeText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function buildIcal(calendarName: string, events: CalendarEvent[]) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//El Portiellu//Reservas web//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`
  ];

  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.uid ?? `${event.start}-${event.end}`}@elportiellu.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icalDay(event.start)}`,
      `DTEND;VALUE=DATE:${icalDay(event.end)}`,
      `SUMMARY:${escapeText(event.summary)}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
