"use client";
import { useInViewOnce } from "@masera/ui/in-view";
import { reportExample } from "@/content/skinlab";
import "./skinlab.css";

/** Report di esempio: la scansione passa sul viso (due volte, poi si ferma) e le barre si riempiono. */
export function ReportExample() {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={`sk-report rounded-3xl bg-bianco p-6 text-tortora-4 shadow-2xl shadow-black/20 ${inView ? "is-in" : ""}`}>
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-tortora-3">Il tuo report · esempio</p>
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-carta">
        <svg viewBox="0 0 300 190" aria-hidden className="block h-auto w-full">
          <g fill="none" stroke="#8C7D6C" strokeWidth="1.5" opacity=".7">
            <ellipse cx="150" cy="96" rx="62" ry="80" />
            <path d="M122 80q8-6 16 0M162 80q8-6 16 0M140 122q10 8 20 0" />
          </g>
        </svg>
        <div aria-hidden className="sk-scan absolute inset-x-0 top-0 h-1 bg-tortora-2/70 shadow-[0_0_18px_4px_rgb(140_125_108/0.45)]" />
      </div>
      <ul className="mt-5 space-y-3" aria-label="Parametri di esempio">
        {reportExample.map((p, i) => (
          <li key={p.n}>
            <div className="flex justify-between text-[15px]">
              <b className="font-semibold">{p.n}</b>
              <span>{p.v}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-tortora-1/40">
              <div className="sk-fill h-full rounded-full bg-tortora-3" style={{ width: `${p.w * 100}%`, animationDelay: `${600 + i * 150}ms` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[13px] text-tortora-3">Esempio illustrativo: il report vero lo ricevi dopo la tua analisi.</p>
    </div>
  );
}
