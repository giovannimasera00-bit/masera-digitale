import type { Metadata } from "next";
import { PharmacyJsonLd } from "@/components/PharmacyJsonLd";
import { DeliveryZones } from "@/components/home/DeliveryZones";
import { Hero } from "@/components/home/Hero";
import { IeriOggi } from "@/components/home/IeriOggi";
import { MyMaseraTeaser } from "@/components/home/MyMaseraTeaser";
import { QuickActions } from "@/components/home/QuickActions";
import { Reparti } from "@/components/home/Reparti";
import { RobotTeaser } from "@/components/home/RobotTeaser";
import { ServicesMarquee } from "@/components/home/ServicesMarquee";
import { ZtlTeaser } from "@/components/home/ZtlTeaser";

export const metadata: Metadata = {
  title: { absolute: "Farmacia Masera · Seregno · Medicina per tradizione dal 1908" },
  description:
    "Farmacia Masera, Via Garibaldi 103, Seregno. Analisi e servizi su prenotazione, consegna in giornata gratuita a Seregno, spedizione in Italia gratis sopra 59 €.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <QuickActions />
      <DeliveryZones />
      <ServicesMarquee />
      <Reparti />
      <ZtlTeaser />
      <RobotTeaser />
      <IeriOggi />
      <MyMaseraTeaser />
      <PharmacyJsonLd url={process.env.NEXT_PUBLIC_SITE_URL ?? "https://farmaciamasera.com"} />
    </>
  );
}
