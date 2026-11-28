import { describe, expect, it } from "vitest";
import {
  checkPrescriptionRequest, handoverNote, PRESCRIPTION_PHOTO_DAYS, normalizeFiscalCode, normalizeNre, prescriptionAllowed, quoteLineLabel, quoteProblems, quoteTotalEur,
} from "../src";

describe("Ricette solo da Seregno", () => {
  it("20831 sì, altri CAP no, CAP sbagliato spiegato", () => {
    expect(prescriptionAllowed("20831").ok).toBe(true);
    const mi = prescriptionAllowed("20121");
    expect(mi.ok).toBe(false);
    if (!mi.ok) expect(mi.message).toContain("solo per Seregno");
    expect(prescriptionAllowed("208").ok).toBe(false);
  });
});

describe("Codice fiscale", () => {
  it("valido, anche scritto minuscolo e con spazi", () => {
    expect(normalizeFiscalCode("RSSMRA85T10A562S")).toBe("RSSMRA85T10A562S");
    expect(normalizeFiscalCode(" rssmra85t10a562s ")).toBe("RSSMRA85T10A562S");
  });
  it("carattere di controllo sbagliato o formato sbagliato", () => {
    expect(normalizeFiscalCode("RSSMRA85T10A562T")).toBeNull();
    expect(normalizeFiscalCode("RSSMRA85T10A562")).toBeNull();
    expect(normalizeFiscalCode("1234567890123456")).toBeNull();
  });
});

describe("Codice della ricetta elettronica", () => {
  it("15 caratteri, lettere e numeri, spazi e trattini tolti", () => {
    expect(normalizeNre("0301 A4 123456789")).toBe("0301A4123456789");
    expect(normalizeNre("0301-a4-123456789")).toBe("0301A4123456789");
    expect(normalizeNre("0301A412345678")).toBeNull(); // 14
    expect(normalizeNre("0301A41234567890")).toBeNull(); // 16
    expect(normalizeNre("123")).toBeNull();
    expect(normalizeNre("ABC!12345678")).toBeNull();
  });
});

describe("Controllo della richiesta", () => {
  const base = { zip: "20831", handover: "ritiro" as const, name: "Mario Rossi", phone: "+393330000000", privacy: true };
  it("con la foto: tutto a posto", () => {
    expect(checkPrescriptionRequest({ ...base, source: { kind: "foto", files: 1 } })).toEqual({});
  });
  it("senza foto, fuori Seregno, dati mancanti", () => {
    expect(checkPrescriptionRequest({ ...base, zip: "20121", name: "", phone: null, privacy: false, source: { kind: "foto", files: 0 } })).toEqual({
      zip: expect.stringContaining("solo per Seregno"),
      source: "Aggiungi la foto della ricetta.",
      name: "Scrivi nome e cognome.",
      phone: "Scrivi un numero di cellulare italiano.",
      privacy: "Serve la presa visione dell'informativa.",
    });
  });
  it("con il codice: NRE e codice fiscale controllati", () => {
    expect(checkPrescriptionRequest({ ...base, source: { kind: "nre", nre: "x", fiscalCode: "RSSMRA85T10A562T" } })).toEqual({
      nre: expect.any(String),
      fiscalCode: expect.stringContaining("16 caratteri"),
    });
  });
});

describe("Preventivo", () => {
  const q = { lines: [{ description: "Crema galenica 50 g", qty: 2, unitEur: 9.9 }, { description: "Capsule 30", qty: 1, unitEur: 0.1 + 0.2 }], readyBy: "domani dopo le 15", note: null };
  it("totale in centesimi esatti", () => expect(quoteTotalEur(q)).toBe(20.1));
  it("riga leggibile", () => expect(quoteLineLabel(q.lines[0]!)).toBe("2 × Crema galenica 50 g · 19,80 €"));
  it("niente preventivi vuoti o senza tempi", () => {
    expect(quoteProblems(q)).toEqual([]);
    expect(quoteProblems({ lines: [], readyBy: "", note: null })).toEqual(["Aggiungi almeno una riga.", "Scrivi quando è pronta."]);
    expect(quoteProblems({ lines: [{ description: "", qty: 0, unitEur: -1 }], readyBy: "oggi", note: null })).toHaveLength(3);
  });
  it("consegna: pacco sigillato e originale al rider", () => {
    expect(handoverNote("consegna")).toContain("sigillato da un farmacista");
    expect(handoverNote("ritiro")).toContain("originale");
  });
  it("foto tenute 7 giorni", () => expect(PRESCRIPTION_PHOTO_DAYS).toBe(7));
});
