import type { Metadata } from "next";
import Link from "next/link";
import { farmacia, farmaciaHours, farmaesteticaBrand, farmaesteticaContacts, formatWeeklyHours, getOpenStatus, isMissing, telHref } from "@masera/core";
import { Button, OpenBadge } from "@masera/ui";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { ZtlMap } from "@/components/ztl/ZtlMap";
import { links } from "@/content/home";
import { googleMapsUrl, ztlSteps } from "@/content/ztl";

const a = farmacia.address;

export const metadata: Metadata = {
  title: "Contatti e orari",
  description: `Farmacia Masera, ${a.street}, ${a.city}: orari, WhatsApp ${farmacia.whatsapp}, come arrivare anche in ZTL.`,
};

/** I canali: un dato ancora "[DA INSERIRE]" non diventa un pulsante. */
function channels() {
  const list: { t: string; v: string; href: string; note: string; external?: boolean }[] = [
    { t: "WhatsApp", v: farmacia.whatsapp.replace("+39 ", ""), href: links.whatsapp, note: "Il modo più veloce per una domanda o una disponibilità." },
  ];
  if (!isMissing(farmacia.phone)) list.push({ t: "Telefono", v: farmacia.phone, href: telHref(farmacia.phone), note: "Negli orari di apertura." });
  if (!isMissing(farmacia.email)) list.push({ t: "Email", v: farmacia.email, href: `mailto:${farmacia.email}`, note: "Per le richieste che non sono urgenti." });
  for (const h of farmacia.instagram) {
    list.push({ t: "Instagram", v: h, href: `https://www.instagram.com/${h.replace("@", "")}/`, note: h === "@dottormasera" ? "I consigli del Dottor Masera." : "Novità e iniziative della farmacia.", external: true });
  }
  return list;
}

export default function ContattiPage() {
  const initial = getOpenStatus(farmaciaHours, new Date());
  const fe = farmaesteticaContacts;
  return (
    <>
      <Breadcrumbs
        siteUrl={siteUrl()}
        items={[
          { label: "Home", href: "/" },
          { label: "Contatti", href: "/contatti" },
        ]}
      />
      <PageHeader
        kicker={`Contatti · ${a.city}`}
        lines={["Scrivici, chiamaci,", <span key="v" className="text-verde">vieni a trovarci.</span>]}
        lead={`Siamo in ${a.street.replace(/^Via/, "via")}, nel centro di ${a.city}. Puoi arrivare in auto anche in ZTL, gratis.`}
      >
        <div className="mt-6">
          <OpenBadge initial={initial} />
        </div>
      </PageHeader>

      <section aria-labelledby="canali-t" className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 id="canali-t" className="sr-only">
          Come contattarci
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels().map((c) => (
            <li key={c.v}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="fm-focus fm-press flex h-full flex-col rounded-3xl bg-bianco p-6 transition-colors hover:bg-beige-chiaro/60 md:p-7"
              >
                <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-verde">{c.t}</span>
                <span className="fm-display mt-2 text-[28px] leading-tight md:text-[32px]">{c.v}</span>
                <span className="mt-2 text-[16px] text-verde">{c.note}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="orari-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-6 rounded-3xl bg-beige-chiaro p-7 md:grid-cols-2 md:p-10">
          <div>
            <h2 id="orari-t" className="fm-display text-[34px] leading-tight md:text-[44px]">
              Orari
            </h2>
            <ul className="mt-4 space-y-1 text-[18px]">
              {formatWeeklyHours(farmaciaHours).map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="mt-4 text-[16px] text-verde">Turni, festivi e chiusure straordinarie arriveranno qui con l&apos;agenda della farmacia.</p>
          </div>
          <div>
            <h3 className="fm-display text-[28px] leading-tight md:text-[34px]">Indirizzo</h3>
            <address className="mt-3 text-[18px] not-italic">
              {farmacia.name}
              <br />
              {a.street}, {a.zip} {a.city} ({a.province})
            </address>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primario" href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Apri in Google Maps
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="arrivare-t" className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 id="arrivare-t" className="fm-display text-[34px] leading-tight md:text-[48px]">
          In auto, anche in ZTL.
        </h2>
        <p className="mt-2 max-w-2xl text-[17px] text-verde">Tre passi e sei davanti alla farmacia.</p>
        <ZtlMap className="mt-8" />
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {ztlSteps.map((s, i) => (
            <li key={s.t} className="flex gap-4 rounded-3xl bg-bianco p-5 md:p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-mela text-[18px] font-bold text-verde-scuro">{i + 1}</span>
              <span className="text-[17px] leading-snug">
                <b className="block font-semibold">{s.t}</b>
                <span className="mt-1 block">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
        <Link href={links.ztl} className="fm-focus mt-5 inline-block rounded text-[17px] font-semibold text-verde underline decoration-2 underline-offset-4">
          Tutto sulla ZTL <span aria-hidden>→</span>
        </Link>
      </section>

      <section aria-labelledby="fe-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-4 rounded-3xl bg-salvia p-7 text-verde-scuro md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h2 id="fe-t" className="fm-display text-[28px] leading-tight md:text-[34px]">
              {farmaesteticaBrand} ha i suoi contatti.
            </h2>
            <p className="mt-2 text-[17px]">
              Al primo piano. Telefono{" "}
              <a href={telHref(fe.phone)} className="font-semibold underline underline-offset-4">
                {fe.phone}
              </a>
              , WhatsApp {fe.whatsapp}.
            </p>
          </div>
          <Button variant="primario" href="/farmaestetica" className="shrink-0">
            Vai a Farmaestetica
          </Button>
        </div>
        <p className="mt-6 text-[15px] text-verde">
          Ragione sociale, partita IVA e altri dati della farmacia sono nelle{" "}
          <Link href="/note-legali" className="font-semibold underline underline-offset-4">
            note legali
          </Link>
          .
        </p>
      </section>
    </>
  );
}
