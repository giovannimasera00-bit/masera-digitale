import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { links } from "@/content/home";
import { legalUpdated } from "@/content/legale";
import { farmacia } from "@masera/core";

export const metadata: Metadata = {
  title: "Accessibilità",
  description: "Come abbiamo reso il sito della Farmacia Masera facile da usare per tutti, e come segnalarci un problema.",
};

export default function AccessibilitaPage() {
  return (
    <LegalPage
      path="/accessibilita"
      crumb="Accessibilità"
      kicker="Accessibilità"
      title={["Un sito facile", <span key="t" className="text-verde">per tutti.</span>]}
      lead="La farmacia è di tutti, anche online. Abbiamo costruito il sito per chi legge con fatica, per chi usa solo la tastiera e per chi usa un lettore di schermo."
      updated={legalUpdated}
      sections={[
        {
          id: "obiettivo",
          title: "Il nostro obiettivo",
          body: <p>Seguiamo le linee guida internazionali WCAG 2.1, livello AA.</p>,
        },
        {
          id: "fatto",
          title: "Cosa abbiamo fatto",
          body: (
            <ul>
              <li>Testi grandi e colori con un buon contrasto.</li>
              <li>Pulsanti grandi, facili da toccare anche dal telefono.</li>
              <li>Tutto il sito si usa anche solo con la tastiera, con il punto in cui ti trovi sempre visibile.</li>
              <li>Le immagini hanno una descrizione per chi usa un lettore di schermo.</li>
              <li>
                Se nelle impostazioni del telefono o del computer hai scelto di ridurre il movimento, le animazioni si fermano e vedi subito il
                risultato finale.
              </li>
            </ul>
          ),
        },
        {
          id: "limiti",
          title: "Cosa possiamo migliorare",
          body: <p>Il sito è nuovo e lo stiamo ancora completando. Se qualcosa non funziona come dovrebbe, vogliamo saperlo.</p>,
        },
        {
          id: "segnala",
          title: "Segnalaci un problema",
          body: (
            <p>
              Scrivici su <a href={links.whatsapp}>WhatsApp al {farmacia.whatsapp.replace("+39 ", "")}</a> dicendoci quale pagina e cosa non
              funziona. Ti rispondiamo e, se serve, ti diamo l&apos;informazione per un&apos;altra strada.
            </p>
          ),
        },
      ]}
    />
  );
}
