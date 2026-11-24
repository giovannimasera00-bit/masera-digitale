import type { Metadata } from "next";
import { Button } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { BustineStrip } from "@/components/deblistering/BustineStrip";
import { CostCalculator } from "@/components/deblistering/CostCalculator";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { chiacchierataInfo, deblisteringFor, deblisteringPrice, deblisteringSteps, prenotaChiacchierata } from "@/content/galenico";
import { links } from "@/content/home";

// Regola fissa: nessun nome di fornitore del software del deblistering.
export const metadata: Metadata = {
  title: "Deblistering · la terapia in bustine",
  description: `La terapia pronta, ordinata e controllata dalla Farmacia Masera di Seregno: le compresse divise in bustine per giorno e momento della giornata. ${deblisteringPrice.day} al giorno.`,
};

export default function DeblisteringPage() {
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Servizi", href: "/servizi" },
          { label: "Deblistering", href: "/deblistering" },
        ]}
      />
      <PageHeader
        kicker="Deblistering · la terapia in bustine"
        lines={["La terapia pronta,", <span key="o" className="text-verde">ordinata e controllata.</span>]}
        lead="Togliamo le compresse dai blister e le dividiamo in bustine, una per ogni momento della giornata. Tu apri la bustina giusta all'ora giusta: al resto pensa la farmacia."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="primario" href={prenotaChiacchierata}>
            Prenota la chiacchierata gratuita
          </Button>
          <Button variant="secondario" href="#costo">
            Quanto costa
          </Button>
        </div>
      </PageHeader>

      <section aria-labelledby="prezzo-t" className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 rounded-[40px] bg-verde-scuro p-7 text-carta md:grid-cols-[1fr_1.3fr] md:items-center md:p-12">
          <div>
            <h2 id="prezzo-t" className="sr-only">
              Il prezzo
            </h2>
            <p className="fm-display text-[72px] leading-none md:text-[96px]">{deblisteringPrice.day}</p>
            <p className="mt-2 text-[20px] font-semibold">al giorno, meno di un caffè.</p>
            <p className="mt-2 text-[16px] text-beige-chiaro">{deblisteringPrice.month} al mese, per 4 settimane di bustine.</p>
          </div>
          <BustineStrip />
        </div>
      </section>

      <section aria-labelledby="passi-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <h2 id="passi-t" className="fm-display text-[34px] leading-tight md:text-[48px]">
          Come funziona, in 4 passi.
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {deblisteringSteps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 150} className="h-full">
              <div className="h-full rounded-3xl bg-bianco p-6">
                <span className="fm-display block text-[40px] leading-none text-verde">{s.n}</span>
                <h3 className="mt-3 text-[19px] font-semibold">{s.t}</h3>
                <p className="mt-2 text-[16px] leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="costo" aria-labelledby="costo-t" className="scroll-mt-28 bg-beige-chiaro/50">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <h2 id="costo-t" className="fm-display text-[34px] leading-tight md:text-[48px]">
            Quanto costa davvero.
          </h2>
          <p className="mt-2 max-w-2xl text-[17px] text-verde">Scegli il periodo e per quante persone: il conto si fa da solo.</p>
          <div className="mt-8">
            <CostCalculator />
          </div>
        </div>
      </section>

      <section aria-labelledby="per-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <h2 id="per-t" className="fm-display text-[34px] leading-tight md:text-[48px]">
          Per chi è.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {deblisteringFor.map((f, i) => (
            <Reveal key={f.t} delay={i * 150} className="h-full">
              <article className="h-full rounded-3xl bg-bianco p-7">
                <h3 className="fm-display text-[26px] leading-tight">{f.t}</h3>
                <p className="mt-3 text-[17px] leading-relaxed">{f.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-label="Prenota la chiacchierata" className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-beige-chiaro p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="fm-display text-[30px] leading-tight md:text-[36px]">Parliamone con calma, prima di cominciare.</p>
            <p className="mt-2 text-[16px] text-verde">Chiacchierata con la farmacista: {chiacchierataInfo}.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button variant="primario" href={prenotaChiacchierata}>
              Prenota
            </Button>
            <Button variant="secondario" href={links.whatsapp}>
              Scrivici su WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
