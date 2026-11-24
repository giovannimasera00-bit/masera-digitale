// Deblistering: prezzi da data/farmacia.json (1 € al giorno, 28 € al mese = 4 settimane di bustine).
import { farmacia } from "./farmacia";

export const deblisteringPerDay = farmacia.deblistering.price_per_day_eur;
export const deblisteringPerMonth = farmacia.deblistering.price_per_month_eur;

/** Periodi della calcolatrice, in settimane di bustine. */
export const deblisteringPeriods = [
  { weeks: 1, label: "1 settimana" },
  { weeks: 4, label: "4 settimane" },
  { weeks: 12, label: "3 mesi" },
  { weeks: 52, label: "1 anno" },
] as const;

/** Costo totale: giorni × persone × prezzo al giorno. */
export function deblisteringCost(weeks: number, persons = 1): number {
  if (!Number.isInteger(weeks) || weeks < 1) throw new Error("Settimane non valide");
  if (!Number.isInteger(persons) || persons < 1) throw new Error("Persone non valide");
  return weeks * 7 * persons * deblisteringPerDay;
}
