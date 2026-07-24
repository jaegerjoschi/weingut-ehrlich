import { terroir as copy } from "../content/copy";
import { SmartImage } from "./ui/SmartImage";
import { Reveal } from "./ui/Reveal";

/**
 * Schmale Textspalte plus eine einzelne, leicht bleedende Illustration.
 * Kein Eyebrow (Sparsamkeit, siehe App.tsx-Kommentar zur Verteilung).
 */
export function Terroir() {
  return (
    <section
      id="terroir"
      aria-labelledby="terroir-heading"
      className="bg-paper py-24 md:py-32 lg:py-40"
    >
      <div className="container-content grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
        <Reveal className="order-2 md:order-1">
          <h2
            id="terroir-heading"
            className="font-display text-4xl font-medium text-ink sm:text-5xl"
          >
            {copy.title}
          </h2>
          <div className="mt-6 max-w-md space-y-5 text-lg leading-relaxed text-ink-soft md:max-w-lg">
            {copy.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
        <Reveal className="order-1 md:order-2">
          <div className="md:ml-[-1.5rem] lg:ml-[-2.25rem]">
            <SmartImage
              src={copy.image.src}
              alt={copy.image.alt}
              placeholderLabel={copy.image.placeholderLabel}
              className={`w-full object-cover ${copy.image.aspectClass}`}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
