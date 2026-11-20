import type { Metadata } from "next";
import Link from "next/link";
import { farmacia } from "@masera/core";
import { Button } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Quattro generazioni",
  description:
    "Dal 1908 la famiglia Masera è un punto di riferimento sanitario per Seregno e la Brianza: dal Prof. Giuseppe Masera, chirurgo, al Dr. Giovanni Masera, quarta generazione.",
};

const ordinali = ["", "Prima", "Seconda", "Terza", "Quarta"];

export default function FamigliaPage() {
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "La famiglia", href: "/famiglia" },
        ]}
      />
      <PageHeader
        kicker="La famiglia Masera"
        lines={["Quattro generazioni,", "una sola missione:", <span key="s" className="text-verde">la tua salute.</span>]}
        lead="Da oltre cento anni la famiglia Masera è un punto di riferimento sanitario per Seregno e la Brianza. La tradizione resta, il modo di servirti cambia."
      />

      <section aria-label="Le quattro generazioni" className="mx-auto max-w-7xl px-4 md:px-8">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {farmacia.generations.map((g, i) => (
            <Reveal as="li" key={g.n} delay={i * 150}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-bianco">
                {/* Foto della famiglia: [DA INSERIRE] (vedi GUIDA, parte E). */}
                <div
                  className="flex aspect-[4/5] items-end rounded-t-[999px] border-2 border-dashed border-beige-scuro bg-beige-chiaro/50 p-5"
                  role="img"
                  aria-label={`Foto di ${g.name}: in arrivo`}
                >
                  <span className="rounded-full bg-bianco px-3 py-1 text-[13px] font-semibold text-verde">Foto in arrivo</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-verde">{g.label}</p>
                  <h2 className="fm-display mt-2 text-[28px] leading-tight">{g.name}</h2>
                  <p className="mt-2 text-[16px] leading-relaxed">{g.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tl-t" className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <h2 id="tl-t" className="fm-display text-[36px] leading-tight md:text-[48px]">
          Dal 1908 a oggi
        </h2>
        <ol className="relative mt-10 border-l-2 border-beige-scuro/60 pl-8 md:pl-12">
          {farmacia.timeline.map((t) => {
            const gen = "generation" in t ? (t.generation as number) : undefined;
            return (
              <Reveal as="li" key={t.year} className="relative pb-10 last:pb-0">
                <span
                  aria-hidden
                  className={`absolute -left-[41px] top-1.5 size-4 rounded-full ring-4 ring-carta md:-left-[57px] ${gen ? "bg-mela" : "bg-verde-scuro"}`}
                />
                <p className="fm-display text-[32px] leading-none text-verde md:text-[40px]">{t.year}</p>
                <h3 className="mt-2 text-[20px] font-semibold">{t.title}</h3>
                <p className="mt-1 text-[17px] leading-relaxed">{t.detail}</p>
                {gen && (
                  <span className="mt-3 inline-block rounded-full bg-beige-chiaro px-3 py-1 text-[13px] font-semibold text-verde-scuro">
                    {ordinali[gen]} generazione
                  </span>
                )}
              </Reveal>
            );
          })}
        </ol>
      </section>

      <section aria-label="Continua" className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/la-farmacia" className="fm-focus fm-press group flex flex-col gap-2 rounded-3xl bg-verde-scuro p-7 text-carta md:p-10">
            <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-mela">Oggi</span>
            <span className="fm-display text-[32px] leading-tight md:text-[40px]">La nuova Farmacia Masera</span>
            <span className="text-[17px] text-beige-chiaro">Il robot, cinque postazioni al banco, cabine nuove.</span>
            <span aria-hidden className="mt-2 font-semibold">
              →
            </span>
          </Link>
          <div className="flex flex-col gap-3 rounded-3xl bg-bianco p-7 md:p-10">
            <span className="fm-display text-[32px] leading-tight md:text-[40px]">Vieni a trovarci</span>
            <span className="text-[17px]">{farmacia.address.street}, Seregno. Anche in ZTL, gratis.</span>
            <div className="mt-2">
              <Button variant="cta" href="/ztl">
                Come arrivare
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
