"use client";
import "./prenota.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  bookableDays, type Busy, type Closure, formatClock, formatDay, formatPrice, formatServiceDuration, isMissing, normalizeMobile, type Service,
} from "@masera/core";
import { AGENDA_LIVE, bookingAreas } from "@/content/prenota";
import { confirmAction, holdAction, releaseAction } from "@/app/(sito)/prenota/actions";

const areas = bookingAreas();
const allServices = areas.flatMap((a) => a.groups.flatMap((g) => g.services));

/** Gruppo di scelte "una sola" accessibile: radio veri, disegnati come pillole o schede. */
function Choices<T extends string | number>({
  legend,
  name,
  value,
  onChange,
  options,
  className,
  itemClass,
}: {
  legend: ReactNode;
  name: string;
  value: T | null;
  onChange: (v: T) => void;
  options: { v: T; label: ReactNode; disabled?: boolean; key?: string }[];
  className: string;
  itemClass: (checked: boolean, disabled: boolean) => string;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-verde">{legend}</legend>
      <div className={className}>
        {options.map((o, i) => {
          const checked = value === o.v;
          return (
            <label key={o.key ?? String(o.v)} className={`pn-in block ${o.disabled ? "cursor-not-allowed" : "cursor-pointer"}`} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <input type="radio" name={name} value={String(o.v)} checked={checked} disabled={o.disabled} onChange={() => onChange(o.v)} className="peer sr-only" />
              <span className={`fm-press block h-full peer-focus-visible:shadow-[0_0_0_3px_var(--color-carta),0_0_0_6px_var(--color-verde-scuro)] ${itemClass(checked, !!o.disabled)}`}>
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const pill = (on: boolean, off: boolean) =>
  `inline-flex min-h-11 items-center rounded-full border-2 px-4 text-[15px] font-bold ${
    off ? "border-transparent bg-beige-chiaro/50 text-verde/50" : on ? "border-verde-scuro bg-verde-scuro text-carta" : "border-verde-scuro/25 bg-bianco text-verde-scuro"
  }`;

/** "2026-11-24T17:05:00Z" → "18:05" (ora di Seregno). */
const clockOf = (iso: string) => new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export function BookingFlow({
  nowIso,
  initialService,
  initialArea,
  mode,
  busy: initialBusy,
  closures,
}: {
  nowIso: string;
  initialService?: string;
  /** "farmaestetica" per aprire direttamente i trattamenti del centro estetico. */
  initialArea?: "farmaestetica";
  /** "db": orari veri e prenotazioni salvate; "demo": orari finti, niente salvato. */
  mode: "db" | "demo";
  busy: Busy[];
  closures: Closure[];
}) {
  const now = useMemo(() => new Date(nowIso), [nowIso]);
  const [busy, setBusy] = useState(initialBusy);
  const [hold, setHold] = useState<{ id: string; expiresAt: string } | null>(null);
  const [holdState, setHoldState] = useState<"idle" | "pending" | "ok">("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const holdSeq = useRef(0);
  const holdRef = useRef<string | null>(null);

  const start = allServices.find((s) => s.slug === initialService);
  const startArea = (start && areas.find((a) => a.groups.some((g) => g.services.includes(start)))) || areas.find((a) => a.slug === initialArea) || areas[0]!;
  const [areaSlug, setAreaSlug] = useState(startArea.slug);
  const area = areas.find((a) => a.slug === areaSlug) ?? areas[0]!;
  const groups = area.groups;
  const [group, setGroup] = useState<string>((start && groups.find((g) => g.services.includes(start))?.slug) || groups[0]!.slug);
  const [serviceSlug, setServiceSlug] = useState<string | null>(start?.slug ?? null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const service: Service | undefined = allServices.find((s) => s.slug === serviceSlug);
  const days = useMemo(() => (service ? bookableDays({ service, now, busy, closures }) : []), [service, now, busy, closures]);
  const slots = days.find((d) => d.date === date)?.slots ?? [];

  // Scelto il servizio, proponi il primo giorno con posti liberi.
  useEffect(() => {
    if (!service) return;
    const keep = days.find((d) => d.date === date && d.slots.length);
    if (!keep) setDate(days.find((d) => d.slots.length)?.date ?? null);
    setSlot((s) => (s !== null && keep?.slots.includes(s) ? s : null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  // Con il database: scelto un orario, teniamo il posto 5 minuti; cambiando scelta liberiamo il precedente.
  useEffect(() => {
    if (mode !== "db" || done) return;
    const seq = ++holdSeq.current;
    const prev = holdRef.current;
    holdRef.current = null;
    setHold(null);
    if (prev) void releaseAction(prev);
    if (!service || !date || slot === null) {
      setHoldState("idle");
      return;
    }
    setHoldState("pending");
    void holdAction({ serviceSlug: service.slug, date, start: slot }).then((r) => {
      if (seq !== holdSeq.current) {
        if (r.ok) void releaseAction(r.holdId); // scelta già cambiata
        return;
      }
      if (r.ok) {
        holdRef.current = r.holdId;
        setHold({ id: r.holdId, expiresAt: r.expiresAt });
        setHoldState("ok");
        setNotice(null);
      } else {
        setHoldState("idle");
        if (r.busy) setBusy(r.busy);
        setSlot(null);
        setNotice(
          r.reason === "preso"
            ? "Questo orario è appena stato preso. Scegline un altro."
            : "Non riusciamo a tenere il posto in questo momento. Riprova, oppure scrivici su WhatsApp.",
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, serviceSlug, date, slot]);

  const mobile = normalizeMobile(phone);
  const errors = {
    name: name.trim().length < 3 ? "Scrivi nome e cognome." : null,
    phone: !mobile ? "Scrivi un numero di cellulare italiano, per esempio 333 123 4567." : null,
    privacy: !privacy ? "Serve la presa visione dell'informativa." : null,
  };
  const ready = !!service && !!date && slot !== null && !errors.name && !errors.phone && !errors.privacy;

  const summary = service
    ? [service.name, date ? formatDay(date).long : null, slot !== null ? `ore ${formatClock(slot)}` : null].filter(Boolean).join(" · ")
    : "Scegli un servizio";

  async function confirm() {
    setTried(true);
    if (!ready || sending) return;
    if (mode === "demo") {
      setDone(true);
      return;
    }
    if (!hold) {
      setNotice(holdState === "pending" ? "Un attimo: stiamo tenendo il posto per te." : "Scegli di nuovo l'orario.");
      return;
    }
    setSending(true);
    const r = await confirmAction({ holdId: hold.id, name, phone, privacy });
    setSending(false);
    if (r.ok) {
      holdRef.current = null;
      setDone(true);
    } else if (r.reason === "scaduto") {
      holdRef.current = null;
      setHold(null);
      setSlot(null);
      setNotice("Sono passati più di 5 minuti e il posto si è liberato. Scegli di nuovo l'orario.");
    } else {
      setNotice(r.reason === "dati" ? "Controlla i tuoi dati qui sopra." : "Qualcosa non ha funzionato. Riprova, oppure scrivici su WhatsApp.");
    }
  }
  function reset() {
    holdSeq.current++;
    setHold(null);
    setHoldState("idle");
    setNotice(null);
    setDone(false);
    setTried(false);
    setSlot(null);
    setName("");
    setPhone("");
    setPrivacy(false);
  }

  if (done && service && date && slot !== null) {
    return (
      <section aria-live="polite" className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <div className="flex flex-col items-center rounded-[40px] bg-[radial-gradient(120%_90%_at_50%_20%,#425D3A_0%,#2E3F2D_50%,#1a2419_100%)] px-6 py-16 text-center text-carta md:py-24">
          <svg className="pn-pop" width="112" height="112" viewBox="0 0 112 112" aria-hidden>
            <circle cx="56" cy="56" r="54" fill="var(--color-mela)" />
            <path className="pn-check" pathLength={1} d="M34 58l15 15 30-32" fill="none" stroke="#1a2419" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2 ref={doneRef} tabIndex={-1} className="pn-in fm-display mt-7 text-[40px] leading-none outline-none md:text-[56px]" style={{ animationDelay: ".5s" }}>
            Ti aspettiamo.
          </h2>
          <p className="pn-in mt-4 text-[19px]" style={{ animationDelay: ".6s" }}>
            {service.name}
            <br />
            {formatDay(date).long}, ore {formatClock(slot)}
          </p>
          <p className="pn-in mt-1 text-[16px] text-beige-chiaro" style={{ animationDelay: ".65s" }}>
            {area.place}
          </p>
          {!isMissing(service.preparation) && service.preparation && (
            <div className="pn-in mt-6 max-w-xl rounded-3xl bg-carta/10 p-5 text-left text-[16px]" style={{ animationDelay: ".7s" }}>
              <b className="block text-mela">Come prepararti</b>
              {service.preparation}
            </div>
          )}
          <p className="pn-in mt-6 max-w-xl text-[15px] text-beige-chiaro" style={{ animationDelay: ".75s" }}>
            Per spostare o annullare scrivici su{" "}
            <a href={area.whatsapp} className="font-semibold text-carta underline underline-offset-4">
              WhatsApp
            </a>
            .
          </p>
          {!AGENDA_LIVE && (
            <p className="pn-in mt-6 rounded-full bg-mela px-4 py-2 text-[14px] font-semibold text-verde-scuro" style={{ animationDelay: ".8s" }}>
              {mode === "demo" ? "Prova: questa prenotazione non è stata salvata." : "Prenotazione di prova: la farmacia non la vede ancora."}
            </p>
          )}
          <button type="button" onClick={reset} className="fm-focus fm-press pn-in mt-8 min-h-12 rounded-full border-2 border-carta px-6 text-[16px] font-bold" style={{ animationDelay: ".85s" }}>
            Prenota un altro servizio
          </button>
        </div>
      </section>
    );
  }

  const groupServices = groups.find((g) => g.slug === group)?.services ?? [];
  const showErr = (e: string | null) => tried && e;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      {!AGENDA_LIVE && (
        <p className="mb-6 rounded-2xl border-2 border-dashed border-verde/40 bg-bianco px-4 py-3 text-[15px]">
          <b>Anteprima di prova.</b>{" "}
          {mode === "demo"
            ? "Gli orari occupati sono finti e la prenotazione non viene salvata."
            : "Le prenotazioni si salvano, ma la farmacia non usa ancora questa agenda: non presentarti all'appuntamento."}
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="min-w-0 space-y-6">
          <Choices
            legend="1 · Dove?"
            name="zona"
            value={areaSlug}
            onChange={(v) => {
              const next = areas.find((a) => a.slug === v)!;
              setAreaSlug(next.slug);
              setGroup(next.groups[0]!.slug);
              setServiceSlug(null);
              setDate(null);
              setSlot(null);
            }}
            options={areas.map((a) => ({ v: a.slug, label: a.name }))}
            className="flex flex-wrap gap-2"
            itemClass={(on) =>
              `inline-flex min-h-12 items-center rounded-2xl border-2 px-5 text-[16px] font-bold ${
                on ? (areaSlug === "farmaestetica" ? "border-verde-scuro bg-salvia text-verde-scuro" : "border-verde-scuro bg-verde-scuro text-carta") : "border-verde-scuro/25 bg-bianco text-verde-scuro"
              }`
            }
          />
          <Choices
            key={areaSlug}
            legend="Cosa ti serve?"
            name="gruppo"
            value={group}
            onChange={setGroup}
            options={groups.map((g) => ({ v: g.slug, label: g.name }))}
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
            itemClass={(on) => `${pill(on, false)} whitespace-nowrap`}
          />
          <Choices
            legend={<span className="sr-only">Servizio</span>}
            name="servizio"
            value={serviceSlug}
            onChange={(v) => setServiceSlug(v)}
            options={groupServices.map((s) => ({
              v: s.slug,
              label: (
                <span className="flex items-center justify-between gap-3">
                  <span>
                    <b className="block text-[16px]">{s.name}</b>
                    <span className="text-[14px] text-verde">{formatServiceDuration(s)}</span>
                  </span>
                  <span className="whitespace-nowrap text-[16px] font-bold">{formatPrice(s.price_eur)}</span>
                </span>
              ),
            }))}
            className="flex flex-col gap-2"
            itemClass={(on) => `rounded-2xl border-2 px-4 py-3.5 ${on ? "border-verde-scuro bg-beige-chiaro" : "border-verde-scuro/15 bg-bianco"}`}
          />
        </div>

        <div className="min-w-0 space-y-8">
          {!service ? (
            <p className="rounded-3xl bg-beige-chiaro/60 p-6 text-[17px]">Scegli un servizio: qui compariranno i giorni e gli orari liberi.</p>
          ) : (
            <>
              <Choices
                legend="2 · Giorno"
                name="giorno"
                value={date}
                onChange={(v) => {
                  setDate(v);
                  setSlot(null);
                }}
                options={days.map((d) => {
                  const f = formatDay(d.date);
                  return {
                    v: d.date,
                    disabled: d.slots.length === 0,
                    label: (
                      <span className="flex flex-col items-center gap-0.5 py-2.5">
                        <span className="text-[11px] font-semibold uppercase">{f.dow}</span>
                        <b className="text-[19px] leading-none">{f.num}</b>
                        <span className="sr-only">{d.slots.length ? `${f.long}, ${d.slots.length} orari liberi` : `${f.long}, nessun orario libero`}</span>
                      </span>
                    ),
                  };
                })}
                className="grid grid-cols-7 gap-1.5"
                itemClass={(on, off) =>
                  `rounded-2xl text-center ${off ? "bg-transparent text-verde/40 line-through" : on ? "bg-verde-scuro text-carta" : "bg-bianco text-verde-scuro"}`
                }
              />
              {date && (
                <Choices
                  key={date}
                  legend={`3 · Orario, ${formatDay(date).long}`}
                  name="orario"
                  value={slot}
                  onChange={setSlot}
                  options={slots.map((m) => ({ v: m, label: formatClock(m) }))}
                  className="grid grid-cols-4 gap-2 sm:grid-cols-5"
                  itemClass={(on) =>
                    `flex min-h-11 items-center justify-center rounded-xl border-2 text-[15px] font-bold ${on ? "border-verde-scuro bg-verde-scuro text-carta" : "border-verde-scuro/20 bg-bianco text-verde-scuro"}`
                  }
                />
              )}
              {mode === "db" && slot !== null && (
                <p aria-live="polite" className="text-[15px] font-semibold text-verde">
                  {holdState === "pending" ? "Teniamo il posto per te…" : hold ? `Ti teniamo il posto fino alle ${clockOf(hold.expiresAt)}.` : null}
                </p>
              )}
              {days.every((d) => d.slots.length === 0) && (
                <p className="rounded-3xl bg-beige-chiaro/60 p-6 text-[17px]">
                  Nei prossimi giorni non ci sono orari liberi online. Scrivici su{" "}
                  <a href={area.whatsapp} className="font-semibold underline underline-offset-4">
                    WhatsApp
                  </a>
                  : troviamo noi un posto.
                </p>
              )}
            </>
          )}

          {service && slot !== null && (
            <fieldset className="pn-in space-y-4">
              <legend className="mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-verde">4 · I tuoi dati</legend>
              <div>
                <label htmlFor="pn-nome" className="block text-[16px] font-semibold">
                  Nome e cognome
                </label>
                <input
                  id="pn-nome"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={!!showErr(errors.name)}
                  aria-describedby={showErr(errors.name) ? "pn-nome-e" : undefined}
                  className="fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-4 text-[17px]"
                />
                {showErr(errors.name) && (
                  <p id="pn-nome-e" className="mt-1 text-[15px] font-semibold text-[#9b2c1f]">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="pn-tel" className="block text-[16px] font-semibold">
                  Cellulare
                </label>
                <input
                  id="pn-tel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={!!showErr(errors.phone)}
                  aria-describedby={`pn-tel-h${showErr(errors.phone) ? " pn-tel-e" : ""}`}
                  className="fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-4 text-[17px]"
                />
                <p id="pn-tel-h" className="mt-1 text-[14px] text-verde">
                  Lo usiamo solo per questo appuntamento.
                </p>
                {showErr(errors.phone) && (
                  <p id="pn-tel-e" className="mt-1 text-[15px] font-semibold text-[#9b2c1f]">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-[16px]">
                  <input
                    type="checkbox"
                    checked={privacy}
                    onChange={(e) => setPrivacy(e.target.checked)}
                    aria-invalid={!!showErr(errors.privacy)}
                    className="fm-focus mt-0.5 size-6 shrink-0 accent-[var(--color-verde-scuro)]"
                  />
                  <span>Ho letto l&apos;informativa privacy.</span>
                </label>
                <Link href="/privacy" target="_blank" className="ml-9 mt-1 inline-flex min-h-8 items-center text-[15px] font-semibold underline underline-offset-4">
                  Leggi l&apos;informativa (si apre in una nuova scheda)
                </Link>
                {showErr(errors.privacy) && <p className="mt-1 text-[15px] font-semibold text-[#9b2c1f]">{errors.privacy}</p>}
              </div>
            </fieldset>
          )}
        </div>
      </div>

      <div className="sticky bottom-4 z-10 mt-10 flex items-center gap-3 rounded-3xl bg-[#1a2419] py-3.5 pl-5 pr-3.5 text-carta shadow-[0_16px_32px_rgba(0,0,0,.25)]">
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] text-salvia">{service ? `${formatPrice(service.price_eur)} · ${formatServiceDuration(service)}` : "Agenda Masera"}</span>
          <b className="block truncate text-[16px]">{summary}</b>
        </span>
        <button
          type="button"
          onClick={confirm}
          aria-disabled={!service || !date || slot === null || sending}
          className={`fm-focus fm-press min-h-12 shrink-0 rounded-full px-6 text-[16px] font-bold text-[#1a2419] ${service && date && slot !== null ? "bg-mela" : "bg-beige-chiaro/50"}`}
        >
          {sending ? "Invio…" : "Conferma"}
        </button>
      </div>
      {(notice || (tried && !ready)) && (
        <p role="alert" className="mt-3 text-center text-[15px] font-semibold text-[#9b2c1f]">
          {notice ?? (!service || !date || slot === null ? "Scegli servizio, giorno e orario." : "Completa i tuoi dati qui sopra.")}
        </p>
      )}
    </div>
  );
}
