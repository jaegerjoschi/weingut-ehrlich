/**
 * Bereitet die drei Quellvideos fuer das Web auf (schnelles Laden, ruckelfreies
 * Scrubbing) und legt sie unter public/media ab. Nutzt das gebuendelte
 * ffmpeg-static-Binary, es muss kein System-ffmpeg installiert sein.
 *
 * Quellen (im Projektstamm):
 *   Herosection.mp4    -> Hero-Reveal (Anwesen, kahle Reben bis Sonnenuntergang)
 *   growing_wine_3.mp4 -> Wachstums-Sektion (ein Rebstock, Austrieb bis Lese)
 *   wine_process.mp4   -> Verarbeitungs-Sektion (Traube bis Flasche)
 *
 * Farbkorrektur: die Quellvideos sind bereits in der botanischen
 * Gravur-Aesthetik gehalten, ihr tatsaechlicher Pergamentton liegt aber bei
 * gemessenen ~#bcb8b0 (kein echtes Weiss vorhanden, max. Luminanz ~205). Das
 * Seiten-Pergament (Tailwind "paper") ist #f0ebe1. Ohne Korrektur wuerde die
 * maskierte Videokante als dunkler Rand gegen die hellere Seite auffallen.
 * Die Gradationskurve unten hebt das Pergament auf ~#f0ece2 an (gemessen,
 * an allen drei Quellen verifiziert), waehrend die dunklen Linien dunkel
 * bleiben. Dieselbe Kurve wird auf Video UND Standbilder angewendet, damit
 * beide zur Seite passen.
 *
 * Desktop-Encode 1600px/CRF24 + Lanczos + leichtes Unsharp (statt 1280/28):
 * die Quellvideos sind nativ 1280x720, auf breiten Desktop-Viewports
 * (1440-1920px+, dazu Retina/HiDPI) wurde das per CSS hochskaliert und wirkte
 * weich/pixelig. Per Sichtvergleich verifiziert (Frame auf 1800px simuliert
 * hochskaliert): 1600/24 mit Lanczos-Skalierung und leichtem Unsharp-Filter
 * zeigt sichtbar schaerfere Kanten/Linienwerk als 1280/28, bei ca. 10-12 MB
 * statt 5 MB. Das betrifft nur den Desktop-Pfad, nicht das Mobile-Budget.
 *
 * Mobile-Encode KORRIGIERT auf 1080px/CRF29 (Hero) bzw. 1280px/CRF30
 * (Wachstum/Verarbeitung), vorher faelschlich auf 720px/CRF33 verkleinert:
 * ich hatte angenommen, das kleinere Mobile-Video wuerde den LCP-Wert
 * (Largest Contentful Paint) verbessern. Per erneutem Lighthouse-Test klar
 * widerlegt: LCP blieb exakt bei 2,8s, egal ob das Mobile-Hero-Video 1 MB
 * (720px) oder 3 MB (1080px) gross war (siehe LCP-Phasenaufschluesselung:
 * TTFB 16% + Load Delay 33% + Render Delay 50% sind React-Mount/Hauptthread-
 * Zeit unter der gedrosselten CPU-Simulation, NICHT die Videogroesse). Die
 * fruehere Verkleinerung hat also nur unnoetig Bildqualitaet gekostet, ohne
 * dem Ziel-Metrik zu helfen. 1080px (Hero, eager geladen, zaehlt fuer die
 * Erstladung) bzw. 1280px = native Quellaufloesung (Wachstum/Verarbeitung,
 * lazy geladen, betrifft weder LCP noch die Erstladung ueberhaupt) sind der
 * neue, ehrliche Kompromiss: kein Qualitaetsverlust ohne Grund, aber auch
 * kein sinnloses Aufblasen der Dateigroesse ueber das hinaus, was ein
 * Telefon-Bildschirm ueberhaupt darstellen kann.
 *
 * Aufruf:  npm run gen:video
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import ffmpegPath from "ffmpeg-static";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const media = join(root, "public", "media");
mkdirSync(media, { recursive: true });

const run = (args) =>
  execFileSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
const src = (name) => {
  const p = join(root, name);
  if (!existsSync(p)) throw new Error(`Quelldatei fehlt: ${name} (im Projektstamm erwartet)`);
  return p;
};
const out = (name) => join(media, name);

// Gradationskurve: hebt das gemessene Video-Pergament (~#bcb8b0) auf das
// Seiten-Pergament (~#f0ebe1) an, ohne die dunklen Linien auszubleichen.
const GRADE = "curves=all='0/0 0.25/0.29 0.5/0.62 0.78/0.97 1/1'";

// Leichtes Nachschaerfen fuers feine Federzeichnungs-Linienwerk. Nur beim
// Desktop-Encode aktiv (siehe Kommentar oben), um das Mobile-Ladebudget
// nicht anzutasten.
const UNSHARP = "unsharp=5:5:0.5:5:5:0.0";

// Gemeinsame Encode-Parameter: All-Intra (jedes Bild ein Keyframe) fuer
// bildgenaues, ruckelfreies Scrubbing, ohne Ton. `frames` (optional) schneidet
// den Clip auf die ersten N Bilder zu, z. B. um vor einem Farbumschlag zu enden.
const scrubEncode = (input, output, { width, crf, sharpen = false, frames } = {}) => {
  const vf = [
    `scale=${width}:-2:flags=lanczos`,
    "fps=24",
    "setsar=1",
    GRADE,
    ...(sharpen ? [UNSHARP] : []),
    "format=yuv420p",
  ].join(",");
  const args = ["-i", input, "-vf", vf];
  if (frames) args.push("-frames:v", String(frames));
  args.push(
    "-an",
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-crf",
    String(crf),
    "-g",
    "1",
    "-keyint_min",
    "1",
    "-sc_threshold",
    "0",
    "-preset",
    "slow",
    "-movflags",
    "+faststart",
    out(output),
  );
  run(args);
};

// Standbild (Poster), gleiche Gradation wie das Video, als WebP (< 100 KB
// Ziel) plus JPG-Fallback, identisches Seitenverhaeltnis (kein CLS).
// q:v 60 gemessen: staerkste Motive (dichtes Blattwerk/Trauben) landen bei
// ~91-97 KB, alle anderen darunter. Bei q:v 82 lagen die dichtesten
// Standbilder noch bei 121-134 KB, daher die niedrigere Stufe.
const still = (input, frame, baseName) => {
  const vf = `select='eq(n\\,${frame})',${GRADE},scale=1280:-2:flags=lanczos`;
  run(["-i", input, "-vf", vf, "-frames:v", "1", "-c:v", "libwebp", "-q:v", "60", out(`${baseName}.webp`)]);
  run(["-i", input, "-vf", vf, "-frames:v", "1", "-q:v", "4", out(`${baseName}.jpg`)]);
};

/**
 * Deaktivierter WebM/VP9-Pfad (bewusst nicht verwendet): gemessen war
 * All-Intra-VP9 fuer diese Quellen 4-5x GROESSER als All-Intra-H.264
 * (z. B. Hero: ~25 MB WebM gegenueber ~5 MB MP4), weil All-Intra fast nur aus
 * teuren Keyframes besteht und VP9 dort keinen Vorteil ausspielen kann. Die im
 * urspruenglichen Auftrag vorgesehene WebM-Quelle wuerde also gerade auf
 * Mobilfunk das Ladebudget sprengen. H.264 allein (Desktop + Mobile) trifft
 * die Zielgroessen zuverlaessig. Sollte ein zukuenftiger Encoder (z. B. AV1)
 * hier tatsaechlich kleiner werden, kann dieser Pfad reaktiviert werden:
 *
 * const scrubEncodeWebm = (input, output, width, crf) =>
 *   run([
 *     "-i", input,
 *     "-vf", `scale=${width}:-2,fps=24,setsar=1,${GRADE},format=yuv420p`,
 *     "-an", "-c:v", "libvpx-vp9", "-crf", String(crf), "-b:v", "0",
 *     "-g", "1", "-keyint_min", "1", "-deadline", "good", "-cpu-used", "2",
 *     out(output),
 *   ]);
 */

