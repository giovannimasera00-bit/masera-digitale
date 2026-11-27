"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { addToCart, cartTotals, setCartQty, type CartLine, type ShopItem } from "@masera/core";

type CartItem = Pick<ShopItem, "handle" | "name" | "price" | "compareAtPrice" | "stock" | "department">;

type Cart = {
  lines: (CartLine & { item: CartItem })[];
  totals: ReturnType<typeof cartTotals>;
  add: (item: CartItem, qty?: number) => void;
  setQty: (item: CartItem, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<Cart | null>(null);

/**
 * Carrello in memoria: resta mentre navighi nello shop, sparisce se ricarichi la pagina.
 * Volutamente non salvato nel browser finché la pagina cookie dice "niente da salvare": quando lo shop
 * andrà online decideremo se tenerlo nel browser (dato tecnico) e aggiorneremo la pagina cookie.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [known, setKnown] = useState<Record<string, CartItem>>({});

  const value = useMemo<Cart>(() => {
    const remember = (item: CartItem) => setKnown((k) => (k[item.handle] ? k : { ...k, [item.handle]: item }));
    const items = Object.values(known);
    return {
      lines: lines.filter((l) => known[l.handle]).map((l) => ({ ...l, item: known[l.handle]! })),
      totals: cartTotals(lines, items),
      add: (item, qty = 1) => {
        remember(item);
        setLines((c) => addToCart(c, item, qty));
      },
      setQty: (item, qty) => {
        remember(item);
        setLines((c) => setCartQty(c, item, qty));
      },
      clear: () => setLines([]),
    };
  }, [lines, known]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): Cart {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart fuori da CartProvider");
  return c;
}
