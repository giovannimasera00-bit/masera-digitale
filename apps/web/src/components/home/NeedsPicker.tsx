"use client";
import { useEffect, useState } from "react";
import { formatMinutes, seregnoDelivery, FREE_SHIPPING_ITALY_EUR, type SeregnoDelivery } from "@masera/core";
import { Button, Chip, ColorBar, ComingSoon } from "@masera/ui";
import { featureOf, isOn, links, needs, type Feature } from "@/content/home";

type NeedId = (typeof needs)[number]["id"];

/** "Di cosa hai bisogno oggi?": i chip cambiano la card accanto. La card Consegna è in tempo reale. */
export function NeedsPicker({ initialDelivery }: { initialDelivery: SeregnoDelivery }) {
  const [need, setNeed] = useState<NeedId>(isOn("shop") ? "consegna" : "analisi");
  const [delivery, setDelivery] = useState(initialDelivery);

  useEffect(() => {
    const tick = () => setDelivery(seregnoDelivery(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const current = needs.find((n) => n.id === need)!;

  return (
    <div>
      <p id="needs-label" className="text-[17px] font-medium text-carta">
        Di cosa hai bisogno oggi?
      </p>
      <div role="group" aria-labelledby="needs-label" className="mt-3 flex flex-wrap gap-2">
        {needs.map((n) => (
          <Chip key={n.id} tone="dark" selected={need === n.id} onClick={() => setNeed(n.id)}>
            {n.label}
          </Chip>
        ))}
      </div>

      <div key={need} aria-live="polite" className="fm-swap mt-5 rounded-3xl bg-bianco p-6 text-verde-scuro shadow-2xl shadow-black/20 md:p-8">
        {current.id === "consegna" ? (
          <>
            <Head kicker="Consegna a Seregno" badge="Gratis" />
            <p className="fm-display mt-3 text-[30px] leading-tight md:text-[34px]">
              {delivery.today ? "Arriva oggi, verso le 19:00." : `Arriva ${delivery.when}, verso le 19:00.`}
            </p>
            <p className="mt-2 text-[17px]">
              {delivery.today && (delivery.minutesLeft ?? 0) > 240 ? (
                "Ordina entro le 16:00, da lunedì a sabato. Consegna sempre gratuita."
              ) : delivery.today ? (
                <>
                  Ordina entro le 16:00:{" "}
                  <b className="font-semibold">
                    <span aria-hidden className="fm-breathe mr-1.5 inline-block size-2 rounded-full bg-mela align-middle" />
                    mancano {formatMinutes(delivery.minutesLeft ?? 0)}
                  </b>
                  .
                </>
              ) : (
                "Le consegne di oggi sono partite: ordina ora e arriva il prossimo giorno lavorativo."
              )}
            </p>
            {/* Il conto alla rovescia compare solo nelle ultime 4 ore: un'informazione vera, non un'urgenza finta. */}
            {delivery.today && (delivery.minutesLeft ?? 0) <= 240 && (
              <ColorBar
                className="mt-4"
                height={10}
                progress={Math.max(0.04, 1 - (delivery.minutesLeft ?? 0) / 240)}
                label="Tempo che resta prima delle 16:00"
              />
            )}
            <Foot note={`Resto d'Italia: 2–3 giorni lavorativi, gratis sopra ${FREE_SHIPPING_ITALY_EUR} €`} cta="Vai allo shop" href={links.shop} feature="shop" comingLabel="Shop online" />
          </>
        ) : (
          <>
            <Head kicker={current.kicker} badge={current.badge} />
            <p className="fm-display mt-3 text-[30px] leading-tight md:text-[34px]">{current.title}</p>
            <p className="mt-2 text-[17px]">{current.text}</p>
            <Foot note={current.note} cta={current.cta} href={current.href} feature={featureOf(current)} comingLabel="Invia la ricetta" />
          </>
        )}
      </div>
    </div>
  );
}

function Head({ kicker, badge }: { kicker: string; badge: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-verde">{kicker}</p>
      <span className="rounded-full bg-beige-chiaro px-3 py-1 text-[13px] font-semibold">{badge}</span>
    </div>
  );
}

function Foot({
  note,
  cta,
  href,
  feature,
  comingLabel,
}: {
  note: string;
  cta: string;
  href: string;
  feature?: Feature;
  comingLabel: string;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-beige-chiaro pt-5">
      <span className="text-[15px] text-verde">{note}</span>
      {isOn(feature) ? (
        <Button variant="cta" href={href}>
          {cta}
        </Button>
      ) : (
        <ComingSoon label={comingLabel} />
      )}
    </div>
  );
}
