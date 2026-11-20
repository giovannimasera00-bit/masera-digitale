// Testi Skin LAB: dal prototipo design/canvas/SkinLabPage.dc.html e dal BRIEF §7.3.
// Prezzi e durate da data/servizi.json, trattamenti in cabina da data/miamo-lounge.json.
import { formatDuration, formatPrice, service } from "@masera/core";
import miamo from "../../../../data/miamo-lounge.json";

const viso = service("analisi-pelle-viso");
const capelli = service("analisi-cuoio-capelluto");

export const skinlabPrice = formatPrice(viso.price_eur); // "25 €"
export const prenotaViso = "/prenota?servizio=analisi-pelle-viso";
export const prenotaCapelli = "/prenota?servizio=analisi-cuoio-capelluto";

/** Report di esempio: livelli descrittivi, non numeri (è solo un'illustrazione). */
export const reportExample = [
  { n: "Idratazione", v: "Da migliorare", w: 0.42 },
  { n: "Sebo", v: "Nella norma", w: 0.6 },
  { n: "Elasticità", v: "Buona", w: 0.74 },
  { n: "Macchie", v: "Lievi", w: 0.3 },
];

export const skinlabSteps = [
  {
    n: "01",
    t: "Prenoti l'analisi",
    d: `Online o al banco. Dura circa ${viso.duration_min} minuti e costa ${skinlabPrice}, che poi scali dall'acquisto dei prodotti consigliati.`,
  },
  {
    n: "02",
    t: "Guardiamo la tua pelle",
    d: "La farmacista fa l'analisi strumentale e ti spiega i risultati con parole semplici, senza venderti niente a tutti i costi.",
  },
  {
    n: "03",
    t: "Ti portiamo a casa la routine",
    d: "Pochi prodotti scelti per te, con dosi e ordine. Presto la ritroverai passo per passo nell'app MyMasera, con il riordino quando stanno per finire.",
  },
];

export const skinlabTabs = [
  {
    label: "Viso",
    title: "Analisi della pelle del viso",
    text: "Con lo strumento SpectroSkin la farmacista misura diversi parametri della pelle del viso. Alla fine ti spiega cosa è emerso e, se vuoi, ricevi il report in PDF.",
    facts: [`Circa ${formatDuration(viso.duration_min)}`, `${skinlabPrice}, scalabili sui prodotti`, "Su appuntamento"],
    prep: viso.preparation,
    href: prenotaViso,
  },
  {
    label: "Cuoio capelluto",
    title: "Analisi di capelli e cuoio capelluto",
    text: "Con una microcamera osserviamo da vicino cuoio capelluto e capello, per capire il problema reale e scegliere il prodotto o il trattamento più adatto.",
    facts: [`Circa ${formatDuration(capelli.duration_min)}`, formatPrice(capelli.price_eur), "Su appuntamento"],
    prep: "Quando prenoti ti diciamo come prepararti.",
    href: prenotaCapelli,
  },
];

/** Marchi delle routine (BRIEF §3, dermocosmesi). */
export const skinlabBrands = ["Miamo", "SkinCeuticals", "La Roche-Posay", "Caudalie", "Dolomia", "Bakel", "Farmacisti Preparatori", "Ceramol", "Dercos", "Triunico"];

/** Ponte con Farmaestetica: trattamenti in cabina dalla routine (BRIEF §7.3). */
function miamoItem(name: string) {
  for (const line of miamo.lines) {
    const it = line.items.find((i) => i.name === name);
    if (it) return { name: it.name, price: formatPrice(it.price_eur), duration: `circa ${formatDuration(it.duration_min)}`, line: line.name };
  }
  throw new Error(`Trattamento non trovato in data/miamo-lounge.json: ${name}`);
}
export const cabinTreatments = [
  { ...miamoItem("Hydrashine"), for: "Per la pelle che ha bisogno di idratazione." },
  { ...miamoItem("Purity Skin"), for: "Per la pelle grassa o con imperfezioni." },
];
