// Regole di consegna (BRIEF §8): le stesse in home, carrello, scheda prodotto, footer e termini.
// I numeri arrivano da data/farmacia.json; qui solo la logica, con i test in test/delivery.test.ts.
import { farmacia } from "./farmacia";
import { addDays, formatDay, localNow, weekdayOf } from "./agenda";

const d = farmacia.delivery;
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};
const cents = (eur: number) => Math.round(eur * 100);
const euros = (c: number) => c / 100;

export const SEREGNO_ZIPS: readonly string[] = d.seregno.zip;
export const SEREGNO_CUTOFF = d.seregno.cutoff; // "16:00"
export const SEREGNO_ETA = d.seregno.eta; // "19:00"
export const FREE_SHIPPING_ITALY_EUR = d.italia.free_over_eur; // 59
export const ITALY_ETA = "2–3 giorni lavorativi";
/** Costo della spedizione in Italia sotto i 59 €: null finché Giovanni non lo decide (BRIEF §21 n. 1). */
const italyPrice: unknown = d.italia.price_below_threshold_eur;
export const ITALY_SHIPPING_EUR: number | null = typeof italyPrice === "number" ? italyPrice : null;

export type DeliveryZone = "seregno" | "italia";

/** Il CAP decide il percorso: Seregno (in giornata, ricetta) o resto d'Italia. */
export function deliveryZone(zip: string): DeliveryZone {
  return SEREGNO_ZIPS.includes(zip.trim()) ? "seregno" : "italia";
}

/** Un CAP italiano ha 5 cifre. */
export const isValidZip = (zip: string): boolean => /^\d{5}$/.test(zip.trim());

/** Quanto manca alla spedizione gratuita in Italia (0 se già gratuita). Importi in euro. */
export function freeShippingGap(cartTotalEur: number): number {
  return euros(Math.max(0, cents(FREE_SHIPPING_ITALY_EUR) - cents(cartTotalEur)));
}

export type SeregnoDelivery = {
  /** Ordinando adesso, arriva oggi? */
  today: boolean;
  /** Giorno di consegna: "oggi", "domani", il nome del giorno o, se è più in là di una settimana, la data. */
  when: string;
  /** Data di consegna, "AAAA-MM-GG" nell'ora di Seregno. */
  date: string;
  /** Minuti che restano prima delle 16:00 (solo se today). */
  minutesLeft: number | null;
  /** Frase principale, già pronta. */
  label: string;
};

/**
 * Consegna a Seregno: ordine entro le 16:00 da lunedì a sabato → consegna verso le 19:00.
 * Dopo le 16:00, di domenica o in un giorno di chiusura → il primo giorno di consegna successivo.
 * `closedDates`: giorni in cui la farmacia è chiusa (festivi e chiusure segnate in agenda), "AAAA-MM-GG".
 */
export function seregnoDelivery(now: Date, closedDates: readonly string[] = []): SeregnoDelivery {
  const { date: today, minutes } = localNow(now);
  const isDeliveryDay = (date: string) => weekdayOf(date) !== "sun" && !closedDates.includes(date);
  const cutoff = toMin(SEREGNO_CUTOFF);

  if (isDeliveryDay(today) && minutes < cutoff) {
    return {
      today: true,
      when: "oggi",
      date: today,
      minutesLeft: cutoff - minutes,
      label: `Ordina entro le ${SEREGNO_CUTOFF}, ricevi oggi verso le ${SEREGNO_ETA}`,
    };
  }

  let offset = 1;
  while (!isDeliveryDay(addDays(today, offset)) && offset < 60) offset++;
  const date = addDays(today, offset);
  const long = formatDay(date).long;
  const when = offset === 1 ? "domani" : offset < 7 ? long.split(" ")[0]! : long;
  return { today: false, when, date, minutesLeft: null, label: `Ordina ora, ricevi ${when} verso le ${SEREGNO_ETA}` };
}

export type PaymentMethod = "pos_alla_consegna" | "contanti_alla_consegna" | "online";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pos_alla_consegna: "Carta alla consegna (POS)",
  contanti_alla_consegna: "Contanti alla consegna",
  online: "Online",
};

