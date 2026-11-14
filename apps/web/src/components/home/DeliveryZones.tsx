import { FREE_SHIPPING_ITALY_EUR, SEREGNO_CUTOFF, SEREGNO_ETA } from "@masera/core";
import { ColorBar } from "@masera/ui";
import { features } from "@/content/home";

/** Le due strade di consegna. Regole da data/farmacia.json, uguali in tutto il sito. */
export function DeliveryZones() {
  return (
    <section aria-label="Come ti arriva l'ordine" className="mx-auto max-w-7xl px-4 md:px-8">
      {!features.shop && (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-beige-scuro px-4 py-2 text-[15px] font-medium">
          Lo shop online è in arrivo: ecco come funzioneranno le consegne.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-verde-scuro p-7 text-carta md:p-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-mela">Seregno</p>
          <h2 className="fm-display mt-3 text-[36px] leading-tight md:text-[44px]">Oggi stesso, gratis.</h2>
          <p className="mt-3 max-w-md text-[17px] leading-relaxed text-beige-chiaro">
            Ordini entro le {SEREGNO_CUTOFF}, da lunedì a sabato, e verso le {SEREGNO_ETA} è a casa tua. Paghi alla consegna, con POS o
            in contanti. Solo a Seregno puoi anche mandarci la ricetta.
          </p>
          <DeliveryVan />
        </div>
        <div className="rounded-3xl border border-beige-chiaro bg-bianco p-7 text-verde-scuro md:p-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-verde">Tutta Italia</p>
          <h2 className="fm-display mt-3 text-[36px] leading-tight md:text-[44px]">In 2–3 giorni lavorativi.</h2>
          <p className="mt-3 max-w-md text-[17px] leading-relaxed">
            Tutto quello che trovi in farmacia, ovunque in Italia, con il consiglio di una farmacista prima di comprare.
          </p>
          <div className="mt-8 rounded-2xl bg-carta p-4">
            <p className="text-[16px] font-medium">Spedizione gratuita sopra {FREE_SHIPPING_ITALY_EUR} €</p>
            <ColorBar className="mt-3" height={10} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Piccolo furgone sulla strada: puramente decorativo, fermo con "riduci movimento". */
function DeliveryVan() {
  return (
    <svg aria-hidden viewBox="0 0 400 60" className="mt-8 w-full max-w-md" fill="none">
      <path d="M0 48H400" stroke="var(--color-carta)" strokeOpacity=".25" strokeWidth="2" strokeDasharray="10 10" className="fm-road" />
      <g className="fm-van">
        <rect x="8" y="16" width="44" height="26" rx="5" fill="var(--color-carta)" />
        <path d="M52 22h12l8 10v10H52z" fill="var(--color-salvia)" />
        <circle cx="22" cy="44" r="5" fill="var(--color-mela)" />
        <circle cx="60" cy="44" r="5" fill="var(--color-mela)" />
      </g>
    </svg>
  );
}
