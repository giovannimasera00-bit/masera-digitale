// Shop (BRIEF §8): reparti, Le Nostre Linee, disponibilità e carrello. Solo logica, con i test.
// I prodotti veri arriveranno da Shopify (riempito dal ponte catalogo); qui nessun dato di prodotto.
import { formatEuro, promoPrice } from "./delivery";

export type Department = { slug: string; name: string; lead: string };

/** I reparti dello shop, come nel BRIEF §3. Niente farmaci. */
export const shopDepartments: Department[] = [
  { slug: "dermocosmesi", name: "Dermocosmesi", lead: "Pelle e bellezza, con il consiglio delle farmaciste." },
  { slug: "integratori", name: "Integratori", lead: "L'integratore giusto, al momento giusto." },
  { slug: "alimenti-speciali", name: "Alimenti speciali", lead: "Nutrizione funzionale in farmacia." },
  { slug: "veterinaria", name: "Veterinaria", lead: "Per cani e gatti." },
  { slug: "sanitari", name: "Sanitari", lead: "Medicazione, misurazione e cura di tutti i giorni." },
];
export const findDepartment = (slug: string) => shopDepartments.find((d) => d.slug === slug);

export type Line = { slug: string; name: string; maker: string; lead: string; tone: "masera" | "ldf" | "preparatori" };

/** Le Nostre Linee (BRIEF §3). Farmacisti Preparatori tiene la sua etichetta storica. */
export const ourLines: Line[] = [
  { slug: "dottor-masera", name: "Dottor Masera", maker: "Formulati dal Dott. Giuseppe Masera", lead: "Integratori pensati da un medico di famiglia: scienza e cura.", tone: "masera" },
  { slug: "ldf", name: "LDF – Laboratorio della Farmacia", maker: "LDF, Quarto d'Altino", lead: "Integratori e cosmetici a marchio Masera, fatti per noi.", tone: "ldf" },
  { slug: "farmacisti-preparatori", name: "Farmacisti Preparatori", maker: "Unifarco", lead: "Cosmetica a marchio Masera, premium e ricercata.", tone: "preparatori" },
];
export const findLine = (slug: string) => ourLines.find((l) => l.slug === slug);

/** Un prodotto come lo usa il sito (da Shopify o, in prova, dai dati finti). */
export type ShopItem = {
  handle: string;
  ean: string;
  name: string;
  brand: string;
  department: string;
  line: string | null;
  /** Una riga su a cosa serve e per chi è. Mai proprietà terapeutiche non autorizzate. */
  summary: string;
  price: number;
  /** Prezzo pieno barrato quando c'è una promo. */
  compareAtPrice: number | null;
  /** Giacenza al netto dei prenotati. */
  stock: number;
  image: string | null;
};

/** "Crema viso 50 ml" + EAN → "crema-viso-50-ml-8001234000011": unico e leggibile. */
export function productHandle(name: string, ean: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return `${base}-${ean}`;
}

/** Sotto questa giacenza scriviamo "ultimi pezzi". */
export const LOW_STOCK = 3;

export type Availability = { state: "disponibile" | "ultimi" | "esaurito"; label: string };

/** Disponibilità reale, dalla giacenza al netto dei prenotati. Niente urgenza finta: solo i numeri veri. */
export function availability(stock: number): Availability {
  if (stock <= 0) return { state: "esaurito", label: "Non disponibile ora: chiedici quando arriva" };
  if (stock <= LOW_STOCK) return { state: "ultimi", label: stock === 1 ? "Disponibile: 1 pezzo" : `Disponibili: ${stock} pezzi` };
  return { state: "disponibile", label: "Disponibile" };
}

/** Prezzo da mostrare: con la promo, barrato + nuovo prezzo + percentuale insieme. */
export function displayPrice(item: Pick<ShopItem, "price" | "compareAtPrice">): { price: string; full: string | null; badge: string | null } {
  const p = item.compareAtPrice !== null ? promoPrice(item.compareAtPrice, item.price) : null;
  return p ? { price: p.price, full: p.full, badge: p.label } : { price: formatEuro(item.price), full: null, badge: null };
}

export type CartLine = { handle: string; qty: number };

/** Massimo pezzi per riga: non più della giacenza e mai più di 10 (anti-errore). */
export const MAX_PER_LINE = 10;
export const maxQty = (stock: number) => Math.max(0, Math.min(stock, MAX_PER_LINE));

/** Aggiunge al carrello rispettando la giacenza. Restituisce il carrello nuovo (non modifica quello vecchio). */
export function addToCart(cart: CartLine[], item: Pick<ShopItem, "handle" | "stock">, qty = 1): CartLine[] {
  const cur = cart.find((l) => l.handle === item.handle)?.qty ?? 0;
  const next = Math.min(cur + Math.max(0, Math.floor(qty)), maxQty(item.stock));
  if (next <= 0) return cart.filter((l) => l.handle !== item.handle);
  return cur ? cart.map((l) => (l.handle === item.handle ? { ...l, qty: next } : l)) : [...cart, { handle: item.handle, qty: next }];
}

/** Imposta la quantità (0 = togli). */
export function setCartQty(cart: CartLine[], item: Pick<ShopItem, "handle" | "stock">, qty: number): CartLine[] {
  const q = Math.min(Math.max(0, Math.floor(qty)), maxQty(item.stock));
  if (q === 0) return cart.filter((l) => l.handle !== item.handle);
  return cart.some((l) => l.handle === item.handle) ? cart.map((l) => (l.handle === item.handle ? { ...l, qty: q } : l)) : [...cart, { handle: item.handle, qty: q }];
}

/** Totale del carrello in euro (centesimi esatti) e risparmio sulle promo. Le righe di prodotti spariti si saltano. */
export function cartTotals(cart: CartLine[], items: Pick<ShopItem, "handle" | "price" | "compareAtPrice">[]): { subtotalEur: number; savedEur: number; pieces: number } {
  let sub = 0;
  let saved = 0;
  let pieces = 0;
  for (const l of cart) {
    const it = items.find((i) => i.handle === l.handle);
    if (!it) continue;
    sub += Math.round(it.price * 100) * l.qty;
    if (it.compareAtPrice !== null && it.compareAtPrice > it.price) saved += (Math.round(it.compareAtPrice * 100) - Math.round(it.price * 100)) * l.qty;
    pieces += l.qty;
  }
  return { subtotalEur: sub / 100, savedEur: saved / 100, pieces };
}

/** I passaggi della consegna nella scheda prodotto (canvas Prodotto). */
export function deliverySteps(zone: "seregno" | "italia"): { t: string; d: string }[] {
  return zone === "seregno"
    ? [
        { t: "Entro le 16:00", d: "L'ordine entra nel giro di oggi" },
        { t: "Preparato in farmacia", d: "Il pacco viene sigillato da un farmacista" },
        { t: "Verso le 19:00 a casa tua", d: "Consegna sempre gratuita, paghi alla consegna" },
      ]
    : [
        { t: "Lo prepariamo in farmacia", d: "Imballato da noi e affidato al corriere" },
        { t: "In viaggio", d: "Ti mandiamo il link per seguirlo" },
        { t: "A casa in 2–3 giorni lavorativi", d: "Spedizione gratuita sopra i 59 €" },
      ];
}
