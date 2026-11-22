"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { formatDuration, formatPrice, treatmentSlug, type TreatmentGroup } from "@masera/core";

type Tab = { slug: string; label: string; groups: TreatmentGroup[]; estimate: boolean; note?: string };

/** Listino a schede: Viso · Corpo · Laser · Cera e mani-piedi · Miamo Lounge. */
export function TreatmentTabs({ tabs }: { tabs: Tab[] }) {
  const [sel, setSel] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = tabs[sel]!;
  const onKey = (e: KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const last = tabs.length - 1;
    const next = e.key === "Home" ? 0 : e.key === "End" ? last : e.key === "ArrowRight" ? (sel === last ? 0 : sel + 1) : sel === 0 ? last : sel - 1;
    setSel(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Categorie di trattamenti" onKeyDown={onKey} className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((x, i) => (
          <button
            key={x.slug}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`fe-tab-${x.slug}`}
            role="tab"
            type="button"
            aria-selected={sel === i}
            aria-controls="fe-panel"
            tabIndex={sel === i ? 0 : -1}
            onClick={() => setSel(i)}
            className={`fm-focus fm-press min-h-12 shrink-0 rounded-full border-2 px-5 text-[16px] font-semibold ${
              sel === i ? "border-verde-scuro bg-verde-scuro text-carta" : "border-verde-scuro/30 bg-bianco text-verde-scuro hover:border-verde-scuro"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div id="fe-panel" role="tabpanel" aria-labelledby={`fe-tab-${t.slug}`} className="mt-4 rounded-3xl bg-bianco p-5 md:p-8">
        <div key={t.slug} className="fm-swap">
          {t.groups.map((g) => (
            <div key={g.slug} className="mb-6 last:mb-0">
              {t.groups.length > 1 && <h3 className="fm-display mb-1 text-[24px] text-verde-scuro">{g.name}</h3>}
              <ul>
                {g.items.map((it) => (
                  <li key={it.name} className="flex items-center justify-between gap-4 border-t border-beige-chiaro py-3 first:border-t-0">
                    <span>
                      <b className="block text-[17px] font-semibold">{it.name}</b>
                      <span className="text-[15px] text-verde">
                        {t.estimate ? "circa " : ""}
                        {formatDuration(it.minutes)}
                        {it.package5plus1 ? ` · pacchetto 5+1: ${formatPrice(it.package5plus1)}` : ""}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <b className="fm-display text-[24px]">{formatPrice(it.price)}</b>
                      <a
                        href={`/prenota?servizio=${treatmentSlug(g.slug, it.name)}`}
                        aria-label={`Prenota: ${it.name}`}
                        className="fm-focus fm-press flex size-11 items-center justify-center rounded-full bg-mela text-verde-scuro"
                      >
                        <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {t.note && <p className="mt-4 text-[15px] text-verde">{t.note}</p>}
        </div>
      </div>
    </div>
  );
}
