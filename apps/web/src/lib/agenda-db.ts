// Agenda Masera sul database (Supabase a Francoforte). Solo lato server: usa la chiave segreta.
// Le chiavi stanno nelle variabili d'ambiente di Vercel, mai nel codice:
//   NEXT_PUBLIC_SUPABASE_URL      indirizzo del progetto
//   SUPABASE_SERVICE_ROLE_KEY     chiave segreta (secret key)
import type { Busy, Closure, ResourceId } from "@masera/core";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Senza chiavi (sul computer o in un'anteprima non configurata) l'agenda gira in prova, con orari finti. */
export const agendaDbConfigured = (): boolean => !!url && !!key && typeof window === "undefined";

function headers(): HeadersInit {
  const h: Record<string, string> = { apikey: key!, "Content-Type": "application/json" };
  // Le vecchie chiavi (JWT) vanno anche in Authorization; le nuove "sb_secret_" solo in apikey.
  if (key!.startsWith("eyJ")) h.Authorization = `Bearer ${key}`;
  return h;
}

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${url}/rest/v1/${path}`, { ...init, headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`Agenda: il database ha risposto ${res.status} su ${path.split("?")[0]}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/** Orari occupati (appuntamenti e posti tenuti) tra due giorni compresi, senza dati dei clienti. */
export async function fetchBusy(from: string, to: string): Promise<Busy[]> {
  const rows = await rest<{ resource: ResourceId; day: string; start_min: number; end_min: number }[]>(
    `agenda_busy?select=resource,day,start_min,end_min&day=gte.${from}&day=lte.${to}`,
  );
  return rows.map((r) => ({ resource: r.resource, date: r.day, start: r.start_min, end: r.end_min }));
}

export async function fetchClosures(from: string, to: string): Promise<Closure[]> {
  const rows = await rest<{ day: string; resource: ResourceId | null; from_min: number | null; to_min: number | null; reason: string | null }[]>(
    `closures?select=day,resource,from_min,to_min,reason&day=gte.${from}&day=lte.${to}`,
  );
  return rows.map((r) => ({
    date: r.day,
    ...(r.resource ? { resource: r.resource } : {}),
    ...(r.from_min !== null && r.to_min !== null ? { from: r.from_min, to: r.to_min } : {}),
    ...(r.reason ? { reason: r.reason } : {}),
  }));
}

/** Tiene il posto per 5 minuti. null = l'orario è stato appena preso da qualcun altro. */
export async function holdSlot(a: {
  serviceSlug: string; resource: ResourceId; date: string; start: number; duration: number; buffer: number;
}): Promise<{ id: string; expiresAt: string } | null> {
  const rows = await rest<{ id: string; hold_expires_at: string }[]>("rpc/hold_slot", {
    method: "POST",
    body: JSON.stringify({
      p_service_slug: a.serviceSlug, p_resource: a.resource, p_day: a.date,
      p_start_min: a.start, p_duration_min: a.duration, p_buffer_min: a.buffer,
    }),
  });
  const r = rows?.[0];
  return r ? { id: r.id, expiresAt: r.hold_expires_at } : null;
}

/** Conferma il posto tenuto. false = il posto è scaduto (più di 5 minuti). */
export async function confirmHold(id: string, name: string, phone: string): Promise<boolean> {
  return rest<boolean>("rpc/confirm_hold", { method: "POST", body: JSON.stringify({ p_id: id, p_name: name, p_phone: phone }) });
}

export async function releaseHold(id: string): Promise<void> {
  await rest("rpc/release_hold", { method: "POST", body: JSON.stringify({ p_id: id }) });
}
