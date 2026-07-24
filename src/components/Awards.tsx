import { awards as copy } from "../content/copy";
import { Reveal } from "./ui/Reveal";

/**
 * Ruhige Text-Reihe mit duennen Trennstrichen. Kein Logo-Karussell, kein
 * Konfetti, keine Icons.
 */
export function Awards() {
  return (
    <section
      id="auszeichnungen"
      aria-labelledby="auszeichnungen-heading"
      className="bg-paper py-24 lg:py-28"
    >
      <div className="container-content">
        <h2
          id="auszeichnungen-heading"
          className="font-display text-3xl font-medium text-ink sm:text-4xl"
        >
          {copy.title}
        </h2>
        <Reveal as="ul" stagger className="mt-10 divide-y divide-line border-t border-line">
          {copy.items.map((item) => (
            <li
              key={item.source}
              className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <span className="font-medium text-ink">{item.source}</span>
              <span className="text-ink-soft">{item.detail}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
