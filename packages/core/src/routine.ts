// SkinLab Routine (BRIEF §10): il motore. Ordina i passaggi, dice cosa fare oggi, stima quando finisce un prodotto
// e quando rifare l'analisi. Un motore, più usi: viso, capelli e (in futuro) cicli di integratori. Solo logica, con i test.
import { addDays, weekdayOf } from "./agenda";

/** L'ordine giusto dei passaggi (BRIEF §10). */
export const STEP_ORDER = {
  viso: ["detergente", "tonico", "siero", "contorno_occhi", "crema", "protezione_solare"],
  capelli: ["shampoo", "trattamento", "lozione"],
} as const;
export type StepCategory = (typeof STEP_ORDER)["viso"][number] | (typeof STEP_ORDER)["capelli"][number];

export const STEP_LABELS: Record<StepCategory, string> = {
  detergente: "Detergente", tonico: "Tonico", siero: "Siero", contorno_occhi: "Contorno occhi", crema: "Crema",
  protezione_solare: "Protezione solare", shampoo: "Shampoo", trattamento: "Trattamento", lozione: "Lozione",
};

export type When = "mattina" | "sera" | "entrambi";
export type Frequency = "ogni_giorno" | "2_3_settimana" | "1_settimana";
export type Amount = "goccia" | "pisello" | "noce" | "2_erogazioni";

/** I tre pulsanti del banco (BRIEF §10): quando, quanto spesso, quanto. */
export const WHEN_LABELS: Record<When, string> = { mattina: "Mattina", sera: "Sera", entrambi: "Mattina e sera" };
export const FREQUENCY_LABELS: Record<Frequency, string> = { ogni_giorno: "Ogni giorno", "2_3_settimana": "2–3 volte a settimana", "1_settimana": "1 volta a settimana" };
export const AMOUNT_LABELS: Record<Amount, string> = { goccia: "Una goccia", pisello: "Un pisello", noce: "Una noce", "2_erogazioni": "2 erogazioni" };

/**
 * Dose indicativa in ml per ogni quantità, usata SOLO se la scheda del prodotto non ha la sua "dose standard in ml".
 * [DA CONFERMARE] con le farmaciste: servono per stimare quando finisce il prodotto, non sono indicazioni d'uso.
 */
export const DEFAULT_DOSE_ML: Record<Amount, number> = { goccia: 0.05, pisello: 0.3, noce: 1, "2_erogazioni": 0.3 };

export type RoutineItem = {
  ean: string;
  name: string;
  category: StepCategory;
  when: When;
  frequency: Frequency;
  amount: Amount;
  /** Contenuto della confezione in ml (o pezzi). */
  capacity: number;
  /** Dose standard del prodotto in ml, dalla scheda (se c'è vince su DEFAULT_DOSE_ML). */
  doseMl?: number;
  /** Giorno in cui ha iniziato a usarlo ("AAAA-MM-GG"). */
  startDate: string;
};

const rank = (c: StepCategory) => {
  const v = (STEP_ORDER.viso as readonly string[]).indexOf(c);
  return v >= 0 ? v : 100 + (STEP_ORDER.capelli as readonly string[]).indexOf(c);
};

/** La sequenza della mattina o della sera, nell'ordine giusto qualunque sia l'ordine in cui la farmacista ha passato i prodotti. */
export function routineFor(items: RoutineItem[], moment: "mattina" | "sera"): RoutineItem[] {
  return items.filter((i) => i.when === moment || i.when === "entrambi").sort((a, b) => rank(a.category) - rank(b.category));
}

/** Avvisi per la farmacista prima dell'invio (non bloccano). */
export function routineWarnings(items: RoutineItem[]): string[] {
  const w: string[] = [];
  for (const i of items) if (i.category === "protezione_solare" && i.when === "sera") w.push(`${i.name}: la protezione solare di solito va la mattina.`);
  const dup = items.map((i) => `${i.category}|${i.when}`).filter((k, n, all) => all.indexOf(k) !== n);
  for (const k of new Set(dup)) w.push(`Due prodotti per lo stesso passaggio (${STEP_LABELS[k.split("|")[0] as StepCategory]}): controlla se è voluto.`);
  return w;
}

/** Quante applicazioni a settimana. */
export function usesPerWeek(i: Pick<RoutineItem, "when" | "frequency">): number {
  const perDay = i.when === "entrambi" ? 2 : 1;
  const days = i.frequency === "ogni_giorno" ? 7 : i.frequency === "2_3_settimana" ? 2.5 : 1;
  return perDay * days;
}

/** Oggi si fa? Ogni giorno sempre; 2–3 volte: lunedì, mercoledì, venerdì; 1 volta: lo stesso giorno della settimana dell'inizio. */
export function isDueOn(i: Pick<RoutineItem, "frequency" | "startDate">, date: string): boolean {
  if (date < i.startDate) return false;
  if (i.frequency === "ogni_giorno") return true;
  const d = weekdayOf(date);
  return i.frequency === "2_3_settimana" ? d === "mon" || d === "wed" || d === "fri" : d === weekdayOf(i.startDate);
}

/** Stima della fine del prodotto: data, giorni che restano, e se proporre il riordino (ultimi 7 giorni). */
export function finishEstimate(i: RoutineItem, today: string): { date: string; daysLeft: number; reorder: boolean } | null {
  const dose = i.doseMl ?? DEFAULT_DOSE_ML[i.amount];
  const perWeek = usesPerWeek(i);
  if (!(dose > 0) || !(i.capacity > 0) || !(perWeek > 0)) return null;
  const totalDays = Math.floor((i.capacity / dose / perWeek) * 7);
  const date = addDays(i.startDate, totalDays);
  const daysLeft = Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86_400_000);
  return { date, daysLeft, reorder: daysLeft <= 7 };
}

/** Dopo 8 settimane: "Rifacciamo l'analisi?" (BRIEF §10). */
export const ANALYSIS_RECALL_DAYS = 56;
export const analysisRecallDate = (analysisDate: string) => addDays(analysisDate, ANALYSIS_RECALL_DAYS);

/** Serie di giorni consecutivi con la routine della sera spuntata, fino a oggi (o a ieri, se oggi non è ancora spuntata). */
export function streak(checkedDates: readonly string[], today: string): number {
  const set = new Set(checkedDates);
  let day = set.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (set.has(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

/** Il banco passa un EAN con la penna ottica: 8 o 13 cifre seguite da Invio. */
export const isScannedEan = (input: string) => /^(\d{8}|\d{13})$/.test(input.trim());
