"use client";
import Link from "next/link";
import { useState } from "react";
import { links, marquee } from "@/content/home";

/**
 * Striscia di servizi che scorre. Si ferma al passaggio del mouse, con il pulsante "Ferma"
 * (obbligatorio per l'accessibilità) e da sola con "riduci movimento".
 */
export function ServicesMarquee() {
  const [paused, setPaused] = useState(false);
  const items = [...marquee, ...marquee];
  return (
    <section aria-label="I nostri servizi" className="mt-14 border-y border-beige-chiaro bg-carta py-6 md:mt-20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-4 md:px-8">
        <Link href={links.servizi} className="fm-focus rounded-full text-[16px] font-semibold text-verde underline decoration-2 underline-offset-4">
          Servizi e prezzi <span aria-hidden>→</span>
        </Link>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="fm-focus fm-marquee-toggle min-h-11 rounded-full border-2 border-beige-scuro px-4 text-[15px] font-medium text-verde-scuro"
        >
          {paused ? "Fai scorrere" : "Ferma"}
        </button>
      </div>
      {/* Elenco leggibile per i lettori di schermo; la striscia animata è solo decorazione. */}
      <ul className="sr-only">
        {marquee.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <div aria-hidden className="overflow-hidden">
        <div className={`fm-marquee flex w-max gap-10 ${paused ? "is-paused" : ""}`}>
          {items.map((m, i) => (
            <span key={i} className="fm-display flex items-center gap-10 whitespace-nowrap text-[30px] text-verde-scuro md:text-[40px]">
              {m}
              <span className="size-2.5 rounded-full bg-mela" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
