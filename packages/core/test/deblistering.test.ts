import { describe, expect, it } from "vitest";
import { deblisteringCost, deblisteringPerDay, deblisteringPerMonth, deblisteringPeriods } from "../src";

describe("Deblistering", () => {
  it("1 € al giorno, 28 € al mese (brief §11)", () => {
    expect(deblisteringPerDay).toBe(1);
    expect(deblisteringPerMonth).toBe(28);
  });
  it("il prezzo al mese è uguale a 4 settimane di bustine", () => {
    expect(deblisteringCost(4)).toBe(deblisteringPerMonth);
  });
  it("calcola periodo e persone", () => {
    expect(deblisteringCost(1)).toBe(7);
    expect(deblisteringCost(52, 2)).toBe(728);
  });
  it("rifiuta valori senza senso", () => {
    expect(() => deblisteringCost(0)).toThrow();
    expect(() => deblisteringCost(4, 0)).toThrow();
  });
  it("i periodi della calcolatrice sono in ordine", () => {
    const w = deblisteringPeriods.map((p) => p.weeks);
    expect([...w].sort((a, b) => a - b)).toEqual(w);
  });
});
