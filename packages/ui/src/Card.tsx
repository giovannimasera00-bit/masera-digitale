import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type CardTone = "bianco" | "carta" | "scuro" | "salvia" | "beige";

const tones: Record<CardTone, string> = {
  bianco: "bg-bianco text-verde-scuro shadow-[0_1px_0_rgb(46_63_45/0.06),0_8px_24px_-12px_rgb(46_63_45/0.18)]",
  carta: "bg-carta text-verde-scuro border border-beige-chiaro",
  scuro: "bg-verde-scuro text-carta",
  salvia: "bg-salvia text-verde-scuro",
  beige: "bg-beige-chiaro text-verde-scuro",
};

export function Card({
  tone = "bianco",
  className,
  children,
  ...rest
}: { tone?: CardTone; children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("rounded-3xl p-6 md:p-8", tones[tone], className)} {...rest}>
      {children}
    </div>
  );
}
