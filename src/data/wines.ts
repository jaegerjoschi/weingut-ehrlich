import { withBase } from "../lib/publicUrl";

export interface Wine {
  id: string;
  type: "rot" | "weiss";
  vintage: string;
  grape: string;
  name: string;
  notes: string;
  image: {
    src: string;
    alt: string;
    placeholderLabel: string;
    aspectClass: string;
  };
}

/**
 * Vier Weine der aktuellen Kollektion. Die Illustrationen sind
 * Platzhalter-Slots (siehe docs/media-assets.md): botanische Gravuren, die
 * nachtraeglich erzeugt und unter dem jeweiligen Dateinamen abgelegt werden.
 */
export const wines: Wine[] = [
  {
    id: "spaetburgunder-reserve",
    type: "rot",
    vintage: "2022",
    grape: "Spätburgunder",
    name: "Spätburgunder Reserve",
    notes:
      "Zwölf Monate im Barrique, mit dichter Frucht von dunkler Kirsche und einem Hauch Waldboden. Die Tannine sind fein, das Finale lang. Unser Flaggschiff, und der Wein, an dem wir jeden Jahrgang messen.",
    image: {
      src: withBase("/media/wine-spaetburgunder.jpg"),
      alt: "Botanische Illustration einer dunklen Spätburgunder-Traube am Rebstock",
      placeholderLabel: "Spätburgunder",
      aspectClass: "aspect-[3/4]",
    },
  },
  {
    id: "grauburgunder-kalkmergel",
    type: "weiss",
    vintage: "2025",
    grape: "Grauburgunder",
    name: "Grauburgunder vom Kalkmergel",
    notes:
      "Trocken ausgebaut, mit reifer Birne und einer feinen mineralischen Note vom Kalkmergelboden. Am Gaumen strukturiert und trotzdem leichtfüßig.",
    image: {
      src: withBase("/media/wine-grauburgunder.jpg"),
      alt: "Botanische Illustration einer hellgrünen Grauburgunder-Traube",
      placeholderLabel: "Grauburgunder",
      aspectClass: "aspect-[3/4]",
    },
  },
  {
    id: "weissburgunder-vulkanfels",
    type: "weiss",
    vintage: "2025",
    grape: "Weißburgunder",
    name: "Weißburgunder vom Vulkanfels",
    notes:
      "Gewachsen auf dem vulkanischen Fels des Kaiserstuhl: straff, salzig-mineralisch und mit wenig Frucht im Vordergrund. Ein Wein für alle, die Textur mehr schätzen als Süße.",
    image: {
      src: withBase("/media/wine-weissburgunder.jpg"),
      alt: "Botanische Illustration einer hellen Weißburgunder-Traube auf vulkanischem Gestein",
      placeholderLabel: "Weißburgunder",
      aspectClass: "aspect-[3/4]",
    },
  },
  {
    id: "cuvee-vier-generationen",
    type: "rot",
    vintage: "2022",
    grape: "Cuvée aus vier Lagen",
    name: "Cuvée „Vier Generationen“",
    notes:
      "Eine Assemblage aus allen vier Lagen der Familie, zur Erinnerung an fast hundert Jahre auf demselben Boden abgefüllt. Nur 928 Flaschen, benannt nach dem Gründungsjahr 1928. Kräftiger und dichter als unsere anderen Rotweine, aber mit derselben Handschrift.",
    image: {
      src: withBase("/media/wine-cuvee.jpg"),
      alt: "Botanische Illustration mit vier kleinen Traubenzweigen, sinnbildlich für die vier Lagen der Cuvée",
      placeholderLabel: "Cuvée",
      aspectClass: "aspect-[3/4]",
    },
  },
];
