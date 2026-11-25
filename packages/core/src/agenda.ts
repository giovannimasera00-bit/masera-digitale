// Agenda Masera: calcolo degli orari davvero liberi (BRIEF §9).
// Tutto ragiona in "ora di Seregno": date "AAAA-MM-GG" e minuti dalla mezzanotte, così il risultato
// non cambia se il server gira in un altro fuso o al cambio dell'ora legale.
import { farmaciaHours, TIME_ZONE, type WeekDay, type WeeklyHours } from "./farmacia";
import { services, type Service } from "./services";
import { farmaesteticaGroups, farmaesteticaHours, miamoGroups, treatmentSlug, type Treatment } from "./farmaestetica";

export type ResourceId = "cabina_analisi" | "skinlab" | "farmaestetica";

export type AgendaResource = {
  id: ResourceId;
  name: string;
  /** Minuti di pulizia dopo ogni appuntamento. */
  bufferMin: number;
  hours: WeeklyHours;
};

/** Le zone prenotabili, indipendenti tra loro. Videoconsulenza ed eventi arriveranno dopo. */
export const agendaResources: Record<ResourceId, AgendaResource> = {
  cabina_analisi: { id: "cabina_analisi", name: "Cabina analisi", bufferMin: 5, hours: farmaciaHours },
  // Skin LAB: nessuna pausa tra un appuntamento e l'altro (confermato da Giovanni il 25/11/2026).
  skinlab: { id: "skinlab", name: "Cabina Skin LAB", bufferMin: 0, hours: farmaciaHours },
  // Farmaestetica (e Miamo Lounge): una sola estetista, laser incluso; 10 minuti di pulizia (BRIEF §9).
  farmaestetica: { id: "farmaestetica", name: "Farmaestetica", bufferMin: 10, hours: farmaesteticaHours },
};

export type BookingGroup = { slug: string; name: string; services: Service[] };

const feService = (group: string, t: Treatment, name: string, estimate: boolean): Service => ({
  slug: treatmentSlug(group, t.name),
  name,
  description: "",
  group: `fe-${group}`,
  price_eur: t.price,
  duration_min: t.minutes,
  preparation: "",
  resource: "farmaestetica",
  bookable_online: true,
  ...(estimate ? { estimate: true } : {}),
});

/** I trattamenti di Farmaestetica by Dottor Masera come servizi prenotabili, divisi come nel listino, più la Miamo Lounge. */
export const farmaesteticaBookingGroups: BookingGroup[] = [
  ...farmaesteticaGroups.map((g) => ({ slug: `fe-${g.slug}`, name: g.name, services: g.items.map((t) => feService(g.slug, t, t.name, true)) })),
  {
    slug: "fe-miamo",
    name: "Miamo Lounge",
    services: miamoGroups.flatMap((l) =>
      l.items.map((t) => feService(l.slug, t, l.slug.includes("elettroporazione") ? `${t.name} con elettroporazione e radiofrequenza` : t.name, false)),
    ),
  },
];

/** Tutto ciò che può stare in agenda: servizi della farmacia e trattamenti di Farmaestetica. */
export const agendaServices: Service[] = [...services, ...farmaesteticaBookingGroups.flatMap((g) => g.services)];
export const findAgendaService = (slug: string): Service | undefined => agendaServices.find((s) => s.slug === slug);

/** Ogni quanto si può iniziare un appuntamento. */
export const SLOT_STEP_MIN = 15;
/** Preavviso minimo per prenotare online: 1 ora, sempre (confermato il 25/11/2026). */
export const MIN_NOTICE_MIN = 60;
/** Quanti giorni avanti si può prenotare online: 30 (confermato da Giovanni il 25/11/2026). */
export const BOOKING_WINDOW_DAYS = 30;
/** Il cliente può spostare o annullare da solo fino a 1 ora prima (confermato il 25/11/2026). Dopo, chiama o scrive. */
export const CHANGE_NOTICE_MIN = 60;

/** Un appuntamento (o un posto tenuto per 5 minuti) che occupa una risorsa. */
export type Busy = { resource: ResourceId; date: string; start: number; end: number };
/** Chiusura: tutto il giorno o una fascia; senza risorsa vale per tutte. */
export type Closure = { date: string; resource?: ResourceId; from?: number; to?: number; reason?: string };

const isResource = (r: string): r is ResourceId => r in agendaResources;

/** I servizi che il cliente può prenotare da solo sul sito. */
export function bookableServices(): Service[] {
  return agendaServices.filter((s) => s.bookable_online && isResource(s.resource));
}

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};
/** 545 → "9:05" */
export const formatClock = (min: number): string => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;

