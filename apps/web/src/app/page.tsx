import { farmacia, farmaciaHours, getOpenStatus } from "@masera/core";
import { Button, ColorBar, LogoArch, OpenBadge, RiseTitle } from "@masera/ui";

export const dynamic = "force-dynamic";

// Pagina provvisoria della Fase 0: la homepage vera arriva in Fase 1.
export default function Home() {
  const initial = getOpenStatus(farmaciaHours, new Date());
  return (
    <main className="min-h-dvh bg-verde-scuro text-carta">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center gap-8 px-4 py-16 md:px-8">
        <LogoArch className="w-40 text-salvia md:w-56" />
        <RiseTitle
          as="h1"
          className="text-[44px] leading-[1.02] md:text-[80px]"
          lines={["Medicina", "per tradizione.", <span key="1908" className="text-mela">Dal 1908.</span>]}
        />
        <p className="max-w-xl text-lg text-beige-chiaro">{farmacia.claims[1]}</p>
        <div className="flex flex-wrap items-center gap-3">
          <OpenBadge initial={initial} />
          <Button variant="cta" href="/design">
            Vedi i componenti
          </Button>
        </div>
        <p className="text-[15px] text-beige-chiaro">
          Il nuovo sito è in costruzione. {farmacia.address.street}, {farmacia.address.city}.
        </p>
      </div>
      <div className="bg-carta px-4 py-6 md:px-8">
        <ColorBar className="mx-auto max-w-5xl" />
      </div>
    </main>
  );
}
