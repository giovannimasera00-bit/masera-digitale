"use client";
import "../prenota/prenota.css";
import "./my.css";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  barsFromModules, CONSENT_LABELS, creditAvailable, creditExpiry, currentConsents, ean13Modules, formatCardNumber, formatDay, formatEuro,
  loyaltyProgress, normalizeMobile, recordConsent, type ConsentPurpose, type ConsentRecord,
} from "@masera/core";

// ——— Dati FINTI del profilo di prova ———
const DEMO = {
  name: "Cliente di prova",
  card: "8001234567897",
  points: 130,
  /** Soglia del buono di prova: quella vera arriva dal programma fedeltà [DA CONFERMARE]. */
  threshold: 200,
  credit: [{ amountEur: 15, date: "2026-11-10" }],
  creditUsed: 0,
};
type Row = { tag: string; title: string; sub: string; badge: string; strong?: boolean; href?: string };
const TABS: { key: string; label: string; rows: Row[] }[] = [
  {
    key: "agenda",
    label: "Agenda",
    rows: [
      { tag: "3 dic", title: "Elettrocardiogramma (prova)", sub: "giovedì 3 dicembre · 9:30 · Cabina analisi", badge: "Confermato" },
      { tag: "15 dic", title: "Analisi della pelle (prova)", sub: "martedì 15 dicembre · 17:00 · Skin LAB", badge: "Sposta o annulla", href: "/prenota" },
    ],
  },
  {
    key: "ordini",
    label: "Ordini",
    rows: [
      { tag: "🛍", title: "Ordine M-1001 (prova)", sub: "2 prodotti · consegna a Seregno", badge: "In viaggio" },
      { tag: "⏸", title: "Messo da parte (prova)", sub: "Crema viso · ritiro in farmacia", badge: "Pronto al banco" },
    ],
  },
  {
    key: "ricette",
    label: "Ricette",
    rows: [
      { tag: "Rx", title: "Preparazione galenica (prova)", sub: "Foto inviata · preventivo pronto", badge: "Approva", strong: true },
      { tag: "Rx", title: "Ricetta elettronica (prova)", sub: "Pronta, ritiro o consegna oggi", badge: "Pronta" },
    ],
  },
  {
    key: "referti",
    label: "Referti",
    rows: [
      { tag: "PDF", title: "Emoglobina glicata (prova)", sub: "Referto del 12 novembre", badge: "Apri" },
      { tag: "PDF", title: "Elettrocardiogramma (prova)", sub: "Referto del 4 novembre", badge: "Apri" },
    ],
  },
];

function Card({ flipped, onFlip }: { flipped: boolean; onFlip: () => void }) {
  const bars = barsFromModules(ean13Modules(DEMO.card)!);
  return (
    <div className="my-scene">
      <button type="button" onClick={onFlip} aria-pressed={flipped} aria-label={flipped ? "Carta fedeltà: codice a barre. Tocca per vedere i punti" : "Carta fedeltà: punti. Tocca per il codice a barre"} className={`fm-focus my-card ${flipped ? "my-flipped" : ""}`}>
        <span className="my-face flex flex-col justify-between rounded-3xl bg-[radial-gradient(120%_140%_at_90%_0%,#425D3A_0%,#2E3F2D_55%,#1a2419_100%)] p-6 text-left text-carta shadow-[0_18px_36px_rgba(31,43,30,.3)]">
          <span className="flex items-center justify-between">
            <span className="text-[15px] font-bold">Farmacia Masera</span>
            <span className="text-[11px] font-bold tracking-[0.18em]">CARTA FEDELTÀ</span>
          </span>
          <span className="flex items-end justify-between">
            <span>
              <span className="block text-[14px] opacity-80">{DEMO.name}</span>
              <span className="fm-display text-[40px] leading-none">{DEMO.points}</span>
              <span className="text-[14px]"> punti</span>
            </span>
            <span className="text-[13px] opacity-80">Tocca per il codice</span>
          </span>
        </span>
        <span className="my-face my-back flex flex-col items-center justify-center gap-3 rounded-3xl border border-[#E2DED2] bg-[#F4F1E8] p-6">
          <svg viewBox="0 0 113 60" className="h-[88px] w-[290px] max-w-full" role="img" aria-label={`Codice a barre ${DEMO.card}`}>
            <g fill="#1D1D1B">
              {bars.map((b) => (
                <rect key={b.x} x={b.x + 9} y="0" width={b.w} height="60" />
              ))}
            </g>
          </svg>
          <span className="font-mono text-[16px] tracking-[0.12em] text-nero">{formatCardNumber(DEMO.card)}</span>
        </span>
      </button>
    </div>
  );
}

function Consents() {
  const [history, setHistory] = useState<ConsentRecord[]>([
    { purpose: "prenotazioni", granted: true, at: "2026-11-10T09:00:00Z", textVersion: "prova-1", channel: "sito" },
  ]);
  const cur = currentConsents(history);
  return (
    <ul className="space-y-2">
      {(Object.keys(CONSENT_LABELS) as ConsentPurpose[]).map((p) => {
        const l = CONSENT_LABELS[p];
        const on = cur[p]?.granted === true;
        return (
          <li key={p} className="flex items-start justify-between gap-3 rounded-2xl bg-bianco p-4">
            <span className="min-w-0">
              <b className="block text-[16px]">{l.title}</b>
              <span className="block text-[14px] text-verde">{l.text}</span>
              {cur[p] && <span className="mt-1 block text-[12px] text-verde">Ultima scelta: {formatDay(cur[p]!.at.slice(0, 10)).long} · testo {cur[p]!.textVersion} · dal {cur[p]!.channel}</span>}
            </span>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[14px] font-semibold">
              <input
                type="checkbox"
                role="switch"
                checked={on}
                disabled={l.required}
                onChange={(e) => setHistory((h) => recordConsent(h, { purpose: p, granted: e.target.checked, at: new Date().toISOString(), textVersion: "prova-1", channel: "sito" }))}
                className="fm-focus size-6 accent-[var(--color-verde-scuro)]"
              />
              <span className="sr-only">{l.title}: </span>
              {on ? "Sì" : "No"}
            </label>
          </li>
        );
      })}
      <li className="px-1 text-[13px] text-verde">Ogni scelta resta nello storico con data, versione del testo e canale. Il consenso per gli appuntamenti serve al servizio.</li>
    </ul>
  );
}

