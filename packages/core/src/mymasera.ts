// MyMasera (BRIEF §10): tessera fedeltà, punti, accesso con cellulare e password, consensi, credito. Solo logica, con i test.
import { addDays } from "./agenda";

// ——— Tessera ———
/** Codice delle nuove tessere: una lettera e 5 numeri, es. "A12345" (confermato da Giovanni il 28/11/2026). */
export function normalizeCardCode(input: string): string | null {
  const c = input.replace(/[\s-]/g, "").toUpperCase();
  return /^[A-Z]\d{5}$/.test(c) ? c : null;
}

// ——— Codici a barre EAN-13 (prodotti). Il tipo di codice a barre della tessera [DA CONFERMARE] dalla foto di una tessera. ———
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

/** Il codice come è stampato sotto il codice a barre della tessera: "A12345", tutto attaccato. */
export const formatCardNumber = (code: string) => code.trim().toUpperCase();

// ——— Punti (decisione di Giovanni del 28/11/2026) ———
// 30 € di spesa = 100 punti, in proporzione (45 € = 150 punti). 100 punti = 1 € da spendere su prodotti che non sono farmaci.
export const POINTS_PER_30_EUR = 100;
export const POINTS_PER_EURO_VALUE = 100;

/** Punti per una spesa, in proporzione, arrotondati per difetto: 45 € → 150, 10 € → 33. */
export function pointsForSpend(eur: number): number {
  const cents = Math.max(0, Math.round(eur * 100));
  return Math.floor((cents * POINTS_PER_30_EUR) / 3000);
}

/** Quanto valgono i punti, in euro (centesimi esatti): 130 punti → 1,30 €. Si spendono solo su prodotti che non sono farmaci. */
export const pointsValueEur = (points: number): number => Math.max(0, Math.floor(points)) / POINTS_PER_EURO_VALUE;

/** Quanto manca al prossimo euro da spendere (ogni 100 punti). */
export function loyaltyProgress(points: number): { ratio: number; missing: number; label: string } {
  const p = Math.max(0, Math.floor(points));
  const inCycle = p % POINTS_PER_EURO_VALUE;
  const missing = POINTS_PER_EURO_VALUE - inCycle;
  return { ratio: inCycle / POINTS_PER_EURO_VALUE, missing, label: missing === 1 ? "Manca 1 punto" : `Mancano ${missing} punti` };
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
export type ConsentPurpose = "carta" | "prenotazioni" | "ricette" | "referti" | "routine" | "promemoria_whatsapp" | "marketing";
export type ConsentRecord = {
  purpose: ConsentPurpose;
  granted: boolean;
  at: string;
  /** Versione del testo che la persona ha letto. */
  textVersion: string;
  channel: "sito" | "app" | "banco_cartaceo";
};

export const CONSENT_LABELS: Record<ConsentPurpose, { title: string; text: string; required: boolean }> = {
  // Carta e marketing: dall'informativa della Carta Fedeltà (testo definitivo del 28/11/2026). Gli altri: testi provvisori.
  carta: { title: "Carta Fedeltà", text: "Rilascio della Carta, raccolta punti, sconti e promozioni.", required: true },
  prenotazioni: { title: "Appuntamenti", text: "Usiamo nome e cellulare per gestire le tue prenotazioni.", required: true },
  ricette: { title: "Ricette e preventivi", text: "Valutiamo le ricette che ci mandi e ti scriviamo il preventivo.", required: false },
  referti: { title: "Referti nel profilo", text: "Teniamo i referti degli esami fatti in farmacia nel tuo profilo.", required: false },
  routine: { title: "SkinLab Routine", text: "Teniamo la tua routine e ti avvisiamo quando un prodotto sta finendo.", required: false },
  promemoria_whatsapp: { title: "Promemoria su WhatsApp", text: "Conferme e promemoria di appuntamenti, ordini e ricette.", required: false },
  marketing: { title: "Marketing diretto", text: "Materiale pubblicitario e promozioni anche via e-mail, SMS e newsletter, compresi omaggi e campioni.", required: false },
};

/** Si aggiunge sempre un nuovo record: lo storico non si cancella mai. */
export const recordConsent = (history: ConsentRecord[], r: ConsentRecord): ConsentRecord[] => [...history, r];

/** Lo stato attuale di ogni consenso: l'ultimo record per scopo (null se mai dato né negato). */
export function currentConsents(history: ConsentRecord[]): Record<ConsentPurpose, ConsentRecord | null> {
  const out = Object.fromEntries((Object.keys(CONSENT_LABELS) as ConsentPurpose[]).map((p) => [p, null])) as Record<ConsentPurpose, ConsentRecord | null>;
  for (const r of [...history].sort((a, b) => a.at.localeCompare(b.at))) out[r.purpose] = r;
  return out;
}

// ——— Accesso: cellulare + password (decisione di Giovanni del 28/11/2026) ———
// La password si salva solo come impronta lenta (scrypt) sul server. Il profilo si attiva quando la farmacista,
// al banco, controlla la tessera: così nessuno può aprire un profilo con il numero di un altro.
export const PASSWORD_MIN = 8;
export const LOGIN_MAX_FAILS = 5;
export const LOGIN_LOCK_MINUTES = 15;

const COMMON = ["password", "12345678", "123456789", "qwertyui", "farmacia", "masera", "seregno", "iloveyou", "11111111", "00000000"];

/** Controlla una password nuova: almeno 8 caratteri, non banale, senza il numero di telefono dentro. Errore da mostrare o null. */
export function checkNewPassword(pw: string, phone: string | null): string | null {
  if (pw.length < PASSWORD_MIN) return `Almeno ${PASSWORD_MIN} caratteri.`;
  const low = pw.toLowerCase();
  if (COMMON.some((c) => low.includes(c)) || /^(.)\1+$/.test(pw)) return "È troppo facile da indovinare: scegline un'altra.";
  const digits = (phone ?? "").replace(/\D/g, "").slice(-7);
  if (digits && pw.replace(/\D/g, "").includes(digits)) return "Non usare il tuo numero di telefono.";
  return null;
}

/** Dopo 5 tentativi sbagliati di fila si aspetta 15 minuti. Restituisce i minuti di attesa (0 = si può provare). */
export function loginWaitMinutes(fails: number, lastFailAt: string | null, now: Date): number {
  if (fails < LOGIN_MAX_FAILS || !lastFailAt) return 0;
  const left = LOGIN_LOCK_MINUTES * 60_000 - (now.getTime() - new Date(lastFailAt).getTime());
  return left > 0 ? Math.ceil(left / 60_000) : 0;
}

/** Promemoria "rifacciamo l'analisi" e simili: data + N giorni. */
export const dueDate = (from: string, days: number) => addDays(from, days);
