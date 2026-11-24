import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button, ComingSoon } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { galenicoKinds, galenicoSteps } from "@/content/galenico";
import { features, links } from "@/content/home";

export const metadata: Metadata = {
  title: "Laboratorio galenico",
  description:
    "Il laboratorio galenico della Farmacia Masera di Seregno: preparazioni officinali senza ricetta e magistrali su prescrizione, preparate su misura secondo la Farmacopea Ufficiale Italiana.",
};

export default function GalenicoPage() {
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Servizi", href: "/servizi" },
          { label: "Laboratorio galenico", href: "/galenico" },
        ]}
      />
      <PageHeader
        kicker="Laboratorio galenico · Seregno"
        lines={["Preparato da noi,", <span key="m" className="text-verde">su misura per te.</span>]}
        lead="Nel nostro laboratorio prepariamo su misura quello che il medico ti prescrive, e le nostre formule storiche. È una tradizione di famiglia. Tutto secondo la Farmacopea Ufficiale Italiana."
      />

      <section aria-label="Il laboratorio di ieri" className="mx-auto max-w-7xl px-4 md:px-8">
        <figure className="overflow-hidden rounded-t-[999px] rounded-b-3xl bg-verde-scuro text-carta md:grid md:grid-cols-[1.2fr_1fr] md:rounded-t-[40px] md:rounded-b-[40px]">
          <Image
            src="/img/ieri-laboratorio.webp"
            alt="Un farmacista nel laboratorio galenico della farmacia, in una foto d'epoca."
            width={612}
            height={362}
            sizes="(min-width: 768px) 700px, 100vw"
            className="aspect-[3/2] h-full w-full object-cover"
            priority
          />
          <figcaption className="flex flex-col justify-center p-7 md:p-10">
            <span className="fm-display block text-[44px] leading-none">Ieri e oggi</span>
            <span className="mt-3 block text-[18px] leading-relaxed text-beige-chiaro">
              Il laboratorio galenico è una tradizione di famiglia. Gli strumenti sono cambiati, la cura nel preparare ogni vasetto no.
            </span>
            <Link href={links.famiglia} className="fm-focus mt-5 inline-block self-start rounded text-[17px] font-semibold text-mela underline decoration-2 underline-offset-4">
              La storia della famiglia <span aria-hidden>→</span>
            </Link>
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="cosa-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <h2 id="cosa-t" className="fm-display text-[34px] leading-tight md:text-[48px]">
          Cosa prepariamo.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {galenicoKinds.map((k, i) => (
            <Reveal key={k.title} delay={i * 150} className="h-full">
              <article className={`h-full rounded-3xl p-7 md:p-10 ${i === 0 ? "bg-beige-chiaro" : "bg-bianco"}`}>
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-verde">{k.tag}</p>
                <h3 className="fm-display mt-2 text-[30px] leading-tight md:text-[36px]">{k.title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed">{k.text}</p>
                <ul className="mt-5 space-y-2">
                  {k.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[17px]">
                      <span aria-hidden className="mt-2.5 block size-2 shrink-0 rounded-full bg-mela" />
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="come-t" className="bg-beige-chiaro/50">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <h2 id="come-t" className="fm-display text-[34px] leading-tight md:text-[48px]">
            Con la ricetta del medico.
          </h2>
          <p className="mt-2 max-w-2xl text-[17px] text-verde">Per le preparazioni magistrali, ecco come funziona.</p>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {galenicoSteps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 150} className="h-full">
                <div className="h-full rounded-3xl bg-bianco p-6">
                  <span className="fm-display block text-[40px] leading-none text-verde">{s.n}</span>
                  <h3 className="mt-3 text-[19px] font-semibold">{s.t}</h3>
                  <p className="mt-2 text-[16px] leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-verde-scuro p-7 text-carta md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <p className="fm-display text-[28px] leading-tight md:text-[34px]">Presto potrai mandarci la foto della ricetta.</p>
              <p className="mt-2 text-[16px] text-beige-chiaro">Ti mandiamo il preventivo prima di cominciare. L&apos;originale resta obbligatorio.</p>
            </div>
            {features.ricetta ? (
              <Button variant="cta" href={links.ricetta} className="shrink-0">
                Invia la ricetta
              </Button>
            ) : (
              <ComingSoon label="Invia la ricetta" tone="dark" />
            )}
          </div>
        </div>
      </section>

      <section aria-label="Informazioni" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-bianco p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <p className="fm-display text-[30px] leading-tight md:text-[36px]">Hai una domanda su una preparazione? Scrivici.</p>
          <Button variant="primario" href={links.whatsapp} className="shrink-0">
            Scrivici su WhatsApp
          </Button>
        </div>
      </section>
    </>
  );
}
