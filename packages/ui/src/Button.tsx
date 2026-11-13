import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primario" | "cta" | "secondario" | "testo";

const variants: Record<ButtonVariant, string> = {
  primario: "bg-verde-scuro text-carta hover:bg-verde",
  cta: "bg-mela text-verde-scuro hover:brightness-95",
  secondario: "bg-transparent text-verde border-2 border-verde hover:bg-verde hover:text-carta",
  testo: "bg-transparent text-verde underline underline-offset-4 decoration-2 !px-2",
};

const base =
  "fm-press fm-focus inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold " +
  "text-[17px] leading-none min-h-12 min-w-12 px-6 cursor-pointer no-underline " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

type Common = { variant?: ButtonVariant; children: ReactNode; className?: string };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Pulsante Masera: almeno 48 px di altezza, focus sempre visibile. Con `href` diventa un link. */
export function Button(props: AsButton | AsLink) {
  const { variant = "primario", className, children, ...rest } = props;
  const cls = cx(base, variants[variant], className);
  if (typeof rest.href === "string") {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
