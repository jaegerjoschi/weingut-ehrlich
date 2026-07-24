# Claude-Code-Prompt: Weingut Ehrlich – Premium-Scrollanimation-Website

Empfohlenes Modell: Opus (in Claude Code z. B. per `/model opus` oder `claude --model opus` starten). Der Build hat viele ineinandergreifende Entscheidungen auf einmal (Timing der drei Scroll-Videos, Farbsystem, vollständige deutsche Texte, Barrierefreiheit), dafür lohnt sich das stärkste Modell. Sonnet reicht für spätere kleine Anpassungen (Text ändern, Farbe verschieben, neue Sektion ergänzen).

Kontext für Claude Code, bitte diesen ganzen Block als Auftrag verwenden:

---

Baue eine einseitige Premium-Website für „Weingut Ehrlich", ein Familienweingut in vierter Generation am Kaiserstuhl (Baden), gegründet 1928.

**Was vom Referenzprojekt (Poolmanufaktur) übernommen wird und was nicht**: Nur die technische Mechanik ist 1:1 zu übernehmen, nicht die Bildsprache. Uebernimm eins zu eins: Ordnerstruktur, GSAP-ScrollTrigger-Video-Scrub-Mechanik, `useReducedMotion`-Handling, das `gen-video.mjs`-Aufbereitungsmuster, Barrierefreiheits-Grundlagen. Uebernimm NICHT die visuelle Sprache des Referenzprojekts: kein "Soft Structuralism" mit rundlichen Karten, mehrlagigen weichen Schatten (`shadow-soft`, `shadow-lift`, `shadow-bezel`), keine `bezel-card`-Doppelrahmen-Optik, kein `MagneticButton` mit Cursor-Anziehung. Diese Elemente wirken wie ein Tech-Produkt und widersprechen dem Weingut-Stil unten direkt.

**Verbindliche Art-Direction fuer diese Website** (immer wieder hierauf zurueckkommen, bei jeder Komponente pruefen ob sie dazu passt):

> Contemporary premium winery editorial design combining botanical engraving, warm natural paper, forest-green linework, restrained burgundy and gold accents, elegant serif typography, generous negative space and slow hand-drawn scroll animations. Sophisticated, grounded and handcrafted, never rustic, kitschy, glossy or commercially generic.

Auf Deutsch: traditionelle Weinkultur trifft ruhiges, modernes Editorial-Design. Hochwertig, handwerklich, naturverbunden, botanische Gravur-Aesthetik mit feinen organischen Strichzeichnungen und dezenten Kreuzschraffuren, grosszuegige fast unberuehrte Flaechen, keine glaenzenden 3D-Objekte, keine Stockfotos, keine ueberladenen Weinmotive, kein typischer Onlineshop-Look. Layout wie ein hochwertiges Weinmagazin: viel Weissraum, grosse asymmetrische Kompositionen, schmale Textspalten, einzelne Illustrationen die teilweise ueber Sektionsgrenzen hinausragen, feine Linien als Trenner statt harter Farbbloecke, bewusst langsamer Seitenrhythmus. Keine Kartenraster mit starken Schatten, nirgendwo auf der Seite.

Zu den drei Quellvideos: sie sind bereits genau in dieser botanischen Gravur-Aesthetik gehalten (Pergamentgrund, dunkle sepia-gruene Linien, sparsamer Bordeaux-Akzent), das war schon vor dieser Stilvorgabe so generiert worden. Die Website muss diesen bereits vorhandenen Look konsequent weiterfuehren, nicht einen eigenen, abweichenden UI-Stil daneben stellen.

## 1. Tech-Stack

Vite, React 18, TypeScript, Tailwind CSS, GSAP mit ScrollTrigger, keine weiteren Animationsbibliotheken. `ffmpeg-static` als Dev-Dependency für ein Video-Aufbereitungsskript (siehe Abschnitt 2). Kein Next.js, rein clientseitig, kein Server nötig.

Projektstruktur:

