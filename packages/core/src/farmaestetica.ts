// Farmaestetica by Dottor Masera e Miamo Lounge: listini da data/farmaestetica.json e data/miamo-lounge.json.
import fe from "../../../data/farmaestetica.json";
import miamo from "../../../data/miamo-lounge.json";
import { parseHours, type WeeklyHours } from "./farmacia";

export type Treatment = { name: string; minutes: number; price: number; package5plus1?: number };
export type TreatmentGroup = { slug: string; name: string; items: Treatment[]; note?: string };

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const farmaesteticaBrand = fe.brand; // "Farmaestetica by Dottor Masera"
export const farmaesteticaContacts = fe.contacts;

const cat = (name: string) => {
  const c = fe.categories.find((x) => x.name === name);
  if (!c) throw new Error(`Categoria non trovata in data/farmaestetica.json: ${name}`);
  return c.items.map((i) => ({
    name: i.name,
    minutes: i.duration_min_estimate,
    price: i.price_eur,
    ...("package_5plus1_eur" in i ? { package5plus1: i.package_5plus1_eur as number } : {}),
  }));
};

/** Le schede del listino, nell'ordine del BRIEF §7.4 (Viso · Corpo · Laser · Cera e mani-piedi). */
export const farmaesteticaGroups: TreatmentGroup[] = [
  { slug: "viso", name: "Viso", items: cat("Viso") },
  { slug: "corpo", name: "Corpo", items: cat("Corpo"), note: "Pacchetto 5 sedute + 1 in omaggio, al prezzo di 5." },
  { slug: "laser", name: "Laser", items: cat("Laser"), note: "Il laser lo esegue solo la nostra estetista." },
  { slug: "cera-mani-piedi", name: "Cera e mani-piedi", items: [...cat("Cera"), ...cat("Mani e piedi")] },
];

/** Miamo Lounge: protocolli raggruppati per linea. */
export const miamoGroups: TreatmentGroup[] = miamo.lines.map((l) => ({
  slug: slugify(l.name),
  name: l.name,
  items: l.items.map((i) => ({ name: i.name, minutes: i.duration_min, price: i.price_eur })),
}));

/** Orari di Farmaestetica in formato settimanale (stesso calcolo di "Aperto ora"). */
export const farmaesteticaHours: WeeklyHours = (() => {
  const h = fe.contacts.hours;
  const r = (s: string) => (s === "chiuso" ? [] : [s.split("-") as [string, string]]);
  return parseHours({ mon: r(h.mon_fri), tue: r(h.mon_fri), wed: r(h.mon_fri), thu: r(h.mon_fri), fri: r(h.mon_fri), sat: r(h.sat), sun: r(h.sun) });
})();

export const treatmentSlug = (group: string, name: string) => `fe-${group}-${slugify(name)}`;
