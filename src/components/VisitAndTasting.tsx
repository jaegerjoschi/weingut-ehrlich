import { useId, useState, type FormEvent } from "react";
import { visit as copy } from "../content/copy";
import { Reveal } from "./ui/Reveal";
import { Field } from "./ui/Field";

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Besuch (Oeffnungszeiten, Anfahrt) und Kontakt in einem Abschnitt mit einem
 * gemeinsamen Formular. Wunschtermin und Personenzahl sind optional (nur bei
 * einem Verkostungswunsch relevant), Name/E-Mail/Nachricht sind fuer beide
 * Anliegen (Verkostung buchen oder allgemeine Frage) die Pflichtfelder.
 */
export function VisitAndTasting() {
  const ids = { name: useId(), email: useId(), date: useId(), people: useId(), message: useId() };
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(form: HTMLFormElement): Errors {
    const data = new FormData(form);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name) next.name = copy.form.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = copy.form.errors.email;
    if (!message) next.message = copy.form.errors.message;
    return next;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate(e.currentTarget);
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
      // Demo: kein echter Versand. Hier wuerde die Anfrage an das Backend gehen.
    } else {
      const firstKey = Object.keys(next)[0] as keyof Errors;
      document.getElementById(ids[firstKey])?.focus();
    }
  }

  return (
    <section
      id="besuch"
      aria-labelledby="besuch-heading"
      className="bg-surface py-24 md:py-32 lg:py-40"
    >
      <div className="container-content grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <h2
            id="besuch-heading"
            className="font-display text-4xl font-medium text-ink sm:text-5xl"
          >
            {copy.title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">{copy.intro}</p>

          <dl className="mt-10 max-w-md space-y-3 border-t border-line pt-6">
            {copy.hours.map((entry) => (
              <div key={entry.days} className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-soft">{entry.days}</dt>
                <dd className="text-ink">{entry.time}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-ink-muted">{copy.anfahrt}</p>
        </Reveal>

        <Reveal>
          {submitted ? (
            <div role="status" className="border border-line bg-paper p-8">
              <h3 className="text-2xl font-medium text-ink">{copy.form.successTitle}</h3>
              <p className="mt-3 text-ink-soft">{copy.form.successBody}</p>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-6">
              <Field
                id={ids.name}
                name="name"
                label={copy.form.fields.name}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                id={ids.email}
                name="email"
                type="email"
                label={copy.form.fields.email}
                error={errors.email}
                autoComplete="email"
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  id={ids.date}
                  name="date"
                  label={copy.form.fields.date}
                  placeholder="z. B. 12. Oktober 2026"
                />

                <div>
                  <label htmlFor={ids.people} className="mb-2 block text-sm font-medium text-ink">
                    {copy.form.fields.people}
                  </label>
                  <select
                    id={ids.people}
                    name="people"
                    defaultValue=""
                    className="w-full border border-line bg-paper px-4 py-3 text-ink outline-none transition focus:border-wine-500"
                  >
                    <option value="">{copy.form.fields.peoplePrompt}</option>
                    {copy.form.peopleOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor={ids.message} className="mb-2 block text-sm font-medium text-ink">
                  {copy.form.fields.message}
                </label>
                <textarea
                  id={ids.message}
                  name="message"
                  rows={4}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? `${ids.message}-err` : undefined}
                  placeholder={copy.form.fields.messagePlaceholder}
                  className="w-full border border-line bg-paper px-4 py-3 text-ink outline-none transition placeholder:text-ink-muted focus:border-wine-500"
                />
                {errors.message && (
                  <p id={`${ids.message}-err`} className="mt-2 text-sm text-wine-600">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center border border-ink px-8 text-sm font-medium text-ink transition-colors duration-300 ease-soft hover:bg-ink hover:text-paper"
                >
                  {copy.form.submit}
                </button>
                <p className="max-w-xs text-xs leading-relaxed text-ink-muted">
                  {copy.form.privacyNote}
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
