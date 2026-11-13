"use client";
import type { ElementType, ReactNode } from "react";
import { cx } from "./cx";
import { useInViewOnce } from "./use-in-view";

/**
 * Titolo che sale una riga alla volta (150 ms tra una riga e l'altra).
 * Ogni elemento di `lines` è una riga. Resta un unico titolo per i lettori di schermo.
 */
export function RiseTitle({
  lines,
  as: Tag = "h2",
  className,
  stagger = 150,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  stagger?: number;
}) {
  const { ref, inView } = useInViewOnce<HTMLHeadingElement>();
  return (
    <Tag ref={ref} className={cx("fm-display fm-rise", inView && "is-in", className)}>
      {lines.map((line, i) => (
        <span key={i} className="fm-rise-line" style={{ animationDelay: `${i * stagger}ms` }}>
          {line}
        </span>
      ))}
    </Tag>
  );
}
