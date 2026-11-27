import { notFound } from "next/navigation";
import { CartLink } from "@/components/shop/CartLink";
import { CartProvider } from "@/components/shop/CartProvider";
import { DemoNotice } from "@/components/shop/ProductCard";
import { shopMode, shopVisible } from "@/lib/shop";

/** Tutte le pagine dello shop: nascoste sul sito principale finché lo shop è "in arrivo". */
export default function NegozioLayout({ children }: { children: React.ReactNode }) {
  if (!shopVisible()) notFound();
  return (
    <CartProvider>
      {shopMode() === "demo" && <DemoNotice />}
      {children}
      <CartLink />
    </CartProvider>
  );
}
