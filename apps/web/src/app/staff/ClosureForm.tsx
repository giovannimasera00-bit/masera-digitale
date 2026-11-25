"use client";
import { useActionState, useState } from "react";
import { addClosureAction } from "./actions";

const field = "fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-3 text-[16px]";

/** Chiusure, ferie, festivi: tutto il giorno o una fascia, per tutta la farmacia o una cabina. */
export function ClosureForm({
  date,
  resources,
  wholeAllowed,
}: {
  date: string;
  resources: { id: string; name: string }[];
  /** Solo la farmacia può chiudere tutte le zone insieme. */
  wholeAllowed: boolean;
}) {
  const [state, action, pending] = useActionState(addClosureAction, undefined);
  const [whole, setWhole] = useState(true);
  return (
    <form action={action} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="cl-g" className="block text-[15px] font-semibold">
            Giorno
          </label>
          <input id="cl-g" name="giorno" type="date" defaultValue={date} required className={field} />
        </div>
        <div>
          <label htmlFor="cl-r" className="block text-[15px] font-semibold">
            Dove
          </label>
          <select id="cl-r" name="risorsa" className={field}>
            {wholeAllowed && <option value="">Tutta la farmacia</option>}
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[16px]">
        <input type="checkbox" name="intero" value="si" aria-label="Tutto il giorno" checked={whole} onChange={(e) => setWhole(e.target.checked)} className="size-6 accent-[var(--color-verde-scuro)]" />
        Tutto il giorno
      </label>
      {!whole && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="cl-d" className="block text-[15px] font-semibold">
              Dalle
            </label>
            <input id="cl-d" name="dalle" type="time" step={900} required className={field} />
          </div>
          <div>
            <label htmlFor="cl-a" className="block text-[15px] font-semibold">
              Alle
            </label>
            <input id="cl-a" name="alle" type="time" step={900} required className={field} />
          </div>
        </div>
      )}
      <div>
        <label htmlFor="cl-m" className="block text-[15px] font-semibold">
          Motivo (es. festivo, ferie, formazione)
        </label>
        <input id="cl-m" name="motivo" autoComplete="off" className={field} />
      </div>
      <button type="submit" disabled={pending} className="fm-focus fm-press min-h-12 w-full rounded-full border-2 border-verde-scuro bg-bianco text-[16px] font-bold text-verde-scuro disabled:opacity-50">
        {pending ? "Salvo…" : "Aggiungi chiusura"}
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
