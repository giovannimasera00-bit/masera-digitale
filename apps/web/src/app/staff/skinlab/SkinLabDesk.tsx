"use client";
import { useEffect, useRef, useState } from "react";
import {
  AMOUNT_LABELS, analysisRecallDate, finishEstimate, formatDay, FREQUENCY_LABELS, isScannedEan, normalizeCardCode, routineFor, routineWarnings,
  STEP_LABELS, WHEN_LABELS, type Amount, type Frequency, type RoutineItem, type StepCategory, type When,
} from "@masera/core";
import { skinDemoCustomers, skinDemoProducts } from "@/content/skinlab-demo";

type Line = RoutineItem & { unit: "ml" | "pz" };
const btn = "fm-focus fm-press inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-bold";

/** Gruppo di 3–4 pulsanti: uno solo acceso. */
function Pick<T extends string>({ label, value, options, onPick }: { label: string; value: T; options: Record<T, string>; onPick: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="w-28 text-[13px] font-bold uppercase tracking-[0.1em] text-verde">{label}</span>
      {(Object.keys(options) as T[]).map((k) => (
        <button
          key={k}
          type="button"
          aria-pressed={value === k}
          onClick={() => onPick(k)}
          className={`fm-focus min-h-10 rounded-full border-2 px-3 text-[14px] font-bold ${value === k ? "border-verde-scuro bg-verde-scuro text-carta" : "border-verde-scuro/20 bg-bianco"}`}
        >
          {options[k]}
        </button>
      ))}
    </div>
  );
}

