import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { localNow } from "@masera/core";
import { staffRole } from "@/lib/staff-auth";
import { SkinLabDesk } from "./SkinLabDesk";

export const metadata: Metadata = { title: "SkinLab al banco" };

/** Pannello del banco cosmesi (BRIEF §10): tessera + prodotti con la penna ottica, tre pulsanti, invio. Meno di 2 minuti. */
export default async function SkinLabPage() {
  const role = await staffRole();
  if (!role) redirect("/staff/accesso");
  if (role !== "staff") redirect("/staff/agenda");
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:px-8">
      <Link href="/staff/agenda" className="fm-focus text-[15px] font-semibold underline underline-offset-4">
        ← Agenda
      </Link>
      <h1 className="fm-display mt-4 text-[34px] leading-tight md:text-[44px]">SkinLab al banco</h1>
      <p className="mt-3 rounded-2xl border-2 border-dashed border-verde/40 bg-bianco px-4 py-3 text-[15px]">
        <b>Prova.</b> Clienti e prodotti finti, niente viene salvato o inviato. Tessere di prova: A12345, B54321. Prodotti di prova:
        dal 8009990000016 al 8009990000092 (anche scritti a mano + Invio).
      </p>
      <SkinLabDesk today={localNow(new Date()).date} />
    </main>
  );
}
