"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Button } from "@masera/ui";
import { features, isOn, links, nav } from "@/content/home";

/** Testata con menu principale. Sul telefono il menu si apre con un pulsante grande. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-beige-chiaro bg-carta/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 md:px-8">
        <Link href="/" className="fm-focus shrink-0 rounded-lg" aria-label="Farmacia Masera, torna alla home">
          <Image src="/img/logo-oriz-color.png" alt="" width={640} height={202} priority className="h-10 w-auto md:h-12" />
        </Link>

        <nav aria-label="Menu principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                {isOn(n.feature) ? (
                  <Link href={n.href} className="fm-focus rounded-full px-3 py-2 text-[16px] font-medium text-verde-scuro hover:bg-beige-chiaro/60">
                    {n.label}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-2 text-[16px] font-medium text-verde">
                    {n.label}
                    <span className="rounded-full bg-beige-chiaro px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">in arrivo</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Finché MyMasera non è attivo, il pulsante porta alla sezione che lo presenta ("in arrivo"). */}
          <Button href={features.mymasera ? links.my : "/#mymasera"} variant="primario" className="!min-h-11 !px-5">
            MyMasera
          </Button>
          <button
            type="button"
            className="fm-focus inline-flex size-12 items-center justify-center rounded-full border-2 border-beige-scuro text-verde-scuro lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 6h16M3 11h16M3 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      <nav id={menuId} aria-label="Menu principale" hidden={!open} className="border-t border-beige-chiaro lg:hidden">
        <ul className="mx-auto max-w-7xl px-4 py-2">
          {nav.map((n) => (
            <li key={n.href}>
              {isOn(n.feature) ? (
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="fm-focus flex min-h-12 items-center rounded-xl px-3 text-[18px] font-medium text-verde-scuro"
                >
                  {n.label}
                </Link>
              ) : (
                <span className="flex min-h-12 items-center gap-2 px-3 text-[18px] font-medium text-verde">
                  {n.label}
                  <span className="rounded-full bg-beige-chiaro px-2 py-0.5 text-[12px] font-semibold uppercase tracking-wide">in arrivo</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
