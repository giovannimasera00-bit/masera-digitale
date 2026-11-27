import { describe, expect, it } from "vitest";
import {
  classifyType, isValidEan, parseCatalog, parseItalianDate, parseItalianNumber, planSync, priceToday, promoActive, shouldAlarm,
  summarizeSync, type ShopProduct,
} from "../src";

// File di PROVA, con nomi di colonna inventati: il formato vero arriverà da Farmaconsult.
const FILE = [
  "EAN;Minsan;Descrizione;Ditta;Reparto;Tipo prodotto;Prezzo;Prezzo promo;Promo dal;Promo al;IVA;Giacenza",
  "8001234000011;;Crema viso idratante 50 ml;Marca Uno;Dermocosmesi;COSMETICO;25,00;19,90;01/12/2026;31/12/2026;22;7",
  "8001234000028;;Integratore magnesio 30 bustine;Marca Due;Integratori;INTEGRATORE;12,50;;;;10;0",
  "8001234000035;012345678;Paracetamolo 500 mg 20 compresse;Marca Tre;Farmaci;FARMACO SOP;4,90;;;;10;30",
  "8001234000042;;Prodotto senza tipo;Marca Quattro;Varie;;3,00;;;;22;1",
  "8001234000043;;EAN sbagliato;Marca;Varie;COSMETICO;3,00;;;;22;1",
  "80012344;;Cerotti 20 pezzi;Marca Cinque;Sanitari;DISPOSITIVO MEDICO;\"3,50\";;;;22;12,0",
  "8001234000011;;Riga ripetuta;Marca Uno;Dermocosmesi;COSMETICO;25,00;;;;22;7",
  "8001234000059;;Shampoo 200 ml;Marca Sei;Capelli;COSMETICO;9,90;9,90;;;22;3",
].join("\r\n");

describe("Lettura dei numeri e delle date italiane", () => {
  it("numeri", () => {
    expect(parseItalianNumber("12,50")).toBe(12.5);
    expect(parseItalianNumber("1.234,50")).toBe(1234.5);
    expect(parseItalianNumber("€ 9,90")).toBe(9.9);
    expect(parseItalianNumber("12.5")).toBe(12.5);
    expect(parseItalianNumber("")).toBeNull();
    expect(parseItalianNumber("n.d.")).toBeNull();
  });
  it("date", () => {
    expect(parseItalianDate("31/12/2026")).toBe("2026-12-31");
    expect(parseItalianDate("1-2-26")).toBe("2026-02-01");
    expect(parseItalianDate("2026-12-31")).toBe("2026-12-31");
    expect(parseItalianDate("31/13/2026")).toBeNull();
  });
  it("EAN con cifra di controllo", () => {
    expect(isValidEan("8001234000011")).toBe(true);
    expect(isValidEan("80012344")).toBe(true);
    expect(isValidEan("8001234000012")).toBe(false);
    expect(isValidEan("123")).toBe(false);
  });
});

describe("Farmaci esclusi, nel dubbio fuori", () => {
  it("parafarmaco vendibile", () => {
    expect(classifyType("COSMETICO")).toBe("vendibile");
    expect(classifyType("Integratore alimentare")).toBe("vendibile");
    expect(classifyType("Dietetico")).toBe("vendibile");
  });
  it("farmaci: mai in vendita", () => {
    expect(classifyType("FARMACO SOP")).toBe("farmaco");
    expect(classifyType("Medicinale etico")).toBe("farmaco");
    expect(classifyType("OTC")).toBe("farmaco");
  });
  it("tipo vuoto o sconosciuto: escluso", () => {
    expect(classifyType("")).toBe("tipo_sconosciuto");
    expect(classifyType("Varie")).toBe("tipo_sconosciuto");
  });
});

