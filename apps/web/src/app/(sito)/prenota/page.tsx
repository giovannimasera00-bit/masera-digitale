import type { Metadata } from "next";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { BookingFlow } from "@/components/prenota/BookingFlow";

export const metadata: Metadata = {
  title: "Prenota un servizio",
  description: "Agenda Masera: prenota analisi, ECG, Holter e Skin LAB alla Farmacia Masera di Seregno. Vedi solo gli orari davvero liberi.",
};

export default async function PrenotaPage({ searchParams }: { searchParams: Promise<{ servizio?: string | string[] }> }) {
  const sp = await searchParams;
  const servizio = typeof sp.servizio === "string" ? sp.servizio : undefined;
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
      <BookingFlow nowIso={new Date().toISOString()} initialService={servizio} />
    </>
  );
}
