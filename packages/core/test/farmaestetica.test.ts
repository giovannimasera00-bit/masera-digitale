import { describe, expect, it } from "vitest";
import { farmaesteticaGroups, farmaesteticaHours, formatWeeklyHours, getOpenStatus, miamoGroups, treatmentSlug } from "../src";

describe("Listino Farmaestetica", () => {
  const all = [...farmaesteticaGroups, ...miamoGroups].flatMap((g) => g.items);

  it("ogni trattamento ha prezzo e durata", () => {
    for (const t of all) {
      expect(t.price, t.name).toBeGreaterThan(0);
      expect(t.minutes, t.name).toBeGreaterThan(0);
    }
  });

  it("pacchetto 5+1 = prezzo di 5 sedute", () => {
    const pacchetti = farmaesteticaGroups.flatMap((g) => g.items).filter((t) => t.package5plus1);
    expect(pacchetti.length).toBeGreaterThan(0);
    for (const t of pacchetti) expect(t.package5plus1, t.name).toBe(t.price * 5);
  });

  it("le quattro schede del brief, nell'ordine", () => {
    expect(farmaesteticaGroups.map((g) => g.name)).toEqual(["Viso", "Corpo", "Laser", "Cera e mani-piedi"]);
  });

  it("gli identificativi per la prenotazione sono unici", () => {
    const ids = [...farmaesteticaGroups, ...miamoGroups].flatMap((g) => g.items.map((t) => treatmentSlug(g.slug, t.name)));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Orari Farmaestetica", () => {
  it("raggruppati per il sito", () => {
    expect(formatWeeklyHours(farmaesteticaHours)).toEqual(["Lun–ven 9:30–19:30", "Sabato 8:30–18:30", "Domenica chiuso"]);
  });
  it("aperto ora: sabato alle 13 è aperto (niente pausa pranzo)", () => {
    expect(getOpenStatus(farmaesteticaHours, new Date("2026-11-21T12:00:00Z")).label).toBe("Aperto ora · chiude alle 18:30");
  });
  it("lunedì alle 9 apre alle 9:30", () => {
    expect(getOpenStatus(farmaesteticaHours, new Date("2026-11-23T08:00:00Z")).label).toBe("Chiuso · apre alle 9:30");
  });
});
