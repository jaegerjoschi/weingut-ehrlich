import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, EASE_SOFT } from "../../lib/gsap";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Gestaffelte Einblendung der direkten Kinder. */
  stagger?: boolean;
}

/**
 * Blendet Inhalte beim Scrollen ruhig ein (nur opacity/transform).
 * Bei prefers-reduced-motion bleibt alles sofort sichtbar (siehe index.css).
 */
export function Reveal({
  children,
  as,
  className = "",
  delay = 0,
  stagger = false,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.set(targets, { opacity: 0, y: 22 });
      const tween = gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: EASE_SOFT,
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [delay, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

// Sorgt dafuer, dass Positionen nach spaetem Nachladen (Bilder) stimmen.
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
