import { describe, expect, it } from "vitest";
import {
  addDays, availableSlots, bookableDays, bookableServices, BOOKING_WINDOW_DAYS, formatClock, formatDay,
  localNow, normalizeMobile, toMinutes, weekdayOf, type Busy, agendaServices, farmaesteticaBookingGroups, findAgendaService,
  formatServiceDuration, farmaesteticaGroups, miamoGroups, treatmentSlug,
} from "../src";

// Lunedì 23 novembre 2026, 7:00 a Seregno (ora solare: UTC+1).
const MON_EARLY = new Date("2026-11-23T06:00:00Z");
const MON = "2026-11-23";
const SAT = "2026-11-28";
const SUN = "2026-11-29";
const cabina15 = { duration_min: 15, resource: "cabina_analisi" };
const ecg = { duration_min: 30, resource: "cabina_analisi" };

describe("date nell'ora di Seregno", () => {
  it("legge data e minuti italiani anche a mezzanotte UTC", () => {
    expect(localNow(new Date("2026-11-23T23:30:00Z"))).toEqual({ date: "2026-11-24", minutes: 30 });
    expect(localNow(new Date("2026-07-01T22:30:00Z"))).toEqual({ date: "2026-07-02", minutes: 30 }); // ora legale
  });
  it("giorni della settimana e somme", () => {
    expect(weekdayOf(MON)).toBe("mon");
    expect(weekdayOf(SUN)).toBe("sun");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-28", 2)).toBe("2026-03-30"); // attraverso il cambio d'ora
  });
  it("formati in italiano", () => {
    expect(formatClock(545)).toBe("9:05");
    expect(toMinutes("19:30")).toBe(1170);
    expect(formatDay(MON)).toEqual({ dow: "lun", num: "23", long: "lunedì 23 novembre" });
  });
});

describe("orari liberi", () => {
  it("un giorno vuoto: dalle 8:30, ogni 15 minuti, l'ultimo finisce alla chiusura", () => {
    const s = availableSlots({ service: cabina15, date: MON, now: MON_EARLY });
    expect(s[0]).toBe(toMinutes("08:30"));
    expect(s.at(-1)).toBe(toMinutes("19:15"));
    expect(s.every((m, i) => i === 0 || m - s[i - 1]! === 15)).toBe(true);
  });
  it("ECG da 30 minuti: l'ultimo inizia alle 19:00", () => {
    expect(availableSlots({ service: ecg, date: MON, now: MON_EARLY }).at(-1)).toBe(toMinutes("19:00"));
  });
  it("sabato rispetta la pausa e la domenica è chiusa", () => {
    const s = availableSlots({ service: cabina15, date: SAT, now: MON_EARLY });
    expect(s).toContain(toMinutes("12:15"));
    expect(s).not.toContain(toMinutes("12:30"));
    expect(s).not.toContain(toMinutes("14:45"));
    expect(s).toContain(toMinutes("15:00"));
    expect(s.at(-1)).toBe(toMinutes("18:45"));
    expect(availableSlots({ service: cabina15, date: SUN, now: MON_EARLY })).toEqual([]);
  });
  it("dopo un appuntamento servono 5 minuti di pulizia", () => {
    const busy: Busy[] = [{ resource: "cabina_analisi", date: MON, start: toMinutes("10:00"), end: toMinutes("10:15") }];
    const s = availableSlots({ service: cabina15, date: MON, now: MON_EARLY, busy });
    expect(s).toContain(toMinutes("09:30")); // 9:30–9:45 + 5' finisce prima delle 10
    expect(s).not.toContain(toMinutes("09:45")); // finirebbe alle 10:05 con la pulizia
    expect(s).not.toContain(toMinutes("10:00"));
    expect(s).not.toContain(toMinutes("10:15")); // la cabina è libera solo dalle 10:20
    expect(s).toContain(toMinutes("10:30"));
  });
  it("un impegno su un'altra cabina non toglie posti", () => {
    const busy: Busy[] = [{ resource: "skinlab", date: MON, start: toMinutes("10:00"), end: toMinutes("10:15") }];
    expect(availableSlots({ service: cabina15, date: MON, now: MON_EARLY, busy })).toContain(toMinutes("10:00"));
  });
  it("chiusure: tutto il giorno o solo una fascia", () => {
    expect(availableSlots({ service: cabina15, date: MON, now: MON_EARLY, closures: [{ date: MON }] })).toEqual([]);
    const s = availableSlots({
      service: cabina15, date: MON, now: MON_EARLY,
      closures: [{ date: MON, resource: "cabina_analisi", from: toMinutes("14:00"), to: toMinutes("16:00") }],
    });
    expect(s).toContain(toMinutes("13:45"));
    expect(s).not.toContain(toMinutes("14:00"));
    expect(s).not.toContain(toMinutes("15:45"));
    expect(s).toContain(toMinutes("16:00"));
  });
  it("oggi: niente orari passati e almeno un'ora di preavviso", () => {
    const now = new Date("2026-11-23T09:10:00Z"); // 10:10 a Seregno
    const s = availableSlots({ service: cabina15, date: MON, now });
    expect(s[0]).toBe(toMinutes("11:15"));
  });
  it("personale: in giornata senza preavviso (fino a 15 minuti fa) e anche oltre i 14 giorni", () => {
    const now = new Date("2026-11-23T09:10:00Z"); // 10:10 a Seregno
    expect(availableSlots({ service: cabina15, date: MON, now, staff: true })[0]).toBe(toMinutes("10:00"));
    expect(availableSlots({ service: cabina15, date: addDays(MON, 30), now, staff: true }).length).toBeGreaterThan(0);
    expect(availableSlots({ service: cabina15, date: "2026-11-22", now, staff: true })).toEqual([]);
  });
  it("niente date passate né oltre la finestra di prenotazione", () => {
    expect(availableSlots({ service: cabina15, date: "2026-11-22", now: MON_EARLY })).toEqual([]);
    expect(availableSlots({ service: cabina15, date: addDays(MON, BOOKING_WINDOW_DAYS), now: MON_EARLY })).toEqual([]);
    expect(bookableDays({ service: cabina15, now: MON_EARLY })).toHaveLength(BOOKING_WINDOW_DAYS);
  });
  it("un servizio senza cabina prenotabile non ha orari", () => {
    expect(availableSlots({ service: { duration_min: 15, resource: "video" }, date: MON, now: MON_EARLY })).toEqual([]);
  });
});

