import { describe, expect, it } from "vitest";
import { analysisRecallDate, finishEstimate, isDueOn, isScannedEan, routineFor, routineWarnings, streak, usesPerWeek, type RoutineItem } from "../src";

const it_ = (p: Partial<RoutineItem>): RoutineItem => ({
  ean: "8001234000011", name: "Prodotto", category: "crema", when: "entrambi", frequency: "ogni_giorno", amount: "pisello",
  capacity: 50, startDate: "2026-11-30", ...p,
});

describe("Ordine dei passaggi", () => {
  // La farmacista li passa in ordine sparso: la sequenza si mette a posto da sola.
  const items = [
    it_({ name: "Crema", category: "crema" }),
    it_({ name: "Solare", category: "protezione_solare", when: "mattina" }),
    it_({ name: "Detergente", category: "detergente" }),
    it_({ name: "Siero", category: "siero", when: "sera" }),
    it_({ name: "Tonico", category: "tonico" }),
  ];
  it("mattina", () => expect(routineFor(items, "mattina").map((i) => i.name)).toEqual(["Detergente", "Tonico", "Crema", "Solare"]));
  it("sera", () => expect(routineFor(items, "sera").map((i) => i.name)).toEqual(["Detergente", "Tonico", "Siero", "Crema"]));
  it("capelli dopo il viso, nel loro ordine", () => {
    const h = [it_({ name: "Lozione", category: "lozione" }), it_({ name: "Shampoo", category: "shampoo" })];
    expect(routineFor(h, "sera").map((i) => i.name)).toEqual(["Shampoo", "Lozione"]);
  });
  it("avvisi: solare la sera, doppioni", () => {
    expect(routineWarnings([it_({ name: "SPF", category: "protezione_solare", when: "sera" }), it_({ category: "crema", when: "sera" }), it_({ category: "crema", when: "sera" })])).toEqual([
      "SPF: la protezione solare di solito va la mattina.",
      "Due prodotti per lo stesso passaggio (Crema): controlla se è voluto.",
    ]);
  });
});

describe("Quando si fa", () => {
  it("applicazioni a settimana", () => {
    expect(usesPerWeek({ when: "entrambi", frequency: "ogni_giorno" })).toBe(14);
    expect(usesPerWeek({ when: "sera", frequency: "2_3_settimana" })).toBe(2.5);
    expect(usesPerWeek({ when: "sera", frequency: "1_settimana" })).toBe(1);
  });
  it("2–3 volte: lunedì, mercoledì, venerdì; 1 volta: il giorno dell'inizio", () => {
    const tre = { frequency: "2_3_settimana" as const, startDate: "2026-11-30" }; // lunedì
    expect(["2026-11-30", "2026-12-01", "2026-12-02", "2026-12-04"].map((d) => isDueOn(tre, d))).toEqual([true, false, true, true]);
    const una = { frequency: "1_settimana" as const, startDate: "2026-12-03" }; // giovedì
    expect(isDueOn(una, "2026-12-10")).toBe(true);
    expect(isDueOn(una, "2026-12-11")).toBe(false);
    expect(isDueOn(una, "2026-11-26")).toBe(false); // prima dell'inizio
  });
});

describe("Sta per finire", () => {
  it("dose della scheda: 30 ml, 0,25 ml mattina e sera → 60 giorni", () => {
    const e = finishEstimate(it_({ capacity: 30, doseMl: 0.25 }), "2026-11-30")!;
    expect(e).toEqual({ date: "2027-01-29", daysLeft: 60, reorder: false });
  });
  it("riordino negli ultimi 7 giorni", () => {
    const e = finishEstimate(it_({ capacity: 30, doseMl: 0.25 }), "2027-01-23")!;
    expect(e.daysLeft).toBe(6);
    expect(e.reorder).toBe(true);
  });
  it("senza dose nella scheda usa quella indicativa: 15 ml, una goccia la sera → 300 giorni", () => {
    expect(finishEstimate(it_({ capacity: 15, amount: "goccia", when: "sera" }), "2026-11-30")!.date).toBe("2027-09-26");
  });
  it("dati mancanti: nessuna stima", () => expect(finishEstimate(it_({ capacity: 0 }), "2026-11-30")).toBeNull());
});

describe("Richiamo, serie, penna ottica", () => {
  it("analisi dopo 8 settimane", () => expect(analysisRecallDate("2026-11-30")).toBe("2027-01-25"));
  it("serie di sere consecutive", () => {
    expect(streak(["2026-11-28", "2026-11-29", "2026-11-30"], "2026-11-30")).toBe(3);
    expect(streak(["2026-11-28", "2026-11-29"], "2026-11-30")).toBe(2); // stasera non ancora spuntata
    expect(streak(["2026-11-27", "2026-11-29"], "2026-11-30")).toBe(1);
  });
  it("EAN letto dalla penna", () => {
    expect(isScannedEan("8001234000011")).toBe(true);
    expect(isScannedEan(" 80012344 ")).toBe(true);
    expect(isScannedEan("A12345")).toBe(false);
  });
});
