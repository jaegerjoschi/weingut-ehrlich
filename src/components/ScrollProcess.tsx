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

// Organische statt rechteckig wirkende Maske: die Grundform bleibt ein
// vertikaler Verlauf (das Video ist volle Breite, dort gibt es keine Kante zu
// kaschieren), aber vier zusaetzliche, unterschiedlich breite/hohe Radial-
// "Ausbeulungen" entlang der Ober-/Unterkante reichen an einzelnen Stellen
// etwas weiter ins Bild als an anderen. Per Vereinigung (Standard-
// Kompositing) uebereinandergelegt ergibt das einen leicht welligen statt
// schnurgeraden Uebergang ins Pergament.
const videoMaskImage = [
  "radial-gradient(38% 55% at 25% 0%, #000 45%, transparent 92%)",
  "radial-gradient(42% 60% at 70% 0%, #000 45%, transparent 92%)",
  "radial-gradient(40% 55% at 45% 100%, #000 45%, transparent 92%)",
  "radial-gradient(36% 65% at 80% 100%, #000 45%, transparent 92%)",
  "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
].join(", ");
const videoMask: CSSProperties = {
  WebkitMaskImage: videoMaskImage,
  maskImage: videoMaskImage,
};

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
          {/* Scrollgesteuertes Video, oben/unten ins Pergament maskiert.
              max-w-[1440px] mx-auto: wie beim Hero bleibt das Video auf sehr
              breiten Bildschirmen (1440px+) bei seiner sinnvollen Groesse
              statt weiter ueber die native 1280x720-Aufloesung hinaus
              gestreckt zu werden. Unter 1440px ohne Effekt. */}
          <div className="absolute inset-0 -z-10 mx-auto max-w-[1440px]" style={videoMask}>
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              poster={`${posterStart}.webp`}
              muted
              playsInline
              preload="none"
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

          {/* Pergament-Schleier von links fuer ruhigen Textkontrast: im
              Textbereich kraeftig deckend, faellt danach zuegig ab, damit
              die Animation rechts sichtbar bleibt. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(to right, rgba(240,235,225,0.97) 0%, rgba(240,235,225,0.93) 30%, rgba(240,235,225,0.55) 50%, rgba(240,235,225,0.08) 68%, rgba(240,235,225,0) 80%)",
            }}
          />

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
