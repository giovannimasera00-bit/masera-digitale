import { describe, expect, it } from "vitest";
import { addToCart, availability, cartTotals, displayPrice, maxQty, productHandle, setCartQty } from "../src";

const crema = { handle: "crema", stock: 5, price: 19.9, compareAtPrice: 25 };
const gel = { handle: "gel", stock: 2, price: 9.9, compareAtPrice: null };

describe("Indirizzo del prodotto", () => {
  it("leggibile e unico grazie all'EAN", () => {
    expect(productHandle("Crème viso Idratante 50 ml!", "8001234000011")).toBe("creme-viso-idratante-50-ml-8001234000011");
  });
});

describe("Disponibilità vera, senza urgenza finta", () => {
  it("esaurito, pochi pezzi, disponibile", () => {
    expect(availability(0).state).toBe("esaurito");
    expect(availability(1).label).toBe("Disponibile: 1 pezzo");
    expect(availability(3).label).toBe("Disponibili: 3 pezzi");
    expect(availability(4)).toEqual({ state: "disponibile", label: "Disponibile" });
  });
});

describe("Prezzo mostrato", () => {
  it("promo: barrato, prezzo e percentuale insieme", () => {
    expect(displayPrice(crema)).toEqual({ price: "19,90 €", full: "25 €", badge: "−20%" });
  });
  it("senza promo: solo il prezzo", () => {
    expect(displayPrice(gel)).toEqual({ price: "9,90 €", full: null, badge: null });
  });
});

describe("Carrello", () => {
  it("non si supera la giacenza", () => {
    let c = addToCart([], gel, 1);
    c = addToCart(c, gel, 5);
    expect(c).toEqual([{ handle: "gel", qty: 2 }]);
  });
  it("massimo 10 pezzi per riga", () => {
    expect(maxQty(50)).toBe(10);
    expect(setCartQty([], { handle: "x", stock: 50 }, 30)).toEqual([{ handle: "x", qty: 10 }]);
  });
  it("esaurito: non entra", () => {
    expect(addToCart([], { handle: "x", stock: 0 })).toEqual([]);
  });
  it("quantità 0 toglie la riga", () => {
    expect(setCartQty([{ handle: "gel", qty: 2 }], gel, 0)).toEqual([]);
  });
  it("totale in centesimi esatti e risparmio sulle promo", () => {
    const cart = [{ handle: "crema", qty: 3 }, { handle: "gel", qty: 1 }, { handle: "sparito", qty: 1 }];
    expect(cartTotals(cart, [crema, gel])).toEqual({ subtotalEur: 69.6, savedEur: 15.3, pieces: 4 });
  });
});
