"use client";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useInViewOnce } from "@masera/ui/in-view";
import { robotSteps } from "@/content/robot";
import "./robot.css";

/**
 * Tour del robot: schema in sezione con la confezione rossa che fa il percorso
 * (caricatore → scaffali → braccio → nastro → scivolo → banco) e le 5 tappe con foto.
 * Scegliendo una tappa, la parte corrispondente si illumina nello schema.
 */
export function RobotTour() {
  const [step, setStep] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = step ?? 0;
  const s = robotSteps[current]!;
  const last = robotSteps.length - 1;

  const go = (i: number, focus = false) => {
    setStep(i);
    if (focus) tabs.current[i]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (current === last ? 0 : current + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (current === 0 ? last : current - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    go(next, true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      <figure className="relative rounded-3xl bg-verde-scuro p-3 md:p-5">
        <Schema key={run} highlight={step} />
        <figcaption className="px-2 pt-3 text-[15px] text-beige-chiaro">
          Schema semplificato: la confezione rossa fa il percorso completo, dal caricatore al banco.
        </figcaption>
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="rb-replay fm-focus absolute right-4 top-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-carta/90 px-4 text-[14px] font-semibold text-verde-scuro"
        >
          <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9M2.5 2.5v3h3" />
          </svg>
          Rivedi
        </button>
      </figure>

      <div>
        <div role="tablist" aria-label="Le parti del robot" onKeyDown={onKey} className="flex flex-wrap gap-2">
          {robotSteps.map((x, i) => (
            <button
              key={x.title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`rb-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={current === i}
              aria-controls="rb-panel"
              tabIndex={current === i ? 0 : -1}
              onClick={() => go(i)}
              className={`fm-focus fm-press inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 text-[15px] font-semibold ${
                current === i ? "border-verde-scuro bg-verde-scuro text-carta" : "border-beige-scuro bg-bianco text-verde-scuro hover:border-verde-scuro"
              }`}
            >
              <span aria-hidden className={`flex size-6 items-center justify-center rounded-full text-[13px] ${current === i ? "bg-mela text-verde-scuro" : "bg-beige-chiaro"}`}>
                {i + 1}
              </span>
              {capitalize(x.title.replace(/^(Il|Lo|Gli|La) /, ""))}
            </button>
          ))}
        </div>

        <div id="rb-panel" role="tabpanel" aria-labelledby={`rb-tab-${current}`} className="mt-4 overflow-hidden rounded-3xl bg-bianco">
          <div key={current} className="fm-swap">
            <Image src={s.img} alt={s.alt} width={900} height={1125} sizes="(min-width: 1024px) 520px, 100vw" className="aspect-[16/10] w-full bg-beige-chiaro object-cover" />
            <div className="p-6 md:p-7">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-verde">
                Parte {current + 1} di {robotSteps.length}
              </p>
              <h3 className="fm-display mt-2 text-[30px] leading-tight md:text-[34px]">{s.title}</h3>
              <p className="mt-2 text-[17px] leading-relaxed">{s.text}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <NavButton onClick={() => go(current === 0 ? last : current - 1)}>← Indietro</NavButton>
                <NavButton primary onClick={() => go(current === last ? 0 : current + 1)}>
                  {current === last ? "Ricomincia" : "Avanti →"}
                </NavButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const capitalize = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

function NavButton({ children, onClick, primary }: { children: ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fm-focus fm-press inline-flex min-h-12 items-center rounded-full px-5 text-[16px] font-semibold ${
        primary ? "bg-mela text-verde-scuro" : "border-2 border-verde text-verde"
      }`}
    >
      {children}
    </button>
  );
}

/** Lo schema SVG. `highlight` = indice della parte da evidenziare (null = tutte accese). */
function Schema({ highlight }: { highlight: number | null }) {
  const { ref, inView } = useInViewOnce<SVGSVGElement>("0px 0px -20% 0px");
  const op = (i: number) => (highlight === null || highlight === i ? 1 : 0.3);
  const Marker = ({ x, y, n }: { x: number; y: number; n: number }) => (
    <g transform={`translate(${x} ${y})`}>
      <circle r="13" fill="#A3BE19" />
      <text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1a2419">
        {n}
      </text>
    </g>
  );
  const shelves = [70, 100, 130, 160, 190, 220, 250, 280, 310];
  return (
    <svg
      ref={ref}
      viewBox="0 0 640 380"
      role="img"
      aria-label="Schema del robot: caricatore, scaffali, braccio, nastro e scivolo fino al banco. Una confezione fa tutto il percorso."
      className={`rb block h-auto w-full ${inView ? "is-in" : ""}`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <defs>
        <pattern id="rbGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#3a4b37" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="640" height="380" rx="16" fill="url(#rbGrid)" />
      <line x1="0" y1="352" x2="640" y2="352" stroke="#4d6249" strokeWidth="2" />

      {/* 1 · Caricatore */}
      <g className="rb-part" style={{ opacity: op(0) }}>
        <path d="M28 150h88l-14 30H42z" fill="#425D3A" stroke="#C9DB6A" strokeWidth="2" />
        <rect x="34" y="180" width="76" height="172" rx="6" fill="#F4F1E8" />
        <rect x="54" y="300" width="20" height="30" rx="3" fill="#2E3F2D" />
        <rect x="44" y="160" width="12" height="10" fill="#B7A999" />
        <rect x="62" y="156" width="12" height="14" fill="#9AB9AD" />
        <rect x="80" y="160" width="14" height="10" fill="#D6D2C4" />
        <Marker x={72} y={128} n={1} />
      </g>

      {/* 2 · Scaffali */}
      <g className="rb-part" style={{ opacity: op(1) }}>
        <rect x="128" y="40" width="300" height="312" rx="10" fill="none" stroke="#9AB9AD" strokeWidth="2" />
        <g stroke="#9AB9AD" strokeOpacity=".7" strokeWidth="2">
          {shelves.map((y) => (
            <g key={y}>
              <line x1="140" y1={y} x2="290" y2={y} />
              <line x1="350" y1={y} x2="420" y2={y} />
            </g>
          ))}
        </g>
        <g fill="#D6D2C4" opacity=".55">
          {[
            [146, 58, 14, 12], [166, 60, 10, 10], [182, 56, 16, 14], [210, 88, 14, 12], [150, 118, 18, 12], [236, 148, 12, 12], [160, 178, 14, 12],
            [250, 208, 16, 12], [176, 238, 12, 12], [220, 268, 14, 12], [360, 88, 14, 12], [384, 148, 16, 12], [366, 208, 12, 12], [396, 268, 14, 12],
          ].map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
          ))}
        </g>
        <Marker x={214} y={28} n={2} />
      </g>

      {/* 3 · Braccio */}
      <g className="rb-part" style={{ opacity: op(2) }}>
        <line x1="320" y1="44" x2="320" y2="348" stroke="#F4F1E8" strokeWidth="4" />
        <g className="rb-car">
          <rect x="300" y="26" width="40" height="22" rx="4" fill="#A3BE19" />
          <rect x="290" y="34" width="12" height="6" rx="2" fill="#C9DB6A" />
        </g>
        <Marker x={346} y={196} n={3} />
      </g>

      {/* 4 · Nastro */}
      <g className="rb-part" style={{ opacity: op(3) }}>
        <line x1="320" y1="30" x2="560" y2="30" stroke="#F4F1E8" strokeWidth="10" strokeLinecap="round" />
        <line className="rb-belt" x1="320" y1="30" x2="560" y2="30" stroke="#2E3F2D" strokeWidth="3" />
        <Marker x={470} y={10} n={4} />
      </g>

      {/* 5 · Scivolo e banco */}
      <g className="rb-part" style={{ opacity: op(4) }}>
        <path d="M560 34c30 20 30 30 0 50s-30 30 0 50-30 30 0 50 30 30 0 50-30 30 0 50" fill="none" stroke="#F4F1E8" strokeWidth="8" strokeLinecap="round" />
        <rect x="486" y="284" width="148" height="68" rx="6" fill="#425D3A" />
        <rect x="486" y="284" width="148" height="8" rx="3" fill="#9AB9AD" />
        <text x="560" y="326" textAnchor="middle" fontSize="13" fontWeight="700" fill="#F4F1E8" letterSpacing="1.5">
          BANCO
        </text>
        <Marker x={612} y={150} n={5} />
      </g>

      {/* La confezione */}
      <g className="rb-box">
        <rect x="-10" y="-8" width="20" height="16" rx="2" fill="#E04B3C" />
        <rect x="-10" y="-2" width="20" height="3" fill="#F4F1E8" />
      </g>
    </svg>
  );
}
