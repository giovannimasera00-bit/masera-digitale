"use client";
import { useState } from "react";
import { deblisteringCost, deblisteringPerDay, deblisteringPeriods, formatPrice } from "@masera/core";

const people = [1, 2, 3];

function Choice({ name, label, options, value, onChange }: { name: string; label: string; options: { v: number; l: string }[]; value: number; onChange: (v: number) => void }) {
  return (
    <fieldset>
      <legend className="text-[15px] font-semibold text-verde">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.v} className="cursor-pointer">
            <input type="radio" name={name} value={o.v} checked={value === o.v} onChange={() => onChange(o.v)} className="peer sr-only" />
            <span className="fm-press inline-flex min-h-12 items-center rounded-full border-2 border-verde-scuro/30 bg-bianco px-5 text-[16px] font-semibold text-verde-scuro peer-checked:border-verde-scuro peer-checked:bg-verde-scuro peer-checked:text-carta peer-focus-visible:shadow-[0_0_0_3px_var(--color-carta),0_0_0_6px_var(--color-verde-scuro)]">
              {o.l}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** "Quanto costa davvero": periodo × persone × 1 € al giorno. */
export function CostCalculator() {
  const [weeks, setWeeks] = useState(4);
  const [n, setN] = useState(1);
  const total = deblisteringCost(weeks, n);
  const period = deblisteringPeriods.find((p) => p.weeks === weeks)!;

  return (
    <div className="grid gap-8 rounded-3xl bg-bianco p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
      <div className="space-y-6">
        <Choice name="periodo" label="Per quanto tempo?" value={weeks} onChange={setWeeks} options={deblisteringPeriods.map((p) => ({ v: p.weeks, l: p.label }))} />
        <Choice name="persone" label="Per quante persone?" value={n} onChange={setN} options={people.map((p) => ({ v: p, l: p === 1 ? "1 persona" : `${p} persone` }))} />
      </div>
      <div className="flex flex-col justify-center rounded-3xl bg-verde-scuro p-6 text-carta" aria-live="polite">
        <p className="text-[15px] text-beige-chiaro">
          {period.label}, {n === 1 ? "1 persona" : `${n} persone`}
        </p>
        <p className="fm-display mt-1 text-[56px] leading-none">{formatPrice(total)}</p>
        <p className="mt-3 text-[15px] text-beige-chiaro">
          Cioè {formatPrice(deblisteringPerDay)} al giorno a persona. La prima chiacchierata con la farmacista è gratuita.
        </p>
      </div>
    </div>
  );
}
