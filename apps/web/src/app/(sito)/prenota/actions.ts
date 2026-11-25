"use server";
// Azioni della pagina /prenota: girano sul server, il browser non vede mai le chiavi del database.
import {
  addDays, agendaResources, availableSlots, bookableServices, BOOKING_WINDOW_DAYS, localNow, normalizeMobile, type Busy,
  type ResourceId,
} from "@masera/core";
import { agendaDbConfigured, confirmBooking, fetchBusy, fetchClosures, holdSlot, releaseHold } from "@/lib/agenda-db";
import { hashManageToken, newManageToken } from "@/lib/manage-token";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type HoldResult =
  | { ok: true; holdId: string; expiresAt: string }
  | { ok: false; reason: "preso" | "non_valido" | "errore"; busy?: Busy[] };

/** Il cliente ha scelto un orario: ricontrolla le regole sul database e tiene il posto per 5 minuti. */
export async function holdAction(input: { serviceSlug: string; date: string; start: number }): Promise<HoldResult> {
  if (!agendaDbConfigured()) return { ok: false, reason: "errore" };
  const service = bookableServices().find((s) => s.slug === input.serviceSlug);
  if (!service || !/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !Number.isInteger(input.start)) return { ok: false, reason: "non_valido" };
  const resource = service.resource as ResourceId;
  try {
    const now = new Date();
    const today = localNow(now).date;
    const last = addDays(today, BOOKING_WINDOW_DAYS - 1);
    const [busy, closures] = await Promise.all([fetchBusy(today, last), fetchClosures(today, last)]);
    const free = availableSlots({ service, date: input.date, now, busy, closures });
    if (!free.includes(input.start)) return { ok: false, reason: "preso", busy };
    const hold = await holdSlot({
      serviceSlug: service.slug, resource, date: input.date, start: input.start,
      duration: service.duration_min, buffer: agendaResources[resource].bufferMin,
    });
    if (!hold) return { ok: false, reason: "preso", busy: await fetchBusy(today, last) };
    return { ok: true, holdId: hold.id, expiresAt: hold.expiresAt };
  } catch (e) {
    console.error(e);
    return { ok: false, reason: "errore" };
  }
}

export async function releaseAction(holdId: string): Promise<void> {
  if (!agendaDbConfigured() || !UUID.test(holdId)) return;
  try {
    await releaseHold(holdId);
  } catch (e) {
    console.error(e);
  }
}

export type ConfirmResult = { ok: true; token: string } | { ok: false; reason: "dati" | "scaduto" | "errore" };

/** Conferma: controlla di nuovo i dati sul server e trasforma il posto tenuto in appuntamento. */
export async function confirmAction(input: { holdId: string; name: string; phone: string; privacy: boolean }): Promise<ConfirmResult> {
  if (!agendaDbConfigured()) return { ok: false, reason: "errore" };
  const name = input.name.trim().replace(/\s+/g, " ").slice(0, 120);
  const phone = normalizeMobile(input.phone);
  if (!UUID.test(input.holdId) || name.length < 3 || !phone || input.privacy !== true) return { ok: false, reason: "dati" };
  try {
    // Il link personale per spostare o annullare: il codice va solo al cliente, nel database la sua impronta.
    const token = newManageToken();
    return (await confirmBooking(input.holdId, name, phone, hashManageToken(token))) ? { ok: true, token } : { ok: false, reason: "scaduto" };
  } catch (e) {
    console.error(e);
    return { ok: false, reason: "errore" };
  }
}
