"use client";
import { useState } from "react";
import { formatEuro, localNow, parseCatalog, planSync, priceToday, promoPrice, summarizeSync, type ParsedCatalog } from "@masera/core";

const FIELD_NAMES: Record<string, string> = {
  ean: "EAN", minsan: "Minsan", name: "descrizione", brand: "ditta", department: "reparto", type: "tipo prodotto",
  price: "prezzo", promoPrice: "prezzo promo", promoFrom: "inizio promo", promoTo: "fine promo", vat: "IVA", stock: "giacenza",
};

/** Il file Farmaconsult è spesso in Windows-1252: se in UTF-8 escono caratteri rotti, si rilegge così. */
async function readText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const utf8 = new TextDecoder("utf-8").decode(buf);
  return utf8.includes("�") ? new TextDecoder("windows-1252").decode(buf) : utf8;
}

export function CatalogCheck() {
  const [name, setName] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedCatalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const today = localNow(new Date()).date;

  async function onFile(f: File | undefined) {
    setError(null);
    setParsed(null);
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) {
      setError("Il file è più grande di 50 MB: esporta solo il parafarmaco o mandamelo diviso.");
      return;
    }
    if (/\.(xlsx?|ods)$/i.test(f.name)) {
      setError("Questo è un file Excel: per la prova salvalo come CSV (Salva con nome → CSV). Il formato definitivo lo decidiamo con Farmaconsult.");
      return;
    }
    setName(f.name);
    try {
      setParsed(parseCatalog(await readText(f)));
    } catch (e) {
      console.error(e);
      setError("Non riesco a leggere il file. Mandamelo e lo guardo io.");
    }
  }

  const summary = parsed ? summarizeSync(parsed, planSync(parsed, [], today)) : null;
  const promos = parsed ? parsed.sellable.filter((p) => priceToday(p, today).compareAtPrice !== null) : [];

  return (
    <div className="mt-8 space-y-8">
      <label className="block rounded-3xl border-2 border-dashed border-verde-scuro/30 bg-bianco p-6">
        <span className="block text-[17px] font-semibold">File del catalogo (CSV)</span>
        <input type="file" accept=".csv,.txt,.tsv,text/csv,text/plain,.xls,.xlsx" onChange={(e) => onFile(e.target.files?.[0])} className="fm-focus mt-3 block w-full text-[16px]" />
        {name && <span className="mt-2 block text-[14px] text-verde">Letto: {name}</span>}
      </label>

      {error && (
        <p role="alert" className="text-[16px] font-semibold text-[#9b2c1f]">
          {error}
        </p>
      )}

      {parsed && summary && (
        <div aria-live="polite" className="space-y-8">
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Andrebbero nello shop", summary.inVendita],
              ["Farmaci esclusi", summary.farmaciEsclusi],
              ["Tipo sconosciuto (esclusi)", summary.tipoSconosciuto],
              ["Righe con problemi", summary.problemi],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-beige-chiaro/60 p-4">
                <dt className="text-[14px] text-verde">{k}</dt>
                <dd className="text-[28px] font-bold">{v}</dd>
              </div>
            ))}
          </dl>

          {parsed.missingColumns.length > 0 && (
            <p className="text-[15px]">
              Colonne non trovate: {parsed.missingColumns.map((c) => FIELD_NAMES[c]).join(", ")}. Se nel file ci sono con un altro nome, dimmelo e le aggiungo.
            </p>
          )}

          {parsed.excluded.some((e) => e.reason === "tipo_sconosciuto") && (
            <section>
              <h2 className="text-[20px] font-bold">Tipi sconosciuti (per ora restano fuori)</h2>
              <p className="mt-1 text-[15px]">Dimmi quali di questi tipi sono parafarmaco e li aggiungo.</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {[...new Set(parsed.excluded.filter((e) => e.reason === "tipo_sconosciuto").map((e) => e.type || "(vuoto)"))].slice(0, 40).map((t) => (
                  <li key={t} className="rounded-full bg-bianco px-3 py-1 text-[14px] font-semibold">
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {parsed.issues.length > 0 && (
            <section>
              <h2 className="text-[20px] font-bold">Righe da controllare</h2>
              <ul className="mt-2 space-y-1 text-[15px]">
                {parsed.issues.slice(0, 50).map((i) => (
                  <li key={`${i.line}-${i.problem}`}>
                    Riga {i.line}
                    {i.ean ? ` (EAN ${i.ean})` : ""}: {i.problem}
                  </li>
                ))}
                {parsed.issues.length > 50 && <li>… e altre {parsed.issues.length - 50}.</li>}
              </ul>
            </section>
          )}

          {promos.length > 0 && (
            <section>
              <h2 className="text-[20px] font-bold">Promo attive oggi</h2>
              <ul className="mt-2 space-y-1 text-[15px]">
                {promos.slice(0, 20).map((p) => {
                  const pp = promoPrice(p.price, p.promo!.price)!;
                  return (
                    <li key={p.ean}>
                      {p.name}: <s>{pp.full}</s> <b>{pp.price}</b> ({pp.label})
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-[20px] font-bold">I primi prodotti</h2>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[15px]">
                <thead>
                  <tr className="border-b-2 border-verde-scuro/20">
                    <th className="py-2 pr-3">EAN</th>
                    <th className="py-2 pr-3">Prodotto</th>
                    <th className="py-2 pr-3">Tipo</th>
                    <th className="py-2 pr-3">Prezzo</th>
                    <th className="py-2">Giacenza</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.sellable.slice(0, 30).map((p) => (
                    <tr key={p.ean} className="border-b border-verde-scuro/10">
                      <td className="py-2 pr-3 font-mono">{p.ean}</td>
                      <td className="py-2 pr-3">{p.name}</td>
                      <td className="py-2 pr-3">{p.type}</td>
                      <td className="py-2 pr-3">{formatEuro(p.price)}</td>
                      <td className="py-2">{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
