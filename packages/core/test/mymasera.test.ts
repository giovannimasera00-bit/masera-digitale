import { describe, expect, it } from "vitest";
import {
  barsFromModules, checkLoginCode, creditAvailable, creditExpiry, currentConsents, ean13CheckDigit, ean13Modules, formatCardNumber,
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
    expect(formatCardNumber("8001234567897")).toBe("8 001234 567897");
  });
});

describe("Punti", () => {
  it("quanto manca al prossimo buono", () => {
    expect(loyaltyProgress(130, 200)).toEqual({ ratio: 0.65, missing: 70, label: "Mancano 70 punti" });
    expect(loyaltyProgress(199, 200).label).toBe("Manca 1 punto");
    expect(loyaltyProgress(450, 200).missing).toBe(150);
  });
  it("soglia non ancora decisa", () => {
    expect(loyaltyProgress(10, 0).label).toBe("Soglia del buono da confermare");
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

describe("Codice di accesso", () => {
  const hash = (s: string) => `h:${s}`;
  const now = new Date("2026-11-28T10:00:00Z");
  const c = { codeHash: "h:123456", expiresAt: "2026-11-28T10:10:00Z", attempts: 0 };
  it("giusto, anche con spazi", () => expect(checkLoginCode(c, "123 456", now, hash)).toEqual({ ok: true }));
  it("sbagliato: dice quanti tentativi restano", () => expect(checkLoginCode(c, "111111", now, hash)).toEqual({ ok: false, reason: "sbagliato", attemptsLeft: 4 }));
  it("scaduto dopo 10 minuti", () => expect(checkLoginCode(c, "123456", new Date("2026-11-28T10:10:00Z"), hash).ok).toBe(false));
  it("bloccato dopo 5 tentativi, anche se giusto", () => expect(checkLoginCode({ ...c, attempts: 5 }, "123456", now, hash)).toMatchObject({ reason: "troppi_tentativi" }));
});
