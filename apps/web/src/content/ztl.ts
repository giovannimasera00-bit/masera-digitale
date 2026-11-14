// Testi ZTL: ripresi dalla pagina già pubblicata sul sito attuale (design/sito-attuale/ztl-pagina.html)
// e da data/farmacia.json. Rispetta la regola fissa n. 8 del BRIEF (§2, ZTL).
import { farmacia } from "@masera/core";

const z = farmacia.ztl;

/** "2026-11-01" → "1° novembre 2026" */
export function formatItalianDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const mesi = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  return `${d === 1 ? "1°" : d} ${mesi[(m ?? 1) - 1]} ${y}`;
}

export const ztlSince = formatItalianDate(z.active_since);
export const ztlValidFor = z.valid_for; // "acquisto farmaci o prestazioni sanitarie"
export const ztlClosing = z.closing; // "Tutto qui."

/** I tre passi (testo ufficiale completo in data/farmacia.json → ztl.steps). */
export const ztlSteps = [
  { t: "Entra in ZTL da via Garibaldi", d: "Il varco è all'incrocio con via Fratelli Cairoli." },
  { t: "Parcheggia negli spazi riservati", d: "Davanti alla farmacia, massimo 30 minuti." },
  { t: "Al banco comunica la targa", d: `Vale per ${z.valid_for}.` },
];

export const ztlFacts = [
  { n: "0 €", t: "Accesso gratuito", d: "Entrare in ZTL per venire in farmacia non costa nulla." },
  { n: "30'", t: "Sosta massima", d: "Negli spazi riservati alla Farmacia Masera in via Garibaldi." },
  { n: "1", t: "Una sola cosa da fare", d: "Comunicare la targa ai farmacisti al banco." },
];

export const ztlFaq = [
  { q: "Devo registrare la targa prima di entrare?", a: "No. Entri, parcheggi e comunichi la targa ai farmacisti al banco." },
  { q: "Da dove devo entrare?", a: "Dall'ingresso della ZTL di via Garibaldi, all'incrocio con via Fratelli Cairoli." },
  { q: "Per quanto tempo posso restare?", a: "Al massimo 30 minuti, negli spazi riservati alla Farmacia Masera." },
  { q: "Vale per qualsiasi acquisto?", a: `Vale per l'${z.valid_for} in farmacia.` },
  { q: "Quanto costa?", a: "Niente: l'accesso è gratuito." },
];

export const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${farmacia.geo.lat},${farmacia.geo.lng}`;
