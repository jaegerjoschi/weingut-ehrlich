import type { ProcessStep } from "./growthSteps";

/**
 * Vier Schritte fuer die Verarbeitungs-Sektion (wine-process.mp4, 168 Frames,
 * 24fps, 7s).
 */
export const processSteps: ProcessStep[] = [
  {
    n: "01",
    title: "Handlese und Pressung",
    body: "Am Tag der Ernte werden die Trauben von Hand gelesen und noch am selben Tag sanft gepresst, damit die Beeren so wenig Wärme wie möglich abbekommen.",
    window: [0.0, 0.05, 0.22, 0.28],
  },
  {
    n: "02",
    title: "Spontanvergärung im offenen Bottich",
    body: "Wir setzen auf die natürlichen Hefen aus dem eigenen Weinberg statt auf Reinzuchthefe. Das dauert länger und ist weniger planbar, gibt dem Wein aber seinen eigenen Charakter.",
    window: [0.32, 0.38, 0.56, 0.62],
  },
  {
    n: "03",
    title: "Ausbau im Barrique-Keller",
    body: "Je nach Wein reift der Jungwein zwölf bis achtzehn Monate im Barrique. Wir probieren währenddessen regelmäßig, wann ein Fass bereit ist.",
    window: [0.65, 0.7, 0.79, 0.84],
  },
  {
    n: "04",
    title: "Abfüllung von Hand",
    body: "Abgefüllt wird auf dem eigenen Hof, ohne Zwischenhändler. So bleibt die letzte Kontrolle über jede Flasche bei uns.",
    window: [0.87, 0.92, 1.1, 1.2],
  },
];
