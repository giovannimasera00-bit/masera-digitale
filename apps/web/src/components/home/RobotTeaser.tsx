import Image from "next/image";
import { Button } from "@masera/ui";
import { links } from "@/content/home";

export function RobotTeaser() {
  return (
    <section id="robot" aria-labelledby="robot-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl">
          <Image
            src="/img/robot-scaffali.webp"
            alt="Gli scaffali del robot, pieni di confezioni ordinate."
            width={1050}
            height={1400}
            sizes="(min-width: 1024px) 600px, 100vw"
            className="aspect-[4/5] h-auto w-full object-cover"
          />
          <span className="absolute bottom-5 left-5 rounded-full bg-carta px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-verde-scuro">
            Tour virtuale
          </span>
        </div>
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-verde">Dietro il banco</p>
          <h2 id="robot-t" className="fm-display mt-3 text-[40px] leading-tight md:text-[56px]">
            Entra nel nostro robot.
          </h2>
          <p className="mt-4 max-w-lg text-[18px] leading-relaxed">
            Come arrivano i farmaci al banco in pochi secondi: il magazzino, il braccio che li prende, gli scivoli fino a te. Spiegato in
            modo semplice, pezzo per pezzo.
          </p>
          <Button variant="primario" href={links.robot} className="mt-8">
            Inizia il tour
          </Button>
        </div>
      </div>
    </section>
  );
}
