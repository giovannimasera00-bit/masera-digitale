import { farmaciaHours, getOpenStatus, FREE_SHIPPING_ITALY_EUR } from "@masera/core";
import { OpenBadge } from "@masera/ui";
import { links } from "@/content/home";

/** Barra in cima: aperto/chiuso in tempo reale, spedizione, ZTL, WhatsApp. */
export function StatusBar() {
  const initial = getOpenStatus(farmaciaHours, new Date());
  return (
    <div className="bg-nero text-carta">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2 text-[14px] md:px-8">
        <OpenBadge initial={initial} tone="dark" />
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <li className="hidden sm:block">Spedizione gratuita in Italia sopra {FREE_SHIPPING_ITALY_EUR} €</li>
          <li>
            {/* [DA CONFERMARE] testo: nel brief è "Accesso libero in ZTL" */}
            <a className="inline-flex min-h-6 items-center underline-offset-4 hover:underline" href={links.ztl}>
              Accesso in ZTL per i clienti
            </a>
          </li>
          <li>
            <a className="inline-flex min-h-6 items-center underline-offset-4 hover:underline" href={links.whatsapp}>
              WhatsApp 373 770 5485
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
