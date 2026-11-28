"use client";
import { useMemo, useState } from "react";
import { formatEuro, paymentNote, riderRun, routeLinks, telHref, type Point, type RiderOrder, type RiderStatus } from "@masera/core";

const STATUS: Record<RiderStatus, string> = {
  da_preparare: "Da preparare",
  pronto: "Pronto",
  partito: "In viaggio",
  consegnato: "Consegnato",
  annullato: "Annullato",
};

/** Lista del rider: tappe in ordine, cosa incassare, "Partito" e "Consegnato". In prova lo stato resta solo in questa pagina. */
export function RiderList({ orders: initial, date, origin, start }: { orders: RiderOrder[]; date: string; origin: string; start: Point }) {
  const [orders, setOrders] = useState(initial);
  const [notice, setNotice] = useState<string | null>(null);
  const run = useMemo(() => riderRun(orders, date, [], start), [orders, date, start]);
  const delivered = orders.filter((o) => o.status === "consegnato");
  const set = (id: string, status: RiderStatus) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
  const btn = "fm-focus fm-press inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-bold";

  return (
    <div className="mt-6 space-y-6">
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Tappe", String(run.stops.length)],
          ["Contanti da incassare", formatEuro(run.cashEur)],
          ["Pagamenti col POS", String(run.posCount)],
          ["Pacchi sigillati", String(run.sealedCount)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-beige-chiaro/60 p-4">
            <dt className="text-[14px] text-verde">{k}</dt>
            <dd className="text-[26px] font-bold">{v}</dd>
          </div>
        ))}
      </dl>

      {run.stops.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setOrders((os) => os.map((o) => (run.stops.some((s) => s.id === o.id) && o.status === "pronto" ? { ...o, status: "partito" } : o)));
              setNotice("Giro partito. Il messaggio WhatsApp \"il rider sta arrivando\" partirà da solo quando colleghiamo WhatsApp (tappa 4B).");
            }}
            className={`${btn} bg-verde-scuro text-carta`}
          >
            Partito: avvisa tutti i pronti
          </button>
          {routeLinks(run.stops, origin).map((href, i, all) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={`${btn} border-2 border-verde-scuro/25 bg-bianco`}>
              Percorso su Maps{all.length > 1 ? ` (${i + 1}/${all.length})` : ""}
            </a>
          ))}
        </div>
      )}
      {notice && (
        <p role="status" className="rounded-2xl bg-mela/40 px-4 py-3 text-[15px]">
          {notice}
        </p>
      )}

      {run.outOfArea.length > 0 && (
        <p role="alert" className="rounded-2xl bg-[#f6dcd7] px-4 py-3 text-[15px]">
          <b>Da controllare:</b> {run.outOfArea.map((o) => o.number).join(", ")} ha un CAP fuori Seregno.
        </p>
      )}

      {run.stops.length === 0 ? (
        <p className="rounded-3xl bg-beige-chiaro/60 p-6 text-[17px]">Nessuna consegna da fare in questo giro.</p>
      ) : (
        <ol className="space-y-3">
          {run.stops.map((o, i) => (
            <li key={o.id} className={`rounded-3xl border-2 p-5 ${o.status === "partito" ? "border-mela bg-bianco" : "border-verde-scuro/10 bg-bianco"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-verde">
                    Tappa {i + 1} · {o.number} · {STATUS[o.status]}
                  </p>
                  <b className="mt-1 block text-[20px]">
                    {o.street} {o.houseNumber}
                  </b>
                  <span className="block text-[16px]">{o.customerName}</span>
                  {o.notes && <span className="block text-[15px] text-verde">{o.notes}</span>}
                  <span className="mt-2 block text-[16px] font-semibold">{paymentNote(o)}</span>
                  {o.sealed && <span className="mt-1 inline-block rounded-full bg-verde-scuro px-3 py-0.5 text-[13px] font-bold text-carta">Pacco sigillato dal farmacista</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={telHref(o.phone)} className={`${btn} border-2 border-verde-scuro/25 bg-bianco`}>
                    Chiama
                  </a>
                  {o.status === "da_preparare" && (
                    <button type="button" onClick={() => set(o.id, "pronto")} className={`${btn} bg-beige-chiaro`}>
                      Pronto
                    </button>
                  )}
                  <button type="button" onClick={() => set(o.id, "consegnato")} className={`${btn} bg-mela text-verde-scuro`}>
                    Consegnato
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {delivered.length > 0 && (
        <details className="rounded-2xl bg-bianco p-4">
          <summary className="fm-focus cursor-pointer text-[16px] font-semibold">Già consegnati ({delivered.length})</summary>
          <ul className="mt-2 space-y-1 text-[15px]">
            {delivered.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2">
                <span>
                  {o.number} · {o.street} {o.houseNumber}
                </span>
                <button type="button" onClick={() => set(o.id, "pronto")} className="fm-focus text-[14px] font-semibold underline underline-offset-4">
                  Annulla
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