export type DeliveryQuote =
  | { ok: false; reason: "cap"; message: string }
  | {
      ok: true;
      zone: DeliveryZone;
      /** Costo della spedizione in euro; null = non ancora deciso ([DA CONFERMARE]). */
      shippingEur: number | null;
      free: boolean;
      /** Quanto manca alla spedizione gratuita (solo Italia; 0 se già gratuita). */
      gapToFreeEur: number;
      /** Totale con la spedizione; null se il costo della spedizione non è ancora deciso. */
      totalEur: number | null;
      /** Pagamenti possibili: alla consegna solo a Seregno. */
      payments: PaymentMethod[];
      /** Quando arriva, in parole. */
      eta: string;
      /** Si possono inviare ricette? Solo a Seregno. */
      prescriptions: boolean;
      /** Frasi da mostrare nel carrello. */
      notes: string[];
    };

/**
 * Il preventivo di consegna per un carrello: zona dal CAP, costo, pagamenti possibili, tempi.
 * Importi in euro, calcolati in centesimi per non perdere arrotondamenti.
 */
export function quoteDelivery(opts: { zip: string; subtotalEur: number; now: Date; closedDates?: readonly string[] }): DeliveryQuote {
  const { zip, subtotalEur, now, closedDates = [] } = opts;
  if (!isValidZip(zip)) return { ok: false, reason: "cap", message: "Scrivi un CAP di 5 cifre, per esempio 20831." };
  const zone = deliveryZone(zip);
  const sub = cents(Math.max(0, subtotalEur));

  if (zone === "seregno") {
    const s = seregnoDelivery(now, closedDates);
    return {
      ok: true,
      zone,
      shippingEur: 0,
      free: true,
      gapToFreeEur: 0,
      totalEur: euros(sub),
      payments: ["pos_alla_consegna", "contanti_alla_consegna", "online"],
      eta: `${s.when} verso le ${SEREGNO_ETA}`,
      prescriptions: true,
      notes: [
        "Consegna gratuita a Seregno, frazioni comprese.",
        `${s.label}.`,
        "Paghi alla consegna, con carta o in contanti. Se preferisci, anche online.",
        `Dopo le ${SEREGNO_CUTOFF} o di domenica puoi anche ritirare in farmacia.`,
      ],
    };
  }

  const free = sub >= cents(FREE_SHIPPING_ITALY_EUR);
  const shipping = free ? 0 : ITALY_SHIPPING_EUR;
  const gap = freeShippingGap(euros(sub));
  return {
    ok: true,
    zone,
    shippingEur: shipping,
    free,
    gapToFreeEur: gap,
    totalEur: shipping === null ? null : euros(sub + cents(shipping)),
    payments: ["online"],
    eta: ITALY_ETA,
    prescriptions: false,
    notes: [
      free
        ? `Spedizione gratuita: hai superato i ${FREE_SHIPPING_ITALY_EUR} €.`
        : `Ti mancano ${formatEuro(gap)} per la spedizione gratuita (sopra ${FREE_SHIPPING_ITALY_EUR} €).`,
      `Arriva in ${ITALY_ETA}, con il codice per seguire il pacco.`,
      "Pagamento online.",
      "Le ricette si inviano solo da Seregno.",
    ],
  };
}

/** 0.9 → "0,90 €", 19 → "19 €". */
export function formatEuro(eur: number): string {
  const c = cents(eur);
  return c % 100 === 0 ? `${c / 100} €` : `${(c / 100).toFixed(2).replace(".", ",")} €`;
}

/** Prezzo in promo: prezzo pieno barrato, nuovo prezzo e percentuale, sempre insieme (BRIEF §8). null se non è uno sconto. */
export function promoPrice(fullEur: number, promoEur: number): { full: string; price: string; percent: number; label: string } | null {
  const f = cents(fullEur);
  const p = cents(promoEur);
  if (!(f > 0) || !(p > 0) || p >= f) return null;
  const percent = Math.round(((f - p) / f) * 100);
  return { full: formatEuro(fullEur), price: formatEuro(promoEur), percent, label: `−${percent}%` };
}

/** "2 h 15 min", "45 min". */
export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
