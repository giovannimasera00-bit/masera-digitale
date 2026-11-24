import type { ReactNode } from "react";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";

export type LegalSection = { id: string; title: string; body: ReactNode };

/** Pagine legali: testo lungo e leggibile, indice in alto, data di aggiornamento. */
export function LegalPage({
  path,
  crumb,
  kicker,
  title,
  lead,
  updated,
  sections,
}: {
  path: string;
  crumb: string;
  kicker: string;
  title: ReactNode[];
  lead: ReactNode;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: crumb, href: path },
        ]}
      />
      <PageHeader kicker={kicker} lines={title} lead={lead} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 md:px-8 lg:grid-cols-[260px_1fr]">
        <nav aria-label="In questa pagina" className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-verde">In questa pagina</p>
          <ol className="mt-3 space-y-1 text-[16px]">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="fm-focus inline-flex min-h-8 items-center rounded underline-offset-4 hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="max-w-3xl space-y-10 text-[17px] leading-relaxed [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-4 [&_li]:mt-1 [&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-28">
              <h2 id={`${s.id}-t`} className="fm-display mb-3 text-[28px] leading-tight md:text-[34px]">
                {s.title}
              </h2>
              {s.body}
            </section>
          ))}
          <p className="border-t border-verde-scuro/15 pt-6 text-[15px] text-verde">Ultimo aggiornamento: {updated}</p>
        </article>
      </div>
    </>
  );
}
