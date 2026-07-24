import { brand, footer as copy } from "../content/copy";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper py-16">
      <div className="container-content">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-lg font-medium text-ink">{brand.name}</div>
            <p className="mt-4 max-w-xs text-ink-soft">{copy.tagline}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-caps text-ink-muted">
              Weingut
            </h2>
            <address className="mt-4 not-italic text-ink-soft">
              {copy.address.lines.map((line) => (
                <div key={line}>{line}</div>
              ))}
              <div className="mt-3">
                <a href={`tel:${copy.address.phone.replace(/\s/g, "")}`} className="hover:text-ink">
                  {copy.address.phone}
                </a>
              </div>
              <div>
                <a href={`mailto:${copy.address.email}`} className="hover:text-ink">
                  {copy.address.email}
                </a>
              </div>
            </address>
          </div>

          <nav aria-label="Rechtliches">
            <h2 className="text-sm font-semibold uppercase tracking-caps text-ink-muted">
              Rechtliches
            </h2>
            <div className="mt-4 space-y-3">
              <LegalDisclosure
                id="impressum"
                title={copy.impressum.title}
                body={copy.impressum.body}
              />
              <LegalDisclosure
                id="datenschutz"
                title={copy.datenschutz.title}
                body={copy.datenschutz.body}
              />
            </div>
          </nav>
        </div>

        {/* Altersnachweis-Hinweis: sichtbar, aber nicht aufdringlich */}
        <div className="mt-12 border-t border-line pt-6">
          <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
            {copy.altersnachweis}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {copy.copyright}
          </p>
          <p>{brand.region}</p>
        </div>
      </div>
    </footer>
  );
}

function LegalDisclosure({ id, title, body }: { id: string; title: string; body: string[] }) {
  return (
    <details id={id} className="group border border-line px-4 py-3">
      <summary className="cursor-pointer list-none text-ink transition-colors hover:text-wine-600 focus-visible:outline-offset-4">
        <span className="flex items-center justify-between gap-2">
          {title}
          <span aria-hidden="true" className="text-ink-muted transition-transform group-open:rotate-45">
            +
          </span>
        </span>
      </summary>
      <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
        {body.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </details>
  );
}
