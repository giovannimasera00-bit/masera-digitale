import type { Metadata } from "next";
import Link from "next/link";
import {
  addDays, BOOKING_WINDOW_DAYS, canChangeOnline, findAgendaService, formatClock, formatDay, localNow, minutesUntil, type Busy, type Closure,
} from "@masera/core";
import { PageHeader } from "@/components/PageHeader";
import { ManageAppointment } from "@/components/prenota/ManageAppointment";
import { bookingAreas } from "@/content/prenota";
import { agendaDbConfigured, busyWithout, fetchClosures, manageGet, type ManagedAppointment } from "@/lib/agenda-db";
import { hashManageToken, isManageToken } from "@/lib/manage-token";

// Link personale: mai su Google, e l'indirizzo non passa ad altri siti.
export const metadata: Metadata = {
  title: "Il mio appuntamento",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export const dynamic = "force-dynamic";

const areas = bookingAreas();
const areaOf = (a: ManagedAppointment) => areas.find((x) => x.slug === (a.resource === "farmaestetica" ? "farmaestetica" : "farmacia"))!;

function Box({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl px-4 pb-16 md:px-8">{children}</div>;
}

export default async function AppuntamentoPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ esito?: string | string[] }> }) {
  const { token } = await params;
  const { esito } = await searchParams;
  const now = new Date();

  let appt: ManagedAppointment | null = null;
  let failed = false;
  if (agendaDbConfigured() && isManageToken(token)) {
    try {
      appt = await manageGet(hashManageToken(token));
    } catch (e) {
      console.error(e);
      failed = true;
    }
  }

  if (!appt) {
    return (
      <>
        <PageHeader kicker="Agenda Masera" lines={["Il mio appuntamento"]} lead={failed ? "In questo momento non riusciamo a leggere l'appuntamento. Riprova tra poco." : "Questo link non è valido. Controlla di averlo copiato tutto, oppure scrivici."} />
        <Box>
          <p className="text-[17px]">
            Puoi sempre scriverci su{" "}
            <a href={areas[0]!.whatsapp} className="font-semibold underline underline-offset-4">WhatsApp</a> o{" "}
            <Link href="/prenota" className="font-semibold underline underline-offset-4">prenotare di nuovo</Link>.
          </p>
        </Box>
      </>
    );
  }

  const area = areaOf(appt);
  const service = findAgendaService(appt.serviceSlug);
  const serviceName = service?.name ?? "Appuntamento";
  const when = `${formatDay(appt.date).long}, ore ${formatClock(appt.start)}`;
  const editable = appt.status === "confermato" && canChangeOnline(appt.date, appt.start, now);

  let busy: Busy[] = [];
  let closures: Closure[] = [];
  if (editable) {
    const today = localNow(now).date;
    const last = addDays(today, BOOKING_WINDOW_DAYS - 1);
    try {
      [busy, closures] = await Promise.all([busyWithout(appt, today, last), fetchClosures(today, last)]);
      closures = closures.map(({ reason: _reason, ...c }) => c);
    } catch (e) {
      console.error(e);
    }
  }

  const state =
    appt.status === "annullato" ? "annullato"
    : appt.status !== "confermato" || minutesUntil(appt.date, appt.end, now) <= 0 ? "passato"
    : editable ? "modificabile"
    : "tardi";

  return (
    <>
      <PageHeader kicker="Agenda Masera" lines={["Il mio appuntamento"]} lead={state === "annullato" ? "Questo appuntamento è annullato." : "Qui trovi giorno, ora e indirizzo."} />
      <Box>
        <ManageAppointment
          key={`${appt.date}-${appt.start}-${appt.status}`}
          token={token}
          notice={esito === "spostato" ? "Fatto: appuntamento spostato." : esito === "annullato" ? "Fatto: appuntamento annullato." : null}
          state={state}
          serviceName={serviceName}
          when={when}
          place={area.place}
          whatsapp={area.whatsapp}
          duration={appt.end - appt.start}
          resource={appt.resource}
          nowIso={now.toISOString()}
          busy={busy}
          closures={closures}
        />
      </Box>
    </>
  );
}
