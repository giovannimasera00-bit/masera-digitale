import type { Metadata } from "next";
import { addDays, BOOKING_WINDOW_DAYS, localNow, type Busy, type Closure } from "@masera/core";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { BookingFlow } from "@/components/prenota/BookingFlow";
import { agendaDbConfigured, fetchBusy, fetchClosures } from "@/lib/agenda-db";
import { demoBusy } from "@/content/prenota";

export const metadata: Metadata = {
  title: "Prenota un servizio",
  description: "Agenda Masera: prenota analisi, ECG, Holter e Skin LAB alla Farmacia Masera di Seregno. Vedi solo gli orari davvero liberi.",
};

export default async function PrenotaPage({ searchParams }: { searchParams: Promise<{ servizio?: string | string[] }> }) {
  const sp = await searchParams;
  const servizio = typeof sp.servizio === "string" ? sp.servizio : undefined;
  const now = new Date();

  // Con il database collegato (chiavi su Vercel: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY): orari veri.
  // Senza chiavi, o se il database non risponde: orari finti di prova.
  let mode: "db" | "demo" = "demo";
  let busy: Busy[] = [];
  let closures: Closure[] = [];
  if (agendaDbConfigured()) {
    const today = localNow(now).date;
    const last = addDays(today, BOOKING_WINDOW_DAYS - 1);
    try {
      [busy, closures] = await Promise.all([fetchBusy(today, last), fetchClosures(today, last)]);
      mode = "db";
    } catch (e) {
      console.error(e);
    }
  }
  if (mode === "demo") busy = demoBusy(now);

  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Prenota", href: "/prenota" },
        ]}
      />
      <PageHeader
        kicker="Agenda Masera"
        lines={["Prenota in pochi tocchi.", <span key="l" className="text-verde">Vedi solo i posti liberi.</span>]}
        lead="Scegli il servizio, il giorno e l'orario. Ti diciamo subito come prepararti."
      />
      <BookingFlow nowIso={now.toISOString()} initialService={servizio} mode={mode} busy={busy} closures={closures} />
    </>
  );
}
