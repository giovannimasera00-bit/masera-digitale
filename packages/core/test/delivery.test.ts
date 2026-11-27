import { describe, expect, it } from "vitest";
import {
  deliveryZone,
  farmaciaHours,
  formatMinutes,
  formatPrice,
  formatWeeklyHours,
  freeShippingGap,
  minPrice,
  seregnoDelivery,
  quoteDelivery,
  promoPrice,
  formatEuro,
  ITALY_SHIPPING_EUR,
} from "../src";

// Date in UTC; a novembre Seregno è a UTC+1.
const at = (iso: string) => seregnoDelivery(new Date(iso));

describe("Consegna a Seregno", () => {
  it("lunedì alle 10: arriva oggi, mancano 6 ore", () => {
    expect(at("2026-11-16T09:00:00Z")).toMatchObject({ today: true, minutesLeft: 360, label: "Ordina entro le 16:00, ricevi oggi verso le 19:00" });
  });
  it("lunedì alle 15:59: ancora oggi", () => {
    expect(at("2026-11-16T14:59:00Z")).toMatchObject({ today: true, minutesLeft: 1 });
  });
  it("lunedì alle 16:00 in punto: domani", () => {
    expect(at("2026-11-16T15:00:00Z")).toMatchObject({ today: false, label: "Ordina ora, ricevi domani verso le 19:00" });
  });
  it("sabato mattina: oggi (si consegna anche di sabato)", () => {
    expect(at("2026-11-21T09:00:00Z").today).toBe(true);
  });
  it("sabato dopo le 16: lunedì, salta la domenica", () => {
    expect(at("2026-11-21T16:00:00Z").label).toBe("Ordina ora, ricevi lunedì verso le 19:00");
  });
  it("domenica: domani (lunedì)", () => {
    expect(at("2026-11-22T10:00:00Z").when).toBe("domani");
  });
  it("prima dell'apertura conta comunque fino alle 16", () => {
    expect(at("2026-11-17T06:00:00Z")).toMatchObject({ today: true, minutesLeft: 540 }); // 7:00
  });
});

describe("Zona di consegna dal CAP", () => {
  it("20831 è Seregno", () => expect(deliveryZone("20831")).toBe("seregno"));
  it("spazi intorno al CAP non contano", () => expect(deliveryZone(" 20831 ")).toBe("seregno"));
  it("Milano è resto d'Italia", () => expect(deliveryZone("20121")).toBe("italia"));
});

describe("Spedizione gratuita in Italia sopra 59 €", () => {
  it("con 40 € mancano 19 €", () => expect(freeShippingGap(40)).toBe(19));
  it("con 59 € è gratuita", () => expect(freeShippingGap(59)).toBe(0));
  it("con 58,10 € mancano 0,90 €", () => expect(freeShippingGap(58.1)).toBe(0.9));
});

describe("Formati", () => {
  it("minuti", () => {
    expect(formatMinutes(45)).toBe("45 min");
    expect(formatMinutes(120)).toBe("2 h");
    expect(formatMinutes(135)).toBe("2 h 15 min");
  });
  it("prezzi", () => {
    expect(formatPrice(35)).toBe("35 €");
    expect(formatPrice(59.9)).toBe("59,90 €");
    expect(formatPrice(null)).toBe("[DA CONFERMARE]");
  });
  it("prezzo minimo di un gruppo dai dati", () => {
    expect(minPrice("sangue-urine")).toBe(6);
    expect(minPrice("inesistente")).toBeNull();
  });
  it("orari raggruppati per il footer", () => {
    expect(formatWeeklyHours(farmaciaHours)).toEqual([
      "Lun–ven 8:30–19:30",
      "Sabato 8:30–12:30 e 15:00–19:00",
      "Domenica chiuso",
    ]);
  });
});

