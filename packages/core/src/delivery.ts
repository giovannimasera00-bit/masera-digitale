import { farmacia } from "./farmacia";
import { localClock } from "./opening-hours";

const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
const DAY_NAMES: Record<(typeof DAYS)[number], string> = {
  sun: "domenica", mon: "lunedì", tue: "martedì", wed: "mercoledì", thu: "giovedì", fri: "venerdì", sat: "sabato",
};

const d = farmacia.delivery;
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

export const SEREGNO_ZIPS: readonly string[] = d.seregno.zip;
export const SEREGNO_CUTOFF = d.seregno.cutoff; // "16:00"
export const SEREGNO_ETA = d.seregno.eta; // "19:00"
export const FREE_SHIPPING_ITALY_EUR = d.italia.free_over_eur; // 59

/** Il CAP decide il percorso: Seregno (in giornata, ricetta) o resto d'Italia. */
export function deliveryZone(zip: string): "seregno" | "italia" {
  return SEREGNO_ZIPS.includes(zip.trim()) ? "seregno" : "italia";
}

/** Quanto manca alla spedizione gratuita in Italia (0 se già gratuita). Importi in euro. */
export function freeShippingGap(cartTotalEur: number): number {
  return Math.max(0, Math.round((FREE_SHIPPING_ITALY_EUR - cartTotalEur) * 100) / 100);
}

export type SeregnoDelivery = {
  /** Ordinando adesso, arriva oggi? */
  today: boolean;
  /** Giorno di consegna: "oggi", "domani" o il nome del giorno. */
  when: string;
  /** Minuti che restano prima delle 16:00 (solo se today). */
  minutesLeft: number | null;
  /** Frase principale, già pronta. */
  label: string;
};

/**
 * Consegna a Seregno: ordine entro le 16:00 da lunedì a sabato → consegna verso le 19:00.
 * Dopo le 16:00 o di domenica → il giorno lavorativo successivo.
 * Non conosce ancora festivi e chiusure straordinarie.
 */
export function seregnoDelivery(now: Date): SeregnoDelivery {
  const { day, minutes } = localClock(now);
  const idx = DAYS.indexOf(day as (typeof DAYS)[number]);
  const workday = day !== "sun";
  const cutoff = toMin(SEREGNO_CUTOFF);

  if (workday && minutes < cutoff) {
    return {
      today: true,
      when: "oggi",
      minutesLeft: cutoff - minutes,
      label: `Ordina entro le ${SEREGNO_CUTOFF}, ricevi oggi verso le ${SEREGNO_ETA}`,
    };
  }

  let offset = 1;
  while (DAYS[(idx + offset) % 7] === "sun") offset++;
  const next = DAYS[(idx + offset) % 7]!;
  const when = offset === 1 ? "domani" : DAY_NAMES[next];
  return { today: false, when, minutesLeft: null, label: `Ordina ora, ricevi ${when} verso le ${SEREGNO_ETA}` };
}

/** "2 h 15 min", "45 min". */
export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
