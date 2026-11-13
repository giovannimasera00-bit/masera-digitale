// Rigenera packages/ui/src/tokens.css da data/farmacia.json.
import { readFileSync, writeFileSync } from "node:fs";
import { renderTokensCss } from "../packages/ui/src/tokens-css.ts";

const data = JSON.parse(readFileSync(new URL("../data/farmacia.json", import.meta.url), "utf8"));
writeFileSync(new URL("../packages/ui/src/tokens.css", import.meta.url), renderTokensCss(data.brand));
console.log("tokens.css aggiornato");
