"use client";
import "../prenota/prenota.css";
import "./my.css";
import Link from "next/link";
import { consensoCarta, consensoMarketing, consensoMarketingIntro, INFORMATIVA_CARTA_VERSIONE } from "@/content/informativa-carta";
import { InformativaCarta } from "./InformativaCarta";
import { useMemo, useState } from "react";
import {
  barsFromModules, checkNewPassword, code128BModules, CONSENT_LABELS, creditAvailable, creditExpiry, currentConsents, formatCardNumber, formatDay, formatEuro,
  loyaltyProgress, normalizeCardCode, normalizeMobile, pointsValueEur, recordConsent, type ConsentPurpose, type ConsentRecord,
} from "@masera/core";

// ——— Dati FINTI del profilo di prova ———
const DEMO = {
  name: "Cliente di prova",
  card: "A12345",
  points: 130,
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

const cardModules = code128BModules(DEMO.card)!;
const cardBars = { bars: barsFromModules(cardModules), width: cardModules.length };

function Card({ flipped, onFlip }: { flipped: boolean; onFlip: () => void }) {
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
              <span className="text-[14px]"> punti = {formatEuro(pointsValueEur(DEMO.points))}</span>
            </span>
            <span className="text-[13px] opacity-80">Tocca per il codice</span>
          </span>
        </span>
        <span className="my-face my-back flex flex-col items-center justify-center gap-3 rounded-3xl border border-[#E2DED2] bg-[#F4F1E8] p-6">
          {/* Code 128, come sulle tessere stampate: la penna ottica del banco lo legge anche dal telefono. */}
          <span className="rounded-lg bg-bianco px-3 py-2">
            <svg viewBox={`0 0 ${cardBars.width + 20} 60`} className="h-[88px] w-[290px] max-w-full" role="img" aria-label={`Codice a barre della tessera ${DEMO.card}`} preserveAspectRatio="none">
              <g fill="#1D1D1B">
                {cardBars.bars.map((b) => (
                  <rect key={b.x} x={b.x + 10} y="0" width={b.w} height="60" />
                ))}
              </g>
            </svg>
          </span>
          <span className="font-mono text-[22px] font-bold tracking-[0.2em] text-nero">{formatCardNumber(DEMO.card)}</span>
        </span>
      </button>
    </div>
  );
}

function Consents() {
  const [history, setHistory] = useState<ConsentRecord[]>([
    { purpose: "carta", granted: true, at: "2026-11-10T09:00:00Z", textVersion: INFORMATIVA_CARTA_VERSIONE, channel: "banco_cartaceo" },
    { purpose: "marketing", granted: false, at: "2026-11-10T09:00:00Z", textVersion: INFORMATIVA_CARTA_VERSIONE, channel: "banco_cartaceo" },
    { purpose: "prenotazioni", granted: true, at: "2026-11-10T09:00:00Z", textVersion: "prova-1", channel: "sito" },
  ]);
  const version = (p: ConsentPurpose) => (p === "carta" || p === "marketing" ? INFORMATIVA_CARTA_VERSIONE : "prova-1");
  const channelLabel = { sito: "sito", app: "app", banco_cartaceo: "modulo firmato al banco" } as const;
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
              {cur[p] && <span className="mt-1 block text-[12px] text-verde">Ultima scelta: {formatDay(cur[p]!.at.slice(0, 10)).long} · testo {cur[p]!.textVersion} · {channelLabel[cur[p]!.channel]}</span>}
            </span>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 text-[14px] font-semibold">
              <input
                type="checkbox"
                role="switch"
                checked={on}
                disabled={l.required}
                onChange={(e) => setHistory((h) => recordConsent(h, { purpose: p, granted: e.target.checked, at: new Date().toISOString(), textVersion: version(p), channel: "sito" }))}
                className="fm-focus size-6 accent-[var(--color-verde-scuro)]"
              />
              <span className="sr-only">{l.title}: </span>
              {on ? "Sì" : "No"}
            </label>
          </li>
        );
      })}
      <li className="px-1 text-[13px] text-verde">Ogni scelta resta nello storico con data, versione del testo e canale. Carta Fedeltà e appuntamenti servono al servizio.</li>
      <li>
        <InformativaCarta />
      </li>
    </ul>
  );
}

