import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { staffRole } from "@/lib/staff-auth";
import { PrescriptionDesk } from "./PrescriptionDesk";

export const metadata: Metadata = { title: "Ricette da valutare" };

/** Le ricette arrivate dal sito: la farmacista valuta e manda il preventivo. Per ora con richieste di prova. */
export default async function RicettePage() {
  const role = await staffRole();
  if (!role) redirect("/staff/accesso");
  if (role !== "staff") redirect("/staff/agenda");
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:px-8">
      <Link href="/staff/agenda" className="fm-focus text-[15px] font-semibold underline underline-offset-4">
        ← Agenda
      </Link>
      <h1 className="fm-display mt-4 text-[34px] leading-tight md:text-[44px]">Ricette da valutare</h1>
      <p className="mt-3 rounded-2xl border-2 border-dashed border-verde/40 bg-bianco px-4 py-3 text-[15px]">
        <b>Richieste di prova.</b> Nomi e ricette sono finti e niente viene salvato. Le richieste vere arriveranno dal modulo del sito,
        con le foto in un archivio privato in Europa, visibili solo al personale.
      </p>
      <PrescriptionDesk />
    </main>
  );
}
