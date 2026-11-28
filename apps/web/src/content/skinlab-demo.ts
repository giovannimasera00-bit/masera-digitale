// Dati FINTI per provare il pannello SkinLab al banco. Prodotti e clienti inventati, segnati "(prova)".
// Le schede vere (EAN, capacità, passaggio, dose standard in ml) arriveranno dal catalogo, partendo dai marchi del BRIEF §10.
import type { StepCategory } from "@masera/core";

export type SkinProduct = { ean: string; name: string; category: StepCategory; capacity: number; unit: "ml" | "pz"; doseMl?: number };

export const skinDemoProducts: SkinProduct[] = [
  { ean: "8009990000016", name: "Detergente viso delicato (prova)", category: "detergente", capacity: 200, unit: "ml", doseMl: 1.5 },
  { ean: "8009990000023", name: "Tonico riequilibrante (prova)", category: "tonico", capacity: 200, unit: "ml" },
  { ean: "8009990000030", name: "Siero antiossidante (prova)", category: "siero", capacity: 30, unit: "ml", doseMl: 0.25 },
  { ean: "8009990000047", name: "Contorno occhi (prova)", category: "contorno_occhi", capacity: 15, unit: "ml" },
  { ean: "8009990000054", name: "Crema idratante (prova)", category: "crema", capacity: 50, unit: "ml", doseMl: 0.4 },
  { ean: "8009990000061", name: "Protezione solare SPF 50 (prova)", category: "protezione_solare", capacity: 50, unit: "ml", doseMl: 1 },
  { ean: "8009990000078", name: "Shampoo delicato (prova)", category: "shampoo", capacity: 200, unit: "ml", doseMl: 5 },
  { ean: "8009990000085", name: "Trattamento capelli (prova)", category: "trattamento", capacity: 150, unit: "ml" },
  { ean: "8009990000092", name: "Lozione anticaduta (prova)", category: "lozione", capacity: 60, unit: "ml", doseMl: 1 },
];

export const skinDemoCustomers: Record<string, { name: string; lastAnalysis: string | null }> = {
  A12345: { name: "Cliente di prova", lastAnalysis: "2026-10-02" },
  B54321: { name: "Seconda cliente di prova", lastAnalysis: null },
};
