import type { Metadata } from "next";
import { farmaesteticaContacts as c, farmaesteticaGroups, farmaesteticaHours, formatWeeklyHours, getOpenStatus, miamoGroups } from "@masera/core";
import { ComingSoon, OpenBadge, RiseTitle } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { TreatmentTabs } from "@/components/farmaestetica/TreatmentTabs";

// Regola fissa n. 1: sempre "Farmaestetica by Dottor Masera".
export const metadata: Metadata = {
  title: "Farmaestetica by Dottor Masera",
  description:
    "Farmaestetica by Dottor Masera, al piano 1 della Farmacia Masera di Seregno: trattamenti viso e corpo, laser, cera e la Miamo Lounge. Listino con prezzi.",
};

const waNumber = c.whatsapp.replace(/\s/g, "");

export default function FarmaesteticaPage() {
  const tabs = [
    ...farmaesteticaGroups.map((g) => ({ slug: g.slug, label: g.name, groups: [g], estimate: true, note: g.note })),
    { slug: "miamo-lounge", label: "Miamo Lounge", groups: miamoGroups, estimate: false, note: "Protocolli Miamo eseguiti con i prodotti professionali Miamo." },
  ];
  const initial = getOpenStatus(farmaesteticaHours, new Date());

  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Farmaestetica", href: "/farmaestetica" },
        ]}
      />

      <section aria-label="Farmaestetica by Dottor Masera" className="mx-auto mt-6 max-w-7xl px-4 md:px-8">
        <div className="relative overflow-hidden rounded-[40px] bg-salvia px-6 py-10 text-verde-scuro md:px-12 md:py-16">
          <svg aria-hidden viewBox="0 0 1440 640" preserveAspectRatio="xMidYMax slice" className="fm-arch is-in pointer-events-none absolute inset-0 h-full w-full" fill="none" stroke="#F4F1E8" strokeOpacity=".5" strokeWidth="1.6">
            {[300, 240, 180, 120].map((r, i) => (
              <path key={r} pathLength={1} style={{ animationDelay: `${i * 150}ms` }} d={`M${1120 - r} 640V${420 + i * 10}a${r} ${r} 0 0 1 ${2 * r} 0V640`} />
            ))}
          </svg>
          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              {/* Come il cartello reale: FARMA ESTETICA */}
              <p className="flex flex-col text-[34px] font-extrabold leading-[0.95] tracking-[0.08em] md:text-[44px]" aria-label="Farmaestetica">
                <span>FARMA</span>
                <span>ESTETICA</span>
              </p>
              <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.2em]">by Dottor Masera</p>
              <RiseTitle as="h1" className="mt-8 text-[38px] leading-[1.05] md:text-[56px]" lines={["La bellezza,", "un piano sopra la farmacia."]} />
              <p className="mt-6 max-w-xl text-[18px] leading-relaxed">
                Trattamenti viso e corpo, laser e la Miamo Lounge, con la nostra estetista e il consiglio della farmacia al piano di sotto.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/prenota?zona=farmaestetica" className="fm-focus fm-press inline-flex min-h-12 items-center rounded-full bg-verde-scuro px-6 text-[17px] font-semibold text-carta">
                  Prenota un trattamento
                </a>
                <a href="#listino" className="fm-focus fm-press inline-flex min-h-12 items-center rounded-full border-2 border-verde-scuro px-6 text-[17px] font-semibold">
                  Vedi il listino
                </a>
                <a href={`https://wa.me/39${waNumber}`} className="fm-focus fm-press inline-flex min-h-12 items-center rounded-full border-2 border-verde-scuro px-6 text-[17px] font-semibold">
                  WhatsApp {c.whatsapp}
                </a>
              </div>
            </div>
            <div className="rounded-3xl bg-verde-scuro p-7 text-carta">
              <p className="text-[14px] font-semibold uppercase tracking-[0.2em] text-mela">Piano 1</p>
              <svg aria-hidden width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="mt-3">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
              <p className="mt-3 text-[18px] leading-relaxed">Entri dalla farmacia, via Garibaldi 103, oppure da via Ballerini 10.</p>
              <OpenBadge initial={initial} hours={farmaesteticaHours} className="mt-5" />
            </div>
          </div>
        </div>
      </section>

      <section id="listino" aria-labelledby="listino-t" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 md:px-8 md:py-24">
        <h2 id="listino-t" className="fm-display text-[36px] leading-tight md:text-[48px]">
          Il listino.
        </h2>
        <p className="mt-2 max-w-2xl text-[17px] text-verde">I tempi sono indicativi. Tocca il + per prenotare il trattamento.</p>
        <div className="mt-6">
          <TreatmentTabs tabs={tabs} />
        </div>
      </section>

      <section aria-label="Buoni regalo e orari" className="mx-auto grid max-w-7xl gap-4 px-4 pb-8 md:grid-cols-2 md:px-8">
        <div className="flex flex-col rounded-3xl bg-beige-chiaro p-7 md:p-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-verde">Buono regalo</p>
          <h2 className="fm-display mt-3 text-[32px] leading-tight md:text-[40px]">Regala un momento per sé.</h2>
          <p className="mt-3 text-[17px] leading-relaxed">
            Un trattamento o un importo, da regalare. Presto potrai comprarlo online e inviarlo su WhatsApp o per email.
          </p>
          <div className="mt-auto pt-6">
            <ComingSoon label="Buono regalo online" />
          </div>
        </div>
        <div className="rounded-3xl bg-bianco p-7 md:p-10">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-verde">Orari e contatti</p>
          <h2 className="fm-display mt-3 text-[32px] leading-tight md:text-[40px]">Ti aspettiamo al piano 1.</h2>
          <ul className="mt-4 space-y-1 text-[17px]">
            {formatWeeklyHours(farmaesteticaHours).map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-4 text-[17px]">
            Telefono{" "}
            <a href={`tel:+39${c.phone.replace(/\s/g, "")}`} className="font-semibold underline underline-offset-4">
              {c.phone}
            </a>
            <br />
            WhatsApp{" "}
            <a href={`https://wa.me/39${waNumber}`} className="font-semibold underline underline-offset-4">
              {c.whatsapp}
            </a>
            <br />
            Instagram{" "}
            <a href={`https://www.instagram.com/${c.instagram.replace("@", "")}/`} className="font-semibold underline underline-offset-4">
              {c.instagram}
            </a>
          </p>
          <address className="mt-4 text-[16px] not-italic text-verde">{c.address}</address>
        </div>
      </section>
    </>
  );
}
