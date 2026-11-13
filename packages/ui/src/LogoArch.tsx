"use client";
import { cx } from "./cx";
import { useInViewOnce } from "./use-in-view";

/**
 * Gli archi "a fontana" del logo, che si disegnano all'ingresso della pagina (stroke-dashoffset).
 * Disegno provvisorio: da sostituire con i tracciati del logo vettoriale appena disponibile.
 */
export function LogoArch({
  className,
  strokeWidth = 2.5,
  title,
}: {
  className?: string;
  strokeWidth?: number;
  title?: string;
}) {
  const { ref, inView } = useInViewOnce<SVGSVGElement>();
  return (
    <svg
      ref={ref}
      viewBox="0 0 220 142"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={cx("fm-arch", inView && "is-in", className)}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <path pathLength={1} d="M10 140V110a100 100 0 0 1 200 0V140" />
      <path pathLength={1} d="M40 140V110a70 70 0 0 1 140 0V140" />
      <path pathLength={1} d="M70 140V110a40 40 0 0 1 80 0V140" />
    </svg>
  );
}
