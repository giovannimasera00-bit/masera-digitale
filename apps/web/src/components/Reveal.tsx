"use client";
import type { ElementType, ReactNode } from "react";
import { useInViewOnce } from "@masera/ui/in-view";

/** Il contenuto sale piano quando entra in vista (una volta). Fermo con "riduci movimento". */
export function Reveal({ as: Tag = "div", className = "", delay = 0, children }: { as?: ElementType; className?: string; delay?: number; children: ReactNode }) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  return (
    <Tag ref={ref} className={`fm-rise ${inView ? "is-in" : ""} ${className}`}>
      <div className="fm-rise-line" style={{ animationDelay: `${delay}ms` }}>
        {children}
      </div>
    </Tag>
  );
}
