"use client";
import { useEffect, useMemo, useState } from "react";
import { formatEuro, PAYMENT_LABELS, quoteDelivery } from "@masera/core";

/** Prova delle regole di consegna: CAP + importo del carrello → costo, tempi, pagamenti. */
export function DeliveryCalculator({ nowIso, closedDates }: { nowIso: string; closedDates: string[] }) {
  const [zip, setZip] = useState("20831");
  const [amount, setAmount] = useState("35");
  const [now, setNow] = useState(() => new Date(nowIso));

  // L'ora conta (le 16:00): si aggiorna ogni minuto.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const subtotal = Number(amount.replace(",", "."));
  const q = useMemo(
    () => quoteDelivery({ zip, subtotalEur: Number.isFinite(subtotal) ? subtotal : 0, now, closedDates }),
    [zip, subtotal, now, closedDates],
  );

  const field = "fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-4 text-[17px]";
  return (
    <div className="grid gap-6 rounded-[32px] bg-beige-chiaro/60 p-6 md:grid-cols-[1fr_1.4fr] md:p-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="cg-cap" className="block text-[16px] font-semibold">
            CAP di consegna
          </label>
          <input id="cg-cap" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="cg-tot" className="block text-[16px] font-semibold">
            Totale dei prodotti (€)
          </label>
          <input id="cg-tot" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={field} />
        </div>
      </div>

      <div aria-live="polite" className="rounded-3xl bg-bianco p-6">
        {!q.ok ? (
          <p className="text-[17px] font-semibold text-[#9b2c1f]">{q.message}</p>
        ) : (
          <>
            <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-verde">{q.zone === "seregno" ? "Seregno" : "Resto d'Italia"}</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[17px]">
              <dt className="text-verde">Spedizione</dt>
              <dd className="font-bold">{q.shippingEur === null ? "[DA CONFERMARE]" : q.shippingEur === 0 ? "Gratis" : formatEuro(q.shippingEur)}</dd>
              <dt className="text-verde">Totale</dt>
              <dd className="font-bold">{q.totalEur === null ? "[DA CONFERMARE]" : formatEuro(q.totalEur)}</dd>
              <dt className="text-verde">Arriva</dt>
              <dd>{q.eta}</dd>
              <dt className="text-verde">Pagamento</dt>
              <dd>{q.payments.map((p) => PAYMENT_LABELS[p]).join(" · ")}</dd>
              <dt className="text-verde">Ricette</dt>
              <dd>{q.prescriptions ? "Sì, con la foto per il preventivo" : "No, solo a Seregno"}</dd>
            </dl>
            <ul className="mt-4 space-y-1 border-t border-verde-scuro/10 pt-4 text-[15px]">
              {q.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
