import type { Metadata } from "next";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/shop/ProductCard";
import { listItems } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Promo",
  description: "Le promozioni della Farmacia Masera, con il prezzo pieno e la percentuale di sconto sempre indicati.",
};

export default async function PromoPage() {
  const items = await listItems({ promo: true });
  return (
    <>
      <Breadcrumbs siteUrl={siteUrl()} items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Promo", href: "/promo" }]} />
      <PageHeader kicker="Shop" lines={["Promo"]} lead="Le promozioni in corso in farmacia. Per ogni prodotto trovi il prezzo pieno e lo sconto in percentuale." />
      <section aria-label="Prodotti in promo" className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <ProductGrid items={items} />
      </section>
    </>
  );
}
