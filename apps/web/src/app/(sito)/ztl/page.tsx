import type { Metadata } from "next";
import { farmacia, farmaciaHours, formatWeeklyHours } from "@masera/core";
import { Button } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ZtlMap } from "@/components/ztl/ZtlMap";
import { links } from "@/content/home";
import { googleMapsUrl, ztlClosing, ztlFacts, ztlFaq, ztlSince, ztlSteps } from "@/content/ztl";

export const metadata: Metadata = {
  title: "Come arrivare in ZTL",
  description:
    "In farmacia anche in ZTL, gratis: entra da via Garibaldi, parcheggia negli spazi riservati alla Farmacia Masera (max 30 minuti) e comunica la targa al banco. Seregno, via Garibaldi 103.",
};

export default function ZtlPage() {
  const a = farmacia.address;
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ztlFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Come arrivare in ZTL", href: "/ztl" },
        ]}
      />
      <PageHeader
        kicker={`Novità dal ${ztlSince}`}
        lines={["In farmacia anche in ZTL.", <span key="g" className="text-verde">Gratis.</span>]}
        lead="Puoi entrare nella zona a traffico limitato del centro di Seregno e parcheggiare davanti alla Farmacia Masera. Bastano tre passi."
      />

      <section aria-label="Il percorso" className="mx-auto max-w-7xl px-4 md:px-8">
        <ZtlMap />
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {ztlSteps.map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-3xl bg-bianco p-5 md:p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mela text-[18px] font-bold text-verde-scuro">{i + 1}</span>
              <span className="text-[17px] leading-snug">
                <b className="block font-semibold">{s.t}</b>
                <span className="mt-1 block">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-8 rounded-3xl bg-verde-scuro p-7 text-carta md:p-10">
          <p className="fm-display text-[44px] leading-none text-mela md:text-[56px]">{ztlClosing}</p>
          <p className="mt-3 max-w-2xl text-[18px] text-beige-chiaro">
            Nessuna registrazione, nessun modulo, nessun costo. Valido per l&apos;acquisto di farmaci o per prestazioni sanitarie.
          </p>
        </div>
      </section>

      <section aria-labelledby="breve-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 id="breve-t" className="fm-display text-[34px] md:text-[44px]">
          In breve
        </h2>
        <p className="mt-3 max-w-3xl text-[18px] leading-relaxed">
          Un risultato ottenuto dai Dottori Giuseppe e Giovanni Masera dopo tanti confronti con Comune e Polizia Locale, per una farmacia sempre
          più vicina e accessibile.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {ztlFacts.map((f) => (
            <li key={f.t} className="rounded-3xl border border-beige-chiaro bg-bianco p-6">
              <span className="fm-display block text-[52px] leading-none">{f.n}</span>
              <b className="mt-3 block text-[18px] font-semibold">{f.t}</b>
              <span className="mt-1 block text-[16px] text-verde">{f.d}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-t" className="mx-auto max-w-4xl px-4 pb-16 md:px-8">
        <h2 id="faq-t" className="fm-display text-[34px] md:text-[44px]">
          Domande frequenti
        </h2>
        <div className="mt-6 divide-y divide-beige-chiaro rounded-3xl border border-beige-chiaro bg-bianco">
          {ztlFaq.map((f) => (
            <details key={f.q} className="group px-5 md:px-7">
              <summary className="fm-focus flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[18px] font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-[22px] text-verde transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-5 text-[17px] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="dove-t" className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <div className="grid gap-6 rounded-3xl bg-beige-chiaro p-7 md:grid-cols-2 md:p-10">
          <div>
            <h2 id="dove-t" className="fm-display text-[34px] leading-tight md:text-[44px]">
              Ti aspettiamo in via Garibaldi {a.street.replace(/\D+/g, "")}
            </h2>
            <address className="mt-3 text-[17px] not-italic">
              {farmacia.name}, {a.street}, {a.zip} {a.city} ({a.province})
            </address>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primario" href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Apri in Google Maps
              </Button>
              <Button variant="secondario" href={links.whatsapp}>
                Scrivici su WhatsApp
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-[18px] font-semibold">Orari</h3>
            <ul className="mt-2 space-y-1 text-[17px]">
              {formatWeeklyHours(farmaciaHours).map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
