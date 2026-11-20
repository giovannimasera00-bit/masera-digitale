import { farmacia, farmaciaHours, formatWeeklyHours } from "@masera/core";
import { Button } from "@masera/ui";
import { links } from "@/content/home";
import { googleMapsUrl } from "@/content/ztl";

/** "Ti aspettiamo": indirizzo, Google Maps, WhatsApp e orari. Dati da data/farmacia.json. */
export function VisitInfo() {
  const a = farmacia.address;
  return (
    <section aria-labelledby="dove-t" className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
      <div className="grid gap-6 rounded-3xl bg-beige-chiaro p-7 md:grid-cols-2 md:p-10">
        <div>
          <h2 id="dove-t" className="fm-display text-[34px] leading-tight md:text-[44px]">
            Ti aspettiamo in {a.street.toLowerCase().startsWith("via") ? a.street.replace(/^Via/, "via") : a.street}
          </h2>
          <address className="mt-3 text-[17px] not-italic">
            {farmacia.name}, {a.street}, {a.zip} {a.city} ({a.province})
          </address>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primario" href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              Apri in Google Maps
            </Button>
            <Button variant="secondario" href={links.whatsapp}>
              Scrivici su WhatsApp
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-[18px] font-semibold">Orari</h3>
          <ul className="mt-2 space-y-1 text-[17px]">
            {formatWeeklyHours(farmaciaHours).map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
