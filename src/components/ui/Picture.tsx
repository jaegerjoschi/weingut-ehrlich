interface PictureProps {
  /** Pfad ohne Dateiendung, z. B. "/media/vine-growth-step-1". */
  base: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/**
 * Fuer die von scripts/gen-video.mjs erzeugten Standbilder (Poster,
 * Zeitleisten-Stills): immer vorhanden, kein Platzhalter-Fallback noetig
 * (anders als SmartImage fuer die redaktionellen Illustrations-Slots).
 * WebP zuerst, JPG als Fallback fuer aeltere Browser.
 */
export function Picture({ base, alt, className, eager }: PictureProps) {
  return (
    <picture>
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img
        src={`${base}.jpg`}
        alt={alt}
        className={className}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}
