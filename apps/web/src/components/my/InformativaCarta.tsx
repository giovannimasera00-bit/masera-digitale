import { informativaCarta, informativaCartaIntro } from "@/content/informativa-carta";

/** L'informativa della Carta Fedeltà, apribile, con il testo definitivo della farmacia. */
export function InformativaCarta({ summary = "Leggi l'informativa della Carta Fedeltà" }: { summary?: string }) {
  return (
    <details className="rounded-2xl border-2 border-verde-scuro/15 bg-carta p-4">
      <summary className="fm-focus cursor-pointer text-[15px] font-semibold underline underline-offset-4">{summary}</summary>
      <div className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-2 text-[14px] leading-relaxed">
        <p>{informativaCartaIntro}</p>
        {informativaCarta.map((s) => (
          <section key={s.title}>
            <h3 className="text-[13px] font-bold uppercase tracking-[0.08em] text-verde">{s.title}</h3>
            <p className="mt-1">{s.text}</p>
          </section>
        ))}
      </div>
    </details>
  );
}
