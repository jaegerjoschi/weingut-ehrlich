/**
 * Verbindet einen root-absoluten Pfad unter public/ (z. B. "/media/estate-reveal.mp4")
 * mit dem konfigurierten Vite-Base-Pfad (import.meta.env.BASE_URL). Noetig, weil Vite
 * nur erkannte HTML-Tag-Attribute in index.html (link[href], script[src], img[src/srcset], ...)
 * automatisch gegen "base" umschreibt - String-Literale in .ts/.tsx-Code (Video-/Bildpfade
 * als Props/Feldwerte) bleiben davon unberuehrt und muessen hier manuell verknuepft werden.
 * Normalisiert defensiv auf genau einen Slash, unabhaengig davon ob "base" in
 * vite.config.ts mit oder ohne abschliessenden Slash geschrieben wurde.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/, "")}`;
}
