"use client";
import { useState } from "react";
import { useInViewOnce } from "@masera/ui/in-view";
import { ztlMapSvg } from "./ztl-map-svg";
import "./ztl-map.css";

/**
 * Mappa ZTL animata, ravvicinata sull'incrocio Cairoli/Garibaldi (geometria reale da OpenStreetMap).
 * L'auto passa il varco, parcheggia nello stallo riservato, parte il timer di 30', compare la targa, "Tutto qui."
 * Si gioca una volta quando entra in vista; con "riduci movimento" mostra subito lo stato finale.
 * Usata in homepage, /ztl e (più avanti) /contatti.
 */
export function ZtlMap({ className = "" }: { className?: string }) {
  const [run, setRun] = useState(0);
  return (
    <figure className={`relative overflow-hidden rounded-3xl bg-[#162016] ${className}`}>
      <MapSvg key={run} />
      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        className="zm-replay fm-focus absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-carta/90 px-4 text-[14px] font-semibold text-verde-scuro"
      >
        <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9M2.5 2.5v3h3" />
        </svg>
        Rivedi il percorso
      </button>
    </figure>
  );
}

function MapSvg() {
  const { ref, inView } = useInViewOnce<SVGSVGElement>("0px 0px -20% 0px");
  return (
    <svg
      ref={ref}
      className={`zm block h-auto w-full ${inView ? "is-in" : ""}`}
      viewBox="0 0 800 440"
      role="img"
      aria-label="Mappa: da via Fratelli Cairoli si entra in ZTL al varco di via Garibaldi e si parcheggia negli spazi riservati davanti alla Farmacia Masera, al massimo 30 minuti. Al banco si comunica la targa."
      dangerouslySetInnerHTML={{ __html: ztlMapSvg }}
    />
  );
}
