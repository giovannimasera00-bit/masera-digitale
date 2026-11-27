import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findDepartment } from "@masera/core";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/shop/ProductCard";
import { listItems } from "@/lib/shop";

type Props = { params: Promise<{ reparto: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = findDepartment((await params).reparto);
  return d ? { title: `${d.name} · Shop`, description: d.lead } : {};
}

export default async function RepartoPage({ params }: Props) {
  const d = findDepartment((await params).reparto);
  if (!d) notFound();
  const items = await listItems({ department: d.slug });
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: d.name, href: `/shop/${d.slug}` },
        ]}
      />
      <PageHeader kicker="Shop" lines={[d.name]} lead={d.lead} />
      <section aria-label={`Prodotti: ${d.name}`} className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <ProductGrid items={items} />
      </section>
    </>
  );
}
