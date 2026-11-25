"use server";
// Azioni del link personale /appuntamento/…: il cliente sposta o annulla da solo, fino a un'ora prima.
// Tutto si ricontrolla qui sul server e poi di nuovo nel database.
import { addDays, availableSlots, BOOKING_WINDOW_DAYS, canChangeOnline, localNow, type Busy } from "@masera/core";
import { agendaDbConfigured, busyWithout, fetchClosures, manageCancel, manageGet, manageMove, type ManagedAppointment } from "@/lib/agenda-db";
import { hashManageToken, isManageToken } from "@/lib/manage-token";

export type ManageResult = { ok: true } | { ok: false; reason: "tardi" | "preso" | "non_valido" | "errore"; busy?: Busy[] };

async function load(token: string): Promise<{ hash: string; appt: ManagedAppointment } | "non_valido" | "tardi"> {
  if (!isManageToken(token)) return "non_valido";
  const hash = hashManageToken(token);
  const appt = await manageGet(hash);
  if (!appt || appt.status !== "confermato") return "non_valido";
  if (!canChangeOnline(appt.date, appt.start, new Date())) return "tardi";
  return { hash, appt };
}

export async function cancelAction(token: string): Promise<ManageResult> {
  if (!agendaDbConfigured()) return { ok: false, reason: "errore" };
  try {
    const l = await load(token);
    if (typeof l === "string") return { ok: false, reason: l };
    return (await manageCancel(l.hash)) ? { ok: true } : { ok: false, reason: "tardi" };
  } catch (e) {
    console.error(e);
    return { ok: false, reason: "errore" };
  }
}

export async function moveAction(input: { token: string; date: string; start: number }): Promise<ManageResult> {
  if (!agendaDbConfigured()) return { ok: false, reason: "errore" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !Number.isInteger(input.start)) return { ok: false, reason: "non_valido" };
  try {
    const l = await load(input.token);
    if (typeof l === "string") return { ok: false, reason: l };
    const now = new Date();
    const today = localNow(now).date;
    const last = addDays(today, BOOKING_WINDOW_DAYS - 1);
    const [busy, closures] = await Promise.all([busyWithout(l.appt, today, last), fetchClosures(today, last)]);
    // Stessa durata e stessa zona dell'appuntamento preso; stesse regole della prenotazione online.
    const service = { duration_min: l.appt.end - l.appt.start, resource: l.appt.resource };
    if (!availableSlots({ service, date: input.date, now, busy, closures }).includes(input.start)) return { ok: false, reason: "preso", busy };
    if (await manageMove(l.hash, input.date, input.start)) return { ok: true };
    return { ok: false, reason: "preso", busy: await busyWithout(l.appt, today, last) };
  } catch (e) {
    console.error(e);
    return { ok: false, reason: "errore" };
  }
}
