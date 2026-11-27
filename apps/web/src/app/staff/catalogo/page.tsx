import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { staffRole } from "@/lib/staff-auth";
import { CatalogCheck } from "./CatalogCheck";

export const metadata: Metadata = { title: "Prova del catalogo" };

/** Prova del ponte catalogo: il file del gestionale si legge nel browser, non viene caricato né salvato. */
export default async function CatalogoPage() {
  const role = await staffRole();
  if (!role) redirect("/staff/accesso");
  if (role !== "staff") redirect("/staff/agenda");
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <Link href="/staff/agenda" className="fm-focus text-[15px] font-semibold underline underline-offset-4">
        ← Agenda
      </Link>
      <h1 className="fm-display mt-4 text-[36px] leading-tight md:text-[44px]">Prova del catalogo</h1>
      <p className="mt-3 max-w-2xl text-[17px]">
        Scegli il file esportato da Farmaconsult. Lo leggiamo qui, su questo computer: non viene inviato né salvato.
        Vedi quali prodotti andrebbero nello shop, quali farmaci restano fuori e cosa non torna.
      </p>
      <CatalogCheck />
    </main>
  );
}
