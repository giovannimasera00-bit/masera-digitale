"use client";
import { useState } from "react";
import {
  formatEuro, handoverNote, PRESCRIPTION_STATUS, quoteLineLabel, quoteProblems, quoteTotalEur, type Handover, type PrescriptionQuote,
  type PrescriptionStatus, type QuoteLine,
} from "@masera/core";

type Req = {
  id: string;
  name: string;
  phone: string;
  received: string;
  source: "foto" | "nre";
  handover: Handover;
  status: PrescriptionStatus;
  quote: PrescriptionQuote | null;
};

// Richieste FINTE per provare la pagina.
const DEMO: Req[] = [
  { id: "r1", name: "Cliente di prova 1", phone: "+39 333 000 0001", received: "oggi alle 9:40", source: "foto", handover: "ritiro", status: "inviata", quote: null },
  { id: "r2", name: "Cliente di prova 2", phone: "+39 333 000 0002", received: "oggi alle 11:05", source: "nre", handover: "consegna", status: "inviata", quote: null },
];

const field = "fm-focus min-h-11 w-full rounded-xl border-2 border-verde-scuro/25 bg-bianco px-3 text-[16px]";
const btn = "fm-focus fm-press inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-bold";

function QuoteEditor({ onSend }: { onSend: (q: PrescriptionQuote) => void }) {
  const [lines, setLines] = useState<QuoteLine[]>([{ description: "", qty: 1, unitEur: 0 }]);
  const [readyBy, setReadyBy] = useState("");
  const [note, setNote] = useState("");
  const [tried, setTried] = useState(false);
  const q: PrescriptionQuote = { lines, readyBy, note: note.trim() || null };
  const problems = quoteProblems(q);
  const upd = (i: number, p: Partial<QuoteLine>) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...p } : l)));

  return (
    <div className="mt-4 space-y-3 rounded-2xl bg-beige-chiaro/50 p-4">
      <b className="block text-[17px]">Preventivo</b>
      {lines.map((l, i) => (
        <div key={i} className="grid grid-cols-[1fr_70px_100px_auto] items-end gap-2">
          <label className="text-[14px]">
            Descrizione
            <input value={l.description} onChange={(e) => upd(i, { description: e.target.value })} className={field} />
          </label>
          <label className="text-[14px]">
            Q.tà
            <input inputMode="numeric" value={l.qty} onChange={(e) => upd(i, { qty: Number(e.target.value) || 0 })} className={field} />
          </label>
          <label className="text-[14px]">
            Prezzo €
            <input inputMode="decimal" defaultValue={l.unitEur || ""} onChange={(e) => upd(i, { unitEur: Number(e.target.value.replace(",", ".")) || 0 })} className={field} />
          </label>
          <button type="button" aria-label={`Togli la riga ${i + 1}`} onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))} className={`${btn} border-2 border-verde-scuro/20 bg-bianco`}>
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={() => setLines((ls) => [...ls, { description: "", qty: 1, unitEur: 0 }])} className={`${btn} border-2 border-verde-scuro/20 bg-bianco`}>
        + Riga
      </button>
      <label className="block text-[14px]">
        Quando è pronta
        <input value={readyBy} onChange={(e) => setReadyBy(e.target.value)} placeholder="es. domani dopo le 15" className={field} />
      </label>
      <label className="block text-[14px]">
        Nota per il cliente (facoltativa)
        <input value={note} onChange={(e) => setNote(e.target.value)} className={field} />
      </label>
      <p className="text-[17px]">
        Totale: <b>{formatEuro(quoteTotalEur(q))}</b>
      </p>
      {tried && problems.length > 0 && (
        <ul role="alert" className="text-[15px] font-semibold text-[#9b2c1f]">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => {
          setTried(true);
          if (!problems.length) onSend(q);
        }}
        className={`${btn} bg-verde-scuro text-carta`}
      >
        Invia il preventivo
      </button>
    </div>
  );
}

/** Come lo vede il cliente (su WhatsApp e in MyMasera): approva o rifiuta con un tocco. */
function ClientPreview({ r, onAnswer }: { r: Req; onAnswer: (ok: boolean) => void }) {
  const q = r.quote!;
  return (
    <div className="mt-4 rounded-2xl border-2 border-mela bg-bianco p-4">
      <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-verde">Quello che vede il cliente</p>
      <b className="mt-1 block text-[18px]">Il tuo preventivo</b>
      <ul className="mt-2 space-y-1 text-[16px]">
        {q.lines.map((l, i) => (
          <li key={i}>{quoteLineLabel(l)}</li>
        ))}
      </ul>
      <p className="mt-2 text-[17px]">
        Totale <b>{formatEuro(quoteTotalEur(q))}</b> · pronta {q.readyBy}
      </p>
      {q.note && <p className="mt-1 text-[15px]">{q.note}</p>}
      <p className="mt-2 text-[15px] text-verde">{handoverNote(r.handover)}</p>
      {r.status === "preventivo" && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => onAnswer(true)} className={`${btn} bg-mela text-verde-scuro`}>
            Approvo
          </button>
          <button type="button" onClick={() => onAnswer(false)} className={`${btn} border-2 border-verde-scuro/20 bg-bianco`}>
            No, grazie
          </button>
        </div>
      )}
    </div>
  );
}

export function PrescriptionDesk() {
  const [reqs, setReqs] = useState(DEMO);
  const [open, setOpen] = useState<string | null>(null);
  const set = (id: string, p: Partial<Req>) => setReqs((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)));
  const next: Partial<Record<PrescriptionStatus, [PrescriptionStatus, string]>> = {
    approvata: ["in_preparazione", "In preparazione"],
    in_preparazione: ["pronta", "È pronta"],
    pronta: ["chiusa", "Ritirata o consegnata"],
  };

  return (
    <ul className="mt-6 space-y-3">
      {reqs.map((r) => (
        <li key={r.id} className="rounded-3xl border-2 border-verde-scuro/10 bg-bianco p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-verde">
                {PRESCRIPTION_STATUS[r.status]} · arrivata {r.received}
              </p>
              <b className="mt-1 block text-[19px]">{r.name}</b>
              <span className="block text-[15px]">
                {r.phone} · {r.source === "foto" ? "Foto della ricetta" : "Ricetta elettronica (NRE)"} · {r.handover === "consegna" ? "Consegna serale" : "Ritiro in farmacia"}
              </span>
            </div>
            {r.status === "inviata" && (
              <button type="button" onClick={() => setOpen(open === r.id ? null : r.id)} className={`${btn} bg-verde-scuro text-carta`}>
                {open === r.id ? "Chiudi" : "Valuta"}
              </button>
            )}
            {next[r.status] && (
              <button type="button" onClick={() => set(r.id, { status: next[r.status]![0] })} className={`${btn} bg-beige-chiaro`}>
                {next[r.status]![1]}
              </button>
            )}
          </div>
          {open === r.id && r.status === "inviata" && (
            <>
              <div aria-label="Foto della ricetta" className="mt-4 flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-verde-scuro/20 text-[15px] text-verde">
                {r.source === "foto" ? "Qui la foto della ricetta (prova)" : "Qui il codice NRE e il codice fiscale (prova)"}
              </div>
              <QuoteEditor
                onSend={(q) => {
                  set(r.id, { quote: q, status: "preventivo" });
                  setOpen(null);
                }}
              />
            </>
          )}
          {r.quote && <ClientPreview r={r} onAnswer={(ok) => set(r.id, { status: ok ? "approvata" : "rifiutata" })} />}
        </li>
      ))}
    </ul>
  );
}
