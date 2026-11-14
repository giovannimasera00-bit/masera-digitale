import { describe, expect, it } from "vitest";
import { findService, formatDuration, formatPrice, listedServices, serviceGroups, services, servicesByGroup } from "../src";

describe("Dati dei servizi (data/servizi.json)", () => {
  it("ogni slug è unico e scritto bene (diventa un indirizzo /servizi/...)", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("ogni servizio con gruppo punta a un gruppo che esiste", () => {
    const groups = new Set(serviceGroups.map((g) => g.slug));
    for (const s of listedServices()) expect(groups.has(s.group!), s.slug).toBe(true);
  });

  it("durate del brief: ECG e Holter 30 minuti, il resto della cabina 15 (breath test a parte)", () => {
    for (const slug of ["ecg", "holter-cardiaco", "holter-pressorio"]) expect(findService(slug)?.duration_min).toBe(30);
    const altri = services.filter((s) => s.resource === "cabina_analisi" && !["ecg", "holter-cardiaco", "holter-pressorio"].includes(s.slug) && !s.slug.startsWith("breath-test"));
    for (const s of altri) expect(s.duration_min, s.slug).toBe(15);
  });

  it("ECG e Holter cardiaco: la preparazione dice di depilare il petto", () => {
    for (const slug of ["ecg", "holter-cardiaco"]) expect(findService(slug)?.preparation).toMatch(/depila il petto/i);
  });

  it("i gruppi raccolgono tutti i servizi del listino, nell'ordine", () => {
    const g = servicesByGroup();
    expect(g.map((x) => x.slug)).toEqual(serviceGroups.map((x) => x.slug));
    expect(g.flatMap((x) => x.services).length).toBe(listedServices().length);
    expect(g.find((x) => x.slug === "cuore-pressione")?.services[0]?.slug).toBe("ecg");
  });
});

describe("Formati dei servizi", () => {
  it("durata", () => {
    expect(formatDuration(15)).toBe("15 min");
    expect(formatDuration(30)).toBe("30 min");
    expect(formatDuration(90)).toBe("1 ora e 30 min");
    expect(formatDuration(240)).toBe("circa 4 ore");
  });
  it("prezzo gratuito", () => expect(formatPrice(0)).toBe("Gratis"));
});
