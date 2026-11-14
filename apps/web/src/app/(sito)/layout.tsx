import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusBar } from "@/components/StatusBar";

// Aperto ora e consegna dipendono dall'ora: le pagine del sito si calcolano a ogni visita.
export const dynamic = "force-dynamic";

/** Struttura comune a tutte le pagine pubbliche: barra di stato, menu, contenuto, piè di pagina. */
export default function SitoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenuto"
        className="fm-focus sr-only z-50 rounded-full bg-carta px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Vai al contenuto
      </a>
      <StatusBar />
      <SiteHeader />
      <main id="contenuto">{children}</main>
      <SiteFooter />
    </>
  );
}