```
src/
  components/
    Header.tsx
    SkipLink.tsx
    HeroReveal.tsx        (Hero, Herosection-Video)
    ScrollProcess.tsx      (wiederverwendbar fuer Wachstum + Verarbeitung, siehe Abschnitt 5)
    WineCollection.tsx
    Family.tsx
    Terroir.tsx
    VisitAndTasting.tsx
    Awards.tsx
    ContactForm.tsx
    Footer.tsx
    ui/ (Reveal, SmartImage aus dem Referenzprojekt uebernehmen; TextLink neu bauen als ruhiger Ersatz fuer MagneticButton, siehe Abschnitt 3)
  content/
    copy.ts               (alle deutschen Texte zentral, siehe Abschnitt 6)
  data/
    wines.ts
    growthSteps.ts
    processSteps.ts
    timeline.ts
  lib/
    gsap.ts
    useReducedMotion.ts
  App.tsx
  main.tsx
  index.css
scripts/
  gen-video.mjs
public/media/ (Zieldateien nach Aufbereitung)
```

## 2. Quellvideos und Aufbereitung

Im Projektstamm liegen bereits mehrere generierte Videos. Verwende ausschliesslich diese drei, alle anderen im Ordner ignorieren:

- `Herosection.mp4` → Hero-Reveal (zeigt das Anwesen, von kahlen Rebstoecken bis zum vollen Gutshaus-Panorama mit Bergen und Sonnenuntergang)
- `growing_wine_3.mp4` → Wachstums-Sektion (ein einzelner Rebstock von der knospenden Rute bis zu drei reifen Traubenbueendeln in unterschiedlicher Farbe)
- `wine_process.mp4` → Verarbeitungs-Sektion (Traube, Presse, Gaerglas mit farblich hervorgehobenem Saftverlauf, Barrique-Fass, fertige Flasche)

Schreibe `scripts/gen-video.mjs` nach folgendem, bewaehrtem Muster (All-Intra-Encoding, damit das Scroll-Scrubbing bildgenau und ruckelfrei laeuft, kein Ton, 1280px Breite, H.264 High Profile, CRF 28, GOP-Groesse 1, Preset slow, Faststart fuer sofortiges Anspielen):

```js
scale=1280:-2,fps=24,setsar=1,format=yuv420p
-an -c:v libx264 -profile:v high -crf 28 -g 1 -keyint_min 1 -sc_threshold 0 -preset slow -movflags +faststart
```

Erzeuge daraus:
- `public/media/estate-reveal.mp4` + `public/media/estate-reveal-poster.jpg` (erstes Frame)
- `public/media/vine-growth.mp4` + `public/media/vine-growth-start.jpg` (erstes Frame) + `public/media/vine-growth-end.jpg` (letztes Frame, fuer reduced-motion)
- `public/media/wine-process.mp4` + `public/media/wine-process-start.jpg` (erstes Frame) + `public/media/wine-process-end.jpg` (letztes Frame, fuer reduced-motion)

`npm run gen:video` soll alle drei in einem Rutsch erzeugen.

## 3. Farb- und Typografiesystem

Die drei Quellvideos sind bereits in einem konsistenten, warmen Pergament-Look mit dunkelgruen-sepiafarbener Linienzeichnung und einem einzelnen Bordeaux-Akzent fuer Trauben und Wein gehalten. Das Farbsystem der Website muss exakt daraus abgeleitet werden, nicht neu erfunden, damit Video und Seite nahtlos ineinander uebergehen (Seitenhintergrund = Pergamentton der Videos, dann verschwindet die Videokante beim Maskieren unsichtbar).

Nimm mit einer Farbpipette aus den erzeugten Posterbildern die exakten Toene und trage sie als Tailwind-Farben ein, ungefaehre Startwerte falls keine Farbpipette verfuegbar ist. Neu gegenueber dem Referenzprojekt: ein zusaetzlicher, sehr zurueckhaltender Gold-Ton fuer Licht und einzelne besondere Details (Jahrgangszahl, kleine Trennzeichen, Icon-Akzente), plus helle Stein-/Holz-/Erdtoene als unterstuetzende Nebenfarben:

```ts
colors: {
  paper: "#f0ebe1",      // Pergament-Hintergrund, aus den Videos abgetastet
  surface: "#f7f3ea",
  line: "#ded5c2",
  stone: "#ddd2bd",      // helle Stein-/Erdton-Nebenfarbe fuer Trenner, Icons, Hintergrundflaechen
  ink: {
    DEFAULT: "#2a2f24",  // dunkles Sepia-Gruen der Linienzeichnung, auch fuer Typografie und Navigation
    soft: "#454b3c",
    muted: "#767a67",
  },
  wine: {                // tiefes Burgunderrot, bewusst selten einsetzen, nicht als Hauptfarbe
    50: "#f6ecee",
    100: "#e9ccd2",
    400: "#8a3345",
    500: "#6b2432",
    600: "#521c27",
    700: "#3e151d",
  },
  gold: {                 // warmes, zurueckhaltendes Gold, nur fuer Licht/besondere Details
    300: "#e2cd9c",
    500: "#b3903f",
    700: "#8a6c2c",
  },
},
fontFamily: {
  display: ['"Fraunces"', "Georgia", "serif"],   // elegante, redaktionelle Serife fuer Headlines, traditionsbewusst, nicht historisierend
  sans: ["Inter", "system-ui", "sans-serif"],      // klare, moderne Sans fuer Fliesstext
},
letterSpacing: {
  caps: "0.14em",   // fuer die Small-Caps-Kapitelmarken (Jahrgaenge, Rebsorten, Lagen)
},
```

Wichtige Einsatzregeln, nicht nur Farbwerte:

- Burgunderrot (`wine`) und Gold (`gold`) sind Ausnahmefarben. Grosse Flaechen, Buttons und Navigation bleiben in `ink` auf `paper`, nicht in Wine oder Gold eingefaerbt. Wine taucht z. B. nur bei der Jahrgangs-/Rebsorten-Kennzeichnung, einer einzelnen Akzentlinie oder dem einen wichtigsten Call-to-Action auf, Gold nur bei einem Lichtdetail in einer Illustration oder einer besonderen Auszeichnung, niemals flaechig.
- Headlines in `font-display` (Fraunces), grosse Schriftgrade, viel Zeilenabstand (`leading-relaxed` bis `leading-loose`), kurze Textbloecke, nie mehr als drei bis vier Zeilen am Stueck.
- Kapitelmarken, Jahrgaenge, Rebsorten- und Lagenbezeichnungen als kleine Versalien: `uppercase tracking-caps text-xs text-ink-muted`, keine Icons oder Emojis davor.
- Ersetze `MagneticButton` durch eine ruhige `TextLink`-Komponente: schlichter Text mit einer duennen, animierten Unterstreichung, die sich beim Hover von links nach rechts einzieht (reine CSS-Transition, kein Cursor-Magnetismus, keine Skalierung, kein Schatten).
- Keine der Schattenklassen `shadow-soft`, `shadow-lift`, `shadow-bezel` und keine `bezel-card`/`rounded-2xl`-Karten-Optik aus dem Referenzprojekt uebernehmen. Stattdessen: haarfeine `border-t border-line`-Trenner zwischen Sektionen, Illustrationen ohne Rahmen und ohne Schatten direkt auf `paper`.

## 4. Seitenstruktur und Layoutprinzip

In dieser Reihenfolge:

1. Header (fix, transparent bis zum ersten Scroll, dann Pergament-Hintergrund mit Blur, wie im Referenzprojekt, Navigationstext in `ink`, kein Akzent-Punkt-Icon in Wine)
2. HeroReveal (Herosection-Video, radial ins Pergament maskiert, zentrierter Text, 260vh Scrollstrecke)
3. ScrollProcess "Wachstum" (vine-growth.mp4, drei Textschritte)
4. WineCollection (vier Weine, siehe Layout-Hinweis unten, ausdruecklich kein 2x2- oder 4er-Kartenraster)
5. ScrollProcess "Verarbeitung" (wine-process.mp4, vier Textschritte statt drei, siehe Abschnitt 5)
6. Terroir (Weinberg, Boden, biologischer Anbau)
7. Family (Chronik 1928 bis heute, Generationenwechsel)
8. VisitAndTasting (Oeffnungszeiten, Anmeldeformular fuer Verkostungen, Hofladen)
9. Awards (drei Auszeichnungen als ruhige Text-Reihe mit duennen Trennstrichen, kein Logo-Karussell, kein Konfetti)
10. ContactForm
11. Footer (Impressum, Datenschutz, Altersnachweis fuer alkoholische Produkte)