describe("servizi e dati del cliente", () => {
  it("prenotabili online: cabina analisi, Skin LAB e Farmaestetica; niente videoconsulenza né breath test", () => {
    const b = bookableServices();
    expect(b.length).toBeGreaterThan(10);
    expect(b.every((s) => ["cabina_analisi", "skinlab", "farmaestetica"].includes(s.resource))).toBe(true);
    expect(b.some((s) => s.slug === "videoconsulenza")).toBe(false);
    expect(b.some((s) => s.slug.startsWith("breath-test"))).toBe(false);
  });
  it("cellulare italiano", () => {
    expect(normalizeMobile("373 770 5485")).toBe("+393737705485");
    expect(normalizeMobile("+39 333-1234567")).toBe("+393331234567");
    expect(normalizeMobile("0362 231660")).toBeNull();
    expect(normalizeMobile("12345")).toBeNull();
  });
});

describe("Farmaestetica nell'agenda", () => {
  const pulizia = findAgendaService("fe-viso-pulizia-viso")!;
  it("ogni trattamento ha un codice unico, anche quelli con lo stesso nome", () => {
    const slugs = agendaServices.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(findAgendaService("fe-laser-ascelle")?.resource).toBe("farmaestetica");
    expect(findAgendaService("fe-cera-mani-piedi-ascelle")?.price_eur).toBe(16);
    expect(farmaesteticaBookingGroups.map((g) => g.name)).toEqual(["Viso", "Corpo", "Laser", "Cera e mani-piedi", "Miamo Lounge"]);
  });
  it("ogni tasto + del listino porta a un trattamento prenotabile", () => {
    for (const g of [...farmaesteticaGroups, ...miamoGroups]) {
      for (const it of g.items) expect(findAgendaService(treatmentSlug(g.slug, it.name))?.bookable_online, `${g.name} · ${it.name}`).toBe(true);
    }
  });
  it("durate del listino mostrate come circa", () => {
    expect(pulizia.duration_min).toBe(60);
    expect(formatServiceDuration(pulizia)).toBe("circa 1 ora");
    expect(formatServiceDuration({ duration_min: 30 })).toBe("30 min");
  });
  it("orari propri: sabato dalle 8:30 alle 18:30, domenica chiuso", () => {
    const sat = availableSlots({ service: pulizia, date: SAT, now: MON_EARLY });
    expect(formatClock(sat[0]!)).toBe("8:30");
    expect(formatClock(sat.at(-1)!)).toBe("17:30");
    expect(availableSlots({ service: pulizia, date: SUN, now: MON_EARLY })).toEqual([]);
  });
  it("10 minuti di pulizia, e un ECG in cabina non tocca l'estetista", () => {
    const busy: Busy[] = [
      { resource: "farmaestetica", date: MON, start: toMinutes("10:00"), end: toMinutes("11:00") },
      { resource: "cabina_analisi", date: MON, start: toMinutes("14:00"), end: toMinutes("14:30") },
    ];
    const free = availableSlots({ service: pulizia, date: MON, now: MON_EARLY, busy }).map(formatClock);
    expect(free).not.toContain("11:00"); // pulizia fino alle 11:10
    expect(free).toContain("11:15");
    expect(free[0]).toBe("11:15"); // apre alle 9:30: un'ora non ci sta prima delle 10
    expect(free).toContain("14:00");
  });
});
