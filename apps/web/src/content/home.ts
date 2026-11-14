// Testi della homepage. Prezzi, durate, orari e regole di consegna NON si scrivono qui:
// arrivano da data/*.json tramite @masera/core. Più avanti questi testi passeranno su Sanity.
import { formatPrice, minPrice, service } from "@masera/core";

/**
 * Funzioni non ancora attive: al loro posto il sito mostra "in arrivo" e nessun link.
 * Quando una funzione è pronta basta mettere true qui.
 */
export const features = {
  shop: false, // Fase 2
  mymasera: false, // Fase 2
  ricetta: false, // Fase 2 – Invia una ricetta
  videoconsulenza: false, // Fase 3
};
export type Feature = keyof typeof features;
export const isOn = (f?: Feature) => (f ? features[f] : true);
/** La funzione a cui appartiene un elemento dei testi (se ce l'ha). */
export const featureOf = (x: object): Feature | undefined => ("feature" in x ? (x.feature as Feature) : undefined);

export const links = {
  prenota: "/prenota",
  shop: "/shop",
  ricetta: "/ricetta",
  ztl: "/ztl",
  robot: "/robot",
  famiglia: "/famiglia",
  servizi: "/servizi",
  skinlab: "/skinlab",
  galenico: "/galenico",
  my: "/my",
  contatti: "/contatti",
  whatsapp: "https://wa.me/393737705485",
} as const;

export const nav: { label: string; href: string; feature?: Feature }[] = [
  { label: "Servizi", href: links.servizi },
  { label: "Reparti", href: "/#reparti" },
  { label: "Shop", href: links.shop, feature: "shop" },
  { label: "Ricette", href: links.ricetta, feature: "ricetta" },
  { label: "Il robot", href: links.robot },
  { label: "La famiglia", href: links.famiglia },
];

const ecg = service("ecg");
const holterP = service("holter-pressorio");
const pelle = service("analisi-pelle-viso");
const video = service("videoconsulenza");
const glicata = service("emoglobina-glicata");

/** "Di cosa hai bisogno oggi?" — la card "consegna" è calcolata in tempo reale. */
export const needs = [
  { id: "consegna", label: "Consegna" },
  {
    id: "analisi",
    label: "Analisi",
    kicker: "Autoanalisi in farmacia",
    badge: `${glicata.duration_min} min`,
    title: "Il risultato in pochi minuti.",
    text: "Emoglobina glicata, vitamina D, colesterolo, emocromo e altre analisi da una goccia di sangue.",
    note: `Da ${formatPrice(minPrice("sangue-urine"))} · emoglobina glicata ${formatPrice(glicata.price_eur)}`,
    cta: "Prenota",
    href: links.prenota,
  },
  {
    id: "cuore",
    label: "Cuore",
    kicker: "Telemedicina",
    badge: `${ecg.duration_min} min`,
    title: "ECG e Holter in farmacia.",
    text: "L'esame lo fai qui, il referto lo firma un cardiologo. Prima dell'ECG depila il petto.",
    note: `ECG ${formatPrice(ecg.price_eur)} · Holter da ${formatPrice(holterP.price_eur)}`,
    cta: "Prenota",
    href: links.prenota,
  },
  {
    id: "pelle",
    label: "Pelle",
    kicker: "Skin LAB",
    badge: `${pelle.duration_min} min`,
    title: "Analisi della pelle.",
    text: "La farmacista analizza la tua pelle e ti prepara la routine, che ritrovi passo per passo in MyMasera.",
    note: `${formatPrice(pelle.price_eur)}, scalabili sull'acquisto dei prodotti consigliati`,
    cta: "Prenota l'analisi",
    href: links.skinlab,
  },
  {
    id: "ricetta",
    label: "Ricetta",
    kicker: "Solo per Seregno",
    badge: "Per legge",
    title: "Mandaci la ricetta.",
    text: "Mandaci la foto o il codice della ricetta elettronica: ti rispondiamo con il preventivo. L'originale serve comunque.",
    note: "Ritiro in farmacia, al locker o consegna in serata",
    cta: "Invia la ricetta",
    href: links.ricetta,
    feature: "ricetta",
  },
] as const;

