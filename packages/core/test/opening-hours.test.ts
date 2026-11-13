import { describe, expect, it } from "vitest";
import { farmaciaHours, getOpenStatus } from "../src";

// Date in UTC: novembre = ora solare (UTC+1), luglio = ora legale (UTC+2).
const at = (iso: string) => getOpenStatus(farmaciaHours, new Date(iso));

describe("Aperto ora (orari da data/farmacia.json)", () => {
  it("lunedì mattina prima dell'apertura", () => {
    expect(at("2026-11-16T07:00:00Z").label).toBe("Chiuso · apre alle 8:30"); // 8:00 a Seregno
  });
  it("lunedì alle 8:30 in punto è aperto", () => {
    expect(at("2026-11-16T07:30:00Z")).toMatchObject({ open: true, label: "Aperto ora · chiude alle 19:30" });
  });
  it("lunedì alle 19:30 è già chiuso, apre domani", () => {
    expect(at("2026-11-16T18:30:00Z").label).toBe("Chiuso · apre domani alle 8:30");
  });
  it("sabato in pausa pranzo riapre alle 15", () => {
    expect(at("2026-11-21T12:00:00Z").label).toBe("Chiuso · riapre alle 15:00"); // 13:00
  });
  it("sabato pomeriggio chiude alle 19", () => {
    expect(at("2026-11-21T15:00:00Z").label).toBe("Aperto ora · chiude alle 19:00"); // 16:00
  });
  it("sabato sera salta la domenica: apre lunedì", () => {
    expect(at("2026-11-21T19:00:00Z").label).toBe("Chiuso · apre lunedì alle 8:30");
  });
  it("domenica: apre domani", () => {
    expect(at("2026-11-22T10:00:00Z").label).toBe("Chiuso · apre domani alle 8:30");
  });
  it("con l'ora legale usa comunque l'ora italiana", () => {
    // 6:45 UTC di un mercoledì di luglio = 8:45 a Seregno
    expect(at("2026-07-15T06:45:00Z").open).toBe(true);
    // 6:15 UTC = 8:15 a Seregno, ancora chiuso
    expect(at("2026-07-15T06:15:00Z").open).toBe(false);
  });
});

import { parseHours } from "../src";
describe("Controllo degli orari nel JSON", () => {
  it("rifiuta un orario scritto male", () => {
    const bad = { mon: [["8:30", "19:30"]], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
    expect(() => parseHours(bad)).toThrow(/mon/);
  });
  it("rifiuta una fascia al contrario", () => {
    const bad = { mon: [["19:30", "08:30"]], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
    expect(() => parseHours(bad)).toThrow();
  });
});
