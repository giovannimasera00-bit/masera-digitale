import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { legalUpdated, titolare } from "@/content/legale";

export const metadata: Metadata = {
  title: "Note legali e dati della farmacia",
  description: "Ragione sociale, sede, partita IVA e responsabile della Farmacia Masera di Seregno.",
};

export default function NoteLegaliPage() {
  const rows: [string, string][] = [
    ["Ragione sociale", titolare.nome],
    ["Sede", titolare.sede],
    ["Partita IVA", titolare.piva],
    ["PEC", titolare.pec],
    ["Direttore responsabile", titolare.direttore],
    ["Iscrizione all'Ordine", titolare.ordine],
  ];
  return (
    <LegalPage
      path="/note-legali"
      crumb="Note legali"
      kicker="Note legali"
      title={["I dati", <span key="t" className="text-verde">della farmacia.</span>]}
      lead="Chi siamo, per la legge."
      updated={legalUpdated}
      sections={[
        {
          id: "dati",
          title: "Dati della farmacia",
          body: (
            <dl className="divide-y divide-verde-scuro/10 rounded-3xl bg-bianco px-6">
              {rows.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[220px_1fr]">
                  <dt className="font-semibold">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          ),
        },
        {
          id: "salute",
          title: "Informazioni sulla salute",
          body: (
            <>
              <p>
                I contenuti del sito sono informazioni generali e non sostituiscono il parere del medico o del farmacista. Per un consiglio sulla tua
                situazione parlane con noi in farmacia o con il tuo medico.
              </p>
              <p>
                <b>In caso di emergenza chiama il 112.</b>
              </p>
            </>
          ),
        },
        {
          id: "vendita",
          title: "Vendita online",
          body: <p>Oggi il sito non vende online. Lo shop è in arrivo e non venderà farmaci: le condizioni di vendita saranno pubblicate qui prima dell&apos;apertura.</p>,
        },
        {
          id: "contenuti",
          title: "Testi, foto e marchi",
          body: (
            <p>
              Testi, foto, loghi e marchi del sito appartengono alla Farmacia Masera o a chi ne ha concesso l&apos;uso. Non si possono copiare o
              riutilizzare senza permesso.
            </p>
          ),
        },
      ]}
    />
  );
}
