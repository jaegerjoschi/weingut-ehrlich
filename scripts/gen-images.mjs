/**
 * Erzeugt WebP-Varianten der sechs redaktionellen Platzhalter-Fotos unter
 * public/media (SmartImage-Slots: wine-*, family, terroir). Nutzt dasselbe
 * gebuendelte ffmpeg-static-Binary wie scripts/gen-video.mjs, keine neue
 * Abhaengigkeit noetig.
 *
 * Bewusst KEIN Input aus dem Projektstamm (anders als gen-video.mjs): die
 * hochaufgeloesten Rohdateien (family.jpg, terroir.jpg, wine-*.jpg im
 * Projektstamm, ~2.7-2.9 MB) sind per .gitignore explizit von Git
 * ausgeschlossen und in einem frischen Checkout/CI nicht vorhanden. Input
 * sind stattdessen die bereits eingecheckten, bereits auf 1448x1086 bzw.
 * 1086x1448 herunterskalierten JPGs unter public/media selbst - identische
 * Aufloesung, das WebP wird 1:1 daraus erzeugt, ohne erneute Skalierung.
 *
 * Aufruf: npm run gen:images
 */
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import ffmpegPath from "ffmpeg-static";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const media = join(root, "public", "media");

const FILES = [
  "wine-spaetburgunder",
  "wine-grauburgunder",
  "wine-weissburgunder",
  "wine-cuvee",
  "family",
  "terroir",
];

const run = (args) =>
  execFileSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });

for (const name of FILES) {
  const jpg = join(media, `${name}.jpg`);
  if (!existsSync(jpg)) {
    console.warn(`Uebersprungen (fehlt): ${name}.jpg`);
    continue;
  }
  const webp = join(media, `${name}.webp`);
  // q:v 60: gleiche Qualitaetsstufe wie die Video-Standbilder in
  // gen-video.mjs (still()), dort bereits als guter Kompromiss verifiziert.
  run(["-i", jpg, "-c:v", "libwebp", "-q:v", "60", webp]);
  const jpgKb = (statSync(jpg).size / 1024).toFixed(0);
  const webpKb = (statSync(webp).size / 1024).toFixed(0);
  console.log(`${name}.webp  ${webpKb} KB (jpg: ${jpgKb} KB)`);
}
