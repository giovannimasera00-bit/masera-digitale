import { Reveal } from "@/components/Reveal";
import { bustineDays } from "@/content/galenico";

/** Illustrazione: una settimana di bustine che arrivano una dopo l'altra (ferma con "riduci movimento"). */
export function BustineStrip() {
  return (
    <div role="img" aria-label="Illustrazione: una striscia di sette bustine, una per ogni giorno della settimana." className="flex gap-1.5 sm:gap-2">
      {bustineDays.map((d, i) => (
        <Reveal key={d} delay={i * 110} className="flex-1">
          <div aria-hidden className="relative flex aspect-[3/4] flex-col items-center justify-between rounded-xl border-2 border-dashed border-carta/40 bg-carta/10 px-1 py-2 sm:rounded-2xl sm:py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-mela sm:text-[13px]">{d}</span>
            <span className="flex flex-wrap justify-center gap-1">
              {Array.from({ length: (i % 3) + 2 }).map((_, k) => (
                <span key={k} className={`block size-2.5 rounded-full sm:size-3.5 ${k % 2 ? "bg-beige-chiaro" : "bg-carta"}`} />
              ))}
            </span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
