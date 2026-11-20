"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { skinlabTabs } from "@/content/skinlab";

/** Schede "Viso" / "Cuoio capelluto" su fondo tortora scuro. */
export function SkinlabTabs() {
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = skinlabTabs[sel]!;
  const onKey = (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const last = skinlabTabs.length - 1;
    const next = e.key === "Home" ? 0 : e.key === "End" ? last : e.key === "ArrowRight" ? (sel === last ? 0 : sel + 1) : sel === 0 ? last : sel - 1;
    setSel(next);
    tabs.current[next]?.focus();
  };
  return (
    <div className="rounded-3xl bg-tortora-4 p-6 text-carta md:p-8">
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-tortora-1">Le analisi</p>
      <div role="tablist" aria-label="Tipo di analisi" onKeyDown={onKey} className="mt-4 inline-flex rounded-full bg-carta/10 p-1">
        {skinlabTabs.map((x, i) => (
          <button
            key={x.label}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`sk-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={sel === i}
            aria-controls="sk-panel"
            tabIndex={sel === i ? 0 : -1}
            onClick={() => setSel(i)}
            className={`fm-focus min-h-11 rounded-full px-5 text-[16px] font-semibold ${sel === i ? "bg-carta text-tortora-4" : "text-carta"}`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div id="sk-panel" role="tabpanel" aria-labelledby={`sk-tab-${sel}`} className="mt-6">
        <div key={sel} className="fm-swap">
          <h3 className="fm-display text-[30px] leading-tight md:text-[34px]">{t.title}</h3>
          <p className="mt-3 text-[17px] leading-relaxed text-tortora-1">{t.text}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {t.facts.map((f) => (
              <li key={f} className="rounded-full border border-carta/30 px-4 py-2 text-[15px]">
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[16px]">
            <span className="font-semibold">Come prepararti:</span> <span className="text-tortora-1">{t.prep}</span>
          </p>
          <a href={t.href} className="fm-focus fm-press mt-6 inline-flex min-h-12 items-center rounded-full bg-carta px-6 text-[17px] font-semibold text-tortora-4">
            Prenota
          </a>
        </div>
      </div>
    </div>
  );
}
