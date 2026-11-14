import Link from "next/link";

export type Crumb = { label: string; href: string };

/** Briciole di pane visibili + dati strutturati BreadcrumbList per Google. */
export function Breadcrumbs({ items, siteUrl }: { items: Crumb[]; siteUrl: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: new URL(c.href, siteUrl).toString() })),
  };
  return (
    <nav aria-label="Sei qui" className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-verde">
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>›</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-verde-scuro">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="fm-focus inline-flex min-h-6 items-center rounded underline-offset-4 hover:underline">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}

export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "https://farmaciamasera.com";