**Layoutprinzip fuer alle nicht videogesteuerten Sektionen** (WineCollection, Terroir, Family, Awards): asymmetrisches Editorial-Layout statt Rastern. Konkret fuer WineCollection: kein gleichfoermiges Grid, sondern eine lange, vertikale Abfolge, bei der jeder der vier Weine abwechselnd links oder rechts eine schmale Textspalte bekommt (Jahrgang/Rebsorte als Small-Caps-Kapitelmarke, Name in Fraunces gross, zwei bis drei Saetze Verkostungsnotiz) und auf der gegenueberliegenden Seite eine einzelne botanische Illustration, die bewusst grosszuegig Platz bekommt und leicht ueber die gedachte Spaltengrenze hinausragen darf. Zwischen den vier Weinen nur ein duenner `border-t border-line`, keine Schatten, keine Rahmen, kein Hintergrundwechsel. Family und Terroir bekommen ebenfalls grosse Weissraum-Abstaende (`py-32` bis `py-40` statt `py-24`) und schmale Textspalten (`max-w-md` bis `max-w-lg`), nicht die volle Container-Breite.

## 5. Video-Scrub-Mechanik

Fuer alle drei Video-Sektionen identisch: `video.currentTime` wird per `ScrollTrigger` (`start: "top top"`, `end: "bottom bottom"`, `onUpdate` liefert `progress`) an eine Ziel-Zeit gekoppelt, die per `requestAnimationFrame`-Tick sanft angenaehert wird (`currentTime += (target - currentTime) * 0.12`, bewusst etwas traeger als im Referenzprojekt, damit die Bewegung noch ruhiger und geduldiger wirkt), nicht hart gesetzt, damit kein Ruckeln entsteht. `video` ist `muted`, `playsInline`, `preload="auto"`, mit `poster` fuer sofortige Anzeige. Textuebergaenge in allen Sektionen langsam und weich faden (mindestens 600 bis 900ms, `power2.out` oder aehnlich sanft), nie ein hartes Einblenden oder Herausspringen, keine Zoom- oder Bounce-Effekte, kein auffaelliges Parallax quer zur Scrollrichtung.

**HeroReveal**: Container `h-[260vh]`, sticky `100svh`-Bereich, radialer Innenmaske-Verlauf, der das Video zu allen Raendern hin ins Pergament ausblendet (`radial-gradient(112% 108% at 50% 45%, #000 24%, rgba(0,0,0,0.5) 50%, transparent 73%)`), zentrierter Text (Eyebrow als Small-Caps-Kapitelmarke, H1 in Fraunces, Subline, ein primaerer und ein sekundaerer `TextLink`, keine gefuellten Buttons mit Schatten), Scroll-Hinweis unten, der beim Start des Scrollens ausblendet.

**ScrollProcess** (wiederverwendbare Komponente fuer beide Prozess-Sektionen, Props: `videoSrc`, `poster`, `eyebrow`, `steps: {n, title, body}[]`, `stepWindows: [number, number, number, number][]`): Container `h-[300vh]` (bei vier Schritten ggf. `h-[340vh]`, damit jeder Schritt genug Lesezeit hat), sticky `100svh`-Bereich, Video oben/unten linear ins Pergament maskiert (`linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)`), Pergament-Schleier von links fuer Textkontrast, linksbuendiger, schmaler Textblock (`max-w-md`) mit den Schritten, die ueber definierte Scroll-Fenster langsam ein- und ausblenden (bei vier statt drei Schritten die Fenster gleichmaessig auf 0 bis 1 verteilen, letztes Fenster bleibt bis zum Ende sichtbar).

Beide Prozess-Sektionen bekommen zusaetzlich darunter eine ruhige, nicht scrollgesteuerte Zeitleiste mit kleinen Standbildern, aber ausdruecklich NICHT im `BuildProcess.tsx`-Stil des Referenzprojekts (kein `ring-1 ring-line shadow-soft`-Rahmen um die Bilder, kein runder Knotenpunkt in Wine-Farbe). Stattdessen: die Standbilder liegen ungerahmt und schattenlos direkt auf `paper`, getrennt nur durch eine duenne horizontale Linie, die Schrittnummer steht als Small-Caps-Kapitelmarke daneben statt als farbiger Kreis. Das erhaelt die Lesbarkeit bei `prefers-reduced-motion` und beim schnellen Ueberfliegen, ohne die Karten-Optik des Referenzprojekts zu wiederholen.

