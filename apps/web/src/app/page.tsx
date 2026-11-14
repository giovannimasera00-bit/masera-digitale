import type { Metadata } from "next";
import { PharmacyJsonLd } from "@/components/PharmacyJsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StatusBar } from "@/components/StatusBar";
import { DeliveryZones } from "@/components/home/DeliveryZones";
import { Hero } from "@/components/home/Hero";
import { IeriOggi } from "@/components/home/IeriOggi";
import { MyMaseraTeaser } from "@/components/home/MyMaseraTeaser";
import { QuickActions } from "@/components/home/QuickActions";
import { Reparti } from "@/components/home/Reparti";
import { RobotTeaser } from "@/components/home/RobotTeaser";
import { ServicesMarquee } from "@/components/home/ServicesMarquee";
import { ZtlTeaser } from "@/components/home/ZtlTeaser";

// Aperto ora e consegna dipendono dall'ora: la pagina si calcola a ogni visita.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Farmacia Masera · Seregno · Medicina per tradizione dal 1908" },
  description:
    "Farmacia Masera, Via Garibaldi 103, Seregno. Analisi e servizi su prenotazione, consegna in giornata gratuita a Seregno, spedizione in Italia gratis sopra 59 €.",
};

export default function Home() {
  return (
    <>
      <a href="#contenuto" className="fm-focus sr-only z-50 rounded-full bg-carta px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Vai al contenuto
      </a>
      <StatusBar />
      <SiteHeader />
      <main id="contenuto">
        <Hero />
        <QuickActions />
        <DeliveryZones />
        <ServicesMarquee />
        <Reparti />
        <ZtlTeaser />
        <RobotTeaser />
        <IeriOggi />
        <MyMaseraTeaser />
      </main>
      <SiteFooter />
      <PharmacyJsonLd url={process.env.NEXT_PUBLIC_SITE_URL ?? "https://farmaciamasera.com"} />
    </>
  );
}
