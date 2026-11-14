import Image from "next/image";
import { farmacia } from "@masera/core";
import { Button } from "@masera/ui";
import { links } from "@/content/home";

// I passi arrivano da data/farmacia.json: titolo in grassetto + dettaglio.
const steps = [
  { t: "Entra in ZTL da via Garibaldi", d: "Il varco è all'incrocio con via Fratelli Cairoli." },
  { t: "Parcheggia negli spazi riservati", d: "Davanti alla farmacia, massimo 30 minuti." },
  { t: "Al banco comunica la targa", d: `Vale per ${farmacia.ztl.valid_for}.` },
];

export function ZtlTeaser() {
  return (
    <section id="ztl" aria-labelledby="ztl-t" className="scroll-mt-24 bg-verde-scuro text-carta">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-mela">Come arrivare</p>
          <h2 id="ztl-t" className="fm-display mt-3 text-[40px] leading-tight md:text-[52px]">
            In farmacia anche in ZTL. <span className="text-mela">Gratis.</span>
          </h2>
          <ol className="mt-8 space-y-5">
            {steps.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-mela text-[17px] font-bold text-verde-scuro">{i + 1}</span>
                <span className="text-[17px] leading-snug">
                  <b className="font-semibold">{s.t}</b>
                  <br />
                  <span className="text-beige-chiaro">{s.d}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="fm-display mt-8 text-[32px] text-mela">{farmacia.ztl.closing}</p>
          <Button variant="cta" href={links.ztl} className="mt-6">
            Vedi il percorso
          </Button>
        </div>
        <div className="overflow-hidden rounded-3xl ring-1 ring-carta/10">
          {/* Mappa statica provvisoria: la versione animata (componente ZtlMap) arriva con la pagina /ztl. */}
          <Image
            src="/ztl/mappa-statica.svg"
            alt="Mappa: da via Fratelli Cairoli si entra in ZTL al varco di via Garibaldi e si parcheggia davanti alla Farmacia Masera, via Garibaldi 103."
            width={800}
            height={440}
            className="h-auto w-full"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
