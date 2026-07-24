import type { Config } from "tailwindcss";

/**
 * Botanische Gravur-Aesthetik: warmes Pergament, dunkles Sepia-Gruen fuer
 * Linienwerk und Typografie, Burgunderrot und Gold als seltene Akzente.
 * Die Farbwerte sind aus den erzeugten Video-Standbildern abgetastet (siehe
 * scripts/gen-video.mjs), damit Seite und Video nahtlos ineinander uebergehen.
 *
 * Bewusst NICHT aus dem Referenzprojekt uebernommen: boxShadow (soft/lift/
 * bezel) und die bezel-card-Optik. Grosse Flaechen bleiben in "ink" auf
 * "paper", "wine" und "gold" sind Ausnahmefarben (siehe index.css-Kommentare
 * und die einzelnen Komponenten).
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f0ebe1",
        surface: "#f7f3ea",
        line: "#ded5c2",
        stone: "#ddd2bd",
        ink: {
          DEFAULT: "#2a2f24",
          soft: "#454b3c",
          muted: "#767a67",
        },
        wine: {
          50: "#f6ecee",
          100: "#e9ccd2",
          400: "#8a3345",
          500: "#6b2432",
          600: "#521c27",
          700: "#3e151d",
        },
        gold: {
          300: "#e2cd9c",
          500: "#b3903f",
          700: "#8a6c2c",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        caps: "0.14em",
      },
      maxWidth: {
        content: "78rem",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
