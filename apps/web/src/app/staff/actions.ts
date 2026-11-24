"use server";
// Azioni dell'agenda del personale. Ognuna controlla prima l'accesso: senza cookie valido non fa niente.
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { agendaResources, availableSlots, normalizeMobile, services, type ResourceId } from "@masera/core";
import { addClosure, bookDirect, deleteClosure, fetchBusy, fetchClosures, setAppointmentStatus, type StaffAppointment } from "@/lib/agenda-db";
import { checkPassword, isStaff, newSessionValue, STAFF_COOKIE } from "@/lib/staff-auth";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const isResource = (r: string): r is ResourceId => r in agendaResources;

export type FormState = { error?: string; ok?: string } | undefined;

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  const ok = checkPassword(String(form.get("password") ?? ""));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 1200)); // rallenta chi prova a indovinare
    return { error: "Password non corretta." };
  }
  const s = newSessionValue();
  (await cookies()).set(STAFF_COOKIE, s.value, { httpOnly: true, secure: true, sameSite: "strict", path: "/staff", maxAge: s.maxAge });
  redirect("/staff/agenda");
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete({ name: STAFF_COOKIE, path: "/staff" });
  redirect("/staff/accesso");
}

async function guard(): Promise<void> {
  if (!(await isStaff())) redirect("/staff/accesso");
}

export async function setStatusAction(form: FormData): Promise<void> {
  await guard();
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "") as StaffAppointment["status"];
  if (UUID.test(id)) await setAppointmentStatus(id, status);
  revalidatePath("/staff/agenda");
}

/** Inserimento rapido: servizio, giorno, ora, nome (cellulare facoltativo al banco). */
export async function quickBookAction(_prev: FormState, form: FormData): Promise<FormState> {
  await guard();
  const service = services.find((s) => s.slug === form.get("servizio"));
  const date = String(form.get("giorno") ?? "");
  const start = Number(form.get("ora"));
  const name = String(form.get("nome") ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
  const rawPhone = String(form.get("cellulare") ?? "").trim();
  const channel = form.get("canale") === "banco" ? "banco" : "telefono";
  const notes = String(form.get("note") ?? "").trim().slice(0, 300);
  if (!service || !isResource(service.resource)) return { error: "Scegli il servizio." };
  if (!DAY.test(date) || !Number.isInteger(start)) return { error: "Scegli giorno e ora." };
  if (name.length < 2) return { error: "Scrivi il nome del cliente." };
  const phone = rawPhone ? normalizeMobile(rawPhone) : "";
  if (phone === null) return { error: "Il cellulare non sembra giusto (es. 333 123 4567)." };
  if (channel === "telefono" && !phone) return { error: "Per le prenotazioni al telefono serve il cellulare." };

  const [busy, closures] = await Promise.all([fetchBusy(date, date), fetchClosures(date, date)]);
  const free = availableSlots({ service, date, now: new Date(), busy, closures, staff: true });
  if (!free.includes(start)) return { error: "Quell'orario non è più libero: scegline un altro." };
  const res = agendaResources[service.resource];
  const id = await bookDirect({
    serviceSlug: service.slug, resource: service.resource, date, start, duration: service.duration_min, buffer: res.bufferMin,
    name, phone: phone ?? "", channel, notes,
  });
  if (!id) return { error: "Quell'orario è stato appena preso: scegline un altro." };
  revalidatePath("/staff/agenda");
  return { ok: `Fatto: ${name} è in agenda.` };
}

export async function addClosureAction(_prev: FormState, form: FormData): Promise<FormState> {
  await guard();
  const date = String(form.get("giorno") ?? "");
  const r = String(form.get("risorsa") ?? "");
  const resource = r && isResource(r) ? r : null;
  const whole = form.get("intero") === "si";
  const toMin = (v: FormDataEntryValue | null) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(v ?? ""));
    return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
  };
  const from = whole ? null : toMin(form.get("dalle"));
  const to = whole ? null : toMin(form.get("alle"));
  if (!DAY.test(date)) return { error: "Scegli il giorno." };
  if (!whole && (Number.isNaN(from) || Number.isNaN(to) || (to as number) <= (from as number))) return { error: "Controlla le ore (dalle … alle …)." };
  await addClosure({ date, resource, from, to, reason: String(form.get("motivo") ?? "").trim().slice(0, 120) });
  revalidatePath("/staff/agenda");
  return { ok: "Chiusura salvata: quegli orari non sono più prenotabili." };
}

export async function deleteClosureAction(form: FormData): Promise<void> {
  await guard();
  const id = String(form.get("id") ?? "");
  if (UUID.test(id)) await deleteClosure(id);
  revalidatePath("/staff/agenda");
}
