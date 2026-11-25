// Agenda Masera: testi e dati di prova della pagina /prenota.
import {
  addDays, bookableServices, BOOKING_WINDOW_DAYS, farmaesteticaBookingGroups, farmaesteticaBrand, farmaesteticaContacts, localNow, serviceGroups, toMinutes,
  type BookingGroup, type Busy,
} from "@masera/core";
import { links } from "@/content/home";

/**
 * false finché la farmacia non usa davvero l'agenda online (fino allo switch):
 * la pagina avvisa che le prenotazioni sono di prova.
 */
export const AGENDA_LIVE = false;

/** Gruppi "per bisogno" della farmacia con almeno un servizio prenotabile, più gli altri servizi in fondo. */
export function bookingGroups(): BookingGroup[] {
  const all = bookableServices().filter((s) => s.resource !== "farmaestetica");
  const groups: BookingGroup[] = serviceGroups
    .map((g) => ({ slug: g.slug, name: g.name, services: all.filter((s) => s.group === g.slug) }))
    .filter((g) => g.services.length > 0);
  const others = all.filter((s) => !s.group);
  if (others.length) groups.push({ slug: "altro", name: "Consulenze", services: others });
  return groups;
}

export type BookingArea = {
  slug: "farmacia" | "farmaestetica";
  name: string;
  groups: BookingGroup[];
  /** Dove presentarsi, nella schermata finale. */
  place: string;
  whatsapp: string;
};

/** Le due "porte" della pagina: la farmacia e il centro estetico al piano di sopra. */
export function bookingAreas(): BookingArea[] {
  const fe = farmaesteticaBookingGroups
    .map((g) => ({ ...g, services: g.services.filter((s) => s.bookable_online) }))
    .filter((g) => g.services.length > 0);
  return [
    { slug: "farmacia", name: "Farmacia", groups: bookingGroups(), place: "Farmacia Masera, via Garibaldi 103, Seregno", whatsapp: links.whatsapp },
    {
      slug: "farmaestetica",
      name: farmaesteticaBrand,
      groups: fe,
      place: `${farmaesteticaBrand}, piano 1 · ingresso ${farmaesteticaContacts.address.replace(", 20831 Seregno (MB)", "")}, Seregno`,
      whatsapp: `https://wa.me/39${farmaesteticaContacts.whatsapp.replace(/\s/g, "")}`,
    },
  ];
}

/**
 * Impegni finti, usati solo quando il database non è collegato (sul computer o in un'anteprima senza chiavi):
 * qualche orario già occupato ogni giorno, così si vede che il calendario nasconde i posti presi.
 */
export function demoBusy(now: Date): Busy[] {
  const start = localNow(now).date;
  const out: Busy[] = [];
  for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
    const date = addDays(start, i);
    const shift = (i % 3) * 30;
    out.push({ resource: "cabina_analisi", date, start: toMinutes("09:00") + shift, end: toMinutes("09:30") + shift });
    out.push({ resource: "cabina_analisi", date, start: toMinutes("11:00") + shift, end: toMinutes("11:15") + shift });
    out.push({ resource: "cabina_analisi", date, start: toMinutes("17:30") - shift, end: toMinutes("18:00") - shift });
    out.push({ resource: "skinlab", date, start: toMinutes("10:00") + shift, end: toMinutes("10:15") + shift });
    out.push({ resource: "farmaestetica", date, start: toMinutes("10:00") + shift, end: toMinutes("11:00") + shift });
    out.push({ resource: "farmaestetica", date, start: toMinutes("15:30") - shift, end: toMinutes("16:20") - shift });
  }
  return out;
}
