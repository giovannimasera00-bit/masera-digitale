import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { PrescriptionForm } from "@/components/ricetta/PrescriptionForm";
import { features, links } from "@/content/home";

export const metadata: Metadata = {
  title: "Invia una ricetta",
  description: "Solo a Seregno: mandaci la foto o il codice della ricetta, ti rispondiamo con il preventivo. L'originale serve comunque.",
};

/** Visibile nelle anteprime; sul sito principale solo quando `features.ricetta` è acceso. */
const visible = () => features.ricetta || process.env.VERCEL_ENV !== "production";

const steps = [
  ["Mandaci la ricetta", "La foto, oppure il codice della ricetta elettronica con il codice fiscale."],
  ["Ti mandiamo il preventivo", "La farmacista controlla e ti scrive su WhatsApp prezzo e tempi."],
  ["Approvi con un tocco", "Poi la ritiri in farmacia o te la portiamo la sera, in un pacco sigillato."],
] as const;

export default function RicettaPage() {
  if (!visible()) notFound();
  return (
    <>
      <Breadcrumbs siteUrl={siteUrl()} items={[{ label: "Home", href: "/" }, { label: "Invia una ricetta", href: "/ricetta" }]} />
      <PageHeader
        kicker="Invia una ricetta · solo Seregno"
        lines={["Mandaci la ricetta,", <span key="v" className="text-verde">ti diciamo prezzo e tempi.</span>]}
        lead="La foto serve solo per il preventivo: l'originale della ricetta resta obbligatorio, lo consegni al ritiro o al rider."
      />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="mb-8 rounded-2xl border-2 border-dashed border-verde/40 bg-bianco px-4 py-3 text-[15px]">
          <b>Anteprima di prova.</b> Il modulo funziona, ma non invia niente: la foto resta sul tuo dispositivo.
        </p>
        <ol className="mb-10 grid gap-3 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-3xl bg-beige-chiaro/60 p-5">
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-verde">Passo {i + 1}</span>
              <b className="mt-1 block text-[18px]">{t}</b>
              <span className="mt-1 block text-[15px]">{d}</span>
            </li>
          ))}
        </ol>
      </div>
      <section aria-label="Modulo per inviare la ricetta" className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
        <PrescriptionForm />
        <p className="mt-8 text-[15px]">
          Hai un dubbio? Scrivici su{" "}
          <a href={links.whatsapp} className="font-semibold underline underline-offset-4">
            WhatsApp
          </a>
          .
        </p>
      </section>
    </>
  );
}