const field = "fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-4 text-[17px]";

/** Prima volta: tessera + cellulare + password. Il profilo si attiva al banco, quando la farmacista vede la tessera. */
function Register({ onBack }: { onBack: () => void }) {
  const [card, setCard] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState<boolean | null>(null);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);
  const mobile = normalizeMobile(phone);
  const e = {
    card: normalizeCardCode(card) ? null : "Il codice della tessera è una lettera e 5 numeri, per esempio A12345.",
    phone: mobile ? null : "Scrivi un numero di cellulare italiano.",
    pw: checkNewPassword(pw, mobile),
    pw2: pw && pw !== pw2 ? "Le due password non sono uguali." : null,
    privacy: privacy ? null : "Per avere la Carta serve questo consenso.",
    marketing: marketing === null ? "Scegli \"Do il consenso\" oppure \"Nego il consenso\"." : null,
  };
  const ok = Object.values(e).every((x) => !x);
  const Err = ({ t }: { t: string | null }) => (tried && t ? <p className="mt-1 text-[15px] font-semibold text-[#9b2c1f]">{t}</p> : null);

  if (done) {
    return (
      <div role="status" className="mx-auto max-w-md space-y-3 rounded-[32px] bg-verde-scuro p-6 text-carta md:p-8">
        <b className="fm-display block text-[30px] leading-tight">Ci siamo quasi.</b>
        <p className="text-[16px]">La prossima volta che passi in farmacia mostra la tessera: la farmacista attiva il tuo profilo e da lì entri con cellulare e password.</p>
        <p className="inline-block rounded-full bg-mela px-4 py-2 text-[14px] font-semibold text-verde-scuro">Prova: niente è stato salvato.</p>
        <button type="button" onClick={onBack} className="fm-focus block text-[15px] font-semibold underline underline-offset-4">
          Torna all&apos;accesso
        </button>
      </div>
    );
  }
  return (
    <form
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault();
        setTried(true);
        if (ok) setDone(true);
      }}
      className="mx-auto max-w-md space-y-4 rounded-[32px] bg-bianco p-6 md:p-8"
    >
      <h2 className="fm-display text-[30px] leading-tight">Prima volta?</h2>
      <p className="text-[16px]">Ti serve la tessera della farmacia. Se non ce l&apos;hai, la chiedi al banco.</p>
      <div>
        <label htmlFor="rg-card" className="block text-[16px] font-semibold">Codice della tessera</label>
        <input id="rg-card" autoCapitalize="characters" maxLength={7} value={card} onChange={(x) => setCard(x.target.value)} className={field} />
        <Err t={e.card} />
      </div>
      <div>
        <label htmlFor="rg-tel" className="block text-[16px] font-semibold">Cellulare</label>
        <input id="rg-tel" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(x) => setPhone(x.target.value)} className={field} />
        <Err t={e.phone} />
      </div>
      <div>
        <label htmlFor="rg-pw" className="block text-[16px] font-semibold">Scegli una password</label>
        <input id="rg-pw" type="password" autoComplete="new-password" value={pw} onChange={(x) => setPw(x.target.value)} aria-describedby="rg-pw-h" className={field} />
        <p id="rg-pw-h" className="mt-1 text-[14px] text-verde">Almeno 8 caratteri. Va bene anche una frase, per esempio tre parole.</p>
        <Err t={e.pw} />
      </div>
      <div>
        <label htmlFor="rg-pw2" className="block text-[16px] font-semibold">Riscrivi la password</label>
        <input id="rg-pw2" type="password" autoComplete="new-password" value={pw2} onChange={(x) => setPw2(x.target.value)} className={field} />
        <Err t={e.pw2} />
      </div>
      <InformativaCarta />
      <label className="flex cursor-pointer items-start gap-3 text-[15px]">
        <input type="checkbox" checked={privacy} onChange={(x) => setPrivacy(x.target.checked)} className="fm-focus mt-0.5 size-6 shrink-0 accent-[var(--color-verde-scuro)]" />
        <span>
          <b>Consenso per la Carta Fedeltà (obbligatorio).</b> {consensoCarta}
        </span>
      </label>
      <Err t={e.privacy} />
      <fieldset>
        <legend className="text-[15px]">
          <b>Marketing (facoltativo).</b> {consensoMarketingIntro} {consensoMarketing}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {([[true, "Do il consenso"], [false, "Nego il consenso"]] as const).map(([v, l]) => (
            <label key={l} className="cursor-pointer">
              <input type="radio" name="rg-mk" checked={marketing === v} onChange={() => setMarketing(v)} className="peer sr-only" />
              <span className={`inline-flex min-h-11 items-center rounded-full border-2 px-4 text-[15px] font-bold peer-focus-visible:shadow-[0_0_0_3px_var(--color-carta),0_0_0_6px_var(--color-verde-scuro)] ${marketing === v ? "border-verde-scuro bg-verde-scuro text-carta" : "border-verde-scuro/25 bg-bianco"}`}>{l}</span>
            </label>
          ))}
        </div>
        <Err t={e.marketing} />
      </fieldset>
      <button type="submit" className="fm-focus fm-press min-h-12 w-full rounded-full bg-verde-scuro text-[17px] font-bold text-carta">Crea il profilo</button>
      <button type="button" onClick={onBack} className="fm-focus block text-[15px] font-semibold underline underline-offset-4">Ho già un profilo</button>
    </form>
  );
}

