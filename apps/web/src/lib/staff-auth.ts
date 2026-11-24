// Accesso del personale all'agenda: una password unica, scelta da Giovanni e salvata solo su Vercel (STAFF_PASSWORD).
// Dopo l'accesso il browser tiene un cookie tecnico firmato, valido 30 giorni, solo per le pagine /staff.
// Cambiando la password su Vercel tutti gli accessi già aperti scadono (serve una nuova pubblicazione del sito).
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const STAFF_COOKIE = "masera_staff";
const MAX_AGE_S = 30 * 24 * 60 * 60;

const password = () => process.env.STAFF_PASSWORD ?? "";
/** La firma dipende dalla password e dalla chiave segreta del database: nessuno può costruirla da fuori. */
const signingKey = () => `${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}|${password()}`;

export const staffLoginConfigured = (): boolean => password().length >= 10 && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

function sign(expires: number): string {
  return createHmac("sha256", signingKey()).update(`staff:${expires}`).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(input: string): boolean {
  if (!staffLoginConfigured()) return false;
  // Confronto delle impronte: stessa durata qualunque sia la password scritta.
  const h = (v: string) => createHmac("sha256", "masera-staff").update(v).digest("base64url");
  return safeEqual(h(input), h(password()));
}

export function newSessionValue(now = Date.now()): { value: string; maxAge: number } {
  const expires = Math.floor(now / 1000) + MAX_AGE_S;
  return { value: `${expires}.${sign(expires)}`, maxAge: MAX_AGE_S };
}

export function isValidSession(value: string | undefined, now = Date.now()): boolean {
  if (!value || !staffLoginConfigured()) return false;
  const [exp, sig] = value.split(".");
  const expires = Number(exp);
  if (!Number.isInteger(expires) || !sig || expires * 1000 < now) return false;
  return safeEqual(sig, sign(expires));
}

export async function isStaff(): Promise<boolean> {
  return isValidSession((await cookies()).get(STAFF_COOKIE)?.value);
}
