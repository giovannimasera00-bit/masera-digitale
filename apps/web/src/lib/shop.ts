// Da dove arrivano i prodotti dello shop. Oggi: prodotti finti di prova. Domani: Shopify (Storefront API),
// riempito dal ponte catalogo. Le pagine usano solo queste funzioni, così il cambio non le tocca.
import type { ShopItem } from "@masera/core";
import { features } from "@/content/home";
import { demoItems } from "@/content/shop-demo";

/** "demo" finché non c'è il negozio Shopify collegato (chiavi su Vercel). */
export const shopMode = (): "demo" | "shopify" => "demo";

/**
 * Lo shop si vede nelle anteprime e sul computer; sul sito principale solo quando `features.shop` è acceso.
 * Così unire il codice in main non mette online prodotti di prova.
 */
export const shopVisible = (): boolean => features.shop || process.env.VERCEL_ENV !== "production";

export async function listItems(filter: { department?: string; line?: string; promo?: boolean } = {}): Promise<ShopItem[]> {
  return demoItems.filter(
    (i) =>
      (!filter.department || i.department === filter.department) &&
      (!filter.line || i.line === filter.line) &&
      (!filter.promo || (i.compareAtPrice !== null && i.compareAtPrice > i.price)),
  );
}

export async function getItem(handle: string): Promise<ShopItem | null> {
  return demoItems.find((i) => i.handle === handle) ?? null;
}
