// Unica fonte dei dati della farmacia: data/farmacia.json (seed del kit).
import data from "../../../data/farmacia.json";

export type TimeRange = [string, string];
export type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type WeeklyHours = Record<WeekDay, TimeRange[]>;

const WEEK: WeekDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Controlla gli orari letti dal JSON: un errore di battitura deve fermare la build, non mostrare orari sbagliati. */
export function parseHours(raw: Record<string, unknown>): WeeklyHours {
  const out = {} as WeeklyHours;
  for (const d of WEEK) {
    const ranges = raw[d];
    if (!Array.isArray(ranges)) throw new Error(`Orari: manca il giorno "${d}"`);
    out[d] = ranges.map((r) => {
      if (!Array.isArray(r) || r.length !== 2 || !r.every((t) => typeof t === "string" && HHMM.test(t)) || r[0] >= r[1]) {
        throw new Error(`Orari: fascia non valida per "${d}": ${JSON.stringify(r)}`);
      }
      return [r[0], r[1]] as TimeRange;
    });
  }
  return out;
}

export const farmacia = data;
export const farmaciaHours: WeeklyHours = parseHours(data.hours);
export const TIME_ZONE = "Europe/Rome";
