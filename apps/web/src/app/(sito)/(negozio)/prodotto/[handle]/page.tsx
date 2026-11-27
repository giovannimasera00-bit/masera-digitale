import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { displayPrice, findDepartment, findLine } from "@masera/core";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { ProductBuy } from "@/components/shop/ProductBuy";
import { ProductImage } from "@/components/shop/ProductCard";
import { links } from "@/content/home";
import { getItem } from "@/lib/shop";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getItem((await params).handle);
  return item ? { title: item.name, description: item.summary } : {};
}

export default async function ProdottoPage({ params }: Props) {
  const item = await getItem((await params).handle);
  if (!item) notFound();
  const dept = findDepartment(item.department);
  const line = item.line ? findLine(item.line) : null;
  const p = displayPrice(item);

  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(dept ? [{ label: dept.name, href: `/shop/${dept.slug}` }] : []),
          { label: item.name, href: `/prodotto/${item.handle}` },
        ]}
      />
      <article className="mx-auto grid max-w-7xl gap-8 px-4 pb-24 pt-6 md:grid-cols-2 md:gap-14 md:px-8">
        <div className="relative h-[330px] overflow-hidden rounded-[32px] md:h-[520px]">
          <ProductImage item={item} large />
          <svg viewBox="0 0 390 330" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax meet">
            <g fill="none" stroke="#9AB9AD" strokeOpacity=".45" strokeWidth="1.5">
              <path d="M55 330V200a140 140 0 0 1 280 0V330" />
              <path d="M95 330V210a100 100 0 0 1 200 0V330" />
            </g>
          </svg>
        </div>

        <div className="min-w-0">
          {line && (
            <Link href={`/linee/${line.slug}`} className="fm-focus text-[12px] font-bold uppercase tracking-[0.18em] text-verde underline-offset-4 hover:underline">
              Linea {line.name}
            </Link>
          )}
          <div className="mt-1 flex items-start justify-between gap-4">
            <h1 className="fm-display text-[30px] leading-[1.05] text-verde-scuro md:text-[40px]">{item.name}</h1>
            <div className="text-right">
              <b className="block whitespace-nowrap text-[22px] text-verde-scuro">{p.price}</b>
              {p.full && (
                <span className="text-[14px] text-verde">
                  <s>
                    <span className="sr-only">invece di </span>
                    {p.full}
                  </s>{" "}
                  {p.badge}
                </span>
              )}
            </div>
          </div>
          <p className="mt-1 text-[15px] text-verde">{item.brand}</p>
          <p className="mb-5 mt-3 text-[16px] leading-relaxed text-[#4a4a46]">{item.summary}</p>

          <ProductBuy item={item} nowIso={new Date().toISOString()} />

          <a href={links.whatsapp} className="fm-focus mt-4 flex items-center gap-3 rounded-[18px] bg-[#E6EDCB] px-4 py-3 text-nero">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2E3F2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 5h16v11H9l-5 4z" />
            </svg>
            <span className="text-[15px]">
              <b>Non sai se fa per te?</b> Chiedi al farmacista
            </span>
          </a>
        </div>
      </article>
    </>
  );
}