Bei `prefers-reduced-motion: reduce`: alle drei Video-Sektionen zeigen nur das jeweilige Start- oder Endbild plus gestapelten Text, kein Pinning, kein Scrubbing, identisch zum Referenzprojekt-Verhalten.

## 6. Vollstaendiger Inhalt (Deutsch, in `src/content/copy.ts` und `src/data/*.ts`)

Schreibe echte, fertige deutsche Texte nach diesen Vorgaben, keine Platzhalter:

**Hero**: Eyebrow "Weingut seit 1928". Titel "Vier Generationen, ein Boden am Kaiserstuhl". Subline in der Art von: seit fast hundert Jahren bewirtschaftet die Familie Ehrlich dieselben Steillagen im Kaiserstuhl, mit Handlese und viel Geduld statt Groesse. Primaerer Button "Verkostung buchen" (Anker zu VisitAndTasting), sekundaerer Button "Unsere Weine" (Anker zu WineCollection).

**Wachstum, drei Schritte**: 1. Austrieb im April, die ersten Knospen brechen nach dem Winterschnitt auf. 2. Bluete und Wachstum im Sommer, aus jeder Bluete wird eine Traube, die Reben werden mehrfach von Hand ausgelichtet. 3. Lese im spaeten September und Oktober, jede Rebsorte wird einzeln und von Hand gelesen, wenn die Beeren genau die richtige Reife erreicht haben.

**Verarbeitung, vier Schritte**: 1. Handlese und sanfte Pressung direkt am Tag der Ernte. 2. Spontanvergaerung im offenen Bottich mit den natuerlichen Hefen aus dem eigenen Weinberg. 3. Ausbau im Barrique-Keller, je nach Wein zwoelf bis achtzehn Monate. 4. Abfuellung von Hand auf dem eigenen Hof, ohne Zwischenhaendler.

**Weinkollektion, vier Weine**: Spaetburgunder Reserve (Rotwein, Barrique-gereift, Flaggschiff, dichte Frucht, feine Tannine). Grauburgunder vom Kalkmergel (Weisswein, mineralisch, trocken). Weissburgunder vom Vulkanfels (Weisswein, straff, salzig-mineralisch typisch fuer den Kaiserstuhl-Vulkanboden). Cuvee "Vier Generationen" (Jubilaeums-Cuvee aus allen vier Lagen der Familie, limitierte Abfuellung). Jeweils mit zwei bis drei Saetzen Verkostungsnotiz statt Marketingfloskeln.

**Terroir**: vulkanischer Loessboden des Kaiserstuhl, Steillagen mit teils ueber vierzig Prozent Hangneigung, muss von Hand bearbeitet werden, biologischer Anbau seit 2015, bewusster Verzicht auf Bewaesserung.

**Familie und Geschichte**: kurze Zeitleiste 1928 Gruendung mit zwei Hektar nach der Reblauskrise, Nachkriegs-Wiederaufbau und Erweiterung durch die zweite Generation, Modernisierung des Kellers durch die dritte Generation in den Neunzigern, Uebernahme durch die aktuelle Generation (fiktive Winzerin, Vorname frei waehlbar, z. B. Lena Ehrlich) um 2020 mit Umstellung auf biologischen Anbau. Ein kurzes, persoenliches Zitat der aktuellen Generation, kein Hochglanz-Statement.

**Besuch und Verkostung**: Oeffnungszeiten Hofladen, Anmeldeformular fuer gefuehrte Verkostungen (Name, Wunschtermin, Personenzahl), kurzer Hinweis auf Anfahrt im Kaiserstuhl (z. B. nahe Oberrotweil oder Achkarren als fiktiver, aber regionsplausibler Ort).

**Auszeichnungen**: drei ruhig platzierte, plausible aber klar als Demo-Inhalt erkennbare Auszeichnungen, z. B. Gault-Millau-Trauben-Bewertung, Falstaff-Punktzahl fuer die Reserve, regionale Praedikatsweingut-Mitgliedschaft.

**Footer**: Impressum, Datenschutz, und gut sichtbarer, aber nicht aufdringlicher Altersnachweis-Hinweis fuer alkoholische Produkte (kein Verkauf an Minderjaehrige).

