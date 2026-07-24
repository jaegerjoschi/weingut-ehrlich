import { useEffect, useRef, useState } from "react";
import { brand, nav } from "../content/copy";
import { TextLink } from "./ui/TextLink";

/**
 * Ruhige, fixe Kopfzeile. Wird nach dem ersten Scroll dezent mit
 * Pergament-Untergrund hinterlegt, damit sie ueber dem Hero-Video lesbar
 * bleibt. Der Scroll-Zustand wird per IntersectionObserver auf einem
 * unsichtbaren Sentinel am Seitenanfang erkannt, nicht per
 * scroll-Event-Listener.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      rootMargin: "-24px 0px 0px 0px",
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-soft ${
          scrolled
            ? "border-b border-line/70 bg-paper/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-content flex h-16 items-center justify-between gap-6">
          <a href="#top" className="font-display text-base font-medium tracking-tight text-ink">
            {brand.short}
            <span className="sr-only">, Startseite</span>
          </a>

          <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 md:flex">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-soft transition-colors duration-300 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <TextLink href="#besuch" variant="primary" className="text-sm">
            {nav.cta}
          </TextLink>
        </div>
      </header>
    </>
  );
}
