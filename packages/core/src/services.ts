import data from "../../../data/servizi.json";

export type Service = (typeof data.services)[number];

export const services: Service[] = data.services;
export const serviceGroups = data.groups;

export function service(slug: string): Service {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Servizio non trovato in data/servizi.json: ${slug}`);
  return s;
}

/** 35 → "35 €", 59.9 → "59,90 €", null → "[DA CONFERMARE]". */
export function formatPrice(eur: number | null | undefined): string {
  if (eur === null || eur === undefined || Number.isNaN(eur)) return "[DA CONFERMARE]";
  return Number.isInteger(eur) ? `${eur} €` : `${eur.toFixed(2).replace(".", ",")} €`;
}

/** Prezzo più basso di un gruppo (es. "sangue-urine"), per frasi come "da 6 €". */
export function minPrice(group: string): number | null {
  const prices = services.filter((s) => s.group === group && typeof s.price_eur === "number").map((s) => s.price_eur as number);
  return prices.length ? Math.min(...prices) : null;
}
