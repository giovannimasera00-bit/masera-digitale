"use client";
import { useInViewOnce } from "@masera/ui/in-view";

/** Archi "a fontana" del logo, tono su tono, dietro al titolo. Si disegnano all'ingresso della pagina. */
export function HeroArches() {
  const { ref, inView } = useInViewOnce<SVGSVGElement>();
  const radii = [330, 270, 210, 150, 90];
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 1440 720"
      preserveAspectRatio="xMidYMax slice"
      className={`fm-arch pointer-events-none absolute inset-0 h-full w-full ${inView ? "is-in" : ""}`}
      fill="none"
      stroke="var(--color-salvia)"
      strokeOpacity="0.22"
      strokeWidth="1.6"
    >
      {radii.map((r, i) => {
        const cx = 1090;
        const top = 430 + i * 10;
        return <path key={r} pathLength={1} style={{ animationDelay: `${i * 150}ms` }} d={`M${cx - r} 720V${top}a${r} ${r} 0 0 1 ${2 * r} 0V720`} />;
      })}
    </svg>
  );
}
