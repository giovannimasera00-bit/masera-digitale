import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { addDays, agendaResources, agendaServices, findAgendaService, formatClock, formatDay, localNow, telHref } from "@masera/core";
import { agendaDbConfigured, fetchBusy, fetchStaffClosures, fetchStaffDay, type StaffAppointment } from "@/lib/agenda-db";
import { resourcesFor, staffRole } from "@/lib/staff-auth";
import { deleteClosureAction, logoutAction, setStatusAction } from "../actions";
import { ClosureForm } from "../ClosureForm";
import { QuickBook } from "../QuickBook";

export const metadata: Metadata = { title: "Agenda" };

const STATUS: Record<StaffAppointment["status"], { label: string; cls: string }> = {
  confermato: { label: "Confermato", cls: "bg-beige-chiaro text-verde-scuro" },
  arrivato: { label: "Arrivato", cls: "bg-mela text-verde-scuro" },
  fatto: { label: "Fatto", cls: "bg-verde-scuro text-carta" },
  non_presentato: { label: "Non presentato", cls: "bg-[#f3d9d4] text-[#7a2418]" },
  annullato: { label: "Annullato", cls: "bg-carta text-verde/70 line-through" },
};
const ACTIONS: { status: StaffAppointment["status"]; label: string }[] = [
  { status: "arrivato", label: "Arrivato" },
  { status: "fatto", label: "Fatto" },
  { status: "non_presentato", label: "Non presentato" },
  { status: "annullato", label: "Annulla" },
];
const CHANNEL = { online: "online", telefono: "telefono", banco: "banco" } as const;

