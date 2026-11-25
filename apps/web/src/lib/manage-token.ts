// Il codice del link personale "Il mio appuntamento": 24 byte casuali (32 caratteri).
// Al cliente va il codice; nel database solo la sua impronta sha256.
import { createHash, randomBytes } from "node:crypto";

export const newManageToken = (): string => randomBytes(24).toString("base64url");
export const isManageToken = (t: string): boolean => /^[A-Za-z0-9_-]{32}$/.test(t);
export const hashManageToken = (t: string): string => createHash("sha256").update(t).digest("hex");
export const managePath = (t: string): string => `/appuntamento/${t}`;
