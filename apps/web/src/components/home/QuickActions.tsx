import Link from "next/link";
import { quickActions } from "@/content/home";

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
        {quickActions.map((a) => (
          <li key={a.n}>
            <Link
              href={a.href}
              className={`fm-press fm-focus group flex h-full flex-col gap-3 rounded-3xl p-6 transition-transform hover:-translate-y-1 md:p-7 ${tones[a.tone]}`}
            >
              <span className={`text-[14px] font-semibold ${a.tone === "scuro" ? "text-mela" : "text-verde"}`}>{a.n}</span>
              <span className="fm-display text-[28px] leading-tight">{a.title}</span>
              <span className="text-[16px] leading-relaxed">{a.text}</span>
              <span className="mt-auto pt-2 text-[16px] font-semibold underline decoration-2 underline-offset-4">
                {a.cta} <span aria-hidden>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
