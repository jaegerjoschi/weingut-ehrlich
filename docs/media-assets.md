# public/media – Asset-Uebersicht

## Automatisch erzeugt (per `npm run gen:video`, keine Aktion noetig)

Alle folgenden Dateien werden von `scripts/gen-video.mjs` aus den drei
Quellvideos im Projektstamm erzeugt (Farbgraduierung inklusive). Bei einer
Aenderung an den Quellvideos oder an der Gradationskurve einfach erneut
`npm run gen:video` ausfuehren, alles wird ueberschrieben.

| Datei(en) | Quelle | Verwendung |
|---|---|---|
| `estate-reveal.mp4` / `-mobile.mp4` | Herosection.mp4 | HeroReveal, Scroll-Video (Desktop 1600px/CRF24 geschaerft, Mobile 720px/CRF33) |
| `estate-reveal-poster.webp/.jpg` | Frame 0 | Hero-Poster, reduced-motion/Datensparmodus |
| `vine-growth.mp4` / `-mobile.mp4` | growing_wine_3.mp4, gekappt bei Frame 144 | ScrollProcess "Wachstum". Endet bewusst, waehrend die Trauben noch gruen sind (ab Frame 149 zeigt das Quellmaterial einen Farbumschlag ins Rote) |
| `vine-growth-start.webp/.jpg` | Frame 0 | Video-Poster |
| `vine-growth-end.webp/.jpg` | Frame 144 (neues letztes Bild) | reduced-motion/Datensparmodus-Standbild |
| `wine-process.mp4` / `-mobile.mp4` | wine_process.mp4 | ScrollProcess "Verarbeitung" (Desktop 1600px/CRF24 geschaerft, Mobile 720px/CRF33) |
| `wine-process-start.webp/.jpg` | Frame 0 | Video-Poster |
| `wine-process-end.webp/.jpg` | Frame 167 (letztes) | reduced-motion/Datensparmodus-Standbild |

## Platzhalter-Slots (von Hand zu befuellen)

Die folgenden sechs redaktionellen Illustrationen existieren noch nicht.
`SmartImage` zeigt bis dahin einen ruhigen Pergament-Platzhalter mit Label,
die Seite funktioniert schon jetzt vollstaendig. Sobald eine Datei unter dem
exakten Namen hier abgelegt wird, ersetzt sie den Platzhalter automatisch,
ohne Layoutverschiebung (Seitenverhaeltnis ist bereits reserviert).

Stil: dieselbe botanische Gravur-Aesthetik wie die drei Quellvideos
(Pergamentgrund ~#f0ebe1, dunkles Sepia-Gruen fuer Linienwerk, sparsamer
Bordeaux-Akzent #6b2432 nur wo inhaltlich passend, z. B. reife Beeren).

| Datei | Seitenverhaeltnis | Motiv | Alt-Text (bereits im Code hinterlegt) |
|---|---|---|---|
| `wine-spaetburgunder.jpg` | 3:4 (Hochformat) | Dunkle Spätburgunder-Traube am Rebstock | Botanische Illustration einer dunklen Spätburgunder-Traube am Rebstock |
| `wine-grauburgunder.jpg` | 3:4 (Hochformat) | Hellgrüne Grauburgunder-Traube | Botanische Illustration einer hellgrünen Grauburgunder-Traube |
| `wine-weissburgunder.jpg` | 3:4 (Hochformat) | Helle Weißburgunder-Traube auf vulkanischem Gestein | Botanische Illustration einer hellen Weißburgunder-Traube auf vulkanischem Gestein |
| `wine-cuvee.jpg` | 3:4 (Hochformat) | Vier kleine Traubenzweige (sinnbildlich fuer die vier Lagen) | Botanische Illustration mit vier kleinen Traubenzweigen, sinnbildlich für die vier Lagen der Cuvée |
| `terroir.jpg` | 4:3 (Querformat) | Querschnitt durch vulkanischen Lössboden einer Steillage | Botanische Illustration eines Querschnitts durch den vulkanischen Lössboden einer Steillage am Kaiserstuhl |
| `family.jpg` | 4:3 (Querformat) | Gutshaus und Weinberge des Anwesens | Botanische Illustration des Gutshauses und der Weinberge von Weingut Ehrlich |

Die Dateinamen und Alt-Texte stehen zentral in `src/data/wines.ts` sowie
`src/content/copy.ts` (`terroir.image`, `family.image`). Fuer ein anderes
Weingut: dort die Pfade/Alt-Texte anpassen, diese README mitpflegen.
