import { farmacia, seregnoDelivery } from "@masera/core";
import { Button, RiseTitle } from "@masera/ui";
import { links } from "@/content/home";
import { HeroArches } from "./HeroArches";
import { NeedsPicker } from "./NeedsPicker";

export function Hero() {
  const delivery = seregnoDelivery(new Date());
  return (
    <section aria-label="Benvenuto" className="relative overflow-hidden bg-verde-scuro text-carta">
      <HeroArches />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-mela">Farmacia Masera · Seregno</p>
          <RiseTitle
            as="h1"
            className="mt-5 text-[48px] leading-[1.02] sm:text-[64px] lg:text-[88px]"
            lines={["Medicina", "per tradizione.", <span key="1908" className="text-mela">Dal 1908.</span>]}
          />
          <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-beige-chiaro">
            {farmacia.claims[1]} Prenoti analisi e consulenze, ordini online in tutta Italia e a Seregno ricevi tutto in giornata.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="cta" href={links.prenota}>
              Prenota un servizio
            </Button>
            <Button variant="primario" href={links.shop} className="!bg-carta !text-verde-scuro hover:!bg-bianco">
              Vai allo shop
            </Button>
          </div>
        </div>
        <NeedsPicker initialDelivery={delivery} />
      </div>
    </section>
  );
}
