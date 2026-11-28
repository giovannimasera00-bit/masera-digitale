import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { farmacia, formatDay, localNow, seregnoDelivery } from "@masera/core";
import { demoRiderOrders } from "@/content/rider-demo";
import { staffRole } from "@/lib/staff-auth";
import { RiderList } from "./RiderList";

/** Partenza del giro: la farmacia, in via Garibaldi 103 (coordinate OpenStreetMap). */
const FARMACIA_POINT = { lat: 45.6510625, lon: 9.201046 };

export const metadata: Metadata = { title: "Consegne del giorno" };

/** Elenco consegne per il rider (BRIEF §16). Per ora con ordini di prova: quelli veri arriveranno da Shopify. */
export default async function ConsegnePage() {
  const role = await staffRole();
  if (!role) redirect("/staff/accesso");
  if (role !== "staff") redirect("/staff/agenda");

  const now = new Date();
  // Il giro di oggi se oggi si consegna, altrimenti il prossimo (domenica → lunedì).
  const date = seregnoDelivery(new Date(`${localNow(now).date}T06:00:00Z`)).date;
  const origin = `${farmacia.address.street}, ${farmacia.address.zip} ${farmacia.address.city}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-8">
      <Link href="/staff/agenda" className="fm-focus text-[15px] font-semibold underline underline-offset-4">
        ← Agenda
      </Link>
      <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-verde">Consegne a Seregno · giro delle 16</p>
      <h1 className="fm-display text-[34px] leading-tight md:text-[44px]">{formatDay(date).long.replace(/^./, (c) => c.toUpperCase())}</h1>
      <p className="mt-3 rounded-2xl border-2 border-dashed border-verde/40 bg-bianco px-4 py-3 text-[15px]">
        <b>Ordini di prova.</b> Nomi e importi sono finti: gli ordini veri arriveranno dal negozio online.
      </p>
      <RiderList orders={demoRiderOrders(date)} date={date} origin={origin} start={FARMACIA_POINT} />
    </main>
  );
}
