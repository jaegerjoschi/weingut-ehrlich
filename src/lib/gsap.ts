import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Eigene, ruhige Easing-Kurve (kein linear) fuer Einblendungen.
export const EASE_SOFT = "power2.out";

export { gsap, ScrollTrigger };
