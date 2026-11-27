import type { Metadata } from "next";
import { addDays, FREE_SHIPPING_ITALY_EUR, ITALY_ETA, ITALY_SHIPPING_EUR, localNow, SEREGNO_CUTOFF, SEREGNO_ETA } from "@masera/core";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { DeliveryCalculator } from "@/components/consegne/DeliveryCalculator";
import { PageHeader } from "@/components/PageHeader";
import { agendaDbConfigured, fetchClosures } from "@/lib/agenda-db";

// Pagina delle regole di consegna. Non è ancora nel menu: lo shop è "in arrivo" (Fase 2).
export const metadata: Metadata = {
  title: "Consegne a domicilio",
  description: `A Seregno consegna gratuita in giornata per gli ordini entro le ${SEREGNO_CUTOFF}. In tutta Italia in ${ITALY_ETA}, gratis sopra ${FREE_SHIPPING_ITALY_EUR} €.`,
};
export const dynamic = "force-dynamic";

const rows: [string, string, string][] = [
  ["Tempi", `Ordine entro le ${SEREGNO_CUTOFF}, dal lunedì al sabato: arriva verso le ${SEREGNO_ETA}`, ITALY_ETA],
  ["Costo", "Sempre gratuita", `Gratuita sopra ${FREE_SHIPPING_ITALY_EUR} €; sotto: ${ITALY_SHIPPING_EUR === null ? "[DA CONFERMARE]" : `${ITALY_SHIPPING_EUR} €`}`],
  ["Pagamento", "Alla consegna, con carta o in contanti; anche online", "Online"],
  ["Dopo le 16 e di domenica", "Il primo giorno di consegna successivo, oppure ritiro in farmacia", "—"],
  ["Ricetta", "Sì, con la foto per il preventivo", "No"],
];

export default async function ConsegnePage() {
  const now = new Date();
  // Giorni di chiusura di tutta la farmacia (festivi e ferie segnati in agenda): niente consegne.
  let closedDates: string[] = [];
  if (agendaDbConfigured()) {
    const today = localNow(now).date;
    try {
      const closures = await fetchClosures(today, addDays(today, 60));
      closedDates = closures.filter((c) => !c.resource && c.from === undefined).map((c) => c.date);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Consegne", href: "/consegne" },
        ]}
      />
      <PageHeader
        kicker="Consegne a domicilio"
        lines={["A Seregno arriva stasera.", <span key="i" className="text-verde">In Italia in 2–3 giorni.</span>]}
        lead="Scrivi il tuo CAP e il totale: ti diciamo subito quanto costa, quando arriva e come puoi pagare."
      />
      <section aria-labelledby="calc-t" className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 id="calc-t" className="sr-only">
          Calcola la consegna
        </h2>
        <DeliveryCalculator nowIso={now.toISOString()} closedDates={closedDates} />
      </section>
      <section aria-labelledby="regole-t" className="mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-8">
        <h2 id="regole-t" className="fm-display text-[32px] leading-tight md:text-[40px]">
          Le regole, in breve
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-[16px]">
            <thead>
              <tr className="border-b-2 border-verde-scuro/20">
                <th scope="col" className="py-3 pr-4"><span className="sr-only">Voce</span></th>
                <th scope="col" className="py-3 pr-4">Seregno (CAP 20831, frazioni comprese)</th>
                <th scope="col" className="py-3">Resto d&apos;Italia</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, s, i]) => (
                <tr key={k} className="border-b border-verde-scuro/10 align-top">
                  <th scope="row" className="py-3 pr-4 font-semibold">{k}</th>
                  <td className="py-3 pr-4">{s}</td>
                  <td className="py-3">{i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
