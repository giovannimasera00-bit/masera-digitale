// Testi del tour del robot: dal prototipo design/canvas/Robot.dc.html e dai dati tecnici di data/farmacia.json (BRIEF §3, §7.2).
// Numeri non ancora forniti dal costruttore: [DA CONFERMARE].
import { farmacia } from "@masera/core";

const r = farmacia.robot;
const num = (n: number) => n.toLocaleString("it-IT", { maximumFractionDigits: 2 });

export const robotStats = [
  { v: `${num(r.length_m)} m`, l: "di lunghezza" },
  { v: `${num(r.height_m)} m`, l: "di altezza" },
  { v: String(r.chutes), l: "scivoli a spirale fino al banco" },
  { v: "Vetro", l: "tutti i ripiani interni" },
];

export const robotSteps = [
  {
    title: "Il caricatore",
    text: "Quando arrivano i farmaci dal fornitore li versiamo nella tramoggia del caricatore. Lui li prende uno alla volta, li riconosce e li manda dentro il robot. Le confezioni speciali si caricano a mano dalla mensola laterale.",
    img: "/img/robot-1-caricatore.webp",
    alt: "Il caricatore del robot, con lo schermo di controllo.",
  },
  {
    title: "Gli scaffali in vetro",
    text: "Dentro ci sono file e file di ripiani in vetro, alti fino a quasi 4 metri. Ogni confezione ha il suo posto e il robot sa sempre dove si trova, senza mai confondere un farmaco con un altro.",
    img: "/img/robot-2-scaffali.webp",
    alt: "I ripiani in vetro pieni di confezioni.",
  },
  {
    title: "Il braccio",
    text: "Quando la farmacista ti serve, chiede il farmaco dal computer al banco. Il braccio corre lungo il corridoio centrale, sale all'altezza giusta e prende la confezione.",
    img: "/img/robot-3-braccio.webp",
    alt: "Il corridoio centrale del robot, dove corre il braccio tra gli scaffali.",
  },
  {
    title: "Il nastro",
    text: "La confezione viaggia su un nastro sopra la farmacia, nascosto alla vista. Uno scambio la manda verso il banco giusto, quello dove sei tu.",
    img: "/img/robot-4-nastro.webp",
    alt: "La parte alta della farmacia, dove passa il nastro e iniziano gli scivoli.",
  },
  {
    title: "Lo scivolo a spirale",
    text: `L'ultimo tratto è uno scivolo a spirale che scende fino al banco, a portata di mano. Ce ne sono ${r.chutes}, uno per ogni zona del banco. La farmacista resta con te per tutto il tempo.`,
    img: "/img/robot-5-scivolo.webp",
    alt: "Lo scivolo a spirale che scende fino al banco.",
  },
];

export const robotGallery = [
  { img: "/img/robot-g-tramoggia.webp", alt: "Confezioni dentro la tramoggia del caricatore.", cap: "La tramoggia" },
  { img: "/img/robot-g-ripiani.webp", alt: "Confezioni ordinate su un ripiano.", cap: "I ripiani" },
  { img: "/img/robot-g-pannello.webp", alt: "Il pannello di controllo del robot.", cap: "Il pannello di controllo" },
  { img: "/img/robot-g-porta.webp", alt: "La porta in vetro che guarda dentro il robot.", cap: "La porta in vetro" },
];

/** "Per gli appassionati": scheda tecnica. */
export const robotSpecs: [string, string][] = [
  ["Modello", `${r.model}, ${r.maker}`],
  ["Braccio", `Manipolatore ${r.manipulator}`],
  ["Dimensioni", `${num(r.length_m)} m di lunghezza × ${num(r.height_m)} m di altezza`],
  ["Ripiani", "In vetro, pannelli esterni bianchi (RAL 9016)"],
  ["Carico", "Caricatore automatico con tramoggia, più una mensola per il carico semiautomatico"],
  ["Confezione più alta", `${r.max_pack_height_mm} mm`],
  ["Uscita", `Nastro con deviatori e ${r.chutes} scivoli elicoidali fino al banco (altezza ${r.counter_height_cm} cm)`],
  ["Confezioni gestite", r.packs_capacity],
  ["Tempo per un prelievo", r.seconds_per_pick],
  ["In servizio dal", new Date(r.installed).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })],
];