export function SkinLabDesk({ today }: { today: string }) {
  const scanRef = useRef<HTMLInputElement>(null);
  const [scan, setScan] = useState("");
  const [card, setCard] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  // La penna ottica scrive come una tastiera: il campo torna sempre a fuoco (BRIEF §10).
  const refocus = () => setTimeout(() => scanRef.current?.focus(), 0);
  useEffect(() => {
    refocus();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startedAt]);

  const customer = card ? skinDemoCustomers[card] : null;

  function onScan(raw: string) {
    const v = raw.trim();
    setScan("");
    const c = normalizeCardCode(v);
    if (c) {
      if (!skinDemoCustomers[c]) return setMessage(`Tessera ${c} non trovata.`);
      setCard(c);
      setLines([]);
      setSent(false);
      setAttachment(null);
      return setMessage(`Tessera ${c}: ${skinDemoCustomers[c]!.name}.`);
    }
    if (isScannedEan(v)) {
      if (!card) return setMessage("Prima passa la tessera del cliente.");
      const p = skinDemoProducts.find((x) => x.ean === v);
      if (!p) return setMessage(`Prodotto ${v} non è nelle schede SkinLab: va aggiunto al catalogo.`);
      if (lines.some((l) => l.ean === v)) return setMessage(`${p.name} è già nella routine.`);
      const sun = p.category === "protezione_solare";
      setLines((ls) => [
        ...ls,
        { ean: p.ean, name: p.name, category: p.category, when: sun ? "mattina" : "entrambi", frequency: "ogni_giorno", amount: "pisello", capacity: p.capacity, doseMl: p.doseMl, startDate: today, unit: p.unit },
      ]);
      return setMessage(`Aggiunto: ${p.name} → ${STEP_LABELS[p.category]}.`);
    }
    if (v) setMessage(`"${v}" non è né una tessera (lettera + 5 numeri) né un codice a barre (8 o 13 cifre).`);
  }

  const upd = (ean: string, p: Partial<Line>) => {
    setLines((ls) => ls.map((l) => (l.ean === ean ? { ...l, ...p } : l)));
    refocus();
  };
  const warnings = routineWarnings(lines);
  const morning = routineFor(lines, "mattina");
  const evening = routineFor(lines, "sera");
  const mm = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="mt-6 space-y-6" onClick={(e) => (e.target as HTMLElement).tagName !== "INPUT" && refocus()}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onScan(scan);
        }}
        className="sticky top-2 z-10 flex flex-wrap items-center gap-3 rounded-3xl bg-verde-scuro p-4 text-carta shadow-[0_12px_28px_rgba(0,0,0,.2)]"
      >
        <label htmlFor="sl-scan" className="text-[15px] font-bold">
          Penna ottica
        </label>
        <input
          id="sl-scan"
          ref={scanRef}
          value={scan}
          onChange={(e) => setScan(e.target.value)}
          autoComplete="off"
          inputMode="none"
          placeholder="Passa la tessera o un prodotto"
          className="fm-focus min-h-12 min-w-0 flex-1 rounded-xl bg-carta px-4 font-mono text-[17px] text-nero"
        />
        <span aria-label="Tempo trascorso" className="font-mono text-[15px] text-mela">
          {mm}
        </span>
      </form>
      <p aria-live="polite" className="min-h-6 text-[16px] font-semibold text-verde">
        {message}
      </p>

      {customer && (
        <div className="rounded-3xl bg-beige-chiaro/60 p-5">
          <b className="block text-[20px]">{customer.name}</b>
          <span className="text-[15px]">
            Tessera {card} ·{" "}
            {customer.lastAnalysis ? `ultima analisi ${formatDay(customer.lastAnalysis).long}, prossima dal ${formatDay(analysisRecallDate(customer.lastAnalysis)).long}` : "nessuna analisi registrata"}
          </span>
        </div>
      )}

      {lines.length > 0 && (
        <ol className="space-y-3">
          {[...lines]
            .sort((a, b) => morning.concat(evening).indexOf(a) - morning.concat(evening).indexOf(b))
            .map((l) => {
              const f = finishEstimate(l, today);
              return (
                <li key={l.ean} className="space-y-2 rounded-3xl border-2 border-verde-scuro/10 bg-bianco p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-verde">{STEP_LABELS[l.category as StepCategory]}</span>
                      <b className="block text-[17px]">{l.name}</b>
                      <span className="text-[13px] text-verde">
                        {l.capacity} {l.unit}
                        {f && ` · finisce verso ${formatDay(f.date).long}`}
                      </span>
                    </div>
                    <button type="button" onClick={() => (setLines((ls) => ls.filter((x) => x.ean !== l.ean)), refocus())} className={`${btn} border-2 border-verde-scuro/20 bg-bianco`}>
                      Togli
                    </button>
                  </div>
                  <Pick<When> label="Quando" value={l.when} options={WHEN_LABELS} onPick={(v) => upd(l.ean, { when: v })} />
                  <Pick<Frequency> label="Quanto spesso" value={l.frequency} options={FREQUENCY_LABELS} onPick={(v) => upd(l.ean, { frequency: v })} />
                  <Pick<Amount> label="Quanto" value={l.amount} options={AMOUNT_LABELS} onPick={(v) => upd(l.ean, { amount: v })} />
                </li>
              );
            })}
        </ol>
      )}

      {warnings.length > 0 && (
        <ul role="alert" className="rounded-2xl bg-[#f6dcd7] px-4 py-3 text-[15px]">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      {lines.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["Mattina", morning],
              ["Sera", evening],
            ] as const
          ).map(([t, list]) => (
            <div key={t} className="rounded-3xl bg-beige-chiaro/60 p-4">
              <b className="block text-[17px]">{t}</b>
              <ol className="mt-2 list-decimal pl-5 text-[15px]">
                {list.map((l) => (
                  <li key={l.ean}>
                    {STEP_LABELS[l.category as StepCategory]}: {l.name} · {AMOUNT_LABELS[l.amount].toLowerCase()} · {FREQUENCY_LABELS[l.frequency].toLowerCase()}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}

      {card && lines.length > 0 && !sent && (
        <div className="flex flex-wrap items-center gap-3">
          <label className={`${btn} cursor-pointer border-2 border-verde-scuro/20 bg-bianco`}>
            {attachment ? `Allegato: ${attachment}` : "Allega l'analisi (foto o PDF)"}
            <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => (setAttachment(e.target.files?.[0]?.name ?? null), refocus())} />
          </label>
          <button type="button" onClick={() => (setSent(true), refocus())} className={`${btn} min-h-12 bg-mela px-6 text-[17px] text-verde-scuro`}>
            Invia la routine
          </button>
        </div>
      )}

      {sent && (
        <div role="status" className="rounded-3xl bg-verde-scuro p-5 text-carta">
          <b className="block text-[20px]">Routine pronta in {mm}.</b>
          <p className="mt-1 text-[16px]">
            {customer?.name} riceve su WhatsApp il link alla sua routine: mattina, sera, quando ricomprare. I prodotti diventano &quot;li prendo ora / metti da parte /
            ordina online&quot;.
          </p>
          <p className="mt-3 inline-block rounded-full bg-mela px-4 py-2 text-[14px] font-semibold text-verde-scuro">Prova: niente è stato inviato.</p>
        </div>
      )}
    </div>
  );
}
