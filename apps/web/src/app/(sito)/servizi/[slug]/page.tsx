import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { farmacia, findService, formatDuration, formatPrice, listedServices, serviceGroups, services } from "@masera/core";
import { Button } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { links } from "@/content/home";
import { prenotaHref, resourceLabel, whatsappNumber } from "@/content/servizi";

// Una scheda per ogni servizio del listino; indirizzi non previsti → pagina non trovata.
export const dynamicParams = false;
export function generateStaticParams() {
  return listedServices().map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = findService((await params).slug);
  if (!s) return {};
  const price = formatPrice(s.price_eur);
  return {
    title: s.name,
    description: `${s.name} alla Farmacia Masera di Seregno: ${price}, ${formatDuration(s.duration_min)}. ${s.description}`.trim(),
  };
}

export default async function ServicePage({ params }: Props) {
  const s = findService((await params).slug);
  if (!s || !s.group) notFound();
  const group = serviceGroups.find((g) => g.slug === s.group)!;
  const others = services.filter((x) => x.group === s.group && x.slug !== s.slug);
  const url = siteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description || undefined,
    serviceType: group.name,
    provider: { "@type": "Pharmacy", name: farmacia.name, address: `${farmacia.address.street}, ${farmacia.address.zip} ${farmacia.address.city}` },
    areaServed: farmacia.address.city,
    url: new URL(`/servizi/${s.slug}`, url).toString(),
    ...(typeof s.price_eur === "number" ? { offers: { "@type": "Offer", price: s.price_eur, priceCurrency: "EUR" } } : {}),
  };

  return (
    <>
      <Breadcrumbs
        siteUrl={url}
        items={[
          { label: "Home", href: "/" },
          { label: "Servizi e prezzi", href: "/servizi" },
          { label: s.name, href: `/servizi/${s.slug}` },
        ]}
      />
      <PageHeader kicker={group.name} lines={[s.name]} lead={s.description || group.intro} />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 md:px-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Fact label="Prezzo" value={formatPrice(s.price_eur)} big />
            <Fact label="Durata" value={formatDuration(s.duration_min)} big />
            <Fact label="Dove" value={resourceLabel[s.resource] ?? s.resource} />
          </dl>

          {s.preparation && (
            <section aria-labelledby="prep-t" className="rounded-3xl bg-salvia p-6 md:p-8">
              <h2 id="prep-t" className="fm-display text-[28px]">
                Come prepararti
              </h2>
              <p className="mt-2 text-[18px] leading-relaxed">{s.preparation}</p>
            </section>
          )}

          {s.note && (
            <p className="rounded-2xl border border-beige-chiaro bg-bianco p-5 text-[16px]">
              <span className="font-semibold">Da sapere: </span>
              {s.note}
            </p>
          )}

          {s.description && <p className="text-[16px] text-verde">{group.intro}</p>}
        </div>

        <aside aria-label="Prenota" className="h-fit rounded-3xl bg-verde-scuro p-6 text-carta md:p-8 lg:sticky lg:top-28">
          <p className="fm-display text-[30px] leading-tight">Prenota {s.name.charAt(0).toLowerCase() + s.name.slice(1)}</p>
          <p className="mt-2 text-[16px] text-beige-chiaro">Vedi gli orari liberi e ricevi subito la conferma, con le istruzioni per prepararti.</p>
          <div className="mt-6 flex flex-col gap-3">
            {s.bookable_online && (
              <Button variant="cta" href={prenotaHref(s.slug)}>
                Prenota online
              </Button>
            )}
            <Button variant="primario" href={links.whatsapp} className="!bg-carta !text-verde-scuro hover:!bg-bianco">
              Scrivici su WhatsApp
            </Button>
          </div>
          <p className="mt-4 text-[14px] text-beige-chiaro">Oppure al banco, o su WhatsApp al {whatsappNumber}.</p>
        </aside>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="altri-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <h2 id="altri-t" className="fm-display text-[30px] md:text-[36px]">
            Altri servizi · {group.name}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/servizi/${o.slug}`}
                  className="fm-focus fm-press flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-beige-chiaro bg-bianco px-5 py-4 hover:border-verde-scuro"
                >
                  <span className="font-semibold">{o.name}</span>
                  <span className="shrink-0 text-[15px] text-verde">
                    {formatPrice(o.price_eur)} · {formatDuration(o.duration_min)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/servizi" className="fm-focus mt-6 inline-flex min-h-6 items-center rounded font-semibold text-verde underline underline-offset-4">
            Tutti i servizi e prezzi <span aria-hidden>&nbsp;→</span>
          </Link>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

function Fact({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="rounded-2xl bg-bianco p-4 md:p-5">
      <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-verde">{label}</dt>
      <dd className={big ? "fm-display mt-1 text-[30px] leading-none md:text-[34px]" : "mt-1 text-[18px] font-semibold"}>{value}</dd>
    </div>
  );
}
