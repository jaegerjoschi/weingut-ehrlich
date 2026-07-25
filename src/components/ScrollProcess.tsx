import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useReducedMotion } from "../lib/useReducedMotion";
import { useDataSaver } from "../lib/useDataSaver";
import { useLazyVideo } from "../lib/useLazyVideo";
import { Picture } from "./ui/Picture";
import type { ProcessStep } from "../data/growthSteps";

interface ScrollProcessProps {
  id: string;
  videoSrc: string;
  videoSrcMobile: string;
  /** Basispfad ohne Endung, z. B. "/media/vine-growth-start". */
  posterStart: string;
  /** Basispfad ohne Endung, fuer die reduced-motion/Datensparmodus-Ansicht. */
  posterEnd: string;
  posterEndAlt: string;
  /** Optional: Sektions-Eyebrow. Bewusst nicht auf jeder Sektion vorhanden
   *  (Eyebrow-Sparsamkeit, siehe App.tsx). */
  eyebrow?: string;
  heading: string;
  steps: ProcessStep[];
  /** Vollstaendige Tailwind-Klasse fuer die Pin-Strecke, mobil-first,
   *  z. B. "h-[260vh] md:h-[300vh]". Pro Sektion unterschiedlich lang. */
  pinHeightClass: string;
}

/**
 * Wiederverwendbare Scroll-Video-Sektion fuer "Wachstum" und "Verarbeitung".
 * video.currentTime wird per ScrollTrigger an den Scrollfortschritt gekoppelt
 * und per requestAnimationFrame sanft angenaehert (bewusst traege, 0.12,
 * fuer eine ruhige, geduldige Bewegung). Die Prozess-Videos werden per
 * IntersectionObserver (useLazyVideo) erst rund einen Viewport vor Erreichen
 * geladen, preload="none" bis dahin.
 *
 * Bei reduzierter Bewegung ODER aktivem Datensparmodus: Endstandbild plus
 * gestapelter Text, kein Pinning, kein Scrubbing.
 */
export function ScrollProcess(props: ScrollProcessProps) {
  const reduced = useReducedMotion();
  const saveData = useDataSaver();
  if (reduced || saveData) return <ProcessStatic {...props} />;
  return <ProcessScrubbed {...props} />;
}

// Nach dem Vorbild von HeroReveal.tsx (dort nachweislich ohne harte Kanten
// an jedem Rand): drei grosse, leicht versetzte radiale Ellipsen statt der
// fruehen Mischung aus Eck-"Ausbeulungen" + separater linearer Vertikal-
// Maske. Nach rechts-von-der-Mitte verschoben (62-68% x), damit links die
// Textzone weiterhin vom eigenen Pergament-Schleier (siehe unten) abgedeckt
// wird, nicht von dieser Maske. Erreichen "transparent" bereits bei 74-80%
// des eigenen Radius -> vor dem tatsaechlichen Rand bleibt auf allen Seiten
// ein Sicherheitsabstand mit garantiert voller Transparenz, statt genau am
// Rand exakt bei 0 anzukommen (siehe Kommentar bei videoOverscan-Style oben
// am <video>: reines Ausfaden reicht bei Kanten, die exakt auf dem
// Bildrand liegen, ohnehin nicht aus).
const videoMaskImage = [
  "radial-gradient(74% 120% at 62% 47%, #000 28%, rgba(0,0,0,0.5) 54%, transparent 80%)",
  "radial-gradient(68% 112% at 68% 53%, #000 26%, rgba(0,0,0,0.45) 50%, transparent 76%)",
  "radial-gradient(80% 108% at 58% 50%, #000 24%, rgba(0,0,0,0.4) 48%, transparent 74%)",
].join(", ");
const videoMask: CSSProperties = {
  WebkitMaskImage: videoMaskImage,
  maskImage: videoMaskImage,
};

