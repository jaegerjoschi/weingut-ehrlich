import type { AnchorHTMLAttributes, ReactNode } from "react";

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  /** "primary" nutzt Wine fuer den einen wichtigsten Call-to-Action der
   *  Seite. Alles andere bleibt in "ink" (Ausnahmefarben-Regel). */
  variant?: "primary" | "secondary";
}

/**
 * Ruhiger Text-Link als Ersatz fuer einen gefuellten Button mit Schatten:
 * schlichter Text, dessen duenne Unterstreichung sich beim Hover/Fokus von
 * links nach rechts einzieht (reine CSS-Transition ueber background-size,
 * kein Cursor-Magnetismus, keine Skalierung, kein Schatten).
 *
 * Trotz schlanker optischer Erscheinung mindestens 44px Tippflaeche in der
 * Hoehe (per Padding, nicht per sichtbarer Buttonflaeche) fuer Touch-Ziele.
 */
export function TextLink({
  children,
  variant = "secondary",
  className = "",
  ...rest
}: TextLinkProps) {
  const tone = variant === "primary" ? "text-wine-600" : "text-ink";

  return (
    <a
      {...rest}
      className={`group inline-flex min-h-11 items-center py-2.5 text-base font-medium ${tone} ${className}`}
    >
      <span
        className="inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-soft group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]"
      >
        {children}
      </span>
    </a>
  );
}
