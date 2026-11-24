// Testi del laboratorio galenico (BRIEF §11) e del deblistering (BRIEF §11).
// Prezzi del deblistering da data/farmacia.json tramite @masera/core. Mai nominare fornitori software.
import { deblisteringPerDay, deblisteringPerMonth, formatPrice, service } from "@masera/core";

/** Panoramica secondo la Farmacopea Ufficiale Italiana. */
export const galenicoKinds = [
  {
    tag: "Senza ricetta",
    title: "Preparazioni officinali",
    text: "Le prepariamo in laboratorio seguendo le formule della Farmacopea Ufficiale Italiana. Le chiedi al banco, come un prodotto qualsiasi.",
    items: ["Tinture madri", "Gel e pomate per uso topico", "Preparazioni fitoterapiche", "Il Gel all'Arnica del Dottor Masera, uno dei nostri storici"],
  },
  {
    tag: "Su prescrizione",
    title: "Preparazioni magistrali",
    text: "Le prepariamo su misura per te, seguendo la ricetta del tuo medico: dose, forma e quantità pensate per una sola persona.",
    items: ["Capsule e compresse", "Pomate e creme dermatologiche", "Lozioni e gel", "Preparazioni liquide non sterili"],
  },
];

export const galenicoSteps = [
  { n: "01", t: "Porti la ricetta", d: "Al banco, con la ricetta originale del medico: è obbligatoria per legge." },
  { n: "02", t: "Ti mandiamo il preventivo", d: "La farmacista valuta la preparazione e ti dice prezzo e tempi prima di cominciare." },
  { n: "03", t: "La prepariamo", d: "Quando approvi, la preparazione passa in laboratorio: ti avvisiamo che è in preparazione." },
  { n: "04", t: "È pronta", d: "Ti avvisiamo quando puoi ritirarla in farmacia." },
];

// ——— Deblistering ———

const chiacchierata = service("chiacchierata-deblistering");
export const prenotaChiacchierata = `/prenota?servizio=${chiacchierata.slug}`;
export const chiacchierataInfo = `${formatPrice(chiacchierata.price_eur)} · circa ${chiacchierata.duration_min} minuti`;

export const deblisteringPrice = {
  day: formatPrice(deblisteringPerDay), // "1 €"
  month: formatPrice(deblisteringPerMonth), // "28 €"
};

export const deblisteringSteps = [
  { n: "01", t: "Verifichiamo la terapia", d: "Guardiamo insieme tutti i farmaci che prendi, con dosi e orari, e controlliamo che vadano d'accordo." },
  { n: "02", t: "Parliamo con il medico", d: "Se serve una ricetta nuova o un chiarimento, lo chiediamo noi al tuo medico." },
  { n: "03", t: "Prepariamo le bustine", d: "Ogni bustina contiene le compresse di un momento della giornata. Ogni preparazione passa un doppio controllo." },
  { n: "04", t: "Le ritiri", d: "Passi in farmacia e ritiri le bustine già pronte, in ordine." },
];

export const deblisteringFor = [
  {
    t: "Per chi prende tante pastiglie",
    d: "Niente più scatole aperte sul tavolo e dubbi sull'ora: apri la bustina del momento giusto e prendi quello che c'è dentro.",
  },
  {
    t: "Per chi si prende cura di qualcuno",
    d: "Segui la terapia di un genitore o di un familiare? Le bustine pronte ti tolgono il lavoro di dividere le compresse ogni settimana.",
  },
  {
    t: "Per RSA e comunità",
    d: "Prepariamo in bustine le terapie di più ospiti, una per persona. Parliamone: le condizioni le definiamo insieme.",
  },
];

/** Giorni della striscia di bustine illustrata. */
export const bustineDays = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
