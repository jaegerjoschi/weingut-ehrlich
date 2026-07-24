export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
}

/**
 * Chronik der Familie Ehrlich, 1928 bis heute. 2015 (Terroir-Sektion,
 * Bio-Umstellung beginnt) und 2020 (hier, Lena Ehrlich fuehrt sie weiter)
 * sind bewusst zwei verschiedene Zeitpunkte derselben Entwicklung.
 */
export const timeline: TimelineEntry[] = [
  {
    year: "1928",
    title: "Gründung",
    body: "Gründung des Weinguts durch die Familie Ehrlich, mit zwei Hektar Rebfläche nach der Reblauskrise, die dem Kaiserstuhl Jahre zuvor stark zugesetzt hatte.",
  },
  {
    year: "1952",
    title: "Wiederaufbau",
    body: "Wiederaufbau und erste Erweiterung durch die zweite Generation. Aus zwei Hektar werden über die Jahre acht.",
  },
  {
    year: "1994",
    title: "Modernisierung",
    body: "Modernisierung des Kellers durch die dritte Generation: Edelstahltanks ergänzen die alten Holzfässer, die Qualität wird gleichmäßiger.",
  },
  {
    year: "2020",
    title: "Übernahme",
    body: "Lena Ehrlich übernimmt die Betriebsleitung und führt die 2015 begonnene Umstellung auf biologischen Anbau konsequent weiter.",
  },
];
