// Regole fisse del BRIEF §2 controllate su tutti i testi del sito e sui dati.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = new URL("../../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const dirs = ["data", "apps/web/src"];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return files(p);
    return /\.(tsx?|json|css)$/.test(f) ? [p] : [];
  });
}

const all = dirs.flatMap((d) => files(join(root, d))).map((p) => ({ p: p.slice(root.length), text: readFileSync(p, "utf8") }));

const vietate: [RegExp, string][] = [
  [/carepy/i, "non nominare il fornitore del deblistering (regola 7)"],
  [/farmaestetica by farmacia masera/i, 'è "Farmaestetica by Dottor Masera" (regola 1)'],
  [/parchegg\w* a pagamento|strisce blu|parchimetr/i, "ZTL: nessun riferimento ai parcheggi a pagamento (regola 8)"],
  [/sconti pazzi|prezzo più basso|il più economico/i, "niente guerra di prezzo (posizionamento)"],
];

describe("Regole fisse nei testi", () => {
  it("ci sono file da controllare", () => expect(all.length).toBeGreaterThan(20));
  for (const [re, perche] of vietate) {
    it(perche, () => {
      const trovati = all.filter((f) => re.test(f.text)).map((f) => f.p);
      expect(trovati).toEqual([]);
    });
  }
});
