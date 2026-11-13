// Genera il CSS dei token dal blocco "brand" di data/farmacia.json.
// Nessun import: lo usa sia lo script `pnpm tokens` (Node) sia il test.

export interface Brand {
  colors: Record<string, string>;
  skinlab: string[];
  motion: {
    fast_ms: number; base_ms: number; slow_ms: number;
    ease_out: string; ease_in_out: string; spring: string; stagger_ms: number;
  };
}

const kebab = (s: string) => s.replace(/_/g, "-");

export function renderTokensCss(brand: Brand): string {
  const c = Object.entries(brand.colors).map(([k, v]) => `  --color-${kebab(k)}: ${v};`);
  const s = brand.skinlab.map((v, i) => `  --color-tortora-${i + 1}: ${v};`);
  const m = brand.motion;
  return `/* FILE GENERATO da data/farmacia.json con \`pnpm tokens\`. Non modificarlo a mano. */
@theme {
${c.join("\n")}
  --color-bianco: #FFFFFF;
${s.join("\n")}
  --ease-masera: ${m.ease_out};
  --ease-percorso: ${m.ease_in_out};
  --ease-molla: ${m.spring};
}

:root {
  --fm-dur-fast: ${m.fast_ms}ms;
  --fm-dur-base: ${m.base_ms}ms;
  --fm-dur-slow: ${m.slow_ms}ms;
  --fm-stagger: ${m.stagger_ms}ms;
}
`;
}
