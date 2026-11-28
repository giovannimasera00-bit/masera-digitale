"use client";
import "../prenota/prenota.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { checkPrescriptionRequest, handoverNote, PRESCRIPTION_PHOTO_DAYS, normalizeMobile, prescriptionAllowed, type Handover } from "@masera/core";

const field = "fm-focus mt-1 min-h-12 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-4 text-[17px]";
const legend = "mb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-verde";

function Err({ id, text }: { id: string; text?: string }) {
  return text ? (
    <p id={id} className="mt-1 text-[15px] font-semibold text-[#9b2c1f]">
      {text}
    </p>
  ) : null;
}

/**
 * Modulo "Invia una ricetta" in PROVA: la foto si vede solo qui sul telefono, non viene inviata né salvata.
 * Con il database: foto in un archivio privato in Europa, solo per il personale, cancellata da sola dopo 7 giorni.
 */
export function PrescriptionForm() {
  const [zip, setZip] = useState("");
  const [kind, setKind] = useState<"foto" | "nre">("foto");
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [nre, setNre] = useState("");
  const [cf, setCf] = useState("");
  const [handover, setHandover] = useState<Handover>("ritiro");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);

  // Le anteprime delle foto vivono solo in questa pagina: si liberano quando si esce.
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos]);

  const zipOk = zip.trim().length === 5 ? prescriptionAllowed(zip) : null;
  const errors = checkPrescriptionRequest({
    zip,
    source: kind === "foto" ? { kind, files: photos.length } : { kind, nre, fiscalCode: cf },
    handover,
    name,
    phone: normalizeMobile(phone),
    privacy,
  });
  const show = (k: keyof typeof errors) => (tried ? errors[k] : undefined);

  if (done) {
    return (
      <div role="status" className="pn-in rounded-[32px] bg-verde-scuro p-8 text-carta">
        <b className="fm-display block text-[34px] leading-tight">Ricevuta.</b>
        <p className="mt-3 text-[17px]">La farmacista la guarda e ti manda il preventivo su WhatsApp, con i tempi. Lo approvi con un tocco.</p>
        <p className="mt-2 text-[16px] text-beige-chiaro">{handoverNote(handover)}</p>
        <p className="mt-4 inline-block rounded-full bg-mela px-4 py-2 text-[14px] font-semibold text-verde-scuro">
          Prova: niente è stato inviato. La foto non è uscita da questo dispositivo.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (Object.keys(errors).length === 0) setDone(true);
      }}
      className="space-y-8"
    >
      <fieldset>
        <legend className={legend}>1 · Dove abiti?</legend>
        <label htmlFor="rc-cap" className="block text-[16px] font-semibold">
          CAP
        </label>
        <input id="rc-cap" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value)} aria-describedby="rc-cap-e" className={`${field} max-w-48`} />
        {zipOk && !zipOk.ok ? <Err id="rc-cap-e" text={zipOk.message} /> : <Err id="rc-cap-e" text={show("zip")} />}
      </fieldset>

      <fieldset>
        <legend className={legend}>2 · La ricetta</legend>
        <div role="radiogroup" aria-label="Come ci mandi la ricetta" className="flex flex-wrap gap-2">
          {(
            [
              ["foto", "Foto della ricetta"],
              ["nre", "Codice della ricetta elettronica"],
            ] as const
          ).map(([k, l]) => (
            <label key={k} className="cursor-pointer">
              <input type="radio" name="rc-kind" checked={kind === k} onChange={() => setKind(k)} className="peer sr-only" />
              <span className={`inline-flex min-h-11 items-center rounded-full border-2 px-4 text-[15px] font-bold peer-focus-visible:shadow-[0_0_0_3px_var(--color-carta),0_0_0_6px_var(--color-verde-scuro)] ${kind === k ? "border-verde-scuro bg-verde-scuro text-carta" : "border-verde-scuro/25 bg-bianco"}`}>
                {l}
              </span>
            </label>
          ))}
        </div>
        {kind === "foto" ? (
          <div className="mt-4">
            <label htmlFor="rc-foto" className="block text-[16px] font-semibold">
              Foto (fino a 5)
            </label>
            <input
              id="rc-foto"
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={(e) => {
                const files = [...(e.target.files ?? [])].slice(0, 5);
                setPhotos(files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })));
              }}
              className="fm-focus mt-2 block w-full text-[16px]"
            />
            {photos.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {photos.map((p) => (
                  <li key={p.url} className="h-24 w-20 overflow-hidden rounded-xl border border-verde-scuro/15 bg-bianco">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={`Anteprima: ${p.name}`} className="h-full w-full object-cover" />
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-[14px] text-verde">Inquadra tutta la ricetta, con il nome del medico e la firma ben leggibili.</p>
            <Err id="rc-foto-e" text={show("source")} />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rc-nre" className="block text-[16px] font-semibold">
                Codice ricetta (NRE)
              </label>
              <input id="rc-nre" autoComplete="off" autoCapitalize="characters" maxLength={19} aria-describedby="rc-nre-h" value={nre} onChange={(e) => setNre(e.target.value)} className={field} />
              <p id="rc-nre-h" className="mt-1 text-[14px] text-verde">15 caratteri, li trovi sul promemoria della ricetta.</p>
              <Err id="rc-nre-e" text={show("nre")} />
            </div>
            <div>
              <label htmlFor="rc-cf" className="block text-[16px] font-semibold">
                Codice fiscale del paziente
              </label>
              <input id="rc-cf" autoComplete="off" autoCapitalize="characters" maxLength={16} value={cf} onChange={(e) => setCf(e.target.value)} className={field} />
              <Err id="rc-cf-e" text={show("fiscalCode")} />
            </div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className={legend}>3 · Come la vuoi</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ["ritiro", "Ritiro in farmacia", "Quando è pronta, in via Garibaldi 103."],
              ["consegna", "Consegna serale a casa", "A Seregno, in un pacco sigillato da un farmacista."],
            ] as const
          ).map(([k, t, d]) => (
            <label key={k} className="cursor-pointer">
              <input type="radio" name="rc-handover" checked={handover === k} onChange={() => setHandover(k)} className="peer sr-only" />
              <span className={`block h-full rounded-2xl border-2 px-4 py-3 peer-focus-visible:shadow-[0_0_0_3px_var(--color-carta),0_0_0_6px_var(--color-verde-scuro)] ${handover === k ? "border-verde-scuro bg-beige-chiaro" : "border-verde-scuro/15 bg-bianco"}`}>
                <b className="block text-[16px]">{t}</b>
                <span className="text-[14px] text-verde">{d}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-[15px]">{handoverNote(handover)}</p>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className={legend}>4 · I tuoi dati</legend>
        <div>
          <label htmlFor="rc-nome" className="block text-[16px] font-semibold">
            Nome e cognome
          </label>
          <input id="rc-nome" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
          <Err id="rc-nome-e" text={show("name")} />
        </div>
        <div>
          <label htmlFor="rc-tel" className="block text-[16px] font-semibold">
            Cellulare
          </label>
          <input id="rc-tel" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
          <p className="mt-1 text-[14px] text-verde">Ti mandiamo qui il preventivo, su WhatsApp.</p>
          <Err id="rc-tel-e" text={show("phone")} />
        </div>
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-[16px]">
            <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="fm-focus mt-0.5 size-6 shrink-0 accent-[var(--color-verde-scuro)]" />
            <span>
              Ho letto l&apos;
              <Link href="/privacy" target="_blank" className="font-semibold underline underline-offset-4">
                informativa privacy
              </Link>
              . La foto serve solo per il preventivo e la cancelliamo dopo {PRESCRIPTION_PHOTO_DAYS} giorni.
            </span>
          </label>
          <Err id="rc-pr-e" text={show("privacy")} />
        </div>
      </fieldset>

      {tried && Object.keys(errors).length > 0 && (
        <p role="alert" className="text-[16px] font-semibold text-[#9b2c1f]">
          Controlla i campi segnati qui sopra.
        </p>
      )}
      <button type="submit" className="fm-focus fm-press min-h-14 w-full rounded-full bg-verde-scuro px-6 text-[17px] font-bold text-carta sm:w-auto">
        Invia la ricetta
      </button>
    </form>
  );
}
