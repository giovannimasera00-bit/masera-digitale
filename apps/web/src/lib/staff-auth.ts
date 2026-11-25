// Accesso del personale all'agenda. Due password, scelte da Giovanni e salvate solo su Vercel:
//   STAFF_PASSWORD       dottoresse e farmacia: vedono tutte le zone
//   ESTETISTA_PASSWORD   l'estetista: vede e gestisce solo Farmaestetica (BRIEF: ruolo "beauty")
// Dopo l'accesso il browser tiene un cookie tecnico firmato, valido 30 giorni, solo per le pagine /staff.
// Cambiando una password su Vercel scadono gli accessi aperti con quella password (serve una nuova pubblicazione).
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { agendaResources, type ResourceId } from "@masera/core";

export const STAFF_COOKIE = "masera_staff";
const MAX_AGE_S = 30 * 24 * 60 * 60;

export type StaffRole = "staff" | "estetista";

const passwordOf = (role: StaffRole) => (role === "staff" ? process.env.STAFF_PASSWORD : process.env.ESTETISTA_PASSWORD) ?? "";
const roleConfigured = (role: StaffRole) => passwordOf(role).length >= 10 && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
/** La firma dipende dalla password del ruolo e dalla chiave segreta del database: nessuno può costruirla da fuori. */
const signingKey = (role: StaffRole) => `${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}|${passwordOf(role)}`;

/** L'accesso è attivo appena c'è la password delle dottoresse; quella dell'estetista si può aggiungere dopo. */
export const staffLoginConfigured = (): boolean => roleConfigured("staff");

function sign(role: StaffRole, expires: number): string {
  return createHmac("sha256", signingKey(role)).update(`${role}:${expires}`).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Quale password è stata scritta (o null). Confronto delle impronte: stessa durata qualunque sia la password. */
export function checkPassword(input: string): StaffRole | null {
  const h = (v: string) => createHmac("sha256", "masera-staff").update(v).digest("base64url");
  const given = h(input);
  let found: StaffRole | null = null;
  for (const role of ["staff", "estetista"] as const) {
    if (roleConfigured(role) && safeEqual(given, h(passwordOf(role))) && !found) found = role;
  }
  return found;
}

export function newSessionValue(role: StaffRole, now = Date.now()): { value: string; maxAge: number } {
  const expires = Math.floor(now / 1000) + MAX_AGE_S;
  return { value: `${role}.${expires}.${sign(role, expires)}`, maxAge: MAX_AGE_S };
}

/** Il ruolo di un cookie valido, o null. I cookie di prima (senza ruolo) valgono come "staff". */
export function sessionRole(value: string | undefined, now = Date.now()): StaffRole | null {
  if (!value) return null;
  const parts = value.split(".");
  const [role, exp, sig] = parts.length === 2 ? ["staff", parts[0], parts[1]] : parts;
  if (role !== "staff" && role !== "estetista") return null;
  if (!roleConfigured(role)) return null;
  const expires = Number(exp);
  if (!Number.isInteger(expires) || !sig || expires * 1000 < now) return null;
  return safeEqual(sig, sign(role, expires)) ? role : null;
}

export async function staffRole(): Promise<StaffRole | null> {
  return sessionRole((await cookies()).get(STAFF_COOKIE)?.value);
}

export async function isStaff(): Promise<boolean> {
  return (await staffRole()) !== null;
}

/** Le zone che un ruolo vede e gestisce. */
export function resourcesFor(role: StaffRole): ResourceId[] {
  return role === "estetista" ? ["farmaestetica"] : (Object.keys(agendaResources) as ResourceId[]);
}
