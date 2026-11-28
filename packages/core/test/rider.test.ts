import { describe, expect, it } from "vitest";
import { distanceM, optimizeRoute, routeLengthM, deliveryDateOf, paymentNote, riderRun, routeLinks, toCollect, type RiderOrder } from "../src";

// Lunedì 16 novembre 2026; Seregno è a UTC+1.
const o = (id: string, p: Partial<RiderOrder>): RiderOrder => ({
  id, number: id, customerName: "Cliente " + id, phone: "+393330000000", street: "Via Garibaldi", houseNumber: "1", zip: "20831",
  notes: null, placedAt: "2026-11-16T09:00:00Z", payment: "contanti", totalEur: 10, status: "pronto", sealed: false, ...p,
});

describe("Giorno di consegna dell'ordine", () => {
  it("entro le 16 → oggi; dopo → domani; sabato sera → lunedì", () => {
    expect(deliveryDateOf({ placedAt: "2026-11-16T14:59:00Z" })).toBe("2026-11-16");
    expect(deliveryDateOf({ placedAt: "2026-11-16T15:00:00Z" })).toBe("2026-11-17");
    expect(deliveryDateOf({ placedAt: "2026-11-21T18:00:00Z" })).toBe("2026-11-23");
  });
});

describe("Giro del rider", () => {
  const orders = [
    o("A", { street: "Via Garibaldi", houseNumber: "103", payment: "pos", totalEur: 20 }),
    o("B", { street: "via Ballerini", houseNumber: "10", totalEur: 12.3 }),
    o("C", { street: "Via F.lli Cairoli", houseNumber: "5b", payment: "online_pagato", sealed: true }),
    o("D", { street: "Via Garibaldi", houseNumber: "9" }),
    o("E", { placedAt: "2026-11-16T16:30:00Z" }), // giro di domani
    o("F", { status: "annullato" }),
    o("G", { status: "consegnato" }),
    o("H", { zip: "20121" }), // CAP sbagliato
    o("I", { street: "via Fratelli Cairoli", houseNumber: "5" }),
  ];
  const run = riderRun(orders, "2026-11-16");
  it("solo le consegne di oggi ancora da fare, in ordine di via e civico", () => {
    expect(run.stops.map((s) => s.id)).toEqual(["B", "I", "C", "D", "A"]);
  });
  it("CAP non di Seregno: messo da parte per il controllo", () => {
    expect(run.outOfArea.map((s) => s.id)).toEqual(["H"]);
  });
  it("contanti da incassare, POS e pacchi sigillati", () => {
    expect(run).toMatchObject({ cashEur: 32.3, posCount: 1, sealedCount: 1 });
  });
  it("pagamento in una riga", () => {
    expect(paymentNote({ payment: "pos", totalEur: 20 })).toBe("Carta (POS): 20 €");
    expect(paymentNote({ payment: "online_pagato", totalEur: 20 })).toBe("Già pagato online");
    expect(toCollect({ payment: "online_pagato", totalEur: 20 })).toBe(0);
  });
  it("percorso su Maps a blocchi di 9 tappe", () => {
    const many = Array.from({ length: 11 }, (_, i) => ({ street: "Via Garibaldi", houseNumber: String(i + 1), zip: "20831" }));
    const links = routeLinks(many, "Via Garibaldi 103, 20831 Seregno");
    expect(links).toHaveLength(2);
    expect(links[0]).toContain(encodeURIComponent("Via Garibaldi 103, 20831 Seregno"));
    expect(links[1]!.startsWith(`https://www.google.com/maps/dir/${encodeURIComponent("Via Garibaldi 9, 20831 Seregno")}`)).toBe(true);
  });
});

describe("Percorso ottimizzato", () => {
  // Coordinate vere (OpenStreetMap) di indirizzi di Seregno; partenza dalla farmacia.
  const FARMACIA = { lat: 45.6510625, lon: 9.201046 };
  const pts = {
    garibaldi40: { lat: 45.6511434, lon: 9.2031151 },
    ballerini3: { lat: 45.650983, lon: 9.2012939 },
    cairoli12: { lat: 45.6510885, lon: 9.1987021 },
    garibaldi8: { lat: 45.6511387, lon: 9.2045648 },
    garibaldi120: { lat: 45.6511593, lon: 9.2006046 },
  };
  it("distanza in metri plausibile", () => {
    expect(Math.round(distanceM(FARMACIA, pts.garibaldi8))).toBeGreaterThan(250);
    expect(Math.round(distanceM(FARMACIA, pts.garibaldi8))).toBeLessThan(300);
  });
  it("il giro ottimizzato non è mai più lungo dell'ordine per via", () => {
    const list = Object.values(pts);
    const opt = optimizeRoute(FARMACIA, list);
    expect(opt).toHaveLength(list.length);
    expect(new Set(opt)).toEqual(new Set(list));
    expect(routeLengthM(FARMACIA, opt)).toBeLessThanOrEqual(routeLengthM(FARMACIA, list));
  });
  it("su una retta va da un lato e poi dall'altro, senza zig-zag", () => {
    const line = [0.003, -0.001, 0.001, 0.002].map((d) => ({ lat: 45, lon: 9 + d }));
    const opt = optimizeRoute({ lat: 45, lon: 9 }, line).map((p) => Math.round((p.lon - 9) * 1000));
    expect(opt).toEqual([-1, 1, 2, 3]);
  });
  it("nel giro: prima le tappe con coordinate in ordine di percorso, poi le altre per via", () => {
    const orders = [
      o("X", { street: "Via Garibaldi", houseNumber: "8", ...pts.garibaldi8 }),
      o("Y", { street: "Via Fratelli Cairoli", houseNumber: "12", ...pts.cairoli12 }),
      o("Z", { street: "Via Ballerini", houseNumber: "3", ...pts.ballerini3 }),
      o("N", { street: "Via Arno", houseNumber: "1" }),
    ];
    const run = riderRun(orders, "2026-11-16", [], FARMACIA);
    expect(run.stops.map((s) => s.id).sort()).toEqual(["N", "X", "Y", "Z"]);
    expect(run.stops.at(-1)!.id).toBe("N");
    const located = run.stops.slice(0, 3) as unknown as { lat: number; lon: number }[];
    const byStreetOrder = [orders[2], orders[1], orders[0]] as unknown as { lat: number; lon: number }[];
    expect(routeLengthM(FARMACIA, located)).toBeLessThanOrEqual(routeLengthM(FARMACIA, byStreetOrder));
  });
});
