export interface ProcessStep {
  n: string;
  title: string;
  body: string;
  /** Scroll-Fenster [inA, inB, outA, outB] als Fortschritt 0 bis 1, in dem der
   *  Text ein- und wieder ausblendet. Passend zu den sichtbaren Bildinhalten
   *  des Videos gewaehlt (siehe scripts/gen-video.mjs). */
  window: [number, number, number, number];
}

/**
 * Drei Schritte fuer die Wachstums-Sektion (vine-growth.mp4). Das Video
 * endet bewusst, waehrend die Trauben noch gruen sind (kein Farbumschlag ins
 * Rote), passend zur Kollektion mit Rot- und Weissweinen.
 */
export const growthSteps: ProcessStep[] = [
  {
    n: "01",
    title: "Austrieb im April",
    body: "Nach dem Winterschnitt brechen die ersten Knospen auf. In diesen Wochen entscheidet oft schon ein später Frost über die Menge des ganzen Jahrgangs.",
    window: [0.0, 0.06, 0.24, 0.3],
  },
  {
    n: "02",
    title: "Blüte und Wachstum im Sommer",
    body: "Aus jeder Blüte wird im besten Fall eine Traube. Wir lichten die Reben mehrfach von Hand aus, damit Luft und Sonne an jede Beere kommen.",
    window: [0.34, 0.42, 0.62, 0.7],
  },
  {
    n: "03",
    title: "Lese im späten September und Oktober",
    body: "Jede Rebsorte wird einzeln und von Hand gelesen, sobald ihre Beeren genau die richtige Reife erreicht haben. Manche Lagen ernten wir zwei- bis dreimal, je nach Reifegrad der einzelnen Trauben.",
    window: [0.74, 0.82, 1.1, 1.2],
  },
];