/** Accesso con cellulare e password (decisione di Giovanni). In prova va bene qualsiasi numero, la password è "provaprova". */
function Login({ onIn }: { onIn: () => void }) {
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [register, setRegister] = useState(false);
  if (register) return <Register onBack={() => setRegister(false)} />;
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!normalizeMobile(phone)) return setErr("Scrivi un numero di cellulare italiano, per esempio 333 123 4567.");
        if (pw !== "provaprova") return setErr("Cellulare o password sbagliati. In prova la password è provaprova.");
        onIn();
      }}
      className="mx-auto max-w-md space-y-4 rounded-[32px] bg-bianco p-6 md:p-8"
    >
      <h2 className="fm-display text-[30px] leading-tight">Entra in MyMasera</h2>
      <div>
        <label htmlFor="my-tel" className="block text-[16px] font-semibold">Cellulare</label>
        <input id="my-tel" type="tel" inputMode="tel" autoComplete="username" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="my-pw" className="block text-[16px] font-semibold">Password</label>
        <input id="my-pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className={field} />
        <p className="mt-1 text-[14px] text-verde">Prova: la password è provaprova. Password dimenticata? Te la azzeriamo al banco.</p>
      </div>
      {err && (
        <p role="alert" className="text-[15px] font-semibold text-[#9b2c1f]">
          {err}
        </p>
      )}
      <button type="submit" className="fm-focus fm-press min-h-12 w-full rounded-full bg-verde-scuro text-[17px] font-bold text-carta">Entra</button>
      <button type="button" onClick={() => setRegister(true)} className="fm-focus block text-[15px] font-semibold underline underline-offset-4">
        Prima volta? Crea il tuo profilo
      </button>
    </form>
  );
}

export function MyMaseraDemo({ today }: { today: string }) {
  const [inside, setInside] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [tab, setTab] = useState("agenda");
  const progress = loyaltyProgress(DEMO.points);
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
            <span className="block text-[13px] text-verde">Al prossimo euro</span>
            <b className="text-[15px]">{progress.label}</b>
            <span className="block text-[12px] text-verde">30 € di spesa = 100 punti = 1 €</span>
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
