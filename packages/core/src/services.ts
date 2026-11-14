import data from "../../../data/servizi.json";

/** Un servizio come scritto in data/servizi.json (note facoltative). */
export type Service = {
  slug: string;
  name: string;
  description: string;
  group: string | null;
  price_eur: number | null;
  duration_min: number;
  preparation: string;
  resource: string;
  bookable_online: boolean;
  note?: string;
};
export type ServiceGroup = { slug: string; name: string; intro: string };

export const services: Service[] = data.services;
export const serviceGroups: ServiceGroup[] = data.groups;
export const servicesUpdated = data.updated; // "2026-11"

export function service(slug: string): Service {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`Servizio non trovato in data/servizi.json: ${slug}`);
  return s;
}

export function findService(slug: string): Service | undefined {
  return services.find((x) => x.slug === slug);
}

/** I gruppi "per bisogno" con i loro servizi, nell'ordine del file. Servizi senza gruppo esclusi. */
export function servicesByGroup(): (ServiceGroup & { services: Service[] })[] {
  return serviceGroups.map((g) => ({ ...g, services: services.filter((s) => s.group === g.slug) }));
}

/** Servizi che hanno una scheda nel listino (hanno un gruppo). */
export const listedServices = (): Service[] => services.filter((s) => s.group !== null);

/** 35 → "35 €", 59.9 → "59,90 €", 0 → "Gratis", null → "[DA CONFERMARE]". */
export function formatPrice(eur: number | null | undefined): string {
  if (eur === null || eur === undefined || Number.isNaN(eur)) return "[DA CONFERMARE]";
  if (eur === 0) return "Gratis";
  return Number.isInteger(eur) ? `${eur} €` : `${eur.toFixed(2).replace(".", ",")} €`;
}

/** 15 → "15 min"; dalle 2 ore in su la durata è indicativa: 240 → "circa 4 ore". */
export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  if (min < 120) return min === 60 ? "1 ora" : `1 ora e ${min - 60} min`;
  const h = Math.round(min / 60);
  return `circa ${h} ore`;
}

/** Prezzo più basso di un gruppo (es. "sangue-urine"), per frasi come "da 6 €". */
export function minPrice(group: string): number | null {
  const prices = services.filter((s) => s.group === group && typeof s.price_eur === "number").map((s) => s.price_eur as number);
  return prices.length ? Math.min(...prices) : null;
}