// ---------------------------------------------------------------------------
// 1) Hero-Reveal: Anwesen, von kahlen Rebstoecken bis Gutshaus-Panorama mit
//    Sonnenuntergang. Nur ein Poster (erstes Frame), das Video selbst zeigt
//    den vollen Bogen waehrend des Scrollens.
const hero = src("Herosection.mp4");
scrubEncode(hero, "estate-reveal.mp4", { width: 1600, crf: 24, sharpen: true });
scrubEncode(hero, "estate-reveal-mobile.mp4", { width: 1080, crf: 29 });
still(hero, 0, "estate-reveal-poster");

// ---------------------------------------------------------------------------
// 2) Wachstum: ein Rebstock von der knospenden Rute bis zu vollen, reifen
//    Traubenbuendeln (168 Frames Quellmaterial, 24fps). Bewusst VOR dem
//    Farbumschlag ins Rote/Violette gekappt (Frame 144 ist die letzte durchweg
//    gruene Aufnahme, ab Frame 149 sind im Quellmaterial deutlich Rot-/
//    Purtoene sichtbar), damit die Rebe gruen bleibt und nicht nur die
//    Rotwein-Sorten der Kollektion andeutet. Ergebnis: 145 Bilder (~6,04s).
//    Schrittbilder per Sichtpruefung der graduierten Frames gewaehlt:
//      Frame 18  Austrieb (Knospen brechen auf, vor dem Vollaub)
//      Frame 82  Bluete/Wachstum (Vollaub, erste kleine Traubenansaetze)
const GROWTH_END_FRAME = 144;
const growth = src("growing_wine_3.mp4");
scrubEncode(growth, "vine-growth.mp4", {
  width: 1600,
  crf: 24,
  sharpen: true,
  frames: GROWTH_END_FRAME + 1,
});
scrubEncode(growth, "vine-growth-mobile.mp4", { width: 1280, crf: 30, frames: GROWTH_END_FRAME + 1 });
still(growth, 0, "vine-growth-start");
still(growth, GROWTH_END_FRAME, "vine-growth-end");

