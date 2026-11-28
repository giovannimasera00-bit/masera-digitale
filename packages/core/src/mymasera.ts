// MyMasera (BRIEF §10): tessera fedeltà, accesso con il cellulare, consensi, credito. Solo logica, con i test.
import { addDays } from "./agenda";

// ——— Codice a barre della tessera (EAN-13) ———
// [DA CONFERMARE] con Farmaconsult il formato delle nuove tessere: se non è EAN-13 si cambia solo questa parte.
const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const G = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
const R = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
const PARITY = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

/** Cifra di controllo EAN-13 per le prime 12 cifre. */
export function ean13CheckDigit(first12: string): number {
  const sum = first12.split("").reduce((acc, ch, i) => acc + Number(ch) * (i % 2 === 0 ? 1 : 3), 0);
  return (10 - (sum % 10)) % 10;
}

/** I 95 moduli (1 = barra nera) di un EAN-13 valido; null se il codice non è valido. */
export function ean13Modules(code: string): string | null {
  if (!/^\d{13}$/.test(code) || ean13CheckDigit(code.slice(0, 12)) !== Number(code[12])) return null;
  const d = code.split("").map(Number);
  const parity = PARITY[d[0]!]!;
  let out = "101";
  for (let i = 1; i <= 6; i++) out += (parity[i - 1] === "L" ? L : G)[d[i]!]!;
  out += "01010";
  for (let i = 7; i <= 12; i++) out += R[d[i]!]!;
  return out + "101";
}

/** Le barre da disegnare: posizione e larghezza in moduli. */
export function barsFromModules(modules: string): { x: number; w: number }[] {
  const bars: { x: number; w: number }[] = [];
  for (let i = 0; i < modules.length; i++) {
    if (modules[i] !== "1") continue;
    const last = bars.at(-1);
    if (last && last.x + last.w === i) last.w++;
    else bars.push({ x: i, w: 1 });
  }
  return bars;
}

/** "8001234567895" → "8 001234 567895", come sotto il codice a barre. */
export const formatCardNumber = (code: string) => `${code[0]} ${code.slice(1, 7)} ${code.slice(7)}`;

// ——— Punti ———
/** Quanto manca al prossimo buono. La soglia arriva dal programma fedeltà del gestionale [DA CONFERMARE]. */
export function loyaltyProgress(points: number, threshold: number): { ratio: number; missing: number; label: string } {
  if (!(threshold > 0)) return { ratio: 0, missing: 0, label: "Soglia del buono da confermare" };
  const p = Math.max(0, Math.floor(points));
  const inCycle = p % threshold;
  const missing = threshold - inCycle;
  return { ratio: inCycle / threshold, missing, label: missing === 1 ? "Manca 1 punto" : `Mancano ${missing} punti` };
}

// ——— Credito (videoconsulenza: 15 € interamente scalati dalla spesa entro 12 mesi, BRIEF §12) ———
/** Scadenza del credito: lo stesso giorno, 12 mesi dopo ("AAAA-MM-GG"); 29 febbraio → 28 febbraio. */
export function creditExpiry(fromDate: string): string {
  const [y, m, d] = fromDate.split("-").map(Number);
  const last = new Date(Date.UTC(y! + 1, m!, 0)).getUTCDate();
  return `${y! + 1}-${String(m).padStart(2, "0")}-${String(Math.min(d!, last)).padStart(2, "0")}`;
}

export type CreditEntry = { amountEur: number; date: string };
/** Credito ancora valido oggi (somma dei crediti non scaduti, meno quanto già usato). */
export function creditAvailable(entries: CreditEntry[], usedEur: number, today: string): number {
  const valid = entries.filter((e) => creditExpiry(e.date) >= today).reduce((a, e) => a + Math.round(e.amountEur * 100), 0);
  return Math.max(0, valid - Math.round(usedEur * 100)) / 100;
}

// ——— Consensi: separati, con data, versione del testo e canale (BRIEF §10) ———
export type ConsentPurpose = "prenotazioni" | "ricette" | "referti" | "routine" | "promemoria_whatsapp" | "marketing";
export type ConsentRecord = {
  purpose: ConsentPurpose;
  granted: boolean;
  at: string;
  /** Versione del testo che la persona ha letto. */
  textVersion: string;
  channel: "sito" | "app" | "banco_cartaceo";
};

export const CONSENT_LABELS: Record<ConsentPurpose, { title: string; text: string; required: boolean }> = {
  prenotazioni: { title: "Appuntamenti", text: "Usiamo nome e cellulare per gestire le tue prenotazioni.", required: true },
  ricette: { title: "Ricette e preventivi", text: "Valutiamo le ricette che ci mandi e ti scriviamo il preventivo.", required: false },
  referti: { title: "Referti nel profilo", text: "Teniamo i referti degli esami fatti in farmacia nel tuo profilo.", required: false },
  routine: { title: "SkinLab Routine", text: "Teniamo la tua routine e ti avvisiamo quando un prodotto sta finendo.", required: false },
  promemoria_whatsapp: { title: "Promemoria su WhatsApp", text: "Conferme e promemoria di appuntamenti, ordini e ricette.", required: false },
  marketing: { title: "Novità e promozioni", text: "Ogni tanto ti scriviamo novità e promozioni della farmacia.", required: false },
};

/** Si aggiunge sempre un nuovo record: lo storico non si cancella mai. */
export const recordConsent = (history: ConsentRecord[], r: ConsentRecord): ConsentRecord[] => [...history, r];

/** Lo stato attuale di ogni consenso: l'ultimo record per scopo (null se mai dato né negato). */
export function currentConsents(history: ConsentRecord[]): Record<ConsentPurpose, ConsentRecord | null> {
  const out = Object.fromEntries((Object.keys(CONSENT_LABELS) as ConsentPurpose[]).map((p) => [p, null])) as Record<ConsentPurpose, ConsentRecord | null>;
  for (const r of [...history].sort((a, b) => a.at.localeCompare(b.at))) out[r.purpose] = r;
  return out;
}

// ——— Accesso con il cellulare: codice di 6 cifre ———
export const LOGIN_CODE_MINUTES = 10;
export const LOGIN_MAX_ATTEMPTS = 5;

export type LoginChallenge = { codeHash: string; expiresAt: string; attempts: number };

/**
 * Controlla un codice: `hash` è la stessa funzione usata per salvare il codice (sul server, con un segreto).
 * Dopo 5 tentativi sbagliati o 10 minuti il codice non vale più.
 */
export function checkLoginCode(
  c: LoginChallenge, input: string, now: Date, hash: (s: string) => string,
): { ok: true } | { ok: false; reason: "scaduto" | "troppi_tentativi" | "sbagliato"; attemptsLeft: number } {
  if (c.attempts >= LOGIN_MAX_ATTEMPTS) return { ok: false, reason: "troppi_tentativi", attemptsLeft: 0 };
  if (new Date(c.expiresAt).getTime() <= now.getTime()) return { ok: false, reason: "scaduto", attemptsLeft: LOGIN_MAX_ATTEMPTS - c.attempts };
  const clean = input.replace(/\D/g, "");
  if (clean.length === 6 && hash(clean) === c.codeHash) return { ok: true };
  return { ok: false, reason: "sbagliato", attemptsLeft: LOGIN_MAX_ATTEMPTS - c.attempts - 1 };
}

/** Promemoria "rifacciamo l'analisi" e simili: data + N giorni. */
export const dueDate = (from: string, days: number) => addDays(from, days);
