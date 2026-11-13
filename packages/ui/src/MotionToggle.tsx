"use client";
import { useEffect, useState } from "react";

export type MotionMode = "system" | "reduce" | "full";

/**
 * Interruttore per provare "riduci movimento" senza cambiare le impostazioni del dispositivo.
 * Imposta data-motion sull'elemento <html>; "system" segue la preferenza del dispositivo.
 */
export function MotionToggle({ onChange }: { onChange?: (mode: MotionMode) => void }) {
  const [mode, setMode] = useState<MotionMode>("system");

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "system") root.removeAttribute("data-motion");
    else root.setAttribute("data-motion", mode);
    onChange?.(mode);
  }, [mode, onChange]);

  useEffect(() => () => document.documentElement.removeAttribute("data-motion"), []);

  const opts: [MotionMode, string][] = [
    ["system", "Come il dispositivo"],
    ["reduce", "Riduci movimento"],
    ["full", "Movimento attivo"],
  ];
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="sr-only">Movimento</legend>
      {opts.map(([value, label]) => (
        <label
          key={value}
          className="inline-flex min-h-11 cursor-pointer items-center rounded-full border-2 border-beige-scuro bg-bianco px-4 text-[15px] font-medium text-verde-scuro has-[:checked]:border-verde-scuro has-[:checked]:bg-verde-scuro has-[:checked]:text-carta has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-verde-scuro"
        >
          <input
            type="radio"
            name="motion"
            value={value}
            checked={mode === value}
            onChange={() => setMode(value)}
            className="sr-only"
          />
          {label}
        </label>
      ))}
    </fieldset>
  );
}
