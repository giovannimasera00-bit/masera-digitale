import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

const styles = {
  light: {
    on: "bg-verde-scuro text-carta border-verde-scuro",
    off: "bg-bianco text-verde-scuro border-beige-scuro hover:border-verde-scuro",
  },
  // Su fondo verde scuro: il chip scelto diventa carta.
  dark: {
    on: "bg-carta text-verde-scuro border-carta",
    off: "bg-transparent text-carta border-carta/50 hover:border-carta",
  },
};

/** Chip selezionabile (es. "Di cosa hai bisogno oggi?"). Lo stato è annunciato con aria-pressed. */
export function Chip({
  selected = false,
  tone = "light",
  className,
  children,
  ...rest
}: { selected?: boolean; tone?: "light" | "dark"; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        "fm-press fm-focus inline-flex items-center gap-2 rounded-full min-h-11 px-5 text-base font-medium border-2 cursor-pointer",
        selected ? styles[tone].on : styles[tone].off,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
