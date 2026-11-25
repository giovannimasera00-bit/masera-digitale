"use client";
import type { ReactNode } from "react";

/** Gruppo di scelte "una sola" accessibile: radio veri, disegnati come pillole o schede. */
export function Choices<T extends string | number>({
  legend,
  name,
  value,
  onChange,
  options,
  className,
  itemClass,
}: {
  legend: ReactNode;
  name: string;
  value: T | null;
  onChange: (v: T) => void;
  options: { v: T; label: ReactNode; disabled?: boolean; key?: string }[];
  className: string;
  itemClass: (checked: boolean, disabled: boolean) => string;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-verde">{legend}</legend>
      <div className={className}>
        {options.map((o, i) => {
          const checked = value === o.v;
          return (
            <label key={o.key ?? String(o.v)} className={`pn-in block ${o.disabled ? "cursor-not-allowed" : "cursor-pointer"}`} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <input type="radio" name={name} value={String(o.v)} checked={checked} disabled={o.disabled} onChange={() => onChange(o.v)} className="peer sr-only" />
              <span className={`fm-press block h-full peer-focus-visible:shadow-[0_0_0_3px_var(--color-carta),0_0_0_6px_var(--color-verde-scuro)] ${itemClass(checked, !!o.disabled)}`}>
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export const pill = (on: boolean, off: boolean) =>
  `inline-flex min-h-11 items-center rounded-full border-2 px-4 text-[15px] font-bold ${
    off ? "border-transparent bg-beige-chiaro/50 text-verde/50" : on ? "border-verde-scuro bg-verde-scuro text-carta" : "border-verde-scuro/25 bg-bianco text-verde-scuro"
  }`;