/** Data e minuti attuali nell'ora di Seregno. */
export function localNow(now: Date, timeZone = TIME_ZONE): { date: string; minutes: number } {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return { date: `${g("year")}-${g("month")}-${g("day")}`, minutes: Number(g("hour")) * 60 + Number(g("minute")) };
}

const WEEK: WeekDay[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const asUtcNoon = (iso: string) => new Date(`${iso}T12:00:00Z`);

export function weekdayOf(iso: string): WeekDay {
  return WEEK[asUtcNoon(iso).getUTCDay()]!;
}
export function addDays(iso: string, n: number): string {
  const d = asUtcNoon(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Minuti che mancano a un appuntamento (giorno e minuti in ora di Seregno). Negativo se è già iniziato. */
export function minutesUntil(date: string, startMin: number, now: Date): number {
  const today = localNow(now);
  const days = Math.round((asUtcNoon(date).getTime() - asUtcNoon(today.date).getTime()) / 86_400_000);
  return days * 1440 + startMin - today.minutes;
}

/** true se il cliente può ancora spostare o annullare da solo. */
export const canChangeOnline = (date: string, startMin: number, now: Date): boolean => minutesUntil(date, startMin, now) >= CHANGE_NOTICE_MIN;

const overlaps = (a0: number, a1: number, b0: number, b1: number) => a0 < b1 && b0 < a1;

/**
 * Gli orari d'inizio liberi (in minuti) per un servizio in un giorno.
 * Regole: dentro gli orari della risorsa, l'appuntamento finisce entro la chiusura,
 * dopo ogni appuntamento c'è la pulizia, niente sovrapposizioni con impegni e chiusure,
 * in giornata solo con il preavviso minimo.
 */
export function availableSlots(opts: {
  service: Pick<Service, "duration_min" | "resource">;
  date: string;
  now: Date;
  busy?: Busy[];
  closures?: Closure[];
  /**
   * Per il personale (prenotazioni al telefono o al banco): niente preavviso minimo né limite di giorni,
   * ma mai orari già passati di oltre 15 minuti (per segnare chi è appena arrivato).
   */
  staff?: boolean;
}): number[] {
  const { service, date, now, busy = [], closures = [], staff = false } = opts;
  if (!isResource(service.resource)) return [];
  const res = agendaResources[service.resource];
  const today = localNow(now);
  if (date < today.date || (!staff && date > addDays(today.date, BOOKING_WINDOW_DAYS - 1))) return [];

  const dayClosures = closures.filter((c) => c.date === date && (!c.resource || c.resource === res.id));
  if (dayClosures.some((c) => c.from === undefined || c.to === undefined)) return [];

  const taken = busy.filter((b) => b.resource === res.id && b.date === date);
  const earliest = date !== today.date ? 0 : staff ? today.minutes - SLOT_STEP_MIN : today.minutes + MIN_NOTICE_MIN;
  const dur = service.duration_min;
  const out: number[] = [];

  for (const [from, to] of res.hours[weekdayOf(date)]) {
    const open = toMinutes(from);
    const close = toMinutes(to);
    for (let s = open; s + dur <= close; s += SLOT_STEP_MIN) {
      if (s < earliest) continue;
      const e = s + dur;
      if (taken.some((b) => overlaps(s, e + res.bufferMin, b.start, b.end + res.bufferMin))) continue;
      if (dayClosures.some((c) => overlaps(s, e, c.from!, c.to!))) continue;
      out.push(s);
    }
  }
  return out;
}

/** I giorni prenotabili da oggi, con quanti orari liberi ha ciascuno. */
export function bookableDays(opts: Omit<Parameters<typeof availableSlots>[0], "date">): { date: string; slots: number[] }[] {
  const start = localNow(opts.now).date;
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) => {
    const date = addDays(start, i);
    return { date, slots: availableSlots({ ...opts, date }) };
  });
}

const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
const GIORNI: Record<WeekDay, string> = { mon: "lunedì", tue: "martedì", wed: "mercoledì", thu: "giovedì", fri: "venerdì", sat: "sabato", sun: "domenica" };

/** "2026-11-24" → { dow: "mar", num: "24", long: "martedì 24 novembre" } */
export function formatDay(iso: string): { dow: string; num: string; long: string } {
  const [, m, d] = iso.split("-").map(Number);
  const g = GIORNI[weekdayOf(iso)];
  return { dow: g.slice(0, 3), num: String(d), long: `${g} ${d} ${MESI[(m ?? 1) - 1]}` };
}

/** Cellulare italiano: 3xx xxx xxxx, con o senza +39. Restituisce il numero pulito o null. */
export function normalizeMobile(input: string): string | null {
  const d = input.replace(/[\s.\-/()]/g, "").replace(/^(\+39|0039)/, "");
  return /^3\d{8,9}$/.test(d) ? `+39${d}` : null;
}
