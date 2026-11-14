import data from "../../../data/farmacia.json";

export const colors = { ...data.brand.colors, bianco: "#FFFFFF" } as const;
export const skinlab = data.brand.skinlab;
export const motion = {
  fast: data.brand.motion.fast_ms,
  base: data.brand.motion.base_ms,
  slow: data.brand.motion.slow_ms,
  easeOut: data.brand.motion.ease_out,
  easeInOut: data.brand.motion.ease_in_out,
  spring: data.brand.motion.spring,
  stagger: data.brand.motion.stagger_ms,
} as const;

export type ColorName = keyof typeof colors;

/** I 5 colori della barra, nell'ordine dell'immagine coordinata. */
export const barColors: ColorName[] = ["verde_scuro", "mela", "salvia", "beige_chiaro", "beige_scuro"];

/**
 * Tutte le coppie testo/sfondo ammesse nell'interfaccia.
 * Un componente nuovo che usa un'altra coppia va aggiunto qui: il test del contrasto la verifica.
 * "large" = testo grande (≥ 24 px, o ≥ 18,66 px in grassetto): basta 3:1.
 */
export const textPairs: { fg: ColorName; bg: ColorName; size: "normal" | "large"; where: string }[] = [
  { fg: "verde_scuro", bg: "carta", size: "normal", where: "testo principale" },
  { fg: "verde_scuro", bg: "bianco", size: "normal", where: "card bianche, chip" },
  { fg: "verde", bg: "carta", size: "normal", where: "link, pulsante secondario" },
  { fg: "verde", bg: "bianco", size: "normal", where: "link su card" },
  { fg: "nero", bg: "carta", size: "normal", where: "testi lunghi" },
  { fg: "carta", bg: "verde_scuro", size: "normal", where: "fondi pieni, pulsante primario, chip attivo" },
  { fg: "bianco", bg: "verde_scuro", size: "normal", where: "fondi pieni" },
  { fg: "carta", bg: "verde", size: "normal", where: "pulsante secondario pieno" },
  { fg: "beige_chiaro", bg: "verde_scuro", size: "normal", where: "testo secondario su fondo scuro" },
  { fg: "verde_scuro", bg: "mela", size: "normal", where: "pulsante CTA" },
  { fg: "verde_scuro", bg: "salvia", size: "normal", where: "Farmaestetica" },
  { fg: "verde_scuro", bg: "beige_chiaro", size: "normal", where: "card beige" },
  { fg: "verde_scuro", bg: "beige_scuro", size: "large", where: "titoli su beige scuro" },
  { fg: "mela", bg: "verde_scuro", size: "normal", where: "accento su fondo scuro" },
  { fg: "carta", bg: "nero", size: "normal", where: "barra di stato in cima" },
  { fg: "verde", bg: "beige_chiaro", size: "normal", where: "testi secondari su beige" },
  { fg: "verde_scuro", bg: "carta", size: "large", where: "striscia dei servizi" },
];