describe("Consegna a Seregno con chiusure", () => {
  it("lunedì 7 dicembre dopo le 16, martedì 8 chiuso: mercoledì", () => {
    const s = seregnoDelivery(new Date("2026-12-07T16:00:00Z"), ["2026-12-08"]);
    expect(s).toMatchObject({ today: false, when: "mercoledì", date: "2026-12-09" });
  });
  it("giorno di chiusura in mattinata: niente consegna in giornata", () => {
    const s = seregnoDelivery(new Date("2026-12-08T08:00:00Z"), ["2026-12-08"]);
    expect(s).toMatchObject({ today: false, when: "domani", date: "2026-12-09" });
  });
  it("chiusura lunga: si scrive la data", () => {
    const closed = Array.from({ length: 10 }, (_, i) => `2026-08-${String(10 + i).padStart(2, "0")}`);
    expect(seregnoDelivery(new Date("2026-08-09T10:00:00Z"), closed).when).toBe("giovedì 20 agosto");
  });
});

describe("Preventivo di consegna nel carrello", () => {
  const MON_10 = new Date("2026-11-16T09:00:00Z");
  it("CAP sbagliato: chiede di correggerlo", () => {
    expect(quoteDelivery({ zip: "2083", subtotalEur: 20, now: MON_10 })).toMatchObject({ ok: false, reason: "cap" });
    expect(quoteDelivery({ zip: "abcde", subtotalEur: 20, now: MON_10 }).ok).toBe(false);
  });
  it("Seregno: sempre gratis, pagamento alla consegna, ricette sì", () => {
    const q = quoteDelivery({ zip: "20831", subtotalEur: 12.5, now: MON_10 });
    expect(q).toMatchObject({ ok: true, zone: "seregno", shippingEur: 0, free: true, totalEur: 12.5, prescriptions: true, eta: "oggi verso le 19:00" });
    if (q.ok) expect(q.payments).toEqual(["pos_alla_consegna", "contanti_alla_consegna", "online"]);
  });
  it("Italia sopra 59 €: gratis, solo online, niente ricette", () => {
    const q = quoteDelivery({ zip: "20121", subtotalEur: 59, now: MON_10 });
    expect(q).toMatchObject({ ok: true, zone: "italia", shippingEur: 0, free: true, totalEur: 59, prescriptions: false, gapToFreeEur: 0 });
    if (q.ok) expect(q.payments).toEqual(["online"]);
  });
  it("Italia sotto 59 €: costo ancora da confermare, mai inventato", () => {
    const q = quoteDelivery({ zip: "00184", subtotalEur: 40.1, now: MON_10 });
    expect(q).toMatchObject({ ok: true, free: false, gapToFreeEur: 18.9, shippingEur: ITALY_SHIPPING_EUR });
    if (q.ok && ITALY_SHIPPING_EUR === null) expect(q.totalEur).toBeNull();
    if (q.ok) expect(q.notes[0]).toBe("Ti mancano 18,90 € per la spedizione gratuita (sopra 59 €).");
  });
  it("niente arrotondamenti strani con i centesimi", () => {
    const q = quoteDelivery({ zip: "20831", subtotalEur: 0.1 + 0.2, now: MON_10 });
    expect(q.ok && q.totalEur).toBe(0.3);
  });
});

describe("Prezzi in promo", () => {
  it("prezzo barrato, nuovo prezzo e percentuale sempre insieme", () => {
    expect(promoPrice(25, 19.9)).toEqual({ full: "25 €", price: "19,90 €", percent: 20, label: "−20%" });
  });
  it("non è una promo se il prezzo non scende", () => {
    expect(promoPrice(20, 20)).toBeNull();
    expect(promoPrice(20, 22)).toBeNull();
    expect(promoPrice(0, 5)).toBeNull();
  });
  it("euro scritti in italiano", () => {
    expect(formatEuro(0.9)).toBe("0,90 €");
    expect(formatEuro(19)).toBe("19 €");
  });
});
