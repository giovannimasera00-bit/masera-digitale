"use client";
import "../prenota/prenota.css";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AMOUNT_LABELS, analysisRecallDate, finishEstimate, formatDay, FREQUENCY_LABELS, isDueOn, routineFor, STEP_LABELS, streak,
  type RoutineItem, type StepCategory,
} from "@masera/core";

type Moment = "mattina" | "sera";

/** Il "rituale" del cliente (canvas SkinLab, colori tortora): mattina/sera, passaggi da spuntare, passo passo, sta per finire, richiamo. */
export function RoutineView({ items, today, analysisDate, checkedEvenings }: { items: RoutineItem[]; today: string; analysisDate: string; checkedEvenings: string[] }) {
  const [moment, setMoment] = useState<Moment>("mattina");
  const [done, setDone] = useState<Record<Moment, string[]>>({ mattina: [], sera: [] });
  const [story, setStory] = useState<number | null>(null);
  const pm = moment === "sera";

  // Solo i passaggi di oggi: i trattamenti settimanali compaiono nei loro giorni.
  const steps = useMemo(() => routineFor(items, moment).filter((i) => isDueOn(i, today)), [items, moment, today]);
  const weekly = useMemo(() => routineFor(items, moment).filter((i) => i.frequency !== "ogni_giorno"), [items, moment]);
  const finishing = items.map((i) => ({ i, f: finishEstimate(i, today) })).filter((x) => x.f?.reorder);
  const doneList = done[moment];
  const all = steps.length > 0 && steps.every((s) => doneList.includes(s.ean));
  const days = streak(all && pm ? [...checkedEvenings, today] : checkedEvenings, today);
  const recall = analysisRecallDate(analysisDate);
  const toggle = (ean: string) => setDone((d) => ({ ...d, [moment]: d[moment].includes(ean) ? d[moment].filter((x) => x !== ean) : [...d[moment], ean] }));

  const how = (i: RoutineItem) => `${AMOUNT_LABELS[i.amount]}${i.frequency === "ogni_giorno" ? "" : ` · ${FREQUENCY_LABELS[i.frequency].toLowerCase()}`}`;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div
        className="relative overflow-hidden rounded-[32px] p-6 transition-[background] duration-700"
        style={{ background: pm ? "linear-gradient(160deg, #3a332b 0%, #5e5448 100%)" : "linear-gradient(160deg, #C4B8A9 0%, #A8998A 100%)", color: pm ? "#fff" : "#1D1D1B" }}
      >
        <svg aria-hidden width="64" height="64" viewBox="0 0 64 64" className="absolute right-6 top-6">
          <circle cx="32" cy="32" r={pm ? 18 : 20} fill="#F4F1E8" />
          {pm && <circle cx="41" cy="25" r="16" fill="#463e35" />}
        </svg>
        <p className="text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: pm ? "#D6D2C4" : "#3a332b" }}>
          SkinLab Routine
        </p>
        <h2 className="fm-display mt-1 text-[32px] leading-tight">{pm ? "Routine della sera" : "Routine del mattino"}</h2>
        <div role="tablist" aria-label="Momento della giornata" className="mt-4 inline-flex gap-1 rounded-full bg-white/20 p-1">
          {(["mattina", "sera"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={moment === m}
              onClick={() => (setMoment(m), setStory(null))}
              className={`fm-focus min-h-10 rounded-full px-4 text-[14px] font-bold ${moment === m ? "bg-white text-verde-scuro" : ""}`}
            >
              {m === "mattina" ? "Mattina" : "Sera"}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-[linear-gradient(90deg,#B7A999,#F4F1E8)] transition-[width] duration-500" style={{ width: `${steps.length ? (100 * steps.filter((s) => doneList.includes(s.ean)).length) / steps.length : 0}%` }} />
          </div>
          <p aria-live="polite" className="mt-2 text-[15px] font-semibold">
            {all ? (pm ? "Buonanotte, pelle." : "Pronta per la giornata.") : `${steps.filter((s) => doneList.includes(s.ean)).length} di ${steps.length} passaggi`}
            {days > 0 && ` · ${days} ${days === 1 ? "sera" : "sere"} di fila`}
          </p>
        </div>
      </div>

      {story === null ? (
        <>
          <ol className="space-y-2">
            {steps.map((s, n) => {
              const on = doneList.includes(s.ean);
              return (
                <li key={s.ean} className="pn-in" style={{ animationDelay: `${n * 60}ms` }}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(s.ean)}
                    className="fm-focus flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors"
                    style={{ background: on ? "#EFEAE2" : "#fff", borderColor: on ? "#8C7D6C" : "#E8E4D8" }}
                  >
                    <span className="w-7 font-mono text-[14px] text-tortora-3">{String(n + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-bold uppercase tracking-[0.12em] text-tortora-3">{STEP_LABELS[s.category as StepCategory]}</span>
                      <b className={`block text-[16px] ${on ? "line-through" : ""}`}>{s.name}</b>
                      <span className="block text-[14px] text-[#5a5a55]">{how(s)}</span>
                    </span>
                    <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-lg border-2" style={{ background: on ? "#8C7D6C" : "#fff", borderColor: on ? "#8C7D6C" : "#C9C4B5" }}>
                      {on && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {steps.length > 0 && (
            <button type="button" onClick={() => setStory(0)} className="fm-focus fm-press min-h-12 w-full rounded-full bg-tortora-3 text-[16px] font-bold text-white">
              Fai la routine passo passo
            </button>
          )}
        </>
      ) : (
        <div className="pn-in rounded-[28px] border-2 border-[#E8E4D8] bg-white p-6" aria-live="polite">
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-tortora-3">
            Passo {story + 1} di {steps.length} · {STEP_LABELS[steps[story]!.category as StepCategory]}
          </p>
          <b className="fm-display mt-2 block text-[28px] leading-tight">{steps[story]!.name}</b>
          <p className="mt-2 text-[17px]">{how(steps[story]!)}</p>
          <div className="mt-6 flex gap-2">
            <button type="button" disabled={story === 0} onClick={() => setStory((s) => s! - 1)} className="fm-focus min-h-12 flex-1 rounded-full border-2 border-tortora-1 text-[16px] font-bold disabled:opacity-40">
              Indietro
            </button>
            <button
              type="button"
              onClick={() => {
                const s = steps[story]!;
                if (!doneList.includes(s.ean)) toggle(s.ean);
                setStory(story + 1 < steps.length ? story + 1 : null);
              }}
              className="fm-focus min-h-12 flex-[2] rounded-full bg-tortora-3 text-[16px] font-bold text-white"
            >
              {story + 1 < steps.length ? "Fatto, avanti" : "Fatto, finito"}
            </button>
          </div>
        </div>
      )}

      {weekly.length > 0 && (
        <div className="rounded-3xl bg-bianco p-4 text-[15px]">
          <b className="block">Trattamenti della settimana</b>
          {weekly.map((w) => (
            <span key={w.ean} className="block text-[#5a5a55]">
              {w.name}: {FREQUENCY_LABELS[w.frequency].toLowerCase()}
              {isDueOn(w, today) ? " · oggi sì" : " · oggi no"}
            </span>
          ))}
        </div>
      )}

      {finishing.length > 0 && (
        <div className="rounded-3xl bg-[#EFEAE2] p-5">
          <b className="block text-[17px]">Sta per finire</b>
          {finishing.map(({ i, f }) => (
            <div key={i.ean} className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[15px]">
                {i.name}: {f!.daysLeft <= 0 ? "dovrebbe essere finito" : f!.daysLeft === 1 ? "finisce domani" : `finisce verso ${formatDay(f!.date).long}`}
              </span>
              <Link href="/shop" className="fm-focus rounded-full bg-tortora-3 px-4 py-2 text-[14px] font-bold text-white">
                Riordina
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-3xl bg-bianco p-5">
        <b className="block text-[17px]">{today >= recall ? "Rifacciamo l'analisi?" : "Prossima analisi della pelle"}</b>
        <p className="mt-1 text-[15px]">
          {today >= recall ? "Sono passate 8 settimane: vediamo insieme cosa è cambiato, con il confronto prima e dopo." : `Dal ${formatDay(recall).long}: 8 settimane dopo l'ultima, per confrontare prima e dopo.`}
        </p>
        <Link href="/prenota?servizio=analisi-pelle-viso" className="fm-focus mt-3 inline-flex min-h-11 items-center rounded-full border-2 border-tortora-2 px-4 text-[15px] font-bold">
          Prenota l&apos;analisi
        </Link>
      </div>
    </div>
  );
}
