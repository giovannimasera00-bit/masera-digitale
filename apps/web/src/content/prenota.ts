// Agenda Masera: testi e dati di prova della pagina /prenota.
import { addDays, bookableServices, localNow, serviceGroups, toMinutes, type Busy, type Service } from "@masera/core";

/**
 * false finché la farmacia non usa davvero l'agenda online (fino allo switch):
 * la pagina avvisa che le prenotazioni sono di prova.
 */
export const AGENDA_LIVE = false;

export type BookingGroup = { slug: string; name: string; services: Service[] };

/** Gruppi "per bisogno" con almeno un servizio prenotabile, più gli altri servizi in fondo. */
export function bookingGroups(): BookingGroup[] {
  const all = bookableServices();
  const groups: BookingGroup[] = serviceGroups
    .map((g) => ({ slug: g.slug, name: g.name, services: all.filter((s) => s.group === g.slug) }))
    .filter((g) => g.services.length > 0);
  const others = all.filter((s) => !s.group);
  if (others.length) groups.push({ slug: "altro", name: "Consulenze", services: others });
  return groups;
}

/**
 * Impegni finti, usati solo quando il database non è collegato (sul computer o in un'anteprima senza chiavi):
 * qualche orario già occupato ogni giorno, così si vede che il calendario nasconde i posti presi.
 */
export function demoBusy(now: Date): Busy[] {
  const start = localNow(now).date;
  const out: Busy[] = [];
  for (let i = 0; i < 14; i++) {
    const date = addDays(start, i);
    const shift = (i % 3) * 30;
    out.push({ resource: "cabina_analisi", date, start: toMinutes("09:00") + shift, end: toMinutes("09:30") + shift });
    out.push({ resource: "cabina_analisi", date, start: toMinutes("11:00") + shift, end: toMinutes("11:15") + shift });
    out.push({ resource: "cabina_analisi", date, start: toMinutes("17:30") - shift, end: toMinutes("18:00") - shift });
    out.push({ resource: "skinlab", date, start: toMinutes("10:00") + shift, end: toMinutes("10:15") + shift });
  }
  return out;
}
