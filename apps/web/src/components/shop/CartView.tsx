"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { displayPrice, formatEuro, normalizeMobile, PAYMENT_LABELS, quoteDelivery, type ShopItem } from "@masera/core";
import { useCart } from "./CartProvider";

const field = "fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-4 text-[17px]";

/** "Metti da parte": il cliente lo ritira in farmacia. In prova non si salva niente. */
function SetAside({ item }: { item: ShopItem }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);
  const ok = name.trim().length >= 3 && !!normalizeMobile(phone) && privacy;

  if (done) {
    return (
      <div role="status" className="rounded-3xl bg-verde-scuro p-6 text-carta">
        <b className="block text-[20px]">Lo teniamo da parte per te.</b>
        <span className="mt-1 block text-[16px]">{item.name}: ti avvisiamo quando è pronto al banco.</span>
        <span className="mt-3 inline-block rounded-full bg-mela px-3 py-1 text-[14px] font-semibold text-verde-scuro">Prova: la richiesta non è stata salvata.</span>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (ok) setDone(true);
      }}
      className="space-y-4 rounded-3xl border-2 border-verde-scuro/15 bg-bianco p-6"
      noValidate
    >
      <h2 className="text-[20px] font-bold">Metti da parte: {item.name}</h2>
      <p className="text-[16px]">Lo teniamo per te in farmacia, in via Garibaldi 103. Paghi quando lo ritiri.</p>
      <div>
        <label htmlFor="md-nome" className="block text-[16px] font-semibold">
          Nome e cognome
        </label>
        <input id="md-nome" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={tried && name.trim().length < 3} className={field} />
      </div>
      <div>
        <label htmlFor="md-tel" className="block text-[16px] font-semibold">
          Cellulare
        </label>
        <input id="md-tel" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={tried && !normalizeMobile(phone)} className={field} />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-[16px]">
        <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="fm-focus mt-0.5 size-6 shrink-0 accent-[var(--color-verde-scuro)]" />
        <span>
          Ho letto l&apos;
          <Link href="/privacy" target="_blank" className="font-semibold underline underline-offset-4">
            informativa privacy
          </Link>
          .
        </span>
      </label>
      {tried && !ok && (
        <p role="alert" className="text-[15px] font-semibold text-[#9b2c1f]">
          Scrivi nome e cognome, un cellulare italiano e spunta l&apos;informativa.
        </p>
      )}
      <button type="submit" className="fm-focus fm-press min-h-12 rounded-full bg-verde-scuro px-6 text-[16px] font-bold text-carta">
        Mettilo da parte
      </button>
    </form>
  );
}

export function CartView({ nowIso, setAside }: { nowIso: string; setAside: ShopItem | null }) {
  const cart = useCart();
  const [zip, setZip] = useState("");
  const [now, setNow] = useState(() => new Date(nowIso));
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  const { subtotalEur, savedEur, pieces } = cart.totals;
  const q = zip.trim().length === 5 ? quoteDelivery({ zip, subtotalEur, now }) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="min-w-0 space-y-6">
        {setAside && <SetAside item={setAside} />}

        {cart.lines.length === 0 ? (
          <p className="rounded-3xl bg-beige-chiaro/60 p-6 text-[17px]">
            Il carrello è vuoto. <Link href="/shop" className="font-semibold underline underline-offset-4">Torna allo shop</Link>.
          </p>
        ) : (
          <ul className="divide-y divide-verde-scuro/10 rounded-3xl bg-bianco px-5">
            {cart.lines.map((l) => {
              const p = displayPrice(l.item);
              return (
                <li key={l.handle} className="flex flex-wrap items-center gap-3 py-4">
                  <Link href={`/prodotto/${l.handle}`} className="fm-focus min-w-0 flex-1 text-[16px] font-semibold hover:underline">
                    {l.item.name}
                    <span className="block text-[14px] font-normal text-verde">
                      {p.price}
                      {p.full && (
                        <>
                          {" "}
                          · <s>{p.full}</s> {p.badge}
                        </>
                      )}
                    </span>
                  </Link>
                  <label className="sr-only" htmlFor={`q-${l.handle}`}>
                    Quantità di {l.item.name}
                  </label>
                  <select
                    id={`q-${l.handle}`}
                    value={l.qty}
                    onChange={(e) => cart.setQty(l.item, Number(e.target.value))}
                    className="fm-focus min-h-11 rounded-xl border-2 border-verde-scuro/25 bg-bianco px-3 text-[16px]"
                  >
                    {Array.from({ length: Math.min(l.item.stock, 10) + 1 }, (_, n) => (
                      <option key={n} value={n}>
                        {n === 0 ? "Togli" : n}
                      </option>
                    ))}
                  </select>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {cart.lines.length > 0 && (
        <aside aria-label="Riepilogo" className="h-fit space-y-4 rounded-3xl bg-beige-chiaro/60 p-6">
          <dl className="grid grid-cols-[1fr_auto] gap-y-1 text-[17px]">
            <dt>Prodotti ({pieces})</dt>
            <dd className="font-bold">{formatEuro(subtotalEur)}</dd>
            {savedEur > 0 && (
              <>
                <dt className="text-verde">Risparmi con le promo</dt>
                <dd className="text-verde">{formatEuro(savedEur)}</dd>
              </>
            )}
          </dl>
          <div>
            <label htmlFor="cart-cap" className="block text-[16px] font-semibold">
              CAP di consegna
            </label>
            <input id="cart-cap" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value)} className={field} />
          </div>
          <div aria-live="polite">
            {q && !q.ok && <p className="text-[15px] font-semibold text-[#9b2c1f]">{q.message}</p>}
            {q && q.ok && (
              <div className="space-y-2 text-[16px]">
                <p>
                  <b>{q.zone === "seregno" ? "Seregno" : "Resto d'Italia"}</b> · arriva {q.zone === "italia" ? `in ${q.eta}` : q.eta}
                </p>
                <p>
                  Spedizione: <b>{q.shippingEur === null ? "[DA CONFERMARE]" : q.shippingEur === 0 ? "gratis" : formatEuro(q.shippingEur)}</b>
                </p>
                <p>
                  Totale: <b>{q.totalEur === null ? "[DA CONFERMARE]" : formatEuro(q.totalEur)}</b>
                </p>
                <p className="text-[15px]">Pagamento: {q.payments.map((p) => PAYMENT_LABELS[p]).join(" · ")}</p>
                {q.zone === "italia" && !q.free && <p className="text-[15px] text-verde">{q.notes[0]}</p>}
              </div>
            )}
          </div>
          <button type="button" aria-disabled className="min-h-12 w-full cursor-not-allowed rounded-full bg-beige-chiaro px-6 text-[16px] font-bold text-verde">
            Vai al pagamento
          </button>
          <p className="text-[14px]">Shop di prova: il pagamento arriverà con il negozio Shopify della farmacia.</p>
        </aside>
      )}
    </div>
  );
}
