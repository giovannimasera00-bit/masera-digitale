import type { Metadata } from "next";
import Link from "next/link";
import { ourLines, shopDepartments } from "@masera/core";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/shop/ProductCard";
import { listItems } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Shop",
  description: "Dermocosmesi, integratori, alimenti speciali, veterinaria e sanitari della Farmacia Masera. A Seregno consegna gratuita in giornata.",
};

export default async function ShopPage() {
  const promo = await listItems({ promo: true });
  return (
    <>
      <Breadcrumbs siteUrl={siteUrl()} items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }]} />
      <PageHeader
        kicker="Shop"
        lines={["Il consiglio della farmacia,", <span key="v" className="text-verde">anche a casa.</span>]}
        lead="A Seregno consegna gratuita in giornata per gli ordini entro le 16. In tutta Italia in 2–3 giorni lavorativi. Niente farmaci online."
      />
      <section aria-labelledby="reparti-t" className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 id="reparti-t" className="text-[13px] font-bold uppercase tracking-[0.14em] text-verde">
          Reparti
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shopDepartments.map((d) => (
            <li key={d.slug}>
              <Link href={`/shop/${d.slug}`} className="fm-focus fm-press block h-full rounded-3xl bg-beige-chiaro/60 p-5 hover:bg-beige-chiaro">
                <b className="fm-display block text-[26px] leading-tight">{d.name}</b>
                <span className="mt-1 block text-[15px]">{d.lead}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="linee-t" className="mx-auto max-w-7xl px-4 pt-12 md:px-8">
        <h2 id="linee-t" className="fm-display text-[32px] leading-tight md:text-[40px]">
          Le Nostre Linee
        </h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {ourLines.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/linee/${l.slug}`}
                className={`fm-focus fm-press block h-full rounded-3xl p-6 ${l.tone === "masera" ? "bg-verde-scuro text-carta" : l.tone === "ldf" ? "bg-salvia text-verde-scuro" : "bg-bianco text-nero ring-1 ring-verde-scuro/15"}`}
              >
                <b className="block text-[20px]">{l.name}</b>
                <span className="mt-1 block text-[14px] opacity-80">{l.maker}</span>
                <span className="mt-3 block text-[16px]">{l.lead}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {promo.length > 0 && (
        <section aria-labelledby="promo-t" className="mx-auto max-w-7xl px-4 pb-24 pt-12 md:px-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="promo-t" className="fm-display text-[32px] leading-tight md:text-[40px]">
              In promo
            </h2>
            <Link href="/promo" className="fm-focus text-[16px] font-semibold underline underline-offset-4">
              Tutte le promo
            </Link>
          </div>
          <div className="mt-4">
            <ProductGrid items={promo.slice(0, 4)} />
          </div>
        </section>
      )}
    </>
  );
}