export const quickActions = [
  {
    n: "01",
    title: "Prenota un servizio",
    text: `Analisi del sangue in ${glicata.duration_min} minuti, ECG e Holter in mezz'ora, Skin LAB, Farmaestetica.`,
    cta: "Vedi gli orari liberi",
    href: links.prenota,
    tone: "bianco",
  },
  {
    n: "02",
    title: "Il consiglio giusto, anche online",
    text: "Non inseguiamo lo sconto: ti aiutiamo a scegliere il prodotto giusto. A Seregno arriva in giornata.",
    cta: "Vai allo shop",
    href: links.shop,
    feature: "shop",
    tone: "beige",
  },
  {
    n: "03",
    title: "Ricetta, solo Seregno",
    text: "Fotografa la ricetta e ti mandiamo il preventivo. Per legge vale solo a Seregno.",
    cta: "Invia la ricetta",
    href: links.ricetta,
    feature: "ricetta",
    tone: "salvia",
  },
  {
    n: "04",
    title: "Videoconsulenza",
    text: `${video.duration_min} minuti con una farmacista a ${formatPrice(video.price_eur)}, interamente scalati dalla spesa entro 12 mesi.`,
    cta: "Prenota la chiamata",
    href: links.prenota,
    feature: "videoconsulenza",
    tone: "scuro",
  },
] as const;

export const marquee = [
  "Analisi del sangue",
  "ECG e Holter",
  "Teledermatologia",
  "Skin LAB",
  "Laboratorio galenico",
  "Deblistering",
  "Vaccini",
  "Farmaestetica",
  "Intolleranze e allergie",
  "Tamponi",
];

export const reparti: { name: string; title: string; text: string; brands: string[]; cta: string; href: string; feature?: Feature }[] = [
  {
    name: "Dermocosmesi",
    title: "Pelle e bellezza, con il consiglio delle farmaciste.",
    text: "Marchi scelti uno per uno e l'analisi Skin LAB per trovare la routine adatta alla tua pelle.",
    brands: ["Miamo", "SkinCeuticals", "La Roche-Posay", "Caudalie", "Dolomia", "Bakel", "Farmacisti Preparatori", "Ceramol", "Dercos", "Triunico"],
    cta: "Vedi la dermocosmesi",
    href: "/shop/dermocosmesi",
    feature: "shop",
  },
  {
    name: "Integratori",
    title: "L'integratore giusto, al momento giusto.",
    text: "Dai migliori marchi alla linea Dottor Masera, formulata dal Dott. Giuseppe Masera. Non ti vendiamo il più scontato: ti consigliamo quello adatto a te.",
    brands: ["Dottor Masera", "LDF", "Unifarco"],
    cta: "Scopri la linea Dottor Masera",
    href: "/linee/dottor-masera",
    feature: "shop",
  },
  {
    name: "Alimenti speciali",
    title: "Nutrizione funzionale in farmacia.",
    text: "Alimenti proteici, low carb, aproteici, senza glutine e senza lattosio.",
    brands: ["Keylife", "Dietalab"],
    cta: "Vedi gli alimenti",
    href: "/shop/alimenti-speciali",
    feature: "shop",
  },
  {
    name: "Veterinaria",
    title: "Per cani e gatti.",
    text: "Antiparassitari, integratori e prodotti per l'igiene. Scrivici prima e lo trovi pronto.",
    brands: ["[DA CONFERMARE i marchi]"],
    cta: "Vedi la veterinaria",
    href: "/shop/veterinaria",
    feature: "shop",
  },
  {
    name: "Galenica",
    title: "Il nostro laboratorio galenico.",
    text: "Preparazioni officinali senza ricetta e magistrali su prescrizione, fatte per la singola persona. Prima ti mandiamo il preventivo.",
    brands: ["Preparazioni officinali", "Preparazioni magistrali", "Gel all'Arnica del Dottor Masera"],
    cta: "Scopri il laboratorio",
    href: links.galenico,
  },
];

export const myMaseraFeatures = [
  { t: "Carta fedeltà", d: "La tessera nel telefono, con il saldo punti sempre aggiornato." },
  { t: "Prenotazioni", d: "Sposti o annulli un appuntamento da solo, con il promemoria." },
  { t: "SkinLab Routine", d: "La routine consigliata al banco, passo per passo, mattina e sera." },
  { t: "Ricette e preventivi", d: "A Seregno mandi la foto, approvi il preventivo e ricevi a casa." },
];
