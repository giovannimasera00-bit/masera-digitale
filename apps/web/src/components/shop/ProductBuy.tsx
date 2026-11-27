"use client";
import "../prenota/prenota.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { availability, deliverySteps, maxQty, seregnoDelivery, type ShopItem } from "@masera/core";
import { useCart } from "./CartProvider";

/** Parte interattiva della scheda prodotto (canvas Prodotto): Seregno / Resto d'Italia, quantità, carrello, metti da parte. */
export function ProductBuy({ item, nowIso }: { item: ShopItem; nowIso: string }) {
  const cart = useCart();
  const [zone, setZone] = useState<"seregno" | "italia">("seregno");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [now, setNow] = useState(() => new Date(nowIso));
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const a = availability(item.stock);
  const max = maxQty(item.stock);
  const inCart = cart.lines.find((l) => l.handle === item.handle)?.qty ?? 0;
  const room = Math.max(0, max - inCart);
  const s = seregnoDelivery(now);
  const steps = deliverySteps(zone);
  if (zone === "seregno" && !s.today) steps[0] = { t: `Ordina ora, arriva ${s.when}`, d: "Dopo le 16:00 e di domenica entra nel giro successivo" };
  const cta = a.state === "esaurito" ? "Non disponibile" : zone === "seregno" && s.today ? "Aggiungi · arriva oggi" : "Aggiungi al carrello";

  const tab = (z: "seregno" | "italia", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={zone === z}
      onClick={() => setZone(z)}
      className={`fm-focus min-h-10 rounded-full px-3 text-[14px] font-bold ${zone === z ? "bg-verde-scuro text-carta" : "text-verde-scuro"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-[#E8E4D8] bg-bianco p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-verde">Consegna a</p>
          <div role="tablist" aria-label="Dove consegnare" className="flex gap-1 rounded-full bg-[#EFECE4] p-1">
            {tab("seregno", "Seregno")}
            {tab("italia", "Resto d'Italia")}
          </div>
        </div>
        <ol key={zone} role="tabpanel" className="pn-in relative space-y-3.5 pl-7">
          <span aria-hidden className="absolute bottom-1.5 left-[7px] top-1.5 w-0.5 bg-[linear-gradient(#A3BE19,#9AB9AD)]" />
          {steps.map((st, i) => (
            <li key={st.t} className="relative">
              <span aria-hidden className="absolute -left-[26px] top-1 size-3 rounded-full border-2" style={{ background: i === 0 ? "#A3BE19" : "#fff", borderColor: ["#A3BE19", "#9AB9AD", "#B7A999"][i] }} />
              <b className="block text-[15px]">{st.t}</b>
              <span className="block text-[14px] text-[#5a5a55]">{st.d}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className={`text-[15px] font-semibold ${a.state === "esaurito" ? "text-[#9b2c1f]" : "text-verde"}`}>{a.label}</p>

      <div className="flex gap-2.5">
        <div className="flex items-center rounded-full border border-[#E2DED2] bg-bianco px-1.5">
          <button type="button" aria-label="Togli uno" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="fm-focus h-12 w-11 text-[22px] text-verde-scuro disabled:opacity-40">
            −
          </button>
          <b aria-live="polite" className="w-6 text-center">
            <span className="sr-only">Quantità </span>
            {qty}
          </b>
          <button type="button" aria-label="Aggiungi uno" onClick={() => setQty((q) => Math.min(Math.max(1, room), q + 1))} disabled={qty >= room} className="fm-focus h-12 w-11 text-[22px] text-verde-scuro disabled:opacity-40">
            +
          </button>
        </div>
        <button
          type="button"
          disabled={room === 0}
          onClick={() => {
            cart.add(item, qty);
            setAdded(true);
            setQty(1);
          }}
          className="fm-focus fm-press min-h-14 flex-1 rounded-full bg-verde-scuro px-4 text-[16px] font-bold text-carta disabled:bg-beige-chiaro disabled:text-verde"
        >
          {room === 0 && a.state !== "esaurito" ? "Già tutti nel carrello" : cta}
        </button>
      </div>
      <p aria-live="polite" className="min-h-6 text-[15px] font-semibold text-verde">
        {added && (
          <>
            Aggiunto. <Link href="/carrello" className="underline underline-offset-4">Vai al carrello</Link>
          </>
        )}
      </p>

      {a.state !== "esaurito" && (
        <Link href={`/carrello?metti-da-parte=${item.handle}`} className="fm-focus block rounded-[18px] border-2 border-verde-scuro/20 px-4 py-3 text-[15px]">
          <b>Metti da parte</b>: lo teniamo per te in farmacia e lo ritiri quando passi.
        </Link>
      )}
    </div>
  );
}
