import { wines, type Wine } from "../data/wines";
import { wineCollection as copy } from "../content/copy";
import { SmartImage } from "./ui/SmartImage";
import { Reveal } from "./ui/Reveal";

/**
 * Vier Weine als lange, asymmetrische Editorial-Abfolge statt eines
 * Kartenrasters. Ab md: wechselt die Illustration abwechselnd auf die linke
 * oder rechte Seite, auf Mobile immer dieselbe Reihenfolge (Illustration,
 * Kapitelmarke, Titel, Text) in voller Breite.
 *
 * Jede Illustration bekommt eine leicht unterschiedliche Bleed-Weite auf der
 * jeweils aussenliegenden Seite, damit die Wiederholung der Links-rechts-
 * Alternierung nicht mechanisch wirkt. Nur ein Haarstrich zwischen den
 * Weinen, keine Karten, keine Schatten, kein Hintergrundwechsel.
 */
// Bleed-Werte bleiben unter der jeweils kleinsten verfuegbaren Container-
// Innenabstand in ihrem aktiven Bereich (md: greift ab 768px bei sm:px-8 =
// 32px, lg: greift ab 1024px bei lg:px-10 = 40px), sonst entsteht bei genau
// diesen Breiten echtes horizontales Scrollen.
const bleedClasses = [
  "md:mr-[-1.5rem] lg:mr-[-2.25rem]", // Wein 1: Bild rechts, blutet nach rechts
  "md:ml-[-1rem] lg:ml-[-1.5rem]", // Wein 2: Bild links, blutet nach links
  "md:mr-[-1.75rem] lg:mr-[-2rem]", // Wein 3: Bild rechts, andere Weite
  "md:ml-[-1.25rem] lg:ml-[-1.75rem]", // Wein 4: Bild links, andere Weite
];

export function WineCollection() {
  return (
    <section id="weine" aria-labelledby="weine-heading" className="bg-paper py-24 lg:py-32">
      <div className="container-content">
        <Reveal className="max-w-lg">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2
            id="weine-heading"
            className="mt-4 font-display text-4xl font-medium text-ink sm:text-5xl"
          >
            {copy.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{copy.intro}</p>
        </Reveal>

        <div className="mt-16 lg:mt-24">
          {wines.map((wine, i) => (
            <WineItem
              key={wine.id}
              wine={wine}
              imageRight={i % 2 === 0}
              bleedClass={bleedClasses[i % bleedClasses.length]}
              isLast={i === wines.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function WineItem({
  wine,
  imageRight,
  bleedClass,
  isLast,
}: {
  wine: Wine;
  imageRight: boolean;
  bleedClass: string;
  isLast: boolean;
}) {
  return (
    <Reveal
      as="article"
      className={`grid grid-cols-1 items-center gap-10 border-t border-line py-14 md:grid-cols-2 md:gap-16 lg:py-20 ${
        isLast ? "border-b" : ""
      }`}
    >
      <div className={imageRight ? "md:order-2" : "md:order-1"}>
        <div className={bleedClass}>
          <SmartImage
            src={wine.image.src}
            alt={wine.image.alt}
            placeholderLabel={wine.image.placeholderLabel}
            className={`w-full object-cover ${wine.image.aspectClass}`}
          />
        </div>
      </div>
      <div className={imageRight ? "md:order-1" : "md:order-2"}>
        <span className="eyebrow">
          Jahrgang {wine.vintage} · {wine.grape}
        </span>
        <h3 className="mt-3 font-display text-3xl font-medium text-ink sm:text-4xl">
          {wine.name}
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">{wine.notes}</p>
      </div>
    </Reveal>
  );
}
