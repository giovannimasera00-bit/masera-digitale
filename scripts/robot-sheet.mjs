// Provino delle foto del robot (solo per scegliere le immagini).
import sharp from "sharp";
import { readdirSync } from "node:fs";
const out = process.argv[2];
const files = readdirSync("design/robot").filter((f) => f.endsWith(".jpg")).sort();
const tiles = [];
for (const [i, f] of files.entries()) {
  const b = await sharp("design/robot/" + f).rotate().resize(240, 240, { fit: "inside" }).toBuffer();
  const svg = Buffer.from(`<svg width="240" height="24"><text x="2" y="16" font-size="14">${f}</text></svg>`);
  const left = (i % 6) * 250, top = Math.floor(i / 6) * 275;
  tiles.push({ input: b, left, top }, { input: svg, left, top: top + 245 });
}
await sharp({ create: { width: 1500, height: Math.ceil(files.length / 6) * 275, channels: 3, background: "#fff" } })
  .composite(tiles).jpeg().toFile(out);
console.log("ok");
