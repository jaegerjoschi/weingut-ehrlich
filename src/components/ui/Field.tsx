interface FieldProps {
  id: string;
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}

/**
 * Eingabefeld fuer das Besuch-und-Kontakt-Formular: Label ueber dem Feld,
 * Fehlertext darunter, scharfe Kanten (keine Rundung, passend zum Rest der
 * Seite ohne Karten/Schatten), Fokusrahmen in Wine.
 */
export function Field({
  id,
  name,
  label,
  error,
  type = "text",
  autoComplete,
  placeholder,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className="w-full border border-line bg-paper px-4 py-3 text-ink outline-none transition placeholder:text-ink-muted focus:border-wine-500"
      />
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-wine-600">
          {error}
        </p>
      )}
    </div>
  );
}
