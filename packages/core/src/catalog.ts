// Ponte catalogo (BRIEF §16): file esportato da Farmaconsult → prodotti dello shop, per EAN.
// Solo logica, senza rete: legge il file, lo pulisce, esclude i farmaci, calcola le promo e prepara
// le modifiche da fare su Shopify senza mai toccare foto e testi arricchiti a mano.
import { promoPrice } from "./delivery";

// ——— Colonne del file ———
// [DA CONFERMARE] I nomi veri arriveranno con il primo file di Farmaconsult: qui ci sono i nomi possibili
// per ogni dato (maiuscole, spazi e accenti non contano). Basta aggiungere il nome giusto alla lista.
export const CATALOG_COLUMNS = {
  ean: ["ean", "codice ean", "barcode", "codice a barre", "ean13"],
  minsan: ["minsan", "codice minsan", "aic", "codice prodotto"],
  name: ["descrizione", "descrizione prodotto", "nome", "prodotto"],
  brand: ["ditta", "produttore", "marca", "azienda"],
  department: ["reparto", "categoria", "settore"],
  type: ["tipo prodotto", "tipo", "tipologia", "classe"],
  price: ["prezzo", "prezzo vendita", "prezzo al pubblico", "pvp"],
  promoPrice: ["prezzo promo", "prezzo offerta", "promo prezzo"],
  promoFrom: ["promo dal", "inizio promo", "data inizio promo", "promo inizio"],
  promoTo: ["promo al", "fine promo", "data fine promo", "promo fine"],
  vat: ["iva", "aliquota iva", "% iva"],
  stock: ["giacenza", "giacenza netta", "disponibilita", "quantita"],
} as const;
export type CatalogField = keyof typeof CATALOG_COLUMNS;

/**
 * Tipi di prodotto che si possono vendere online (parafarmaco). Tutto il resto resta fuori,
 * compresi i tipi sconosciuti: meglio un prodotto in meno che un farmaco in vendita (BRIEF §2 e §8).
 * [DA CONFERMARE] con i codici veri del gestionale.
 */
export const SELLABLE_TYPES = [
  "parafarmaco", "cosmetico", "dermocosmesi", "integratore", "alimento", "alimenti speciali", "dietetico",
  "veterinaria", "veterinario", "sanitario", "dispositivo medico", "igiene", "omeopatico non farmaco",
] as const;
/** Parole intere che indicano sempre un farmaco, anche dentro un tipo che sembrerebbe vendibile ("cosmetico" non è "etico"). */
const MEDICINE_WORDS = /\b(farmac[oi]|medicinal[ei]|etic[oi]|sop|otc|ricetta|stupefacent[ei]|galenic[oi]|classe [ac])\b/;

export type CatalogProduct = {
  ean: string;
  minsan: string | null;
  name: string;
  brand: string | null;
  department: string | null;
  type: string;
  /** Prezzo pieno, in euro. */
  price: number;
  promo: { price: number; from: string | null; to: string | null } | null;
  vat: number | null;
  stock: number;
};

export type CatalogIssue = { line: number; ean?: string; problem: string };
export type ParsedCatalog = {
  sellable: CatalogProduct[];
  /** Esclusi perché farmaci o di tipo sconosciuto: si contano, non si mostrano. */
  excluded: { line: number; ean: string | null; name: string; type: string; reason: "farmaco" | "tipo_sconosciuto" }[];
  issues: CatalogIssue[];
  /** Colonne del file che non abbiamo riconosciuto (per adattare CATALOG_COLUMNS). */
  missingColumns: CatalogField[];
};

const clean = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[_\s]+/g, " ").trim();

/** Divide una riga di testo separata da ; , o tabulazione, rispettando le virgolette. */
function splitLine(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (ch === sep && !q) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((c) => c.trim());
}

function detectSeparator(header: string): string {
  const counts = [";", "\t", ",", "|"].map((s) => [s, header.split(s).length] as const);
  return counts.sort((a, b) => b[1] - a[1])[0]![0];
}

