"use client";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { agendaResources, availableSlots, formatClock, formatDuration, type Busy, type Closure, type Service } from "@masera/core";
import { quickBookAction } from "./actions";

const field = "fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-3 text-[16px]";

/** Inserimento rapido per il giorno mostrato: servizio → ora → nome. */
export function QuickBook({ date, nowIso, services, busy, closures }: { date: string; nowIso: string; services: Service[]; busy: Busy[]; closures: Closure[] }) {
  const [state, action, pending] = useActionState(quickBookAction, undefined);
  const [slug, setSlug] = useState(services[0]?.slug ?? "");
  const [channel, setChannel] = useState<"telefono" | "banco">("telefono");
  const formRef = useRef<HTMLFormElement>(null);
  const service = services.find((s) => s.slug === slug);
  const slots = useMemo(
    () => (service ? availableSlots({ service, date, now: new Date(nowIso), busy, closures, staff: true }) : []),
    [service, date, nowIso, busy, closures],
  );

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const byResource = Object.values(agendaResources).map((r) => ({ r, list: services.filter((s) => s.resource === r.id) }));

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="giorno" value={date} />
      <div>
        <label htmlFor="qb-s" className="block text-[15px] font-semibold">
          Servizio
        </label>
        <select id="qb-s" name="servizio" value={slug} onChange={(e) => setSlug(e.target.value)} className={field}>
          {byResource.map(({ r, list }) => (
            <optgroup key={r.id} label={r.name}>
              {list.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} · {formatDuration(s.duration_min)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="qb-o" className="block text-[15px] font-semibold">
          Ora ({slots.length} libere)
        </label>
        <select id="qb-o" name="ora" required className={field} key={slug}>
          {slots.map((m) => (
            <option key={m} value={m}>
              {formatClock(m)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="qb-n" className="block text-[15px] font-semibold">
            Nome e cognome
          </label>
          <input id="qb-n" name="nome" required autoComplete="off" className={field} />
        </div>
        <div>
          <label htmlFor="qb-c" className="block text-[15px] font-semibold">
            Cellulare {channel === "banco" ? "(facoltativo)" : ""}
          </label>
          <input id="qb-c" name="cellulare" type="tel" inputMode="tel" autoComplete="off" required={channel === "telefono"} className={field} />
        </div>
      </div>
      <fieldset className="flex gap-2">
        <legend className="sr-only">Come ha prenotato</legend>
        {(["telefono", "banco"] as const).map((c) => (
          <label key={c} className="cursor-pointer">
            <input type="radio" name="canale" value={c} checked={channel === c} onChange={() => setChannel(c)} className="peer sr-only" />
            <span className="inline-flex min-h-11 items-center rounded-full border-2 border-verde-scuro/25 bg-bianco px-4 text-[15px] font-semibold peer-checked:border-verde-scuro peer-checked:bg-verde-scuro peer-checked:text-carta peer-focus-visible:shadow-[0_0_0_3px_var(--color-carta),0_0_0_6px_var(--color-verde-scuro)]">
              {c === "telefono" ? "Al telefono" : "Al banco"}
            </span>
          </label>
        ))}
      </fieldset>
      <div>
        <label htmlFor="qb-note" className="block text-[15px] font-semibold">
          Note (facoltative)
        </label>
        <input id="qb-note" name="note" autoComplete="off" className={field} />
      </div>
      <button type="submit" disabled={pending || slots.length === 0} className="fm-focus fm-press min-h-12 w-full rounded-full bg-verde-scuro text-[16px] font-bold text-carta disabled:opacity-50">
        {pending ? "Salvo…" : "Metti in agenda"}
      </button>
      {state?.error && (
        <p role="alert" className="text-[15px] font-semibold text-[#9b2c1f]">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="text-[15px] font-semibold text-verde">
          {state.ok}
        </p>
      )}
    </form>
  );
}
