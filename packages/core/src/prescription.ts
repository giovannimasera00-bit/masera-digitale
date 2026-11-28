// Invia una ricetta (BRIEF §11): solo Seregno. Foto o codice della ricetta elettronica → preventivo → il cliente approva.
// Solo logica, con i test. La foto serve solo per il preventivo: l'originale resta obbligatorio.
import { deliveryZone, formatEuro, isValidZip } from "./delivery";

/** Le foto delle ricette si cancellano da sole dopo 7 giorni (decisione di Giovanni del 28/11/2026). */
export const PRESCRIPTION_PHOTO_DAYS = 7;

/** Le ricette si accettano solo da Seregno (CAP 20831). */
export function prescriptionAllowed(zip: string): { ok: true } | { ok: false; message: string } {
  if (!isValidZip(zip)) return { ok: false, message: "Scrivi un CAP di 5 cifre, per esempio 20831." };
  return deliveryZone(zip) === "seregno"
    ? { ok: true }
    : { ok: false, message: "Il servizio ricette è solo per Seregno. Puoi portare la ricetta in farmacia: la prepariamo noi." };
}

// ——— Codice fiscale (controllo del carattere finale) ———
const ODD: Record<string, number> = {
  0: 1, 1: 0, 2: 5, 3: 7, 4: 9, 5: 13, 6: 15, 7: 17, 8: 19, 9: 21,
  A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21, K: 2, L: 4, M: 18,
  N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14, U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23,
};
const evenValue = (ch: string) => (/\d/.test(ch) ? Number(ch) : ch.charCodeAt(0) - 65);

/** "rssmra85t10a562s" → "RSSMRA85T10A562S" se valido (16 caratteri e carattere di controllo giusto), altrimenti null. */
export function normalizeFiscalCode(input: string): string | null {
  const cf = input.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(cf)) return null;
  let sum = 0;
  for (let i = 0; i < 15; i++) sum += i % 2 === 0 ? ODD[cf[i]!]! : evenValue(cf[i]!);
  return String.fromCharCode(65 + (sum % 26)) === cf[15] ? cf : null;
}

/**
 * Codice della ricetta elettronica (NRE): 15 caratteri tra lettere e numeri (confermato da Giovanni il 28/11/2026).
 * Spazi e trattini scritti dal cliente si tolgono.
 */
export function normalizeNre(input: string): string | null {
  const n = input.replace(/[\s-]/g, "").toUpperCase();
  return /^[A-Z0-9]{15}$/.test(n) ? n : null;
}

export type PrescriptionSource = { kind: "foto"; files: number } | { kind: "nre"; nre: string; fiscalCode: string };
export type Handover = "ritiro" | "consegna";

/** Controlla una richiesta prima dell'invio. Restituisce gli errori da mostrare, campo per campo. */
export function checkPrescriptionRequest(r: {
  zip: string; source: PrescriptionSource; handover: Handover; name: string; phone: string | null; privacy: boolean;
}): Partial<Record<"zip" | "source" | "nre" | "fiscalCode" | "name" | "phone" | "privacy", string>> {
  const e: ReturnType<typeof checkPrescriptionRequest> = {};
  const z = prescriptionAllowed(r.zip);
  if (!z.ok) e.zip = z.message;
  if (r.source.kind === "foto") {
    if (r.source.files < 1) e.source = "Aggiungi la foto della ricetta.";
    if (r.source.files > 5) e.source = "Al massimo 5 foto per richiesta.";
  } else {
    if (!normalizeNre(r.source.nre)) e.nre = "Il codice della ricetta elettronica ha 15 caratteri, lettere e numeri.";
    if (!normalizeFiscalCode(r.source.fiscalCode)) e.fiscalCode = "Controlla il codice fiscale: 16 caratteri, come sulla tessera sanitaria.";
  }
  if (r.name.trim().length < 3) e.name = "Scrivi nome e cognome.";
  if (!r.phone) e.phone = "Scrivi un numero di cellulare italiano.";
  if (!r.privacy) e.privacy = "Serve la presa visione dell'informativa.";
  return e;
}

// ——— Preventivo ———
export type QuoteLine = { description: string; qty: number; unitEur: number };
export type PrescriptionQuote = {
  lines: QuoteLine[];
  /** Quando è pronta, in parole ("domani dopo le 15"). */
  readyBy: string;
  /** Nota della farmacista (facoltativa). */
  note: string | null;
};

/** Totale del preventivo in centesimi esatti. */
export function quoteTotalEur(q: Pick<PrescriptionQuote, "lines">): number {
  return q.lines.reduce((acc, l) => acc + Math.round(l.unitEur * 100) * Math.max(0, Math.floor(l.qty)), 0) / 100;
}

/** Un preventivo si può mandare solo se ha almeno una riga valida e il tempo di preparazione. */
export function quoteProblems(q: PrescriptionQuote): string[] {
  const p: string[] = [];
  if (!q.lines.length) p.push("Aggiungi almeno una riga.");
  q.lines.forEach((l, i) => {
    if (!l.description.trim()) p.push(`Riga ${i + 1}: manca la descrizione.`);
    if (!(l.qty >= 1)) p.push(`Riga ${i + 1}: quantità almeno 1.`);
    if (!(l.unitEur >= 0)) p.push(`Riga ${i + 1}: prezzo non valido.`);
  });
  if (!q.readyBy.trim()) p.push("Scrivi quando è pronta.");
  return p;
}

export type PrescriptionStatus = "inviata" | "preventivo" | "approvata" | "rifiutata" | "in_preparazione" | "pronta" | "chiusa";

export const PRESCRIPTION_STATUS: Record<PrescriptionStatus, string> = {
  inviata: "Da valutare",
  preventivo: "Preventivo inviato",
  approvata: "Approvata dal cliente",
  rifiutata: "Rifiutata dal cliente",
  in_preparazione: "In preparazione",
  pronta: "Pronta",
  chiusa: "Ritirata o consegnata",
};

/** Le frasi per il cliente sul passaggio di mano. */
export function handoverNote(h: Handover): string {
  return h === "consegna"
    ? "Consegna serale a Seregno: i farmaci su ricetta viaggiano in un pacco sigillato da un farmacista. Al rider consegni l'originale della ricetta."
    : "Ritiro in farmacia, in via Garibaldi 103: porta l'originale della ricetta.";
}

/** "2 × Crema galenica 50 g · 18,00 €" */
export const quoteLineLabel = (l: QuoteLine) => `${l.qty} × ${l.description} · ${formatEuro(l.unitEur * l.qty)}`;
