import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import data from "../../../data/farmacia.json";
import { AA, contrastRatio } from "../src/contrast";
import { colors, textPairs } from "../src/tokens";
import { renderTokensCss } from "../src/tokens-css";

describe("Contrasto WCAG AA", () => {
  it.each(textPairs)("$fg su $bg ($where)", ({ fg, bg, size }) => {
    const ratio = contrastRatio(colors[fg], colors[bg]);
    expect(ratio, `${fg} su ${bg}: ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA[size]);
  });

  it("il verde mela non è mai ammesso come testo su bianco o carta", () => {
    expect(contrastRatio(colors.mela, colors.bianco)).toBeLessThan(AA.normal);
    const vietate = textPairs.filter((p) => p.fg === "mela" && (p.bg === "bianco" || p.bg === "carta"));
    expect(vietate).toEqual([]);
  });

  it("niente testo bianco o carta su fondi chiari", () => {
    const chiari = ["carta", "bianco", "beige_chiaro", "salvia", "mela", "beige_scuro"];
    const sbagliate = textPairs.filter((p) => (p.fg === "bianco" || p.fg === "carta") && chiari.includes(p.bg));
    expect(sbagliate).toEqual([]);
  });
});

describe("Token", () => {
  it("tokens.css è allineato a data/farmacia.json (altrimenti: pnpm tokens)", () => {
    const css = readFileSync(new URL("../src/tokens.css", import.meta.url), "utf8");
    expect(css).toBe(renderTokensCss(data.brand));
  });
});
