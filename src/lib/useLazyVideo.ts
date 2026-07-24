import { useEffect, useState, type RefObject } from "react";

/**
 * Meldet, sobald ein Container etwa einen Viewport vor Erreichen des
 * sichtbaren Bereichs steht (rootMargin "100% 0px"). Fuer die beiden
 * Prozess-Videos genutzt, die per preload="none" erst kurz vor dem
 * Erreichen geladen werden sollen, waehrend das Hero-Video eager bleibt.
 * Einmal true, bleibt es true (kein Zurueckschalten beim Wegscrollen).
 */
export function useLazyVideo(containerRef: RefObject<HTMLElement | null>): boolean {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [containerRef, shouldLoad]);

  return shouldLoad;
}
