import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { localNow } from "@masera/core";
import { Breadcrumbs, siteUrl } from "@/components/Breadcrumbs";
import { MyMaseraDemo } from "@/components/my/MyMaseraDemo";
import { PageHeader } from "@/components/PageHeader";
import { features } from "@/content/home";

export const metadata: Metadata = { title: "MyMasera", robots: { index: false, follow: false } };

/** Visibile nelle anteprime; sul sito principale solo quando `features.mymasera` è acceso. */
const visible = () => features.mymasera || process.env.VERCEL_ENV !== "production";

export default function MyPage() {
  if (!visible()) notFound();
  return (
    <>
      <Breadcrumbs siteUrl={siteUrl()} items={[{ label: "Home", href: "/" }, { label: "MyMasera", href: "/my" }]} />
      <PageHeader kicker="MyMasera" lines={["La farmacia,", <span key="v" className="text-verde">nel tuo telefono.</span>]} lead="Tessera, appuntamenti, ordini, ricette e referti in un posto solo." />
      <div className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <p className="mx-auto mb-8 max-w-xl rounded-2xl border-2 border-dashed border-verde/40 bg-bianco px-4 py-3 text-[15px]">
          <b>Anteprima di prova.</b> Profilo, punti, tessera e documenti sono finti. Non arriva nessun messaggio: il codice è 000000.
        </p>
        <MyMaseraDemo today={localNow(new Date()).date} />
      </div>
    </>
  );
}
