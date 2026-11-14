// Testi delle pagine Servizi. Prezzi, durate e preparazioni stanno in data/servizi.json.
import { farmacia } from "@masera/core";
import type { Feature } from "./home";

export const prenotaHref = (slug: string) => `/prenota?servizio=${encodeURIComponent(slug)}`;

export const resourceLabel: Record<string, string> = {
  cabina_analisi: "Cabina analisi",
  skinlab: "Cabina Skin LAB",
  video: "Videochiamata",
};

export const whatsappNumber = farmacia.whatsapp.replace("+39 ", "");

/** "Anche in farmacia": servizi con una pagina tutta loro. */
export const otherServices: { title: string; text: string; href: string; feature?: Feature }[] = [
  { title: "Skin LAB", text: "Analisi della pelle e la tua routine, passo per passo.", href: "/skinlab" },
  { title: "Farmaestetica", text: "Trattamenti viso e corpo al piano 1, by Dottor Masera.", href: "/farmaestetica" },
  { title: "Laboratorio galenico", text: "Preparazioni officinali e magistrali, fatte per te.", href: "/galenico" },
  { title: "Deblistering", text: `La terapia pronta in bustine: ${farmacia.deblistering.price_per_day_eur} € al giorno. Prima chiacchierata gratuita.`, href: "/deblistering" },
  { title: "Videoconsulenza", text: "15 minuti con una farmacista, interamente scalati dalla spesa.", href: "/prenota?servizio=videoconsulenza", feature: "videoconsulenza" },
];
