import { useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Kurzes Label fuer den Platzhalter, solange die echte Datei fehlt. */
  placeholderLabel?: string;
  eager?: boolean;
  width?: number;
  height?: number;
}

/**
 * Bild mit ruhigem Pergament-Platzhalter. Solange die echte Illustration noch
 * nicht in /public/media liegt, erscheint ein dezenter Verlauf in Stein-/
 * Pergamenttoenen mit Label statt eines kaputten Bildes. Sobald die Datei
 * vorhanden ist, erscheint sie automatisch (kein Codeaenderung noetig).
 */
export function SmartImage({
  src,
  alt,
  className,
  placeholderLabel,
  eager,
  width,
  height,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-stone via-paper to-line ${className ?? ""}`}
      >
        <span className="px-4 text-center text-xs font-medium uppercase tracking-caps text-ink-muted">
          {placeholderLabel ?? "Bild folgt"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
