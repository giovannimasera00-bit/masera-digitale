import { describe, expect, it } from "vitest";
import {
  barsFromModules, code128BModules, code128BValues, checkNewPassword, loginWaitMinutes, normalizeCardCode, pointsForSpend, pointsValueEur, creditAvailable, creditExpiry, currentConsents, ean13CheckDigit, ean13Modules, formatCardNumber,
  loyaltyProgress, recordConsent, type ConsentRecord,
} from "../src";

describe("Codice a barre della tessera (EAN-13)", () => {
  it("cifra di controllo", () => {
    expect(ean13CheckDigit("400638133393")).toBe(1);
    expect(ean13CheckDigit("800123456789")).toBe(7);
  });
  it("95 moduli con le guardie giuste", () => {
    const m = ean13Modules("4006381333931")!;
    expect(m).toHaveLength(95);
    expect(m.slice(0, 3)).toBe("101");
    expect(m.slice(45, 50)).toBe("01010");
    expect(m.slice(92)).toBe("101");
    // prima cifra 4 → parità LGLLGG: la seconda cifra (0) in L, la terza (0) in G
    expect(m.slice(3, 10)).toBe("0001101");
    expect(m.slice(10, 17)).toBe("0100111");
    // ultima cifra 1 in R
    expect(m.slice(85, 92)).toBe("1100110");
  });
  it("codice non valido: niente barre", () => {
    expect(ean13Modules("4006381333932")).toBeNull();
    expect(ean13Modules("123")).toBeNull();
  });
  it("barre unite e numero leggibile", () => {
    expect(barsFromModules("0110111")).toEqual([{ x: 1, w: 2 }, { x: 4, w: 3 }]);
    expect(formatCardNumber(" a12345")).toBe("A12345");
  });
});

describe("Tessera", () => {
  it("una lettera e 5 numeri", () => {
    expect(normalizeCardCode(" a12345 ")).toBe("A12345");
    expect(normalizeCardCode("A-12345")).toBe("A12345");
    expect(normalizeCardCode("AB1234")).toBeNull();
    expect(normalizeCardCode("A1234")).toBeNull();
    expect(normalizeCardCode("123456")).toBeNull();
  });
});

describe("Punti: 30 € = 100 punti, 100 punti = 1 €", () => {
  it("in proporzione, per difetto", () => {
    expect(pointsForSpend(30)).toBe(100);
    expect(pointsForSpend(45)).toBe(150);
    expect(pointsForSpend(10)).toBe(33);
    expect(pointsForSpend(0.29)).toBe(0);
    expect(pointsForSpend(-5)).toBe(0);
  });
  it("valore in euro", () => {
    expect(pointsValueEur(130)).toBe(1.3);
    expect(pointsValueEur(100)).toBe(1);
  });
  it("quanto manca al prossimo euro", () => {
    expect(loyaltyProgress(130)).toEqual({ ratio: 0.3, missing: 70, label: "Mancano 70 punti" });
    expect(loyaltyProgress(199).label).toBe("Manca 1 punto");
  });
});

describe("Credito della videoconsulenza", () => {
  it("vale 12 mesi", () => {
    expect(creditExpiry("2026-11-28")).toBe("2027-11-28");
    expect(creditExpiry("2028-02-29")).toBe("2029-02-28");
  });
  it("crediti validi meno quelli usati, mai sotto zero", () => {
    const e = [{ amountEur: 15, date: "2025-11-01" }, { amountEur: 15, date: "2026-06-01" }];
    expect(creditAvailable(e, 0, "2026-11-28")).toBe(15);
    expect(creditAvailable(e, 4.9, "2026-11-28")).toBe(10.1);
    expect(creditAvailable(e, 40, "2026-11-28")).toBe(0);
  });
});

describe("Consensi separati e storico", () => {
  const r = (purpose: ConsentRecord["purpose"], granted: boolean, at: string): ConsentRecord => ({ purpose, granted, at, textVersion: "v1", channel: "sito" });
  it("vale l'ultimo record per ogni scopo, lo storico resta", () => {
    let h: ConsentRecord[] = [];
    h = recordConsent(h, r("marketing", true, "2026-11-01T10:00:00Z"));
    h = recordConsent(h, r("referti", true, "2026-11-01T10:00:00Z"));
    h = recordConsent(h, r("marketing", false, "2026-11-20T10:00:00Z"));
    const c = currentConsents(h);
    expect(h).toHaveLength(3);
    expect(c.marketing?.granted).toBe(false);
    expect(c.referti?.granted).toBe(true);
    expect(c.ricette).toBeNull();
  });
});

describe("Password", () => {
  it("regole semplici", () => {
    expect(checkNewPassword("corta", null)).toBe("Almeno 8 caratteri.");
    expect(checkNewPassword("Password123", null)).toContain("troppo facile");
    expect(checkNewPassword("aaaaaaaaaa", null)).toContain("troppo facile");
    expect(checkNewPassword("ciao3330001234", "+39 333 000 1234")).toBe("Non usare il tuo numero di telefono.");
    expect(checkNewPassword("Girasole-di-maggio", "+393330001234")).toBeNull();
  });
  it("dopo 5 errori si aspetta 15 minuti", () => {
    const now = new Date("2026-11-28T10:00:00Z");
    expect(loginWaitMinutes(4, "2026-11-28T09:59:00Z", now)).toBe(0);
    expect(loginWaitMinutes(5, "2026-11-28T09:59:00Z", now)).toBe(14);
    expect(loginWaitMinutes(5, "2026-11-28T09:40:00Z", now)).toBe(0);
  });
});

describe("Codice a barre della tessera (Code 128)", () => {
  it("esempio della tabella standard: PJJ123C con controllo 54 (in set A); in set B il controllo cambia", () => {
    // In set B (start 104): 104 + somma(posizione × valore). Calcolo atteso fatto a mano per "A1".
    // A = 33, 1 = 17 → 104 + 33 + 34 = 171 → 171 mod 103 = 68
    expect(code128BValues("A1")).toEqual([104, 33, 17, 68]);
  });
  it("struttura: inizio, 11 moduli per simbolo, stop di 13, finisce con una barra", () => {
    const m = code128BModules("A00712")!;
    expect(m.length).toBe(11 * (1 + 6 + 1) + 13);
    expect(m.slice(0, 11)).toBe("11010010000"); // Start B
    expect(m.slice(-13)).toBe("1100011101011"); // Stop
  });
  it("caratteri non codificabili: niente codice", () => {
    expect(code128BModules("è")).toBeNull();
    expect(code128BModules("")).toBeNull();
  });
});
