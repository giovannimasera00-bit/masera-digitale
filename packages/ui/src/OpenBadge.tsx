"use client";
import { useEffect, useState } from "react";
import { farmaciaHours, getOpenStatus, type OpenStatus, type WeeklyHours } from "@masera/core";
import { cx } from "./cx";

/**
 * "Aperto ora · chiude alle 19:30", calcolato dagli orari in ora italiana.
 * Il server passa lo stato iniziale (niente salti al caricamento); il browser lo aggiorna ogni minuto.
 * `now` fisso serve solo per le prove (pagina /design).
 */
export function OpenBadge({
  initial,
  hours = farmaciaHours,
  now,
  className,
  tone = "light",
}: {
  initial?: OpenStatus;
  hours?: WeeklyHours;
  now?: Date;
  className?: string;
  /** "light" = pillola bianca; "dark" = solo testo carta, per la barra di stato su fondo scuro. */
  tone?: "light" | "dark";
}) {
  const fixed = now?.getTime();
  const [status, setStatus] = useState<OpenStatus>(() => initial ?? getOpenStatus(hours, now ?? new Date()));

  useEffect(() => {
    if (fixed !== undefined) {
      setStatus(getOpenStatus(hours, new Date(fixed)));
      return;
    }
    const tick = () => setStatus(getOpenStatus(hours, new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours, fixed]);

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2.5 whitespace-nowrap text-[15px] font-medium",
        tone === "light" ? "rounded-full bg-bianco px-4 min-h-10 text-verde-scuro" : "text-carta",
        className,
      )}
    >
      <span aria-hidden className={cx("size-2.5 shrink-0 rounded-full", status.open ? "bg-mela fm-breathe" : "bg-beige-scuro")} />
      {status.label}
    </span>
  );
}
