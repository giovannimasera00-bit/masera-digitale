import { describe, expect, it } from "vitest";
import { deliveryDateOf, paymentNote, riderRun, routeLinks, toCollect, type RiderOrder } from "../src";

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
