import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { legalUpdated } from "@/content/legale";

export const metadata: Metadata = {
  title: "Cookie",
  description: "Il sito della Farmacia Masera non usa cookie di profilazione né statistiche che ti tracciano.",
};

// Verificato sul codice: nessun cookie impostato dal sito, font serviti in locale, nessuna statistica,
// nessun contenuto esterno incorporato (Google Maps, WhatsApp e Instagram sono solo link).
// Quando arriveranno shop o statistiche serve il banner con "Rifiuta" facile quanto "Accetta" (BRIEF §17).
export default function CookiePage() {
  return (
    <LegalPage
      path="/cookie"
      crumb="Cookie"
      kicker="Cookie policy"
      title={["Niente cookie", <span key="t" className="text-verde">che ti seguono.</span>]}
      lead="Per questo oggi non ti chiediamo di accettare niente quando entri nel sito."
      updated={legalUpdated}
      sections={[
        {
          id: "cosa",
          title: "Cosa sono i cookie",
          body: (
            <p>
              Sono piccoli file che un sito salva nel tuo browser. Alcuni servono solo a far funzionare le pagine (cookie tecnici), altri servono a
              seguirti per statistiche o pubblicità (cookie di profilazione): questi ultimi richiedono il tuo consenso.
            </p>
          ),
        },
        {
          id: "nostri",
          title: "Quali usa questo sito",
          body: (
            <>
              <p>
                Il sito della Farmacia Masera <b>non usa cookie di profilazione</b> e <b>non usa strumenti di statistica</b> che ti tracciano. I caratteri
                sono caricati dai nostri server, senza contattare servizi esterni.
              </p>
              <p>Per questo non vedi il banner dei cookie: non c&apos;è niente da accettare. Solo l&apos;area riservata al personale della farmacia usa un cookie tecnico, che tiene aperto l&apos;accesso per 30 giorni.</p>
            </>
          ),
        },
        {
          id: "esterni",
          title: "Link ad altri siti",
          body: (
            <p>
              Alcuni pulsanti aprono servizi esterni: Google Maps, WhatsApp e Instagram. Sono semplici link: questi servizi entrano in gioco solo
              quando li apri, e da quel momento valgono le loro regole sui cookie e sulla privacy.
            </p>
          ),
        },
        {
          id: "browser",
          title: "Come gestire i cookie",
          body: (
            <p>
              Puoi vedere e cancellare i cookie dalle impostazioni del tuo browser (di solito nella sezione Privacy o Sicurezza). Per sapere come
              trattiamo i tuoi dati leggi l&apos;<Link href="/privacy">informativa privacy</Link>.
            </p>
          ),
        },
        {
          id: "novita",
          title: "Cosa cambierà",
          body: (
            <p>
              Quando arriveranno lo shop e l&apos;area clienti MyMasera potrebbero servire altri cookie. In quel caso ti chiederemo il consenso con un
              banner, dove &quot;Rifiuta&quot; sarà facile quanto &quot;Accetta&quot;, e aggiorneremo questa pagina.
            </p>
          ),
        },
      ]}
    />
  );
}
