import type { Metadata } from "next";
import Link from "next/link";
import { formatDuration, formatPrice, servicesByGroup, type Service } from "@masera/core";
import { Button, ComingSoon } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { isOn, links } from "@/content/home";
import { otherServices, prenotaHref, whatsappNumber } from "@/content/servizi";

export const metadata: Metadata = {
  title: "Servizi e prezzi",
  description:
    "Analisi del sangue in 15 minuti, ECG e Holter, intolleranze, Skin LAB e tamponi alla Farmacia Masera di Seregno: prezzi, durata e come prepararti.",
};

export default function ServiziPage() {
  const groups = servicesByGroup();
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Servizi e prezzi", href: "/servizi" },
        ]}
      />
      <PageHeader
        kicker="Servizi e prezzi"
        lines={["Cosa possiamo fare per te,", "e quanto costa."]}
        lead="I servizi divisi per bisogno, con prezzo, durata e come prepararti. Le autoanalisi del sangue si fanno con una goccia di sangue dal dito e il risultato arriva in pochi minuti."
      >
        <nav aria-label="Gruppi di servizi" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.slug}>
                <a
                  href={`#${g.slug}`}
                  className="fm-focus fm-press inline-flex min-h-11 items-center rounded-full border-2 border-verde-scuro px-4 text-[15px] font-semibold text-verde-scuro hover:bg-verde-scuro hover:text-carta"
                >
                  {g.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="mx-auto max-w-7xl space-y-5 px-4 md:px-8">
        {groups.map((g) => (
          <section key={g.slug} id={g.slug} aria-labelledby={`${g.slug}-t`} className="scroll-mt-28 rounded-3xl border border-beige-chiaro bg-bianco p-5 md:p-8">
            <h2 id={`${g.slug}-t`} className="fm-display text-[30px] leading-tight md:text-[36px]">
              {g.name}
            </h2>
            <p className="mt-1 text-[16px] text-verde">{g.intro}</p>
            {g.services.length > 0 ? (
              <ul className="mt-4">
                {g.services.map((s) => (
                  <ServiceRow key={s.slug} s={s} />
                ))}
              </ul>
            ) : (
              <p className="mt-4 border-t border-beige-chiaro pt-4 text-[16px]">
                Te li spieghiamo al banco o su{" "}
                <a href={links.whatsapp} className="font-semibold text-verde underline underline-offset-4">
                  WhatsApp al {whatsappNumber}
                </a>
                .
              </p>
            )}
          </section>
        ))}
      </div>

      <section aria-label="Come prenotare" className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-verde-scuro p-6 text-carta md:flex-row md:items-center md:justify-between md:p-8">
          <p className="text-[18px]">
            Prenoti online, al banco o su WhatsApp al {whatsappNumber}. Ti confermiamo subito come prepararti.
          </p>
          <Button variant="cta" href="/prenota" className="shrink-0">
            Prenota un servizio
          </Button>
        </div>
        <p className="mt-3 px-1 text-[14px] text-verde">Prezzi aggiornati a novembre 2026.</p>
      </section>

      <section aria-labelledby="altri-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 id="altri-t" className="fm-display text-[32px] leading-tight md:text-[40px]">
          Anche in farmacia
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {otherServices.map((o) => (
            <li key={o.title}>
              {isOn(o.feature) ? (
                <Link href={o.href} className="fm-focus fm-press flex h-full flex-col gap-2 rounded-3xl bg-beige-chiaro p-5 transition-transform hover:-translate-y-1">
                  <span className="fm-display text-[24px]">{o.title}</span>
                  <span className="text-[15px]">{o.text}</span>
                  <span aria-hidden className="mt-auto font-semibold">
                    →
                  </span>
                </Link>
              ) : (
                <div className="flex h-full flex-col gap-2 rounded-3xl border-2 border-dashed border-beige-scuro p-5">
                  <span className="fm-display text-[24px]">{o.title}</span>
                  <span className="text-[15px]">{o.text}</span>
                  <ComingSoon label="Prenotazione" className="mt-auto !min-h-10 !px-3 !text-[14px]" />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function ServiceRow({ s }: { s: Service }) {
  return (
    <li className="grid gap-3 border-t border-beige-chiaro py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
      <div>
        <Link href={`/servizi/${s.slug}`} className="fm-focus rounded text-[18px] font-semibold text-verde-scuro underline-offset-4 hover:underline">
          {s.name}
        </Link>
        {s.description && <p className="mt-0.5 text-[15px]">{s.description}</p>}
        {s.preparation && (
          <p className="mt-1 text-[15px] text-verde">
            <span className="font-semibold">Come prepararti:</span> {s.preparation}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p className="text-right">
          <span className="fm-display block text-[26px] leading-none">{formatPrice(s.price_eur)}</span>
          <span className="mt-1 block text-[14px] font-semibold text-verde">{formatDuration(s.duration_min)}</span>
        </p>
        {s.bookable_online && (
          <Button variant="cta" href={prenotaHref(s.slug)} aria-label={`Prenota: ${s.name}`} className="!min-h-11 !px-5">
            Prenota
          </Button>
        )}
      </div>
    </li>
  );
}
