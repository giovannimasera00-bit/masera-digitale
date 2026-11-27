import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findLine } from "@masera/core";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/shop/ProductCard";
import { listItems } from "@/lib/shop";

type Props = { params: Promise<{ linea: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = findLine((await params).linea);
  return l ? { title: `Linea ${l.name}`, description: l.lead } : {};
}

export default async function LineaPage({ params }: Props) {
  const l = findLine((await params).linea);
  if (!l) notFound();
  const items = await listItems({ line: l.slug });
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: l.name, href: `/linee/${l.slug}` },
        ]}
      />
      <PageHeader kicker={`Le Nostre Linee · ${l.maker}`} lines={[l.name]} lead={l.lead} />
      <section aria-label={`Prodotti della linea ${l.name}`} className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <ProductGrid items={items} />
      </section>
    </>
  );
}