// ---------------------------------------------------------------------------
// 3) Verarbeitung: Traube, Presse, Gaerglas mit farblich hervorgehobenem
//    Saftverlauf, Barrique-Fass, fertige Flasche (168 Frames, 24fps, 7s).
const process_ = src("wine_process.mp4");
scrubEncode(process_, "wine-process.mp4", { width: 1600, crf: 24, sharpen: true });
scrubEncode(process_, "wine-process-mobile.mp4", { width: 1280, crf: 30 });
still(process_, 0, "wine-process-start");
still(process_, 167, "wine-process-end");

// ---------------------------------------------------------------------------
const sizeKb = (name) => (statSync(out(name)).size / 1024).toFixed(0);
console.log("\nVideos und Standbilder aufbereitet unter public/media:");
console.log(`  estate-reveal.mp4        ${sizeKb("estate-reveal.mp4")} KB (Desktop)`);
console.log(`  estate-reveal-mobile.mp4 ${sizeKb("estate-reveal-mobile.mp4")} KB (Mobile)`);
console.log(`  vine-growth.mp4          ${sizeKb("vine-growth.mp4")} KB (Desktop)`);
console.log(`  vine-growth-mobile.mp4   ${sizeKb("vine-growth-mobile.mp4")} KB (Mobile)`);
console.log(`  wine-process.mp4         ${sizeKb("wine-process.mp4")} KB (Desktop)`);
console.log(`  wine-process-mobile.mp4  ${sizeKb("wine-process-mobile.mp4")} KB (Mobile)`);
console.log("  + Poster (Start/Ende) als .webp/.jpg");
