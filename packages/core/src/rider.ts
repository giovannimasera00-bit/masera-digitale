// Elenco consegne del giorno per il rider (BRIEF §16 "Rider"): alle 16:00 gli ordini di Seregno del giro di oggi,
// con gli indirizzi in ordine e quanto incassare alla consegna. Solo logica, con i test.
import { formatEuro, isValidZip, SEREGNO_ZIPS, seregnoDelivery } from "./delivery";

export type RiderPayment = "pos" | "contanti" | "online_pagato";
export type RiderStatus = "da_preparare" | "pronto" | "partito" | "consegnato" | "annullato";

export type RiderOrder = {
  id: string;
  /** Numero d'ordine da leggere al telefono. */
  number: string;
  customerName: string;
  phone: string;
  street: string;
  houseNumber: string;
  zip: string;
  /** Citofono, scala, piano… */
  notes: string | null;
  /** Quando è stato fatto l'ordine (ISO). */
  placedAt: string;
  payment: RiderPayment;
  totalEur: number;
  status: RiderStatus;
  /** Contiene farmaci su ricetta: pacco sigillato da un farmacista (BRIEF §11). */
  sealed: boolean;
  /** Coordinate dell'indirizzo, se note (Shopify le calcola dall'indirizzo di consegna). */
  lat?: number;
  lon?: number;
};

/** Giorno di consegna di un ordine di Seregno: quello deciso quando è stato fatto (entro le 16 → in giornata). */
export const deliveryDateOf = (o: Pick<RiderOrder, "placedAt">, closedDates: readonly string[] = []): string =>
  seregnoDelivery(new Date(o.placedAt), closedDates).date;

/** Via senza "via/viale/corso…" e senza accenti, per ordinare: "Via F.lli Cairoli" e "via Fratelli Cairoli" restano vicine. */
function streetKey(street: string): string {
  return street
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\bf\.?\s?lli\b/g, "fratelli")
    .replace(/^(via|viale|v\.le|corso|c\.so|piazza|p\.za|largo|vicolo)\s+/, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}
const houseKey = (n: string) => {
  const m = /^(\d+)\s*(.*)$/.exec(n.trim());
  return m ? [Number(m[1]), m[2]!.toLowerCase()] as const : [Number.MAX_SAFE_INTEGER, n.toLowerCase()] as const;
};

/** Quanto incassare alla consegna (0 se pagato online). */
export const toCollect = (o: Pick<RiderOrder, "payment" | "totalEur">): number => (o.payment === "online_pagato" ? 0 : o.totalEur);

export type RiderRun = {
  date: string;
  stops: RiderOrder[];
  /** Ordini con CAP non di Seregno finiti qui per errore: da controllare al banco. */
  outOfArea: RiderOrder[];
  cashEur: number;
  posCount: number;
  sealedCount: number;
};

export type Point = { lat: number; lon: number };

/** Distanza in metri tra due punti (formula dell'emisenoverso). */
export function distanceM(a: Point, b: Point): number {
  const R = 6_371_000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Lunghezza di un giro che parte da `origin` e tocca i punti in ordine (senza ritorno). */
export const routeLengthM = (origin: Point, pts: Point[]): number =>
  pts.reduce((acc, p, i) => acc + distanceM(i === 0 ? origin : pts[i - 1]!, p), 0);

/**
 * Ordine delle tappe che accorcia il giro: prima la tappa più vicina ogni volta, poi si migliora
 * invertendo tratti finché il percorso si accorcia (2-opt). In linea d'aria: per le vie di Seregno basta.
 */
export function optimizeRoute<T extends Point>(origin: Point, stops: T[]): T[] {
  const left = [...stops];
  const route: T[] = [];
  let cur: Point = origin;
  while (left.length) {
    let best = 0;
    for (let i = 1; i < left.length; i++) if (distanceM(cur, left[i]!) < distanceM(cur, left[best]!)) best = i;
    cur = left.splice(best, 1)[0]!;
    route.push(cur as T);
  }
  let improved = true;
  for (let pass = 0; improved && pass < 50; pass++) {
    improved = false;
    for (let i = 0; i < route.length - 1; i++) {
      for (let k = i + 1; k < route.length; k++) {
        const cand = [...route.slice(0, i), ...route.slice(i, k + 1).reverse(), ...route.slice(k + 1)];
        if (routeLengthM(origin, cand) + 0.5 < routeLengthM(origin, route)) {
          route.splice(0, route.length, ...cand);
          improved = true;
        }
      }
    }
  }
  return route;
}

const byStreet = (a: RiderOrder, b: RiderOrder) => {
  const s = streetKey(a.street).localeCompare(streetKey(b.street), "it");
  if (s) return s;
  const [na, ra] = houseKey(a.houseNumber);
  const [nb, rb] = houseKey(b.houseNumber);
  return na - nb || ra.localeCompare(rb);
};

/**
 * Il giro di consegna di un giorno: ordini di Seregno di quel giorno, non annullati né già consegnati.
 * Con la partenza (la farmacia) e le coordinate degli indirizzi (Shopify le dà con l'indirizzo) le tappe
 * seguono il percorso più corto; gli indirizzi senza coordinate vanno in fondo, in ordine di via e civico.
 */
export function riderRun(orders: RiderOrder[], date: string, closedDates: readonly string[] = [], origin?: Point): RiderRun {
  const ofDay = orders.filter((o) => o.status !== "annullato" && deliveryDateOf(o, closedDates) === date);
  const inArea = (o: RiderOrder) => isValidZip(o.zip) && SEREGNO_ZIPS.includes(o.zip.trim());
  const todo = ofDay.filter((o) => inArea(o) && o.status !== "consegnato");
  const located = todo.filter((o): o is RiderOrder & Point => typeof o.lat === "number" && typeof o.lon === "number");
  const stops = origin
    ? [...optimizeRoute(origin, located), ...todo.filter((o) => !located.includes(o as RiderOrder & Point)).sort(byStreet)]
    : [...todo].sort(byStreet);
  const cents = stops.reduce((acc, o) => acc + (o.payment === "contanti" ? Math.round(o.totalEur * 100) : 0), 0);
  return {
    date,
    stops,
    outOfArea: ofDay.filter((o) => !inArea(o)),
    cashEur: cents / 100,
    posCount: stops.filter((o) => o.payment === "pos").length,
    sealedCount: stops.filter((o) => o.sealed).length,
  };
}

/** Riga per il pagamento, da leggere al volo. */
export function paymentNote(o: Pick<RiderOrder, "payment" | "totalEur">): string {
  if (o.payment === "online_pagato") return "Già pagato online";
  return `${o.payment === "pos" ? "Carta (POS)" : "Contanti"}: ${formatEuro(o.totalEur)}`;
}

/** Link a Google Maps per il percorso: partenza dalla farmacia, poi le tappe in ordine (massimo 9 tappe per link). */
export function routeLinks(stops: Pick<RiderOrder, "street" | "houseNumber" | "zip">[], origin: string, city = "Seregno"): string[] {
  const links: string[] = [];
  for (let i = 0; i < stops.length; i += 9) {
    const chunk = stops.slice(i, i + 9).map((s) => `${s.street} ${s.houseNumber}, ${s.zip} ${city}`);
    const start = i === 0 ? origin : `${stops[i - 1]!.street} ${stops[i - 1]!.houseNumber}, ${stops[i - 1]!.zip} ${city}`;
    links.push(`https://www.google.com/maps/dir/${[start, ...chunk].map(encodeURIComponent).join("/")}`);
  }
  return links;
}
