import type { ReactNode } from "react";
import { ColorBar, RiseTitle } from "@masera/ui";

/** Testata delle pagine interne: occhiello, titolo che sale, barra a 5 colori, introduzione. */
export function PageHeader({
  kicker,
  lines,
  lead,
  children,
}: {
  kicker: string;
  lines: ReactNode[];
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-7xl px-4 pb-8 pt-10 md:px-8 md:pb-12 md:pt-16">
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-verde">{kicker}</p>
      <RiseTitle as="h1" className="mt-3 max-w-4xl text-[34px] leading-[1.05] hyphens-auto [overflow-wrap:anywhere] sm:text-[44px] md:text-[64px] md:hyphens-none" lines={lines} />
      <ColorBar className="mt-6 max-w-[220px]" height={6} />
      {lead && <div className="mt-6 max-w-3xl text-[18px] leading-relaxed">{lead}</div>}
      {children}
    </header>
  );
}
