import { TIME_ZONE, type TimeRange, type WeekDay, type WeeklyHours } from "./farmacia";

const DAYS: WeekDay[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_NAMES: Record<WeekDay, string> = {
  mon: "lunedì", tue: "martedì", wed: "mercoledì", thu: "giovedì",
  fri: "venerdì", sat: "sabato", sun: "domenica",
};

export type OpenStatus =
  | { open: true; closesAt: string; label: string }
  | { open: false; opensAt: string | null; opensDay: WeekDay | null; label: string };

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};
/** "08:30" → "8:30" (come si scrive in italiano). */
const fmt = (hhmm: string) => hhmm.replace(/^0/, "");

/** Giorno della settimana e minuti dalla mezzanotte nell'ora italiana, ovunque giri il server. */
export function localClock(now: Date, timeZone = TIME_ZONE): { day: WeekDay; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = get("weekday").slice(0, 3).toLowerCase() as WeekDay;
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

/**
 * Stato "aperto ora" calcolato dagli orari settimanali.
 * Non conosce ancora turni, festivi e chiusure straordinarie: arriveranno con Agenda Masera.
 */
export function getOpenStatus(hours: WeeklyHours, now: Date, timeZone = TIME_ZONE): OpenStatus {
  const { day, minutes } = localClock(now, timeZone);
  const today: TimeRange[] = hours[day] ?? [];

  for (const [from, to] of today) {
    if (minutes >= toMin(from) && minutes < toMin(to)) {
      return { open: true, closesAt: fmt(to), label: `Aperto ora · chiude alle ${fmt(to)}` };
    }
  }

  // Riapre più tardi oggi?
  const laterToday = today.find(([from]) => toMin(from) > minutes);
  if (laterToday) {
    const reopens = today.some(([, to]) => toMin(to) <= minutes);
    return {
      open: false, opensAt: fmt(laterToday[0]), opensDay: day,
      label: `Chiuso · ${reopens ? "riapre" : "apre"} alle ${fmt(laterToday[0])}`,
    };
  }

  // Prossimo giorno con orari (fino a una settimana).
  const start = DAYS.indexOf(day);
  for (let i = 1; i <= 7; i++) {
    const d = DAYS[(start + i) % 7]!;
    const first = hours[d]?.[0];
    if (first) {
      const when = i === 1 ? "domani" : DAY_NAMES[d];
      return { open: false, opensAt: fmt(first[0]), opensDay: d, label: `Chiuso · apre ${when} alle ${fmt(first[0])}` };
    }
  }
  return { open: false, opensAt: null, opensDay: null, label: "Chiuso" };
}
