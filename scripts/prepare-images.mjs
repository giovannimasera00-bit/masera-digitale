// Prepara le immagini del sito in apps/web/public/img (ritagli e formati leggeri).
// Si rilancia con: node scripts/prepare-images.mjs
import sharp from "sharp";
import { mkdirSync, copyFileSync } from "node:fs";

const out = "apps/web/public/img";
mkdirSync(out, { recursive: true });
mkdirSync("apps/web/public/ztl", { recursive: true });

// Ieri / Oggi: ritagli dalla grafica della homepage attuale (sopra le scritte già stampate nell'immagine).
await sharp("assets/home-ieri-oggi.webp").extract({ left: 194, top: 300, width: 612, height: 362 }).webp({ quality: 82 }).toFile(`${out}/ieri-laboratorio.webp`);
await sharp("assets/home-ieri-oggi.webp").extract({ left: 194, top: 1030, width: 612, height: 284 }).webp({ quality: 82 }).toFile(`${out}/oggi-robot.webp`);

// Robot: scaffali pieni di confezioni.
await sharp("design/robot/IMG_8685.jpg").rotate().resize(1400, 1400, { fit: "inside" }).webp({ quality: 78 }).toFile(`${out}/robot-scaffali.webp`);

// Loghi orizzontali (originali enormi: 7864 px).
await sharp("assets/logo/MASERA_logo_Oriz-COLOR.png").trim().resize({ width: 640 }).png({ compressionLevel: 9 }).toFile(`${out}/logo-oriz-color.png`);
await sharp("assets/logo/MASERA_logo_Oriz-BIANCO.png").trim().resize({ width: 640 }).png({ compressionLevel: 9 }).toFile(`${out}/logo-oriz-bianco.png`);

copyFileSync("design/ztl/ztl-map-static.svg", "apps/web/public/ztl/mappa-statica.svg");
console.log("immagini pronte");