describe("Lettura del file del gestionale", () => {
  const c = parseCatalog(FILE);
  it("tiene solo il parafarmaco valido", () => {
    expect(c.sellable.map((p) => p.ean)).toEqual(["8001234000011", "8001234000028", "80012344", "8001234000059"]);
  });
  it("esclude il farmaco e il prodotto senza tipo", () => {
    expect(c.excluded.map((e) => [e.ean, e.reason])).toEqual([
      ["8001234000035", "farmaco"],
      ["8001234000042", "tipo_sconosciuto"],
    ]);
  });
  it("segnala EAN sbagliato, riga ripetuta e promo non valida", () => {
    expect(c.issues.map((i) => [i.line, i.problem])).toEqual([
      [6, "Codice EAN non valido"],
      [8, "EAN ripetuto: tengo la prima riga"],
      [9, "Prezzo promo non più basso del prezzo pieno: promo ignorata"],
    ]);
  });
  it("prezzi, promo, giacenza e virgolette", () => {
    const crema = c.sellable[0]!;
    expect(crema).toMatchObject({ price: 25, stock: 7, vat: 22, promo: { price: 19.9, from: "2026-12-01", to: "2026-12-31" } });
    expect(c.sellable[2]).toMatchObject({ ean: "80012344", price: 3.5, stock: 12 });
    expect(c.sellable[3]!.promo).toBeNull();
  });
  it("riconosce le colonne anche con maiuscole e accenti diversi", () => {
    const alt = parseCatalog("ean,DESCRIZIONE,tipo,Prezzo Vendita,Disponibilità\n80012344,Cerotti,Sanitario,3.5,4");
    expect(alt.missingColumns).toContain("minsan");
    expect(alt.sellable[0]).toMatchObject({ ean: "80012344", name: "Cerotti", price: 3.5, stock: 4 });
  });
  it("colonna obbligatoria mancante: lo dice e non legge nulla", () => {
    const bad = parseCatalog("codice;nome\n1;x");
    expect(bad.sellable).toEqual([]);
    expect(bad.issues[0]!.problem).toContain('Manca la colonna "ean"');
  });
});

describe("Promo con le date", () => {
  const p = { price: 19.9, from: "2026-12-01", to: "2026-12-31" };
  it("vale solo tra le date, comprese", () => {
    expect(promoActive(p, "2026-11-30")).toBe(false);
    expect(promoActive(p, "2026-12-01")).toBe(true);
    expect(promoActive(p, "2026-12-31")).toBe(true);
    expect(promoActive(p, "2027-01-01")).toBe(false);
  });
  it("con la promo il prezzo pieno diventa barrato", () => {
    const crema = parseCatalog(FILE).sellable[0]!;
    expect(priceToday(crema, "2026-12-10")).toEqual({ price: 19.9, compareAtPrice: 25 });
    expect(priceToday(crema, "2027-01-02")).toEqual({ price: 25, compareAtPrice: null });
  });
});

describe("Aggiornamento dello shop per EAN", () => {
  const c = parseCatalog(FILE);
  const shop: ShopProduct[] = [
    { ean: "8001234000011", price: 25, compareAtPrice: null, stock: 7, active: true }, // promo da applicare
    { ean: "8001234000028", price: 12.5, compareAtPrice: null, stock: 0, active: true }, // invariato
    { ean: "8001234000035", price: 4.9, compareAtPrice: null, stock: 30, active: true }, // ora è un farmaco
    { ean: "8001234999999", price: 5, compareAtPrice: null, stock: 2, active: true }, // non più nel file
    { ean: "8001234000059", price: 9.9, compareAtPrice: null, stock: 3, active: false }, // torna in vendita
  ];
  const changes = planSync(c, shop, "2026-12-10");
  it("crea solo i nuovi, con il nome del gestionale", () => {
    expect(changes.filter((x) => x.action === "crea")).toEqual([
      { action: "crea", ean: "80012344", name: "Cerotti 20 pezzi", brand: "Marca Cinque", department: "Sanitari", price: 3.5, compareAtPrice: null, stock: 12 },
    ]);
  });
  it("aggiorna solo prezzo, barrato, giacenza e visibilità: mai foto, testi o titolo", () => {
    const upd = changes.filter((x) => x.action === "aggiorna");
    expect(upd).toEqual([
      { action: "aggiorna", ean: "8001234000011", set: { price: 19.9, compareAtPrice: 25 } },
      { action: "aggiorna", ean: "8001234000059", set: { active: true } },
    ]);
    for (const u of upd) if (u.action === "aggiorna") expect(Object.keys(u.set).every((k) => ["price", "compareAtPrice", "stock", "active"].includes(k))).toBe(true);
  });
  it("nasconde senza cancellare: farmaco e prodotto uscito dal file", () => {
    expect(changes.filter((x) => x.action === "nascondi")).toEqual([
      { action: "nascondi", ean: "8001234000035", reason: "farmaco" },
      { action: "nascondi", ean: "8001234999999", reason: "non_nel_file" },
    ]);
  });
  it("riassunto per il registro", () => {
    expect(summarizeSync(c, changes)).toEqual({
      inVendita: 4, farmaciEsclusi: 1, tipoSconosciuto: 1, problemi: 3, daCreare: 1, daAggiornare: 2, daNascondere: 2,
    });
  });
});

describe("Allarme del ponte", () => {
  it("solo dopo due errori di fila", () => {
    expect(shouldAlarm(["ok", "errore"])).toBe(false);
    expect(shouldAlarm(["errore", "ok", "errore"])).toBe(false);
    expect(shouldAlarm(["ok", "errore", "errore"])).toBe(true);
  });
});
