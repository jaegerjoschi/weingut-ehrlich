import { useEffect } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { SkipLink } from "./components/SkipLink";
import { Header } from "./components/Header";
import { HeroReveal } from "./components/HeroReveal";
import { ScrollProcess } from "./components/ScrollProcess";
import { WineCollection } from "./components/WineCollection";
import { Terroir } from "./components/Terroir";
import { Family } from "./components/Family";
import { VisitAndTasting } from "./components/VisitAndTasting";
import { Awards } from "./components/Awards";
import { Footer } from "./components/Footer";
import { growth, process as processCopy } from "./content/copy";
import { growthSteps } from "./data/growthSteps";
import { processSteps } from "./data/processSteps";
import { withBase } from "./lib/publicUrl";

// Eyebrow-Sparsamkeit (max. 1 pro 3 Sektionen): nur Hero, "Wachstum" und
// WineCollection tragen einen Sektions-Eyebrow. "Verarbeitung" bekommt daher
// bewusst keinen (siehe growth.eyebrow vs. processCopy ohne eyebrow-Feld).

export default function App() {
  useEffect(() => {
    // Nach dem Laden von Bildern/Schriften Positionen der ScrollTrigger neu berechnen.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="grain-overlay pointer-events-none fixed inset-0 z-40" />
      <SkipLink />
      <Header />
      <main id="hauptinhalt">
        <HeroReveal />

        <ScrollProcess
          id="wachstum"
          videoSrc={withBase("/media/vine-growth.mp4")}
          videoSrcMobile={withBase("/media/vine-growth-mobile.mp4")}
          posterStart={withBase("/media/vine-growth-start")}
          posterEnd={withBase("/media/vine-growth-end")}
          posterEndAlt="Rebstock mit drei vollen, noch grünen Traubenbündeln"
          eyebrow={growth.eyebrow}
          heading={growth.heading}
          steps={growthSteps}
          pinHeightClass="h-[260vh] md:h-[300vh]"
        />

        <WineCollection />

        <ScrollProcess
          id="verarbeitung"
          videoSrc={withBase("/media/wine-process.mp4")}
          videoSrcMobile={withBase("/media/wine-process-mobile.mp4")}
          posterStart={withBase("/media/wine-process-start")}
          posterEnd={withBase("/media/wine-process-end")}
          posterEndAlt="Gefüllte Weinflasche neben Fass und Gärglas"
          heading={processCopy.heading}
          steps={processSteps}
          pinHeightClass="h-[280vh] md:h-[340vh]"
        />

        <Terroir />
        <Family />
        <VisitAndTasting />
        <Awards />
      </main>
      <Footer />
    </>
  );
}
