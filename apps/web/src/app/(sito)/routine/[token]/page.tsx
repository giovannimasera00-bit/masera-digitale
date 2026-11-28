import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { addDays, localNow, type RoutineItem } from "@masera/core";
import { PageHeader } from "@/components/PageHeader";
import { RoutineView } from "@/components/routine/RoutineView";
import { skinDemoProducts } from "@/content/skinlab-demo";

// Link personale della routine (arriva su WhatsApp dal banco): mai su Google, l'indirizzo non passa ad altri siti.
export const metadata: Metadata = { title: "La mia routine", robots: { index: false, follow: false }, referrer: "no-referrer" };

/** In prova esiste solo il link "prova", e solo nelle anteprime. */
const visible = () => process.env.VERCEL_ENV !== "production";

export default async function RoutinePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!visible() || token !== "prova") notFound();
  const today = localNow(new Date()).date;
  const p = (ean: string) => skinDemoProducts.find((x) => x.ean === ean)!;
  // Routine di prova: iniziata 50 giorni fa, così si vedono "sta per finire" e la serie di sere.
  const start = addDays(today, -50);
  const items: RoutineItem[] = [
    { ...p("8009990000016"), when: "entrambi", frequency: "ogni_giorno", amount: "noce", startDate: start },
    { ...p("8009990000030"), when: "sera", frequency: "ogni_giorno", amount: "goccia", startDate: start, capacity: 30, doseMl: 0.25 },
    { ...p("8009990000054"), when: "entrambi", frequency: "ogni_giorno", amount: "pisello", startDate: start },
    { ...p("8009990000061"), when: "mattina", frequency: "ogni_giorno", amount: "noce", startDate: start },
    { ...p("8009990000085"), when: "sera", frequency: "2_3_settimana", amount: "noce", startDate: start },
  ].map(({ unit: _u, ...i }) => i as RoutineItem);
  const checkedEvenings = [1, 2, 3, 4].map((n) => addDays(today, -n));

  return (
    <>
      <PageHeader kicker="SkinLab Routine" lines={["La tua routine,", <span key="v" className="text-tortora-3">passo dopo passo.</span>]} lead="Preparata al banco dalla farmacista, dopo la tua analisi della pelle." />
      <div className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <p className="mx-auto mb-8 max-w-xl rounded-2xl border-2 border-dashed border-verde/40 bg-bianco px-4 py-3 text-[15px]">
          <b>Routine di prova.</b> Prodotti e date sono finti; le spunte restano solo in questa pagina.
        </p>
        <RoutineView items={items} today={today} analysisDate={addDays(today, -60)} checkedEvenings={checkedEvenings} />
      </div>
    </>
  );
}
