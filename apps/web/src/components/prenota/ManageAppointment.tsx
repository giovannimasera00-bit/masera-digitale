"use client";
import "./prenota.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { bookableDays, type Busy, type Closure, formatClock, formatDay, type ResourceId } from "@masera/core";
import { cancelAction, moveAction } from "@/app/(sito)/appuntamento/[token]/actions";
import { Choices } from "./Choices";

type State = "modificabile" | "tardi" | "annullato" | "passato";

/** Il link personale del cliente: vede l'appuntamento e, fino a un'ora prima, lo sposta o lo annulla. */
export function ManageAppointment({
  token, notice: initialNotice, state, serviceName, when, place, whatsapp, duration, resource, nowIso, busy: initialBusy, closures,
}: {
  token: string;
  notice: string | null;
  state: State;
  serviceName: string;
  when: string;
  place: string;
  whatsapp: string;
  duration: number;
  resource: ResourceId;
  nowIso: string;
  busy: Busy[];
  closures: Closure[];
}) {
  const router = useRouter();
  const now = useMemo(() => new Date(nowIso), [nowIso]);
  const [mode, setMode] = useState<"vedi" | "sposta" | "annulla">("vedi");
  const [busy, setBusy] = useState(initialBusy);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const noticeRef = useRef<HTMLParagraphElement>(null);

  const days = useMemo(() => bookableDays({ service: { duration_min: duration, resource }, now, busy, closures }), [duration, resource, now, busy, closures]);
  const slots = days.find((d) => d.date === date)?.slots ?? [];

  useEffect(() => {
    if (initialNotice) noticeRef.current?.focus();
  }, [initialNotice]);

  function fail(reason: "tardi" | "preso" | "non_valido" | "errore", b?: Busy[]) {
    if (b) setBusy(b);
    if (reason === "preso") setSlot(null);
    setError(
      reason === "preso" ? "Questo orario è appena stato preso. Scegline un altro."
      : reason === "tardi" ? "Manca meno di un'ora: per cambiare chiamaci o scrivici su WhatsApp."
      : reason === "non_valido" ? "Questo appuntamento non si può più cambiare online."
      : "Qualcosa non ha funzionato. Riprova, oppure scrivici su WhatsApp.",
    );
  }

  async function move() {
    if (!date || slot === null || sending) return;
    setSending(true);
    setError(null);
    const r = await moveAction({ token, date, start: slot });
    setSending(false);
    if (r.ok) router.replace(`/appuntamento/${token}?esito=spostato`);
    else fail(r.reason, r.busy);
  }
  async function cancel() {
    if (sending) return;
    setSending(true);
    setError(null);
    const r = await cancelAction(token);
    setSending(false);
    if (r.ok) router.replace(`/appuntamento/${token}?esito=annullato`);
    else fail(r.reason);
  }

  const btn = "fm-focus fm-press inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[16px] font-bold";
  const wa = (
    <a href={whatsapp} className="font-semibold underline underline-offset-4">
      WhatsApp
    </a>
  );

  return (
    <div className="space-y-6">
      {initialNotice && (
        <p ref={noticeRef} tabIndex={-1} role="status" className="pn-in rounded-2xl bg-mela px-5 py-3 text-[17px] font-bold text-verde-scuro outline-none">
          {initialNotice}
        </p>
      )}

      <div className={`rounded-3xl p-6 ${state === "annullato" ? "bg-beige-chiaro/60 text-verde" : "bg-verde-scuro text-carta"}`}>
        <b className={`block text-[22px] ${state === "annullato" ? "line-through" : ""}`}>{serviceName}</b>
        <span className={`mt-1 block text-[19px] ${state === "annullato" ? "line-through" : ""}`}>{when}</span>
        <span className={`mt-1 block text-[16px] ${state === "annullato" ? "" : "text-beige-chiaro"}`}>{place}</span>
      </div>

      {state === "annullato" && (
        <p className="text-[17px]">
          Vuoi un altro orario? <Link href="/prenota" className="font-semibold underline underline-offset-4">Prenota di nuovo</Link>.
        </p>
      )}
      {state === "passato" && <p className="text-[17px]">Questo appuntamento è già passato. Per uno nuovo <Link href="/prenota" className="font-semibold underline underline-offset-4">prenota qui</Link>.</p>}
      {state === "tardi" && <p className="text-[17px]">Manca meno di un&apos;ora: per spostare o annullare chiamaci o scrivici su {wa}.</p>}

      {state === "modificabile" && mode === "vedi" && (
        <>
          <p className="text-[17px]">Puoi spostarlo o annullarlo da qui fino a un&apos;ora prima.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { setMode("sposta"); setError(null); }} className={`${btn} bg-verde-scuro text-carta`}>
              Sposta
            </button>
            <button type="button" onClick={() => { setMode("annulla"); setError(null); }} className={`${btn} border-2 border-verde-scuro/30 bg-bianco text-verde-scuro`}>
              Annulla
            </button>
          </div>
        </>
      )}

      {state === "modificabile" && mode === "annulla" && (
        <div className="pn-in space-y-4 rounded-3xl border-2 border-verde-scuro/15 bg-bianco p-6">
          <p className="text-[18px] font-semibold">Vuoi davvero annullare questo appuntamento?</p>
          <p className="text-[16px]">L&apos;orario torna libero per altri. Se cambi idea dovrai prenotare di nuovo.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={cancel} aria-disabled={sending} className={`${btn} bg-[#9b2c1f] text-carta`}>
              {sending ? "Annullo…" : "Sì, annulla"}
            </button>
            <button type="button" onClick={() => setMode("vedi")} className={`${btn} border-2 border-verde-scuro/30 bg-bianco text-verde-scuro`}>
              No, tienilo
            </button>
          </div>
        </div>
      )}

      {state === "modificabile" && mode === "sposta" && (
        <div className="pn-in space-y-6">
          <Choices
            legend="Nuovo giorno"
            name="giorno"
            value={date}
            onChange={(v) => {
              setDate(v);
              setSlot(null);
            }}
            options={days.map((d) => {
              const f = formatDay(d.date);
              return {
                v: d.date,
                disabled: d.slots.length === 0,
                label: (
                  <span className="flex flex-col items-center gap-0.5 py-2.5">
                    <span className="text-[11px] font-semibold uppercase">{f.dow}</span>
                    <b className="text-[19px] leading-none">{f.num}</b>
                    <span className="sr-only">{d.slots.length ? `${f.long}, ${d.slots.length} orari liberi` : `${f.long}, nessun orario libero`}</span>
                  </span>
                ),
              };
            })}
            className="grid grid-cols-7 gap-1.5"
            itemClass={(on, off) => `rounded-2xl text-center ${off ? "bg-transparent text-verde/40 line-through" : on ? "bg-verde-scuro text-carta" : "bg-bianco text-verde-scuro"}`}
          />
          {date && (
            <Choices
              key={date}
              legend={`Nuovo orario, ${formatDay(date).long}`}
              name="orario"
              value={slot}
              onChange={setSlot}
              options={slots.map((m) => ({ v: m, label: formatClock(m) }))}
              className="grid grid-cols-4 gap-2 sm:grid-cols-5"
              itemClass={(on) => `flex min-h-11 items-center justify-center rounded-xl border-2 text-[15px] font-bold ${on ? "border-verde-scuro bg-verde-scuro text-carta" : "border-verde-scuro/20 bg-bianco text-verde-scuro"}`}
            />
          )}
          {days.every((d) => d.slots.length === 0) && <p className="text-[17px]">Nei prossimi giorni non ci sono altri orari liberi online. Scrivici su {wa}.</p>}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={move}
              aria-disabled={!date || slot === null || sending}
              className={`${btn} ${date && slot !== null ? "bg-mela text-verde-scuro" : "bg-beige-chiaro/60 text-verde"}`}
            >
              {sending ? "Sposto…" : date && slot !== null ? `Sposta a ${formatDay(date).long}, ore ${formatClock(slot)}` : "Scegli giorno e orario"}
            </button>
            <button type="button" onClick={() => setMode("vedi")} className={`${btn} border-2 border-verde-scuro/30 bg-bianco text-verde-scuro`}>
              Lascia com&apos;è
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-[16px] font-semibold text-[#9b2c1f]">
          {error}
        </p>
      )}
    </div>
  );
}