// Vertikaler Kanten-Ausblender ueber der GESAMTEN Video-Box. Das war die
// Ursache der sichtbaren Ober-/Unterkante: die Ellipsen oben haben einen
// vertikalen Radius von 108-120% der Boxhoehe und erreichen "transparent"
// erst bei 74-80% davon - an der Ober-/Unterkante selbst steht die Maske
// dadurch noch bei 88-94% Deckkraft (nachgerechnet). Das Quellmaterial
// liegt dort im Mittel bei rgb(205,200,188), das Pergament der Seite bei
// rgb(240,235,225): rund 30 Helligkeitsstufen Unterschied, also eine klar
// sichtbare waagerechte Linie. HeroReveal hat dasselbe Maskenverhalten,
// deckt es aber mit zwei Pergament-Balken (h-52) oben/unten ab - hier gab
// es die nie.
//
// Bewusst eine EIGENE, verschachtelte Ebene statt eines vierten Layers in
// videoMaskImage: mehrere mask-image-Layer auf EINEM Element werden per
// Vereinigung (add) kombiniert, ein zusaetzlicher Verlauf wuerde die
// Randdeckkraft also noch erhoehen statt sie zu senken. Verschachtelte
// Masken multiplizieren sich dagegen von selbst, ohne auf
// mask-composite: intersect angewiesen zu sein.
//
// Die Stuetzstellen bilden eine Smoothstep-Kurve nach statt linear
// anzusteigen: ein linearer Alpha-Verlauf erzeugt an seinen beiden Knicken
// sichtbare Mach-Baender, gerade auf so grossen, ruhigen Flaechen. Erste
// und letzte Stufe liegen exakt auf 0 (nicht knapp darueber), damit an der
// tatsaechlichen Kante garantiert nichts stehen bleibt.
const edgeFadeMaskImage = [
  "linear-gradient(to bottom,",
  "transparent 0%,",
  "rgba(0,0,0,0.05) 3%,",
  "rgba(0,0,0,0.16) 6%,",
  "rgba(0,0,0,0.5) 12%,",
  "rgba(0,0,0,0.84) 18%,",
  "#000 24%,",
  "#000 76%,",
  "rgba(0,0,0,0.84) 82%,",
  "rgba(0,0,0,0.5) 88%,",
  "rgba(0,0,0,0.16) 94%,",
  "rgba(0,0,0,0.05) 97%,",
  "transparent 100%)",
].join(" ");
const edgeFadeMask: CSSProperties = {
  WebkitMaskImage: edgeFadeMaskImage,
  maskImage: edgeFadeMaskImage,
};

// Pergament-Schleier von links fuer ruhigen Textkontrast: im Textbereich
// kraeftig deckend, in der Mitte-rechts durchlaessig fuer die Animation,
// zu beiden Seiten auf volle Deckkraft. Dass er BEIDE Enden (0% und 96%)
// voll deckend erreicht, ist kein Detail: der Schleier liegt jetzt INNEN
// in der max-w-[1440px]-Box (siehe JSX) und deckt damit auf Viewports ueber
// 1440px genau deren senkrechte Kanten ab. Vorher spannte er ueber die
// volle Viewportbreite, sein deckendes Ende lag also neben der Box statt
// auf ihr, und die Box stand dort mit rund 85% Restdeckkraft (rightEdge der
// Ellipsen-Maske) gegen das Pergament.
const paperVeil = [
  "linear-gradient(to right,",
  "rgba(240,235,225,1) 0%,",
  "rgba(240,235,225,0.97) 4%,",
  "rgba(240,235,225,0.9) 30%,",
  "rgba(240,235,225,0.5) 50%,",
  "rgba(240,235,225,0.3) 58%,",
  "rgba(240,235,225,0.55) 74%,",
  "rgba(240,235,225,0.85) 88%,",
  "rgba(240,235,225,1) 96%,",
  "rgba(240,235,225,1) 100%)",
].join(" ");

