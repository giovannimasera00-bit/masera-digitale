import type { WeekDay, WeeklyHours } from "./farmacia";

const ORDER: WeekDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const SHORT: Record<WeekDay, string> = { mon: "Lun", tue: "Mar", wed: "Mer", thu: "Gio", fri: "Ven", sat: "Sab", sun: "Dom" };
const LONG: Record<WeekDay, string> = {
  mon: "Lunedì", tue: "Martedì", wed: "Mercoledì", thu: "Giovedì", fri: "Venerdì", sat: "Sabato", sun: "Domenica",
};

const t = (hhmm: string) => hhmm.replace(/^0/, "");

/**
 * Orari raggruppati per giorni uguali consecutivi:
 * ["Lun–ven 8:30–19:30", "Sabato 8:30–12:30 e 15:00–19:00", "Domenica chiuso"].
 */
export function formatWeeklyHours(hours: WeeklyHours): string[] {
  const key = (d: WeekDay) => JSON.stringify(hours[d]);
  const groups: WeekDay[][] = [];
  for (const d of ORDER) {
    const last = groups.at(-1);
    if (last && key(last[0]!) === key(d)) last.push(d);
    else groups.push([d]);
  }
  return groups.map((g) => {
    const first = g[0]!;
    const days = g.length === 1 ? LONG[first] : `${SHORT[first]}–${SHORT[g.at(-1)!].toLowerCase()}`;
    const ranges = hours[first];
    const text = ranges.length === 0 ? "chiuso" : ranges.map(([a, b]) => `${t(a)}–${t(b)}`).join(" e ");
    return `${days} ${text}`;
  });
}
