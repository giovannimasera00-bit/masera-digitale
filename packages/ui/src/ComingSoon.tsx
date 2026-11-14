import { cx } from "./cx";

/**
 * Al posto di un pulsante, per una funzione non ancora attiva ("Shop online · in arrivo").
 * Non è cliccabile: niente pulsanti che portano a pagine vuote.
 */
export function ComingSoon({ label, tone = "light", className }: { label: string; tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-dashed px-5 text-[16px] font-medium",
        tone === "light" ? "border-beige-scuro text-verde-scuro" : "border-carta/50 text-carta",
        className,
      )}
    >
      {label}
      <span className={cx("rounded-full px-2 py-0.5 text-[12px] font-semibold uppercase tracking-wide", tone === "light" ? "bg-beige-chiaro" : "bg-carta/15")}>
        in arrivo
      </span>
    </span>
  );
}
