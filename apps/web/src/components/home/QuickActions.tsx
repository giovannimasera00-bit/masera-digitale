import Link from "next/link";
import { featureOf, isOn, quickActions } from "@/content/home";

const tones = {
  bianco: "bg-bianco text-verde-scuro",
  beige: "bg-beige-chiaro text-verde-scuro",
  salvia: "bg-salvia text-verde-scuro",
  scuro: "bg-verde-scuro text-carta",
} as const;

export function QuickActions() {
  return (
    <section aria-label="Cosa puoi fare" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a) => {
          const on = isOn(featureOf(a));
          const body = (
            <>
              <span className={`text-[14px] font-semibold ${a.tone === "scuro" ? "text-mela" : "text-verde"}`}>{a.n}</span>
              <span className="fm-display text-[28px] leading-tight">{a.title}</span>
              <span className="text-[16px] leading-relaxed">{a.text}</span>
              {on ? (
                <span className="mt-auto pt-2 text-[16px] font-semibold underline decoration-2 underline-offset-4">
                  {a.cta} <span aria-hidden>→</span>
                </span>
              ) : (
                <span
                  className={`mt-auto inline-flex w-fit rounded-full border-2 border-dashed px-3 py-1 text-[14px] font-semibold ${
                    a.tone === "scuro" ? "border-carta/50" : "border-verde-scuro/40"
                  }`}
                >
                  In arrivo
                </span>
              )}
            </>
          );
          const cls = `flex h-full flex-col gap-3 rounded-3xl p-6 md:p-7 ${tones[a.tone]}`;
          return (
            <li key={a.n}>
              {on ? (
                <Link href={a.href} className={`fm-press fm-focus transition-transform hover:-translate-y-1 ${cls}`}>
                  {body}
                </Link>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