function StatusButton({ id, status, label, current }: { id: string; status: StaffAppointment["status"]; label: string; current: boolean }) {
  return (
    <form action={setStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={current ? "confermato" : status} />
      <button
        type="submit"
        aria-pressed={current}
        className={`fm-focus fm-press min-h-10 rounded-full border-2 px-3 text-[14px] font-semibold ${current ? "border-verde-scuro bg-verde-scuro text-carta" : "border-verde-scuro/25 bg-bianco text-verde-scuro"}`}
      >
        {label}
      </button>
    </form>
  );
}

export default async function StaffAgendaPage({ searchParams }: { searchParams: Promise<{ giorno?: string }> }) {
  const role = await staffRole();
  if (!role) redirect("/staff/accesso");
  const allowed = resourcesFor(role);
  const columns = Object.values(agendaResources).filter((r) => allowed.includes(r.id));
  const sp = await searchParams;
  const now = new Date();
  const today = localNow(now).date;
  const date = sp.giorno && /^\d{4}-\d{2}-\d{2}$/.test(sp.giorno) ? sp.giorno : today;

  if (!agendaDbConfigured()) {
    return <main className="p-8 text-[17px]">Il database dell&apos;agenda non è collegato (mancano le chiavi su Vercel).</main>;
  }
  const [allDay, busy, allUpcoming] = await Promise.all([fetchStaffDay(date), fetchBusy(date, date), fetchStaffClosures(today, addDays(today, 90))]);
  // L'estetista vede solo Farmaestetica (e le chiusure di tutta la farmacia, senza poterle togliere).
  const day = allDay.filter((a) => allowed.includes(a.resource));
  const upcoming = allUpcoming.filter((c) => !c.resource || allowed.includes(c.resource));
  const canRemove = (c: (typeof upcoming)[number]) => role === "staff" || (!!c.resource && allowed.includes(c.resource));
  const dayClosures = upcoming.filter((c) => c.date === date);
  const staffServices = agendaServices.filter((s) => (allowed as string[]).includes(s.resource));
  const f = formatDay(date);
  const navBtn = "fm-focus inline-flex min-h-11 items-center rounded-full border-2 border-verde-scuro/25 bg-bianco px-4 text-[15px] font-semibold";

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-verde">{role === "estetista" ? "Agenda Masera · Farmaestetica" : "Agenda Masera · personale"}</p>
          <h1 className="fm-display text-[34px] leading-tight md:text-[44px]">{f.long.charAt(0).toUpperCase() + f.long.slice(1)}</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className={navBtn}>
            Esci
          </button>
        </form>
      </header>

      <nav aria-label="Cambia giorno" className="mt-4 flex flex-wrap items-center gap-2">
        <Link href={`/staff/agenda?giorno=${addDays(date, -1)}`} className={navBtn}>
          ← Giorno prima
        </Link>
        <Link href="/staff/agenda" className={navBtn} aria-current={date === today ? "date" : undefined}>
          Oggi
        </Link>
        <Link href={`/staff/agenda?giorno=${addDays(date, 1)}`} className={navBtn}>
          Giorno dopo →
        </Link>
        <form action="/staff/agenda" className="flex items-center gap-2">
          <label htmlFor="vai" className="sr-only">
            Vai al giorno
          </label>
          <input id="vai" name="giorno" type="date" defaultValue={date} className="fm-focus min-h-11 rounded-xl border-2 border-verde-scuro/25 bg-bianco px-3 text-[15px]" />
          <button type="submit" className={navBtn}>
            Vai
          </button>
        </form>
      </nav>

      {dayClosures.length > 0 && (
        <p className="mt-4 rounded-2xl bg-[#f3d9d4] px-4 py-3 text-[16px] text-[#7a2418]">
          <b>Chiusure di oggi:</b>{" "}
          {dayClosures
            .map((c) => `${c.resource ? agendaResources[c.resource].name : "tutta la farmacia"} ${c.from !== undefined ? `${formatClock(c.from)}–${formatClock(c.to!)}` : "tutto il giorno"}${c.reason ? ` (${c.reason})` : ""}`)
            .join(" · ")}
        </p>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className={`grid gap-4 ${columns.length > 1 ? "md:grid-cols-2 2xl:grid-cols-3" : ""}`}>
          {columns.map((r) => {
            const list = day.filter((a) => a.resource === r.id);
            const active = list.filter((a) => a.status !== "annullato");
            return (
              <section key={r.id} aria-labelledby={`col-${r.id}`} className={`rounded-3xl p-4 ${r.id === "farmaestetica" ? "bg-salvia/45" : "bg-beige-chiaro/50"}`}>
                <h2 id={`col-${r.id}`} className="flex items-baseline justify-between text-[19px] font-bold">
                  {r.name} <span className="text-[14px] font-semibold text-verde">{active.length === 1 ? "1 appuntamento" : `${active.length} appuntamenti`}</span>
                </h2>
                {list.length === 0 ? (
                  <p className="mt-3 text-[16px] text-verde">Nessun appuntamento.</p>
                ) : (
                  <ol className="mt-3 space-y-3">
                    {list.map((a) => {
                      const s = findAgendaService(a.serviceSlug);
                      const st = STATUS[a.status];
                      return (
                        <li key={a.id} className={`rounded-2xl bg-bianco p-4 ${a.status === "annullato" ? "opacity-60" : ""}`}>
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <span className="text-[20px] font-bold tabular-nums">
                              {formatClock(a.start)}–{formatClock(a.end)}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${st.cls}`}>{st.label}</span>
                          </div>
                          <p className="mt-1 text-[16px] font-semibold">{s?.name ?? a.serviceSlug}</p>
                          <p className="text-[16px]">
                            {a.name ?? "—"}
                            {a.phone && (
                              <>
                                {" · "}
                                <a href={telHref(a.phone)} className="font-semibold underline underline-offset-4">
                                  {a.phone.replace(/^\+39/, "")}
                                </a>
                              </>
                            )}
                            <span className="text-[14px] text-verde"> · {CHANNEL[a.channel]}</span>
                          </p>
                          {a.notes && <p className="mt-1 text-[15px] italic">{a.notes}</p>}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {ACTIONS.map((x) => (
                              <StatusButton key={x.status} id={a.id} status={x.status} label={x.label} current={a.status === x.status} />
                            ))}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>
            );
          })}
        </div>

        <aside className="space-y-6">
          <section aria-labelledby="qb-t" className="rounded-3xl bg-bianco p-5">
            <h2 id="qb-t" className="text-[19px] font-bold">
              Nuova prenotazione
            </h2>
            <p className="mb-3 text-[14px] text-verde">Per {f.long}. Per un altro giorno, cambialo in alto.</p>
            <QuickBook date={date} nowIso={now.toISOString()} services={staffServices} busy={busy} closures={dayClosures} />
          </section>

          <section aria-labelledby="cl-t" className="rounded-3xl bg-bianco p-5">
            <h2 id="cl-t" className="mb-3 text-[19px] font-bold">
              Chiusure, ferie, festivi
            </h2>
            <ClosureForm date={date} resources={columns.map((r) => ({ id: r.id, name: r.name }))} wholeAllowed={role === "staff"} />
            {upcoming.length > 0 && (
              <ul className="mt-4 space-y-2">
                {upcoming.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2 rounded-xl bg-carta px-3 py-2 text-[15px]">
                    <span>
                      <b>{formatDay(c.date).long}</b> · {c.resource ? agendaResources[c.resource].name : "tutta la farmacia"} ·{" "}
                      {c.from !== undefined ? `${formatClock(c.from)}–${formatClock(c.to!)}` : "tutto il giorno"}
                      {c.reason ? ` · ${c.reason}` : ""}
                    </span>
                    {canRemove(c) && (
                      <form action={deleteClosureAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button type="submit" className="fm-focus min-h-10 rounded-full px-3 text-[14px] font-semibold text-[#7a2418] underline underline-offset-4">
                          Togli
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
