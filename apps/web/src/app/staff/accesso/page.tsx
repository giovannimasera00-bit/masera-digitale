import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isStaff, staffLoginConfigured } from "@/lib/staff-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Accesso" };

export default async function AccessoPage() {
  if (await isStaff()) redirect("/staff/agenda");
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-verde">Agenda Masera · personale</p>
      <h1 className="fm-display mt-2 text-[40px] leading-tight">Accesso</h1>
      {staffLoginConfigured() ? (
        <LoginForm />
      ) : (
        <p className="mt-6 rounded-2xl bg-beige-chiaro p-5 text-[16px]">
          L&apos;accesso non è ancora attivo: manca la password del personale nelle impostazioni del sito (STAFF_PASSWORD, almeno 10 caratteri).
        </p>
      )}
    </main>
  );
}
