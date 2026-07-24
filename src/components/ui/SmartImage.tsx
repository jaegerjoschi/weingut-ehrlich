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

const toWebp = (jpgSrc: string) => jpgSrc.replace(/\.jpe?g$/i, ".webp");

/**
 * Bild mit ruhigem Pergament-Platzhalter. Solange die echte Illustration noch
 * nicht in /public/media liegt, erscheint ein dezenter Verlauf in Stein-/
 * Pergamenttoenen mit Label statt eines kaputten Bildes. Sobald die Datei
 * vorhanden ist, erscheint sie automatisch (kein Codeaenderung noetig).
 *
 * Versucht zuerst die per Namenskonvention aus src abgeleitete WebP-Variante,
 * faellt bei Fehlschlag auf das JPG zurueck, erst bei erneutem Fehlschlag auf
 * den Platzhalter. Bewusst ein einzelnes <img> mit zweistufigem onError statt
 * <picture><source type="image/webp">: ein 404 auf einer picture-source faellt
 * NICHT automatisch auf img[src] zurueck (Spec-Verhalten), das wuerde bei
 * fehlendem WebP faelschlich den Platzhalter zeigen, obwohl das JPG da ist.
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
  const webpSrc = toWebp(src);
  const [stage, setStage] = useState<"webp" | "original" | "failed">(
    webpSrc !== src ? "webp" : "original",
  );

  if (stage === "failed") {
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
      src={stage === "webp" ? webpSrc : src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={() => setStage((s) => (s === "webp" ? "original" : "failed"))}
    />
  );
}
