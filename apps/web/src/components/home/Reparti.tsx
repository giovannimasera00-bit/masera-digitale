"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@masera/ui";
import { links, reparti } from "@/content/home";

/** I reparti come schede (tab), navigabili anche con le frecce della tastiera. */
export function Reparti() {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const r = reparti[sel]!;

  const onKey = (e: KeyboardEvent) => {
    const last = reparti.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? (sel === last ? 0 : sel + 1)
      : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (sel === 0 ? last : sel - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="reparti" aria-labelledby="reparti-t" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 md:px-8 md:py-24">
      <div className="max-w-2xl">
        <h2 id="reparti-t" className="fm-display text-[40px] leading-tight md:text-[56px]">
          I nostri reparti.
        </h2>
        <p className="mt-3 text-[18px] text-verde">Marchi scelti uno per uno e una farmacista che ti consiglia, al banco o in chat.</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div role="tablist" aria-label="Reparti" aria-orientation="vertical" onKeyDown={onKey} className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {reparti.map((x, i) => (
            <button
              key={x.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`tab-${i}`}
              role="tab"
              type="button"
              aria-selected={sel === i}
              aria-controls="reparto-panel"
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
              className={`fm-focus fm-press flex min-h-12 shrink-0 items-center justify-between gap-4 rounded-2xl px-5 py-3 text-left ${
                sel === i ? "bg-verde-scuro text-carta" : "text-verde-scuro hover:bg-beige-chiaro/60"
              }`}
            >
              <span className="fm-display text-[24px] lg:text-[28px]">{x.name}</span>
              <span aria-hidden className={`hidden lg:inline ${sel === i ? "" : "invisible"}`}>
                →
              </span>
            </button>
          ))}
        </div>

        <div id="reparto-panel" role="tabpanel" aria-labelledby={`tab-${sel}`} className="rounded-3xl bg-bianco p-7 md:p-10">
          <div key={sel} className="fm-swap">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-verde">Reparto {r.name}</p>
            <p className="fm-display mt-3 text-[30px] leading-tight md:text-[38px]">{r.title}</p>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed">{r.text}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Marchi">
              {r.brands.map((b) => (
                <li key={b} className="rounded-full border border-beige-scuro px-4 py-2 text-[15px] font-medium">
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="primario" href={r.href}>
                {r.cta}
              </Button>
              <Button variant="secondario" href={links.whatsapp}>
                Chiedi consiglio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
