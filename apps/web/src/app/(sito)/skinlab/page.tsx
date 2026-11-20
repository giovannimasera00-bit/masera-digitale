import type { Metadata } from "next";
import Link from "next/link";
import { ColorBar, ComingSoon, RiseTitle } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { ReportExample } from "@/components/skinlab/ReportExample";
import { SkinlabTabs } from "@/components/skinlab/SkinlabTabs";
import { features } from "@/content/home";
import { cabinTreatments, prenotaViso, skinlabBrands, skinlabPrice, skinlabSteps } from "@/content/skinlab";

export const metadata: Metadata = {
  title: "Skin LAB · analisi della pelle",
  description: `Skin LAB by Farmacia Masera: analisi strumentale della pelle del viso con la farmacista, ${skinlabPrice} scalabili sull'acquisto dei prodotti consigliati, e una routine fatta per te. Seregno.`,
};

export default function SkinlabPage() {
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Skin LAB", href: "/skinlab" },
        ]}
      />

      {/* Hero nei colori tortora di Skin LAB */}
      <section aria-label="Skin LAB" className="relative mx-auto mt-6 max-w-7xl overflow-hidden px-4 md:px-8">
        <div className="relative overflow-hidden rounded-[40px] bg-tortora-4 px-6 py-10 text-carta md:px-12 md:py-16">
          <svg aria-hidden viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice" className="fm-arch is-in pointer-events-none absolute inset-0 h-full w-full" fill="none" stroke="#D6D2C4" strokeOpacity=".25" strokeWidth="1.6">
            <path pathLength={1} d="M560 640V430a420 420 0 0 1 840 0V640" />
            <path pathLength={1} d="M640 640V440a340 340 0 0 1 680 0V640" />
            <path pathLength={1} d="M720 640V450a260 260 0 0 1 520 0V640" />
          </svg>
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="flex items-baseline gap-2" aria-label="Skin LAB by Farmacia Masera">
                <span className="fm-display text-[44px] leading-none">Skin</span>
                <span className="text-[36px] font-light tracking-[0.12em]">LAB</span>
              </p>
              <p className="mt-1 text-[13px] font-semibold uppercase tracking-[0.2em] text-tortora-1">by Farmacia Masera</p>
              <RiseTitle as="h1" className="mt-8 text-[38px] leading-[1.05] md:text-[56px]" lines={["Prima guardiamo la tua pelle.", "Poi scegliamo insieme."]} />
              <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-tortora-1">
                Un&apos;analisi strumentale del viso con la farmacista, i risultati spiegati semplici e una routine fatta per te.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href={prenotaViso} className="fm-focus fm-press inline-flex min-h-12 items-center rounded-full bg-carta px-6 text-[17px] font-semibold text-tortora-4">
                  Prenota l&apos;analisi · {skinlabPrice}
                </a>
                <span className="max-w-xs text-[15px] text-tortora-1">I {skinlabPrice} li scali dall&apos;acquisto dei prodotti consigliati.</span>
              </div>
            </div>
            <ReportExample />
          </div>
        </div>
      </section>

      <section aria-labelledby="come-t" className="mx-auto max-w-7xl px-4 py-16 text-tortora-4 md:px-8 md:py-24">
        <h2 id="come-t" className="fm-display text-[36px] leading-tight md:text-[48px]">
          Come funziona.
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {skinlabSteps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 150}>
              <div className="h-full rounded-3xl bg-bianco p-6 md:p-7">
                <span className="fm-display text-[44px] leading-none text-tortora-3">{s.n}</span>
                <h3 className="mt-3 text-[20px] font-semibold">{s.t}</h3>
                <p className="mt-2 text-[16px] leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-label="Le analisi e la routine" className="mx-auto grid max-w-7xl gap-4 px-4 md:px-8 lg:grid-cols-2">
        <SkinlabTabs />
        <div className="flex flex-col rounded-3xl bg-tortora-1 p-6 text-tortora-4 md:p-8">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em]">Dopo l&apos;analisi</p>
          <h2 className="fm-display mt-3 text-[32px] leading-tight md:text-[40px]">La tua routine, nel telefono.</h2>
          <p className="mt-3 text-[17px] leading-relaxed">
            La farmacista segna i prodotti che ti ha consigliato, quanto usarne e quando. Presto la ritroverai nell&apos;app MyMasera, mattina e
            sera, e potrai spuntare i passaggi man mano.
          </p>
          <div className="mt-auto pt-6">{features.mymasera ? null : <ComingSoon label="SkinLab Routine" className="!border-tortora-4/40" />}</div>
        </div>
      </section>

      <section aria-labelledby="cabina-t" className="mx-auto max-w-7xl px-4 py-16 text-tortora-4 md:px-8 md:py-24">
        <div className="rounded-3xl bg-bianco p-6 md:p-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-tortora-3">Il passo in più</p>
          <h2 id="cabina-t" className="fm-display mt-3 text-[32px] leading-tight md:text-[40px]">
            Un trattamento in cabina, al piano di sopra.
          </h2>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed">
            Se la tua pelle ne ha bisogno, dalla routine puoi passare a un trattamento nella Miamo Lounge di Farmaestetica by Dottor Masera.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {cabinTreatments.map((t) => (
              <li key={t.name} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-tortora-1 p-5">
                <span>
                  <b className="fm-display block text-[26px]">{t.name}</b>
                  <span className="text-[15px]">{t.for}</span>
                </span>
                <span className="text-right text-[15px] font-semibold">
                  {t.price}
                  <span className="block font-normal">{t.duration}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/farmaestetica" className="fm-focus mt-6 inline-flex min-h-11 items-center font-semibold text-tortora-4 underline decoration-2 underline-offset-4">
            Scopri Farmaestetica <span aria-hidden>&nbsp;→</span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="marchi-t" className="mx-auto max-w-7xl px-4 pb-8 text-tortora-4 md:px-8">
        <p id="marchi-t" className="text-[13px] font-semibold uppercase tracking-[0.16em] text-tortora-3">
          I marchi che usiamo per le routine
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {skinlabBrands.map((b) => (
            <li key={b} className="rounded-full border border-tortora-2 px-4 py-2 text-[15px] font-medium">
              {b}
            </li>
          ))}
        </ul>
        <ColorBar className="mt-10 max-w-[220px]" height={6} />
      </section>
    </>
  );
}
