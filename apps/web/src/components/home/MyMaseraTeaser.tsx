import { Button, ComingSoon } from "@masera/ui";
import { features, links, myMaseraFeatures } from "@/content/home";

export function MyMaseraTeaser() {
  return (
    <section id="mymasera" aria-labelledby="my-t" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 rounded-[40px] bg-verde-scuro p-7 text-carta md:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-mela">
            MyMasera · {features.mymasera ? "sito e app" : "in arrivo"}
          </p>
          <h2 id="my-t" className="fm-display mt-3 text-[40px] leading-tight md:text-[56px]">
            La farmacia in tasca.
          </h2>
          <p className="mt-4 max-w-lg text-[18px] leading-relaxed text-beige-chiaro">
            Carta fedeltà e punti, prenotazioni, referti, la tua SkinLab Routine e, se sei di Seregno, la foto della ricetta per il preventivo.
            Tutto con lo stesso account, sul sito e nell&apos;app.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {features.mymasera ? (
              <Button variant="cta" href={links.my}>
                Scopri MyMasera
              </Button>
            ) : (
              <ComingSoon label="MyMasera" tone="dark" />
            )}
            <Button variant="primario" href={links.skinlab} className="!bg-transparent !text-carta ring-2 ring-carta/50 hover:!bg-verde">
              Com&apos;è la SkinLab Routine
            </Button>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {myMaseraFeatures.map((f) => (
            <li key={f.t} className="rounded-2xl bg-carta/10 p-5">
              <b className="block text-[17px] font-semibold">{f.t}</b>
              <span className="mt-1 block text-[15px] text-beige-chiaro">{f.d}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