## 7. Barrierefreiheit (BFSG-Pflicht seit Juni 2025)

`useReducedMotion`-Hook wie im Referenzprojekt, Skip-Link, sichtbarer Fokusring in `wine.500`, ausreichender Kontrast zwischen `ink` und `paper`, Alt-Texte fuer alle Bilder, semantisches HTML mit korrekter Ueberschriftenhierarchie, `lang="de"`. `schema.org`-Markup vom Typ `Winery` mit Adresse und Oeffnungszeiten.

## 8. Performance-Optimierung der Scroll-Videos

Ehrlich gesagt ist genau das der Punkt, an dem eine Scroll-Video-Seite leicht schwer wird: All-Intra-Encoding (jedes Bild ein Keyframe, noetig fuer ruckelfreies Scrubbing) erzeugt deutlich groessere Dateien als normal komprimiertes Video derselben Laenge, weil es keine guenstigen Zwischenbilder gibt. Drei solche Videos ungebremst beim Laden der Seite abzurufen, waere auf Mobilfunk spuerbar langsam. Dagegen helfen mehrere Massnahmen gleichzeitig, nicht nur eine einzelne:

- **Nur das Hero-Video eager laden.** `estate-reveal.mp4` bekommt `preload="auto"` und `fetchpriority="high"`, weil es sofort beim Laden sichtbar ist und das wahrscheinliche Largest-Contentful-Paint-Element ist. Die beiden Prozess-Videos (`vine-growth.mp4`, `wine-process.mp4`) bekommen `preload="none"` und werden erst per `IntersectionObserver` geladen (`rootMargin: "100% 0px"`, also etwa einen Viewport bevor die Sektion erreicht wird), nicht sofort beim Seitenaufruf.
- **Getrennte Mobile-Variante rendern.** Zusaetzlich zur Desktop-Version (1280px breit) im `gen-video.mjs`-Skript eine zweite, kleinere Fassung erzeugen (`scale=854:-2`, gleiche All-Intra-Parameter, etwas hoeherer CRF um 30 bis 31 statt 28), und per `<source media="(max-width: 768px)">` im `<video>`-Element vor der Desktop-Quelle einbinden, sodass Mobilgeraete automatisch die kleinere Datei laden.
- **WebM als zweite Quelle anbieten.** Zusaetzlich zu jeder H.264-MP4 eine VP9-WebM-Variante mit denselben All-Intra-Parametern erzeugen und im `<video>` vor der MP4-Quelle einbinden, moderne Browser laden dann die kleinere WebM-Datei, aeltere Browser fallen automatisch auf MP4 zurueck.
- **`prefers-reduced-data` und langsame Verbindungen respektieren.** Zusaetzlich zu `prefers-reduced-motion` auch `navigator.connection?.saveData` beziehungsweise `effectiveType` (`"2g"`/`"slow-2g"`) abfragen und in diesem Fall automatisch die statische Poster-Ansicht zeigen statt der Videos, unabhaengig von der Bewegungspraeferenz des Nutzers, das ist reine Rücksicht auf Datenvolumen.
- **Poster-Bilder klein halten.** Poster als WebP unter 100 KB mit JPG-Fallback, exakt gleiche Seitenverhaeltnisse wie das Video, damit beim Umschalten von Poster zu Video kein Layout-Sprung (CLS) entsteht.
- **Schriften nicht blockieren lassen.** `font-display: swap` fuer Fraunces und Inter, nur die tatsaechlich genutzten Schnitte selbst hosten (kein komplettes Fontset laden), das Schriftschnitt der H1 im Hero per `<link rel="preload">` vorab laden, damit der erste sichtbare Text nicht auf die Schrift wartet.
- **Animationscode compositor-freundlich halten.** Text-Ein-/Ausblenden ausschliesslich ueber `transform` (z. B. `translateY`) und `opacity` animieren, niemals ueber `top`, `margin` oder `width`, damit der Browser nicht bei jedem Frame neu layouten muss. `will-change: transform` nur waehrend der aktiven Scrub-Phase setzen, danach wieder entfernen, sonst bleibt unnoetig Grafikspeicher reserviert.
- **Ziel-Kennzahlen**: Largest Contentful Paint unter 2,5 Sekunden bei simuliertem Mobil-4G, initiale Ladung bis zum ersten sichtbaren Hero-Frame unter etwa 2 MB (Poster plus die ersten Sekunden des gepuffert nachladenden Hero-Videos), kein spuerbarer Ruckler beim Scrubben auch auf einem drei bis vier Jahre alten Mittelklasse-Handy.

