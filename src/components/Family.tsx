import { family as copy } from "../content/copy";
import { timeline } from "../data/timeline";
import { SmartImage } from "./ui/SmartImage";
import { Reveal } from "./ui/Reveal";

/**
 * Chronik 1928 bis heute (data/timeline.ts) links, Illustration plus kurzes
 * persoenliches Zitat rechts. Auf Mobile: Bild und Zitat zuerst, dann die
 * Chronik, volle Breite. Kein Eyebrow (Sparsamkeit).
 */
export function Family() {
  return (
    <section
      id="familie"
      aria-labelledby="familie-heading"
      className="bg-paper py-24 md:py-32 lg:py-40"
    >
      <div className="container-content">
        <Reveal className="max-w-lg">
          <h2
            id="familie-heading"
            className="font-display text-4xl font-medium text-ink sm:text-5xl"
          >
            {copy.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{copy.intro}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:mt-20 lg:gap-24">
          <Reveal as="ol" stagger className="order-2 md:order-1">
            {timeline.map((entry, i) => (
              <li
                key={entry.year}
                className={`max-w-md pb-10 ${i === 0 ? "" : "border-t border-line pt-10"}`}
              >
                <span className="eyebrow">{entry.year}</span>
                <h3 className="mt-2 text-xl font-medium text-ink">{entry.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{entry.body}</p>
              </li>
            ))}
          </Reveal>

          <Reveal className="order-1 md:order-2">
            <div className="md:ml-[-1.25rem] lg:ml-[-2rem]">
              <SmartImage
                src={copy.image.src}
                alt={copy.image.alt}
                placeholderLabel={copy.image.placeholderLabel}
                className={`w-full object-cover ${copy.image.aspectClass}`}
              />
            </div>
            <blockquote className="mt-8 max-w-md border-t border-line pt-6">
              <p className="font-display text-xl italic leading-relaxed text-ink">
                {copy.quote.text}
              </p>
              <footer className="mt-4 text-sm text-ink-muted">
                {copy.quote.name}, {copy.quote.role}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
