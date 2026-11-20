import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { VisitInfo } from "@/components/VisitInfo";
import { ZtlTeaser } from "@/components/home/ZtlTeaser";

export const metadata: Metadata = {
  title: "La nuova Farmacia Masera",
  description:
    "La Farmacia Masera di Seregno si rinnova: il robot di magazzino, cinque postazioni al banco, una cabina analisi più ampia, la cabina Skin LAB e il banco cosmesi.",
};

// Testi dalla pagina ponte già pubblicata (design/sito-attuale/pagina-ponte-nuova-farmacia-masera.html).
// La data della reinaugurazione NON si pubblica finché non è ufficiale (BRIEF §7.5).
const novita = [
  { n: "1", t: "Il robot di magazzino", d: "Prepara i farmaci in pochi secondi: le farmaciste restano al banco con te, non tra gli scaffali.", href: "/robot", cta: "Entra nel robot" },
  { n: "5", t: "Postazioni al banco", d: "Più persone servite insieme, meno coda nelle ore di punta." },
  { n: "2", t: "Cabine dedicate", d: "Una cabina analisi più ampia per ECG, Holter, esami del sangue e pressione, e una cabina per l'analisi di pelle e capello.", href: "/servizi", cta: "Servizi e prezzi" },
  { n: "1", t: "Banco cosmesi", d: "Uno spazio dedicato alla dermocosmesi e a Skin LAB, con consulenza personalizzata.", href: "/skinlab", cta: "Scopri Skin LAB" },
];

export default function LaFarmaciaPage() {
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "La farmacia", href: "/la-farmacia" },
        ]}
      />
      <PageHeader
        kicker="La nuova Farmacia Masera"
        lines={["Più spazio, più servizi,", <span key="t" className="text-verde">più tempo per te.</span>]}
        lead="Dopo mesi di lavori, senza mai chiudere un giorno, la farmacia di famiglia si rinnova. Abbiamo ripensato ogni spazio per farti aspettare meno e dedicarti più attenzione."
      />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Image
          src="/img/spazi-banco.webp"
          alt="Il nuovo banco della farmacia, con le postazioni e gli scaffali sullo sfondo."
          width={1600}
          height={1200}
          priority
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="aspect-[4/3] w-full rounded-[32px] object-cover md:aspect-[16/8]"
        />
      </div>

      <section aria-labelledby="novita-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <h2 id="novita-t" className="fm-display text-[36px] leading-tight md:text-[48px]">
          Cosa trovi di nuovo
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {novita.map((x, i) => (
            <Reveal as="li" key={x.t} delay={i * 150}>
              <div className="flex h-full flex-col rounded-3xl bg-bianco p-6">
                <span className="fm-display text-[64px] leading-none text-verde">{x.n}</span>
                <h3 className="mt-3 text-[20px] font-semibold">{x.t}</h3>
                <p className="mt-2 text-[16px] leading-relaxed">{x.d}</p>
                {x.href && (
                  <Link href={x.href} className="fm-focus mt-auto inline-flex min-h-11 items-center pt-3 font-semibold text-verde underline decoration-2 underline-offset-4">
                    {x.cta} <span aria-hidden>&nbsp;→</span>
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section aria-label="Dietro il banco" className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { src: "/img/spazi-scivoli.webp", alt: "Gli scivoli a spirale che portano i farmaci dal robot al banco.", cap: "Gli scivoli portano i farmaci dal robot fino al banco." },
            { src: "/img/spazi-caricatore.webp", alt: "Il caricatore del robot Medistore, con lo schermo di controllo.", cap: "Il caricatore: da qui le confezioni entrano nel robot." },
          ].map((f) => (
            <figure key={f.src} className="overflow-hidden rounded-t-[999px] rounded-b-3xl bg-bianco">
              <Image src={f.src} alt={f.alt} width={1050} height={1400} sizes="(min-width: 768px) 600px, 100vw" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="p-5 text-[16px]">{f.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <ZtlTeaser />

      <section aria-label="La famiglia" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <Link href="/famiglia" className="fm-focus fm-press flex flex-col gap-2 rounded-3xl bg-beige-chiaro p-7 md:flex-row md:items-center md:justify-between md:p-10">
          <span>
            <span className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-verde">Dal 1908</span>
            <span className="fm-display mt-2 block text-[32px] leading-tight md:text-[40px]">Quattro generazioni, una sola missione.</span>
          </span>
          <span className="font-semibold text-verde underline decoration-2 underline-offset-4">
            La storia della famiglia <span aria-hidden>→</span>
          </span>
        </Link>
      </section>

      <VisitInfo />
    </>
  );
}
