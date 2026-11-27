"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

/** Pulsante del carrello sempre visibile nello shop, con il numero di pezzi. */
export function CartLink() {
  const { totals } = useCart();
  return (
    <Link
      href="/carrello"
      className="fm-focus fm-press fixed bottom-4 right-4 z-20 inline-flex min-h-12 items-center gap-2 rounded-full bg-verde-scuro px-5 text-[16px] font-bold text-carta shadow-[0_12px_28px_rgba(0,0,0,.25)]"
    >
      Carrello
      <span className="rounded-full bg-mela px-2 py-0.5 text-[14px] text-verde-scuro">
        {totals.pieces}
        <span className="sr-only"> {totals.pieces === 1 ? "pezzo" : "pezzi"}</span>
      </span>
    </Link>
  );
}
