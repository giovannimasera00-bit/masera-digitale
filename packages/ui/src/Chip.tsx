import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

/** Chip selezionabile (es. "Di cosa hai bisogno oggi?"). Lo stato è annunciato con aria-pressed. */
export function Chip({
  selected = false,
  className,
  children,
  ...rest
}: { selected?: boolean; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        "fm-press fm-focus inline-flex items-center gap-2 rounded-full min-h-11 px-5 text-base font-medium border-2 cursor-pointer",
        selected
          ? "bg-verde-scuro text-carta border-verde-scuro"
          : "bg-bianco text-verde-scuro border-beige-scuro hover:border-verde-scuro",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