function Login({ onIn }: { onIn: () => void }) {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const field = "fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-4 text-[17px]";
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!sent) {
          if (!normalizeMobile(phone)) return setErr("Scrivi un numero di cellulare italiano, per esempio 333 123 4567.");
          setErr(null);
          setSent(true);
        } else if (code.replace(/\D/g, "") === "000000") onIn();
        else setErr("Codice sbagliato. In prova il codice è 000000.");
      }}
      className="mx-auto max-w-md space-y-4 rounded-[32px] bg-bianco p-6 md:p-8"
    >
      <h2 className="fm-display text-[30px] leading-tight">Entra in MyMasera</h2>
      <p className="text-[16px]">Niente password: ti mandiamo un codice sul cellulare.</p>
      {!sent ? (
        <div>
          <label htmlFor="my-tel" className="block text-[16px] font-semibold">
            Cellulare
          </label>
          <input id="my-tel" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
        </div>
      ) : (
        <div>
          <label htmlFor="my-code" className="block text-[16px] font-semibold">
            Codice di 6 cifre
          </label>
          <input id="my-code" inputMode="numeric" autoComplete="one-time-code" maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} className={field} />
          <p className="mt-1 text-[14px] text-verde">Prova: non arriva nessun messaggio, il codice è 000000.</p>
        </div>
      )}
      {err && (
        <p role="alert" className="text-[15px] font-semibold text-[#9b2c1f]">
          {err}
        </p>
      )}
      <button type="submit" className="fm-focus fm-press min-h-12 w-full rounded-full bg-verde-scuro text-[17px] font-bold text-carta">
        {sent ? "Entra" : "Mandami il codice"}
      </button>
    </form>
  );
}

export function MyMaseraDemo({ today }: { today: string }) {
  const [inside, setInside] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [tab, setTab] = useState("agenda");
  const progress = loyaltyProgress(DEMO.points, DEMO.threshold);
  const credit = creditAvailable(DEMO.credit, DEMO.creditUsed, today);
  const rows = useMemo(() => TABS.find((t) => t.key === tab)?.rows ?? [], [tab]);

  if (!inside) return <Login onIn={() => setInside(true)} />;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <Card flipped={flipped} onFlip={() => setFlipped((f) => !f)} />

      <div className="pn-in grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-3xl bg-bianco p-4">
          <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden className="shrink-0">
            <circle cx="26" cy="26" r="21" fill="none" stroke="#EFECE4" strokeWidth="7" />
            <circle className="my-ring" pathLength={1} cx="26" cy="26" r="21" fill="none" stroke="#A3BE19" strokeWidth="7" strokeLinecap="round" transform="rotate(-90 26 26)" style={{ ["--my-left" as string]: String(1 - progress.ratio) }} />
          </svg>
          <span>
            <span className="block text-[13px] text-verde">Al prossimo buono</span>
            <b className="text-[15px]">{progress.label}</b>
          </span>
        </div>
        <div className="rounded-3xl bg-bianco p-4">
          <span className="block text-[13px] text-verde">Credito in farmacia</span>
          <b className="fm-display text-[26px]">{formatEuro(credit)}</b>
          <span className="block text-[12px] text-verde">valido fino a {formatDay(creditExpiry(DEMO.credit[0]!.date)).long} {creditExpiry(DEMO.credit[0]!.date).slice(0, 4)}</span>
        </div>
      </div>

      <div role="tablist" aria-label="Sezioni" className="flex gap-1 overflow-x-auto rounded-full bg-[#EFECE4] p-1">
        {[...TABS.map((t) => [t.key, t.label] as const), ["consensi", "Consensi"] as const].map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`fm-focus min-h-10 shrink-0 rounded-full px-4 text-[14px] font-bold ${tab === k ? "bg-bianco text-verde-scuro" : "text-[#5a5a55]"}`}>
            {l}
          </button>
        ))}
      </div>

      <div role="tabpanel" key={tab}>
        {tab === "consensi" ? (
          <Consents />
        ) : (
          <ul className="space-y-2">
            {rows.map((r, i) => (
              <li key={r.title} className="pn-in flex items-center gap-3 rounded-2xl bg-bianco p-4" style={{ animationDelay: `${i * 70}ms` }}>
                <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E6EDCB] text-[13px] font-bold text-verde-scuro">
                  {r.tag}
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-[15px]">{r.title}</b>
                  <span className="block text-[13px] text-[#5a5a55]">{r.sub}</span>
                </span>
                {r.href ? (
                  <Link href={r.href} className="fm-focus shrink-0 rounded-full bg-[#F4F1E8] px-3 py-1.5 text-[13px] font-bold text-verde-scuro">
                    {r.badge}
                  </Link>
                ) : (
                  <span className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] font-bold ${r.strong ? "bg-mela text-[#1a2419]" : "bg-[#F4F1E8] text-verde-scuro"}`}>{r.badge}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button type="button" onClick={() => setInside(false)} className="fm-focus text-[15px] font-semibold underline underline-offset-4">
        Esci
      </button>
    </div>
  );
}
