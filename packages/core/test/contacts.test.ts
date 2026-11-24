import { describe, expect, it } from "vitest";
import { farmacia, isMissing, telHref } from "../src";

describe("dati di contatto", () => {
  it("riconosce i dati mancanti", () => {
    expect(isMissing("[DA INSERIRE]")).toBe(true);
    expect(isMissing("[DA CONFERMARE se ...]")).toBe(true);
    expect(isMissing("")).toBe(true);
    expect(isMissing(undefined)).toBe(true);
    expect(isMissing("0362 231660")).toBe(false);
  });
  it("crea il link per chiamare", () => {
    expect(telHref("0362 231660")).toBe("tel:+390362231660");
    expect(telHref("+39 373 770 5485")).toBe("tel:+393737705485");
  });
  it("i campi legali esistono nel file, anche se ancora da inserire", () => {
    for (const k of ["vat", "pec", "phone", "email", "director", "professional_order"] as const) {
      expect(typeof farmacia[k]).toBe("string");
    }
  });
});
