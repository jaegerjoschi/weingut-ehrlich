import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useReducedMotion } from "../lib/useReducedMotion";
import { useDataSaver } from "../lib/useDataSaver";
import { Picture } from "./ui/Picture";
import { TextLink } from "./ui/TextLink";
import { hero as copy } from "../content/copy";
import { withBase } from "../lib/publicUrl";

/**
 * Zentrierter Hero als Scroll-Animation. Das Anwesen-Video (kahle Reben bis
 * Gutshaus-Panorama mit Sonnenuntergang) ist Bild fuer Bild an den
 * Scrollfortschritt gekoppelt und radial ins Pergament der Seite maskiert.
 * Einziges eager geladenes Video der Seite (LCP-Element).
 *
 * Bei reduzierter Bewegung ODER aktivem Datensparmodus: statisches Poster
 * plus zentrierter Text, kein Pinning, kein Scrubbing.
 */
export function HeroReveal() {
  const reduced = useReducedMotion();
  const saveData = useDataSaver();
  if (reduced || saveData) return <HeroStatic />;
  return <HeroScrubbed />;
}

// Weiche Innenmaske: Video verschwindet zu allen Raendern hin ins Pergament.
// Drei aehnlich grosse, aber leicht versetzte Ellipsen (statt einer
// einzigen perfekten) werden per Vereinigung (Standard-Kompositing, jede
// Ebene traegt ihr Maximum bei) uebereinandergelegt: der Rand der
// kombinierten Flaeche ist dadurch leicht wellig/unregelmaessig statt
// mathematisch glatt, ohne die sichtbare Flaeche insgesamt zu verkleinern.
const maskImage = [
  "radial-gradient(112% 108% at 47% 43%, #000 24%, rgba(0,0,0,0.5) 50%, transparent 73%)",
  "radial-gradient(100% 96% at 55% 47%, #000 22%, rgba(0,0,0,0.45) 48%, transparent 70%)",
  "radial-gradient(96% 104% at 44% 51%, #000 20%, rgba(0,0,0,0.4) 46%, transparent 68%)",
].join(", ");
const maskStyle: CSSProperties = {
  WebkitMaskImage: maskImage,
  maskImage: maskImage,
};

function HeroScrubbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // fetchPriority als Attribut setzen (robuster als der JSX-Prop, dessen
    // Typunterstuetzung je nach @types/react-Version variiert).
    video.setAttribute("fetchpriority", "high");

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

    const render = (p: number) => {
      // Scroll-Hinweis verschwindet, sobald der Aufbau startet.
      if (hintRef.current) {
        hintRef.current.style.opacity = (1 - ramp(p, 0, 0.08)).toFixed(3);
      }
    };
    render(0);

    // Nur die ScrollTrigger-Erstellung liegt im gsap.context (wird darueber
    // zuverlaessig via ctx.revert() entfernt). Ticker und Event-Listener sind
    // keine GSAP-eigenen Objekte und werden NICHT automatisch mitgetrackt,
    // ihr Aufraeumen erfolgt bewusst direkt im useEffect-Cleanup unten (siehe
    // ScrollProcess.tsx-Kommentar fuer die volle Begruendung).
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

    // Videozeit sanft Richtung Ziel interpolieren (RAF-getrieben, bewusst
    // traege fuer eine geduldige, ruckelfreie Bewegung).
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
  }, []);

  return (
    <section id="top" aria-labelledby="hero-heading" className="relative bg-paper">
      <div ref={containerRef} className="relative h-[220vh] md:h-[260vh]">
        <div className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden">
          {/* Scrollgesteuertes Anwesen-Video, nach innen ins Pergament maskiert.
              max-w-[1440px] mx-auto: auf sehr breiten Bildschirmen (1440px+)
              bleibt das Video auf seiner sinnvollen Groesse und wird nicht
              weiter gestreckt (Quellmaterial ist nativ 1280x720, ueber ca.
              1440px hinaus wuerde reines Hochskalieren zunehmend weich/pixelig
              wirken). Unter 1440px ohne Effekt, da die Box ohnehin nicht
              breiter als der Viewport werden kann. */}
          <div className="absolute inset-0 -z-10 mx-auto max-w-[1440px]" style={maskStyle}>
            <video
              ref={videoRef}
              className="h-full w-full object-cover object-[center_50%]"
              poster={withBase("/media/estate-reveal-poster.webp")}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
            >
              <source media="(max-width: 768px)" src={withBase("/media/estate-reveal-mobile.mp4")} type="video/mp4" />
              <source src={withBase("/media/estate-reveal.mp4")} type="video/mp4" />
            </video>
          </div>

          <HeroOverlays />

          {/* Zentrierter Inhalt */}
          <div className="container-content flex flex-col items-center pb-8 text-center">
            <p className="eyebrow text-scrim">{copy.eyebrow}</p>
            <h1
              id="hero-heading"
              className="text-scrim mt-5 max-w-4xl text-balance font-display text-4xl font-medium leading-[1.08] text-ink sm:text-5xl lg:text-7xl lg:leading-[1.05]"
            >
              {copy.title}
            </h1>
            <p className="text-scrim mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              {copy.body}
            </p>

            <div className="mt-9 flex flex-col items-center gap-2 sm:flex-row sm:gap-8">
              <TextLink href={copy.primary.href} variant="primary">
                {copy.primary.label}
              </TextLink>
              <TextLink href={copy.secondary.href} variant="secondary">
                {copy.secondary.label}
              </TextLink>
            </div>
          </div>

          {/* Scroll-Hinweis (blendet beim Start des Scrollens aus) */}
          <div
            ref={hintRef}
            aria-hidden="true"
            className="absolute inset-x-0 bottom-7 flex justify-center"
          >
            <span className="flex flex-col items-center gap-2 text-xs uppercase tracking-caps text-ink-muted">
              {copy.scrollHint}
              <span className="h-9 w-px animate-pulse bg-ink-muted/50" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pergament-Wash und Kantenverlaeufe fuer ruhigen Textkontrast. */
function HeroOverlays() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-paper/10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(58% 60% at 50% 47%, rgba(240,235,225,0.92) 0%, rgba(240,235,225,0.82) 38%, rgba(240,235,225,0.55) 60%, rgba(240,235,225,0.2) 80%, rgba(240,235,225,0) 94%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-52 bg-gradient-to-b from-paper via-paper/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-52 bg-gradient-to-t from-paper via-paper/80 to-transparent"
      />
    </>
  );
}

function HeroStatic() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-paper"
    >
      <div className="absolute inset-0 -z-10 mx-auto max-w-[1440px]" style={maskStyle}>
        <Picture
          base={withBase("/media/estate-reveal-poster")}
          alt="Weinberg und Gutshaus von Weingut Ehrlich im Abendlicht"
          className="h-full w-full object-cover object-[center_50%]"
          eager
        />
      </div>
      <HeroOverlays />

      <div className="container-content flex flex-col items-center pb-8 text-center">
        <p className="eyebrow text-scrim">{copy.eyebrow}</p>
        <h1
          id="hero-heading"
          className="text-scrim mt-5 max-w-4xl text-balance font-display text-4xl font-medium leading-[1.08] text-ink sm:text-5xl lg:text-7xl lg:leading-[1.05]"
        >
          {copy.title}
        </h1>
        <p className="text-scrim mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          {copy.body}
        </p>
        <div className="mt-9 flex flex-col items-center gap-2 sm:flex-row sm:gap-8">
          <TextLink href={copy.primary.href} variant="primary">
            {copy.primary.label}
          </TextLink>
          <TextLink href={copy.secondary.href} variant="secondary">
            {copy.secondary.label}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