function ProcessScrubbed({
  id,
  videoSrc,
  videoSrcMobile,
  posterStart,
  eyebrow,
  heading,
  steps,
  pinHeightClass,
}: ScrollProcessProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const shouldLoad = useLazyVideo(videoWrapRef);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video || !shouldLoad) return;

    // Sources wurden gerade erst per React eingehaengt (siehe JSX unten):
    // load() anstossen, damit der Browser sie tatsaechlich aufnimmt.
    video.load();

    let duration = 0;
    let targetTime = 0;
    let currentTime = 0;

    const onMeta = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
    };
    if (video.readyState >= 1) onMeta();
    video.addEventListener("loadedmetadata", onMeta);

    const ramp = (p: number, a: number, b: number) =>
      Math.min(1, Math.max(0, (p - a) / (b - a)));

    const apply = (el: HTMLElement | null, opacity: number, rise: number) => {
      if (!el) return;
      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translateY(${rise.toFixed(1)}px)`;
    };

    // Auf schmalen (mobilen) Viewports schneidet object-fit:cover bei einer
    // breiten 16:9-Komposition links/rechts viel weg (z. B. verschwindet die
    // fertige Flasche am rechten Bildrand bei "Abfuellung" komplett). Da der
    // Bildaufbau der Reihe nach von links nach rechts erzaehlt (Traube ->
    // Presse -> Gaerglas -> Fass -> Flasche) UND der Scrollfortschritt
    // dieselbe Erzaehlung durchlaeuft, schwenkt object-position auf schmalen
    // Viewports synchron mit, sodass immer der gerade relevante Ausschnitt im
    // Bild bleibt statt eines festen Mittel-Crops.
    const isNarrowViewport = window.matchMedia("(max-width: 768px)").matches;

    const render = (p: number) => {
      steps.forEach((step, i) => {
        const [inA, inB, outA, outB] = step.window;
        const fadeIn = ramp(p, inA, inB);
        const fadeOut = ramp(p, outA, outB);
        apply(stepRefs.current[i], fadeIn * (1 - fadeOut), (1 - fadeIn) * 26 - fadeOut * 22);
      });
      if (isNarrowViewport) {
        const panPercent = 12 + Math.min(1, Math.max(0, p)) * 76;
        video.style.objectPosition = `${panPercent.toFixed(1)}% center`;
      }
    };
    render(0);

    // Nur die ScrollTrigger-Erstellung liegt im gsap.context (wird darueber
    // zuverlaessig via ctx.revert() entfernt). Ticker und Event-Listener sind
    // keine GSAP-eigenen Objekte und werden NICHT automatisch mitgetrackt,
    // ihr Aufraeumen erfolgt bewusst direkt im useEffect-Cleanup unten, statt
    // sich auf einen (nicht garantiert aufgerufenen) inneren Return-Wert aus
    // gsap.context() zu verlassen. Ohne das entstanden bei jedem erneuten
    // Effect-Lauf (z. B. React StrictMode) zusaetzliche, nie entfernte
    // ScrollTrigger/Ticker-Instanzen, die sich gegenseitig ueberschrieben
    // haben und zu falschen, eingefrorenen Zwischenzustaenden fuehrten.
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          targetTime = self.progress * duration;
          render(self.progress);
        },
      });
    }, container);

    const tick = () => {
      if (!duration) return;
      currentTime += (targetTime - currentTime) * 0.12;
      if (Math.abs(targetTime - currentTime) < 0.002) currentTime = targetTime;
      if (video.readyState >= 1) {
        try {
          video.currentTime = currentTime;
        } catch {
          /* Video noch nicht bereit */
        }
      }
    };
    gsap.ticker.add(tick);

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, [shouldLoad, steps]);

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="relative bg-paper">
      <h2 id={`${id}-heading`} className="sr-only">
        {heading}
      </h2>
      <div ref={containerRef} className={`relative ${pinHeightClass}`}>
        <div
          ref={videoWrapRef}
          className="sticky top-0 flex h-[100svh] w-full items-center overflow-hidden"
        >
          {/* Scrollgesteuertes Video, zu allen Seiten ins Pergament ausgeblendet.
              max-w-[1440px] mx-auto: wie beim Hero bleibt das Video auf sehr
              breiten Bildschirmen (1440px+) bei seiner sinnvollen Groesse
              statt weiter ueber die native 1280x720-Aufloesung hinaus
              gestreckt zu werden. Unter 1440px ohne Effekt.

              Drei bewusst getrennte Ebenen, weil jede eine andere Aufgabe hat
              und sie sich nur verschachtelt sauber multiplizieren:
              1. diese Box  -> vertikaler Ausblender auf echte Transparenz an
                               Ober-/Unterkante (edgeFadeMask),
              2. Video-Box  -> organische Ellipsen-Vignette (videoMask),
              3. Schleier   -> waagerechter Pergament-Verlauf (paperVeil).
              Der Schleier liegt mit in dieser Box und wird daher vom
              vertikalen Ausblender gleich mit erfasst - so endet auch er
              nicht an einer eigenen Kante. Weil alles auf Pergament (#f0ebe1)
              ausblendet und Sektion wie Nachbarsektionen exakt dieselbe Farbe
              tragen, geht die Animation ohne Absatz in den Seitenhintergrund
              ueber. */}
          <div className="absolute inset-0 -z-10 mx-auto max-w-[1440px]" style={edgeFadeMask}>
            <div className="h-full w-full" style={videoMask}>
              {/* transform: scale(1.07) "ueberscannt" das Video bewusst: die
                  Illustration hat eine hart gezeichnete Vignette, die in
                  manchen Frames bis exakt an den Rand des Quellbilds reicht
                  (per Pixel-Sampling verifiziert, 0% Abstand). Reines Ausfaden
                  kann eine Kante, die auf dem Rand selbst liegt, nicht mehr
                  kaschieren; die 7%ige Vergroesserung schneidet diesen
                  Randstreifen (~3.3%, Formel 50*(k-1)/k) komplett weg, bevor
                  die Maske/der Schleier ueberhaupt zum Tragen kommt. */}
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                style={{ transform: "scale(1.07)" }}
                poster={`${posterStart}.webp`}
                muted
                playsInline
                preload={shouldLoad ? "auto" : "none"}
                aria-hidden="true"
                tabIndex={-1}
              >
                {shouldLoad && (
                  <>
                    <source media="(max-width: 768px)" src={videoSrcMobile} type="video/mp4" />
                    <source src={videoSrc} type="video/mp4" />
                  </>
                )}
              </video>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: paperVeil }}
            />
          </div>

          <div className="container-content relative">
            {eyebrow && (
              <p className="eyebrow text-scrim mb-6">{eyebrow}</p>
            )}
            <div className="relative max-w-md">
              {steps.map((step, i) => (
                <div
                  key={step.n}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className={i === 0 ? "" : "absolute inset-x-0 top-0"}
                  style={i === 0 ? undefined : { opacity: 0 }}
                >
                  <span className="eyebrow text-scrim">{step.n}</span>
                  <h3 className="text-scrim mt-3 font-display text-3xl font-medium leading-snug text-ink sm:text-4xl">
                    {step.title}
                  </h3>
                  <p className="text-scrim mt-4 text-lg leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStatic({
  id,
  posterEnd,
  posterEndAlt,
  eyebrow,
  heading,
  steps,
}: ScrollProcessProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="bg-paper py-24 lg:py-32">
      <div className="container-content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2
          id={`${id}-heading`}
          className={`${eyebrow ? "mt-4" : ""} max-w-2xl font-display text-4xl font-medium text-ink sm:text-5xl`}
        >
          {heading}
        </h2>

        <div className="mt-12 max-w-3xl">
          <Picture base={posterEnd} alt={posterEndAlt} className="w-full object-cover" />
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n}>
              <span className="eyebrow">{step.n}</span>
              <h3 className="mt-2 text-xl font-medium text-ink">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
