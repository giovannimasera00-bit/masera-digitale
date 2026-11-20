// Prepara le immagini del sito in apps/web/public/img (ritagli e formati leggeri).
// Si rilancia con: node scripts/prepare-images.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const out = "apps/web/public/img";
mkdirSync(out, { recursive: true });

// Ieri / Oggi: ritagli dalla grafica della homepage attuale (sopra le scritte già stampate nell'immagine).
await sharp("assets/home-ieri-oggi.webp").extract({ left: 194, top: 300, width: 612, height: 362 }).webp({ quality: 82 }).toFile(`${out}/ieri-laboratorio.webp`);
await sharp("assets/home-ieri-oggi.webp").extract({ left: 194, top: 1030, width: 612, height: 284 }).webp({ quality: 82 }).toFile(`${out}/oggi-robot.webp`);

// Robot: scaffali pieni di confezioni.
await sharp("design/robot/IMG_8685.jpg").rotate().resize(1400, 1400, { fit: "inside" }).webp({ quality: 78 }).toFile(`${out}/robot-scaffali.webp`);

// Loghi orizzontali (originali enormi: 7864 px).
await sharp("assets/logo/MASERA_logo_Oriz-COLOR.png").trim().resize({ width: 640 }).png({ compressionLevel: 9 }).toFile(`${out}/logo-oriz-color.png`);
await sharp("assets/logo/MASERA_logo_Oriz-BIANCO.png").trim().resize({ width: 640 }).png({ compressionLevel: 9 }).toFile(`${out}/logo-oriz-bianco.png`);

// La nuova farmacia: banco, scivoli dal robot, caricatore (foto di cantiere, ottobre 2026).
await sharp("design/robot/IMG_8176.jpg").rotate().resize(1600, 1200, { fit: "cover", position: "centre" }).webp({ quality: 78 }).toFile(`${out}/spazi-banco.webp`);
await sharp("design/robot/IMG_8840.jpg").rotate().resize(1050, 1400, { fit: "cover" }).webp({ quality: 78 }).toFile(`${out}/spazi-scivoli.webp`);
await sharp("design/robot/IMG_8836.jpg").rotate().resize(1050, 1400, { fit: "cover" }).webp({ quality: 78 }).toFile(`${out}/spazi-caricatore.webp`);

// Tour del robot: le 5 tappe e la galleria.
const robot = [
  ["IMG_8836", "robot-1-caricatore", "centre"],
  ["IMG_8563", "robot-2-scaffali", "centre"],
  ["IMG_8560", "robot-3-braccio", "centre"],
  ["IMG_8839", "robot-4-nastro", "top"],
  ["IMG_8840", "robot-5-scivolo", "centre"],
  ["CD724AD3-E019-4065-9B87-CD5666F07CE5", "robot-g-tramoggia", "centre"],
  ["IMG_8703", "robot-g-ripiani", "centre"],
  ["IMG_8832", "robot-g-pannello", "centre"],
  ["IMG_8834", "robot-g-porta", "centre"],
];
for (const [src, name, position] of robot) {
  await sharp(`design/robot/${src}.jpg`).rotate().resize(900, 1125, { fit: "cover", position }).webp({ quality: 76 }).toFile(`${out}/${name}.webp`);
}

console.log("immagini pronte");
