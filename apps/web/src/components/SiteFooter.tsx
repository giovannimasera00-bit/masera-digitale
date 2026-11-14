import Image from "next/image";
import Link from "next/link";
import { farmacia, farmaciaHours, formatWeeklyHours, FREE_SHIPPING_ITALY_EUR, SEREGNO_CUTOFF } from "@masera/core";
import { ColorBar } from "@masera/ui";
import { features, links } from "@/content/home";

const legal = [
  { label: "Privacy", href: "/privacy" },
  { label: "Cookie", href: "/cookie" },
  { label: "Termini di vendita", href: "/termini" },
  { label: "Accessibilità", href: "/accessibilita" },
];

export function SiteFooter() {
  const a = farmacia.address;
  return (
    <footer className="mt-8">
      {/* La barra sta sul fondo chiaro: sul verde scuro il primo colore sparirebbe. */}
      <ColorBar className="!rounded-none" height={8} />
      <div className="bg-verde-scuro text-carta">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-8 lg:grid-cols-4">
          <div>
            <Image src="/img/logo-oriz-bianco.png" alt="Farmacia Masera" width={640} height={202} className="h-12 w-auto" />
            <p className="mt-4 text-[15px] text-beige-chiaro">{farmacia.claims[0]}</p>
          </div>
          <div>
            <h2 className="text-[16px] font-semibold">Orari</h2>
            <ul className="mt-2 space-y-1 text-[15px] text-beige-chiaro">
              {formatWeeklyHours(farmaciaHours).map((l) => (
                <li key={l}>{l}</li>
              ))}
              <li>
                <Link href="/turni" className="inline-flex min-h-6 items-center underline underline-offset-4">
                  Farmacie di turno
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-[16px] font-semibold">Dove siamo</h2>
            <address className="mt-2 text-[15px] not-italic text-beige-chiaro">
              {a.street}, {a.zip} {a.city} ({a.province})
              <br />
              <Link href={links.ztl} className="inline-flex min-h-6 items-center underline underline-offset-4">
                Come arrivare in ZTL
              </Link>
              <br />
              <a href={links.whatsapp} className="inline-flex min-h-6 items-center underline underline-offset-4">
                WhatsApp {farmacia.whatsapp.replace("+39 ", "")}
              </a>
            </address>
          </div>
          <div>
            <h2 className="text-[16px] font-semibold">Spedizioni{features.shop ? "" : " · shop online in arrivo"}</h2>
            <p className="mt-2 text-[15px] text-beige-chiaro">
              Seregno: in giornata, gratis (ordine entro le {SEREGNO_CUTOFF})
              <br />
              Italia: 2–3 giorni lavorativi, gratis sopra {FREE_SHIPPING_ITALY_EUR} €
            </p>
          </div>
        </div>
        <div className="border-t border-carta/15">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-[14px] text-beige-chiaro md:flex-row md:items-center md:justify-between md:px-8">
            <p>
              {farmacia.legal_name} · P.IVA {farmacia.vat}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-6 items-center underline-offset-4 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