## 9. Mobile-First und Responsive

Der bisherige Prompt beschreibt vor allem die Desktop-Komposition, das muss ausdruecklich mobile-first gedacht werden, nicht nachtraeglich zusammengequetscht:

- Basis-Styles (ohne Tailwind-Praefix) sind fuer schmale Bildschirme, `sm:`/`md:`/`lg:`/`xl:` bauen von dort nach oben aus, nicht umgekehrt.
- **WineCollection**: das alternierende Links-rechts-Layout gilt erst ab `md:`. Unterhalb davon immer dieselbe Reihenfolge (Illustration, dann Small-Caps-Kapitelmarke, dann Titel und Text), volle Spaltenbreite, keine nebeneinanderliegenden Spalten.
- **Family/Terroir**: schmale `max-w-md`-Spalten gelten ab `md:` aufwaerts, darunter volle Breite mit normalem Seitenrand, sonst wirkt der Text auf dem Handy gequetscht statt grosszuegig.
- **Typografie**: Headlines mit `clamp()` bzw. Tailwind-Stufen fluessig skalieren (z. B. `text-3xl sm:text-4xl lg:text-6xl`), nicht eine feste Desktop-Grösse, die auf 375px Breite umbricht oder ueberläuft. Zeilenlaenge auf Mobile pruefen, nicht mehr als etwa 60 bis 70 Zeichen pro Zeile.
- **Video-Scrub-Sektionen**: `h-[100svh]` (nicht `100vh`) fuer den sticky Bereich beibehalten, das ist bereits mobil-sicher wegen der iOS-Adressleiste. Die vh-Multiplikatoren der Pin-Strecke (`260vh`, `300vh`, `340vh`) auf kleinen Screens gegenpruefen, im Zweifel auf Mobile etwas kuerzer fahren (z. B. `220vh`/`260vh`/`280vh` per `max-sm:`-Anpassung), damit das Durchscrollen dort nicht unangemessen lang wirkt. Auf echten Mobilgeraeten testen, ob das Scrubbing beim Touch-Scrollen (mit Momentum/Inertia) ruckelfrei bleibt, notfalls die Interpolationsrate leicht erhoehen.
- **Assets**: die mobile Video-Variante und das Lade-Priorisierungsschema aus Abschnitt 8 gelten hier genauso, auf dem Handy zaehlt die Datenersparnis noch mehr als auf Desktop.
- **Touch-Ziele**: `TextLink` und alle interaktiven Elemente brauchen eine Tippflaeche von mindestens 44x44px, auch wenn optisch nur schlanker unterstrichener Text zu sehen ist (Padding statt sichtbarem Button).
- Am Ende auf mindestens drei Breiten pruefen: 375px (kleines Handy), 768px (Tablet), 1440px (Desktop), jeweils Scroll-Sektionen, Textumbrueche und Tippflaechen kontrollieren, nicht nur die Desktop-Ansicht.

## 10. Abgabe

Nach dem Bauen: `npm run gen:video` ausfuehren und bestaetigen, dass alle Zieldateien (Desktop- und Mobile-Variante je Video, WebM und MP4, alle Poster) unter `public/media` existieren, danach `npm run build` zur Kontrolle, dass alles fehlerfrei durchlaeuft. Danach die drei Breiten aus Abschnitt 9 pruefen (375px, 768px, 1440px) und einen Lighthouse-Lauf im mobilen mit gedrosseltem 4G-Profil gegen die Ziel-Kennzahlen aus Abschnitt 8 pruefen (LCP, Ladegroesse bis zum ersten Hero-Frame, kein spuerbarer Ruckler beim Scrubben). Gib am Ende eine kurze Zusammenfassung, welche Datei welche Sektion bedient, damit spaeter fuer ein anderes Weingut leicht ausgetauscht werden kann (Ziel: dieses Projekt als wiederverwendbares Pitch-Template fuer weitere Weingueter, also Inhalte moeglichst zentral in `copy.ts` und `data/*.ts` halten, nicht in den Komponenten verstreuen).
