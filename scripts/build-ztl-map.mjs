// Ricava la mappa ZTL per il sito da design/canvas/ZtlMap.dc.html (geometria reale da OpenStreetMap).
// Scrive apps/web/src/components/ztl/ztl-map-svg.ts. Si rilancia con: node scripts/build-ztl-map.mjs
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("design/canvas/ZtlMap.dc.html", "utf8");
const m = html.match(/<svg class="zm"[^>]*>([\s\S]*?)<\/svg>\s*<\/div>/);
if (!m) throw new Error("SVG della mappa non trovato");
let inner = m[1];

const replace = (from, to) => {
  if (!inner.includes(from)) throw new Error("non trovato: " + from);
  inner = inner.split(from).join(to);
};
// Font del sito (next/font) invece dei nomi di Google Fonts.
replace('font-family="DM Sans, Arial, sans-serif"', 'class="zm-sans"');
replace('font-family="Bodoni Moda, Georgia, serif" font-style="italic" font-weight="700"', 'class="zm-display"');
// Testo coerente con la barra di stato del sito.
replace("ACCESSO LIBERO", "ACCESSO CLIENTI");
// Pillola più larga per "CLIENTI", con la spunta staccata dal testo.
replace('<rect x="-78" y="-15" width="156" height="28" rx="14" fill="#A3BE19"></rect><text x="12"', '<rect x="-90" y="-15" width="180" height="28" rx="14" fill="#A3BE19"></rect><text x="14"');
replace('<path d="M-64 -1l5 5 8-9"', '<path d="M-76 -1l5 5 8-9"');
// Il segnale della farmacia non pulsa: si muovono da soli solo i dati in tempo reale.
replace('<circle class="zm-ping" r="18" fill="#A3BE19" opacity=".25"></circle>', '<circle r="18" fill="#A3BE19" opacity=".25"></circle>');
// "class" con più classi su un gruppo: unisco zm-in.. con zm-sans dove serve.
inner = inner.replace(/<g class="(zm-in\d+)" class="zm-sans">/g, '<g class="$1 zm-sans">');
inner = inner.replace(/<g class="zm-sans" class="(zm-[a-z0-9]+)">/g, '<g class="$1 zm-sans">');

const out = `// FILE GENERATO da design/canvas/ZtlMap.dc.html con \`node scripts/build-ztl-map.mjs\`. Non modificarlo a mano.
export const ztlMapSvg = ${JSON.stringify(inner.trim())};
`;
writeFileSync("apps/web/src/components/ztl/ztl-map-svg.ts", out);
console.log("mappa ZTL generata", inner.length, "caratteri");
