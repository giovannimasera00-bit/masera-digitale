"use client";
import { barColors } from "./tokens";
import { cx } from "./cx";
import { useInViewOnce } from "./use-in-view";

const bg: Record<string, string> = {
  verde_scuro: "bg-verde-scuro",
  mela: "bg-mela",
  salvia: "bg-salvia",
  beige_chiaro: "bg-beige-chiaro",
  beige_scuro: "bg-beige-scuro",
};

/**
 * Barra a 5 colori. Senza `progress` è decorativa (piè di sezione).
 * Con `progress` (0–1) diventa un indicatore di avanzamento: consegna, routine, punti.
 */
export function ColorBar({
  progress,
  label,
  className,
  height = 8,
}: {
  progress?: number;
  label?: string;
  className?: string;
  height?: number;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const isMeter = progress !== undefined;
  const p = isMeter ? Math.min(1, Math.max(0, progress)) : 1;
  return (
    <div
      ref={ref}
      className={cx("fm-bar relative w-full overflow-hidden rounded-full", isMeter && "bg-beige-chiaro/70", inView && "is-in", className)}
      style={{ height }}
      {...(isMeter
        ? { role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(p * 100) }
        : { "aria-hidden": true })}
    >
      <div className="fm-bar-fill absolute inset-y-0 left-0 flex" style={{ width: `${p * 100}%` }}>
        {barColors.map((c) => (
          <span key={c} className={cx("h-full flex-1", bg[c])} />
        ))}
      </div>
    </div>
  );
}