/** "12,50" "12.50" "1.234,50" "€ 9,90" → numero; null se non è un numero. */
export function parseItalianNumber(raw: string): number | null {
  let s = raw.replace(/[€\s%]/g, "");
  if (!s) return null;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** "31/12/2026" "31-12-26" "2026-12-31" → "2026-12-31"; null se non è una data. */
export function parseItalianDate(raw: string): string | null {
  const s = raw.trim();
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/.exec(s);
  if (!m) return null;
  const y = m[3]!.length === 2 ? `20${m[3]}` : m[3]!;
  const mo = Number(m[2]);
  const d = Number(m[1]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Controlla la cifra di controllo di un EAN-8 o EAN-13. */
export function isValidEan(raw: string): boolean {
  if (!/^(\d{8}|\d{13})$/.test(raw)) return false;
  const digits = raw.split("").map(Number);
  const check = digits.pop()!;
  const sum = digits.reverse().reduce((acc, n, i) => acc + n * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check;
}

/** Farmaco o non vendibile? Il tipo decide; nel dubbio si esclude. */
export function classifyType(type: string): "vendibile" | "farmaco" | "tipo_sconosciuto" {
  const t = clean(type);
  if (!t) return "tipo_sconosciuto";
  if (MEDICINE_WORDS.test(t)) return "farmaco";
  return SELLABLE_TYPES.some((s) => t.includes(s)) ? "vendibile" : "tipo_sconosciuto";
}

/** Legge il file esportato da Farmaconsult (testo CSV). */
export function parseCatalog(text: string): ParsedCatalog {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/);
  const headerIdx = lines.findIndex((l) => l.trim() !== "");
  const result: ParsedCatalog = { sellable: [], excluded: [], issues: [], missingColumns: [] };
  if (headerIdx < 0) return { ...result, issues: [{ line: 0, problem: "Il file è vuoto." }] };

  const sep = detectSeparator(lines[headerIdx]!);
  const header = splitLine(lines[headerIdx]!, sep).map(clean);
  const col = {} as Record<CatalogField, number>;
  for (const field of Object.keys(CATALOG_COLUMNS) as CatalogField[]) {
    col[field] = header.findIndex((h) => (CATALOG_COLUMNS[field] as readonly string[]).includes(h));
    if (col[field] < 0) result.missingColumns.push(field);
  }
  for (const needed of ["ean", "name", "type", "price", "stock"] as const) {
    if (col[needed] < 0) result.issues.push({ line: headerIdx + 1, problem: `Manca la colonna "${needed}": controlla i nomi in CATALOG_COLUMNS.` });
  }
  if (result.issues.length) return result;

  const seen = new Set<string>();
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (!lines[i]!.trim()) continue;
    const line = i + 1;
    const cells = splitLine(lines[i]!, sep);
    const get = (f: CatalogField) => (col[f] >= 0 ? (cells[col[f]] ?? "").trim() : "");

    const name = get("name").replace(/\s+/g, " ");
    const type = get("type");
    const kind = classifyType(type);
    const eanRaw = get("ean").replace(/\s/g, "");
    if (kind !== "vendibile") {
      result.excluded.push({ line, ean: eanRaw || null, name, type, reason: kind });
      continue;
    }
    if (!isValidEan(eanRaw)) {
      result.issues.push({ line, ean: eanRaw || undefined, problem: eanRaw ? "Codice EAN non valido" : "Manca il codice EAN" });
      continue;
    }
    if (seen.has(eanRaw)) {
      result.issues.push({ line, ean: eanRaw, problem: "EAN ripetuto: tengo la prima riga" });
      continue;
    }
    const price = parseItalianNumber(get("price"));
    if (price === null || price <= 0) {
      result.issues.push({ line, ean: eanRaw, problem: "Prezzo mancante o non valido" });
      continue;
    }
    seen.add(eanRaw);

    const promoValue = parseItalianNumber(get("promoPrice"));
    const promo =
      promoValue !== null && promoPrice(price, promoValue)
        ? { price: promoValue, from: parseItalianDate(get("promoFrom")), to: parseItalianDate(get("promoTo")) }
        : null;
    if (promoValue !== null && !promo) result.issues.push({ line, ean: eanRaw, problem: "Prezzo promo non più basso del prezzo pieno: promo ignorata" });

    result.sellable.push({
      ean: eanRaw,
      minsan: get("minsan") || null,
      name,
      brand: get("brand") || null,
      department: get("department") || null,
      type,
      price,
      promo,
      vat: parseItalianNumber(get("vat")),
      stock: Math.max(0, Math.floor(parseItalianNumber(get("stock")) ?? 0)),
    });
  }
  return result;
}

/** La promo vale in quella data ("AAAA-MM-GG")? Senza date vale sempre; date comprese. */
export function promoActive(p: CatalogProduct["promo"], date: string): boolean {
  if (!p) return false;
  return (!p.from || p.from <= date) && (!p.to || date <= p.to);
}

// ——— Dal catalogo allo shop ———

/** Quello che c'è già nello shop per un EAN. Solo i campi che servono a decidere. */
export type ShopProduct = {
  ean: string;
  price: number;
  /** Prezzo barrato (prezzo pieno quando c'è una promo). */
  compareAtPrice: number | null;
  stock: number;
  /** In vendita (true) o nascosto (false). */
  active: boolean;
};

/**
 * I campi che il ponte scrive. Tutto il resto (foto, descrizione, "chi lo ha formulato", video, titolo
 * ritoccato a mano) appartiene alle persone e il ponte non lo tocca mai. Il nome dal gestionale
 * si usa solo quando il prodotto viene creato.
 */
export type SyncChange =
  | { action: "crea"; ean: string; name: string; brand: string | null; department: string | null; price: number; compareAtPrice: number | null; stock: number }
  | { action: "aggiorna"; ean: string; set: Partial<Pick<ShopProduct, "price" | "compareAtPrice" | "stock" | "active">> }
  | { action: "nascondi"; ean: string; reason: "non_nel_file" | "farmaco" };

const same = (a: number | null, b: number | null) => (a === null || b === null ? a === b : Math.round(a * 100) === Math.round(b * 100));

/** Prezzo e prezzo barrato di oggi: con la promo attiva il prezzo pieno diventa barrato. */
export function priceToday(p: CatalogProduct, date: string): { price: number; compareAtPrice: number | null } {
  return promoActive(p.promo, date) ? { price: p.promo!.price, compareAtPrice: p.price } : { price: p.price, compareAtPrice: null };
}

/**
 * Le modifiche da fare sullo shop, confrontando per EAN.
 * - nuovo nel file → crea (con giacenza 0 lo shop lo mostra "non disponibile");
 * - già nello shop → aggiorna solo prezzo, barrato, giacenza ed eventualmente lo rimette in vendita;
 * - nello shop ma non più nel file → nascondi (mai cancellare: foto e testi restano);
 * - diventato farmaco → nascondi subito.
 */
export function planSync(catalog: ParsedCatalog, shop: ShopProduct[], date: string): SyncChange[] {
  const changes: SyncChange[] = [];
  const shopByEan = new Map(shop.map((s) => [s.ean, s]));
  const inFile = new Set(catalog.sellable.map((p) => p.ean));
  const medicines = new Set(catalog.excluded.filter((e) => e.reason === "farmaco" && e.ean).map((e) => e.ean!));

  for (const p of catalog.sellable) {
    const t = priceToday(p, date);
    const s = shopByEan.get(p.ean);
    if (!s) {
      changes.push({ action: "crea", ean: p.ean, name: p.name, brand: p.brand, department: p.department, price: t.price, compareAtPrice: t.compareAtPrice, stock: p.stock });
      continue;
    }
    const set: Extract<SyncChange, { action: "aggiorna" }>["set"] = {};
    if (!same(s.price, t.price)) set.price = t.price;
    if (!same(s.compareAtPrice, t.compareAtPrice)) set.compareAtPrice = t.compareAtPrice;
    if (s.stock !== p.stock) set.stock = p.stock;
    if (!s.active) set.active = true;
    if (Object.keys(set).length) changes.push({ action: "aggiorna", ean: p.ean, set });
  }
  for (const s of shop) {
    if (!s.active || inFile.has(s.ean)) continue;
    changes.push({ action: "nascondi", ean: s.ean, reason: medicines.has(s.ean) ? "farmaco" : "non_nel_file" });
  }
  return changes;
}

/** Riassunto per il registro di ogni esecuzione. */
export function summarizeSync(catalog: ParsedCatalog, changes: SyncChange[]) {
  const count = (a: SyncChange["action"]) => changes.filter((c) => c.action === a).length;
  return {
    inVendita: catalog.sellable.length,
    farmaciEsclusi: catalog.excluded.filter((e) => e.reason === "farmaco").length,
    tipoSconosciuto: catalog.excluded.filter((e) => e.reason === "tipo_sconosciuto").length,
    problemi: catalog.issues.length,
    daCreare: count("crea"),
    daAggiornare: count("aggiorna"),
    daNascondere: count("nascondi"),
  };
}

/** Allarme se il ponte fallisce due volte di fila (BRIEF §16). `history`: esiti dal più vecchio al più recente. */
export const shouldAlarm = (history: readonly ("ok" | "errore")[]): boolean =>
  history.length >= 2 && history.at(-1) === "errore" && history.at(-2) === "errore";
