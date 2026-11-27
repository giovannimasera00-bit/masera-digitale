import type { Metadata } from "next";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { CartView } from "@/components/shop/CartView";
import { getItem } from "@/lib/shop";

export const metadata: Metadata = { title: "Carrello", robots: { index: false, follow: false } };

export default async function CarrelloPage({ searchParams }: { searchParams: Promise<{ "metti-da-parte"?: string | string[] }> }) {
  const sp = await searchParams;
  const handle = typeof sp["metti-da-parte"] === "string" ? sp["metti-da-parte"] : null;
  const setAside = handle ? await getItem(handle) : null;
  return (
    <>
      <Breadcrumbs siteUrl={siteUrl()} items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "Carrello", href: "/carrello" }]} />
      <PageHeader kicker="Shop" lines={[setAside ? "Metti da parte" : "Il tuo carrello"]} lead="Scrivi il CAP: ti diciamo subito quando arriva, quanto costa la spedizione e come puoi pagare." />
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <CartView nowIso={new Date().toISOString()} setAside={setAside && setAside.stock > 0 ? setAside : null} />
      </section>
    </>
  );
}
