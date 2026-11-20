import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { RobotTour } from "@/components/robot/RobotTour";
import { robotGallery, robotSpecs, robotStats } from "@/content/robot";

export const metadata: Metadata = {
  title: "Il robot · tour virtuale",
  description:
    "Dietro il banco della Farmacia Masera c'è un robot Medistore: custodisce i farmaci e li porta al banco da solo, così la farmacista resta sempre con te. Ecco come funziona, un pezzo alla volta.",
};

export default function RobotPage() {
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Il robot", href: "/robot" },
        ]}
      />
      <PageHeader
        kicker="Tour virtuale · dietro il banco"
        lines={["Dietro il banco", <span key="r" className="text-verde">c'è un robot.</span>]}
        lead="Si chiama Medistore ed è progettato e costruito in Italia. Custodisce i farmaci e li porta al banco da solo, così la farmacista non si allontana mai da te. Ecco come funziona, un pezzo alla volta."
      >
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {robotStats.map((s, i) => (
            <Reveal as="li" key={s.l} delay={i * 150}>
              <div className="h-full rounded-3xl bg-bianco p-5">
                <b className="fm-display block text-[36px] leading-none md:text-[44px]">{s.v}</b>
                <span className="mt-2 block text-[15px] text-verde">{s.l}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </PageHeader>

      <section aria-labelledby="come-t" className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 id="come-t" className="fm-display mb-6 text-[34px] leading-tight md:text-[44px]">
          Come funziona
        </h2>
        <RobotTour />
      </section>

      <section aria-labelledby="perche-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="rounded-3xl bg-verde-scuro p-7 text-carta md:p-10">
          <h2 id="perche-t" className="fm-display text-[32px] leading-tight md:text-[40px]">
            Perché un robot?
          </h2>
          <p className="mt-3 max-w-3xl text-[18px] leading-relaxed text-beige-chiaro">
            Per darti più tempo. Prima la farmacista doveva allontanarsi dal banco per cercare il farmaco tra cassetti e scaffali. Ora
            arriva da solo, in pochi secondi, e lei resta con te: ad ascoltarti, a consigliarti, a spiegarti come prenderlo.
          </p>
        </div>
      </section>

      <section aria-labelledby="vicino-t" className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 id="vicino-t" className="fm-display text-[34px] leading-tight md:text-[44px]">
          Da vicino.
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {robotGallery.map((g) => (
            <li key={g.img}>
              <figure className="overflow-hidden rounded-3xl bg-bianco">
                <Image src={g.img} alt={g.alt} width={900} height={1125} sizes="(min-width: 768px) 300px, 50vw" className="aspect-[4/5] w-full object-cover" />
                <figcaption className="p-4 text-[15px] font-semibold">{g.cap}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tech-t" className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <details className="group rounded-3xl border border-beige-chiaro bg-bianco">
          <summary className="fm-focus flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-6 py-5 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block text-[13px] font-semibold uppercase tracking-[0.14em] text-verde">Per gli appassionati</span>
              <span id="tech-t" className="fm-display mt-1 block text-[28px] leading-tight">
                La scheda tecnica
              </span>
            </span>
            <span aria-hidden className="text-[28px] text-verde transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <dl className="divide-y divide-beige-chiaro px-6 pb-4">
            {robotSpecs.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr] sm:gap-4">
                <dt className="text-[15px] font-semibold text-verde">{k}</dt>
                <dd className="text-[16px]">{v}</dd>
              </div>
            ))}
          </dl>
        </details>
      </section>

      <section aria-label="Vieni a vederlo" className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <div className="flex flex-col gap-4 rounded-3xl bg-beige-chiaro p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <p className="fm-display text-[30px] leading-tight md:text-[36px]">Vuoi vederlo dal vivo? Chiedi al banco.</p>
          <Button variant="primario" href="/ztl" className="shrink-0">
            Come arrivare, anche in ZTL
          </Button>
        </div>
      </section>
    </>
  );
}
