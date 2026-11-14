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
