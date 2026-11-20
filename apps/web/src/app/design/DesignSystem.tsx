"use client";
import { useState, type ReactNode } from "react";
import type { OpenStatus } from "@masera/core";
import {
  AA,
  Button,
  Card,
  Chip,
  ColorBar,
  LogoArch,
  MotionToggle,
  OpenBadge,
  RiseTitle,
  colors,
  contrastRatio,
  motion,
  skinlab,
  textPairs,
  allColors,
  type AnyColorName,
  type ColorName,
} from "@masera/ui";

const colorLabels: Record<AnyColorName, string> = {
  tortora_1: "Tortora 1",
  tortora_2: "Tortora 2",
  tortora_3: "Tortora 3",
  tortora_4: "Tortora 4",
  verde_scuro: "Verde scuro",
  verde: "Verde",
  mela: "Mela",
  salvia: "Salvia",
  beige_chiaro: "Beige chiaro",
  beige_scuro: "Beige scuro",
  nero: "Nero",
  carta: "Carta",
  bianco: "Bianco",
};

const colorUse: Partial<Record<ColorName, string>> = {
  verde_scuro: "Testi, fondi pieni, header",
  verde: "Link, pulsanti secondari",
  mela: "Accento: CTA, aperto, progressi. Mai testo su bianco",
  salvia: "Fondi tenui, Farmaestetica",
  carta: "Fondo pagina",
};

const chips = ["Consegna", "Analisi", "Cuore", "Pelle", "Ricetta"];

// Orari di prova, in UTC (novembre = UTC+1): così si vedono tutti i casi senza aspettare.
const examples: [string, string][] = [
  ["Lunedì 10:00", "2026-11-16T09:00:00Z"],
  ["Sabato 13:00", "2026-11-21T12:00:00Z"],
  ["Sabato 20:00", "2026-11-21T19:00:00Z"],
  ["Domenica", "2026-11-22T10:00:00Z"],
];

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="border-t border-beige-chiaro py-12 md:py-16">
      <h2 id={`${id}-t`} className="fm-display text-[32px] leading-tight md:text-[40px]">
        {title}
      </h2>
      {intro && <p className="mt-2 max-w-2xl text-[17px] text-verde">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function DesignSystem({ initialOpen }: { initialOpen: OpenStatus }) {
  const [replay, setReplay] = useState(0);
  const [chip, setChip] = useState("Consegna");
  const cart = 40;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 md:px-8">
      {/* Testata */}
      <header key={replay} className="-mx-4 mb-4 bg-verde-scuro px-4 pb-12 pt-10 text-carta md:-mx-8 md:rounded-b-[40px] md:px-12 md:pt-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-6">
            <LogoArch className="w-36 text-salvia md:w-48" />
            <RiseTitle
              as="h1"
              className="text-[44px] leading-[1.02] md:text-[72px]"
              lines={["Medicina", "per tradizione.", <span key="1908" className="text-mela">Dal 1908.</span>]}
            />
            <p className="max-w-lg text-[17px] text-beige-chiaro">
              Componenti di base del nuovo sito. Si muovono con calma, mai per fare scena.
            </p>
          </div>
          <OpenBadge initial={initialOpen} className="self-start md:self-auto" />
        </div>
      </header>
      {/* Sul verde scuro il primo segmento sparirebbe: la barra sta sempre su fondo chiaro. */}
      <ColorBar key={`bar${replay}`} className="mb-2" />


      {/* Comandi */}
      <div className="z-10 -mx-4 md:sticky md:top-0 flex flex-wrap items-center gap-3 border-b border-beige-chiaro bg-carta/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <MotionToggle />
        <Button variant="secondario" onClick={() => setReplay((n) => n + 1)}>
          Rivedi le animazioni
        </Button>
      </div>

      <div key={`b${replay}`}>
        <Section id="colori" title="Colori" intro="Dall'immagine coordinata. Il verde mela si usa per superfici, icone e barre, mai per il testo piccolo.">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {(Object.keys(colors) as ColorName[]).map((c) => (
              <li key={c} className="overflow-hidden rounded-2xl border border-beige-chiaro bg-bianco">
                <div className="h-20" style={{ background: colors[c] }} />
                <div className="p-3 text-[15px]">
                  <b className="block">{colorLabels[c]}</b>
                  <span className="font-mono text-sm">{colors[c]}</span>
                  {colorUse[c] && <span className="mt-1 block text-sm text-verde">{colorUse[c]}</span>}
                </div>
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-lg font-semibold">Skin LAB · tortora</h3>
          <div className="mt-3 flex overflow-hidden rounded-2xl">
            {skinlab.map((c) => (
              <div key={c} className="h-14 flex-1" style={{ background: c }} title={c} />
            ))}
          </div>

          <h3 className="mt-10 text-lg font-semibold">Coppie testo / sfondo ammesse (controllate da un test automatico)</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {textPairs.map((p) => {
              const r = contrastRatio(allColors[p.fg], allColors[p.bg]);
              return (
                <li
                  key={`${p.fg}-${p.bg}`}
                  className="flex items-center justify-between gap-3 rounded-2xl p-4"
                  style={{ background: allColors[p.bg], color: allColors[p.fg] }}
                >
                  <span className={p.size === "large" ? "text-2xl font-bold" : "text-[15px]"}>
                    {colorLabels[p.fg]} su {colorLabels[p.bg].toLowerCase()}
                    <span className="block text-sm opacity-90">{p.where}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold">
                    {r.toFixed(1)}:1 {r >= AA[p.size] ? "✓ AA" : "✗"}
                  </span>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section id="tipografia" title="Tipografia" intro="Bodoni Moda corsivo per titoli e claim (mai sotto i 28 px), DM Sans per testi e interfaccia (16 px minimo).">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="fm-display text-[56px] leading-none">Quattro generazioni</p>
              <p className="fm-display mt-3 text-[28px]">Una sola missione: la tua salute.</p>
              <p className="mt-2 text-sm text-verde">Bodoni Moda, corsivo, grassetto · asse ottico 14</p>
            </div>
            <div className="space-y-3">
              <p className="text-[18px]">
                Testo lungo a 18 px. L&apos;ECG dura 30 minuti e costa 35 €. Prima dell&apos;esame depila il petto: altrimenti gli elettrodi non aderiscono.
              </p>
              <p className="text-base">Testo normale a 16 px, per l&apos;interfaccia.</p>
              <p className="text-sm text-verde">DM Sans</p>
            </div>
          </div>
        </Section>

        <Section id="pulsanti" title="Pulsanti" intro="Alti almeno 48 px. Con la tastiera il contorno è sempre visibile.">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="cta">Prenota un servizio</Button>
            <Button variant="primario">Vai allo shop</Button>
            <Button variant="secondario">Scopri di più</Button>
            <Button variant="testo" href="#pulsanti">
              Link testuale
            </Button>
            <Button variant="primario" disabled>
              Non disponibile
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-3xl bg-verde-scuro p-6">
            <Button variant="cta">Prenota un servizio</Button>
            <Button variant="primario" className="!bg-carta !text-verde-scuro">
              Su fondo scuro
            </Button>
          </div>
        </Section>

        <Section id="card" title="Card">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card tone="bianco">
              <p className="text-sm font-semibold uppercase tracking-wide text-verde">Cuore e pressione</p>
              <h3 className="fm-display mt-2 text-[28px]">Elettrocardiogramma</h3>
              <p className="mt-2">35 € · 30 minuti</p>
              <p className="mt-1 text-[15px] text-verde">Depila il petto prima dell&apos;esame.</p>
              <Button variant="cta" className="mt-5">
                Prenota
              </Button>
            </Card>
            <Card tone="scuro">
              <h3 className="fm-display text-[28px]">Seregno</h3>
              <p className="mt-2 text-beige-chiaro">Ordina entro le 16:00, ricevi verso le 19:00. Consegna sempre gratuita.</p>
            </Card>
            <Card tone="salvia">
              <h3 className="fm-display text-[28px]">Farmaestetica</h3>
              <p className="mt-2">by Dottor Masera · Piano 1</p>
            </Card>
            <Card tone="carta">
              <h3 className="fm-display text-[28px]">Tutta Italia</h3>
              <p className="mt-2">2–3 giorni lavorativi. Spedizione gratuita sopra 59 €.</p>
            </Card>
            <Card tone="beige">
              <h3 className="fm-display text-[28px]">Laboratorio galenico</h3>
              <p className="mt-2">Preparazioni officinali e magistrali.</p>
            </Card>
          </div>
        </Section>

        <Section id="chip" title="Chip" intro="Di cosa hai bisogno oggi? Un tocco cambia la scelta.">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Di cosa hai bisogno oggi?">
            {chips.map((c) => (
              <Chip key={c} selected={chip === c} onClick={() => setChip(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <p className="mt-4 text-[15px] text-verde" aria-live="polite">
            Hai scelto: <b>{chip}</b>
          </p>
        </Section>

        <Section id="barra" title="Barra a 5 colori" intro="A piè di sezione, e come indicatore di ogni progresso. Si riempie da sinistra.">
          <ColorBar />
          <div className="mt-8 max-w-md rounded-3xl bg-bianco p-6">
            <p className="text-[17px]">
              Ti mancano <b>{59 - cart} €</b> alla spedizione gratuita
            </p>
            <ColorBar className="mt-3" height={12} progress={cart / 59} label="Avanzamento verso la spedizione gratuita" />
          </div>
        </Section>

        <Section id="arco" title="L'arco" intro="Gli archi del logo si disegnano all'ingresso della pagina. Disegno provvisorio, in attesa del logo vettoriale.">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex h-48 items-end justify-center rounded-3xl bg-verde-scuro p-6 text-salvia">
              <LogoArch className="w-48" />
            </div>
            <div className="flex h-48 items-end justify-center rounded-3xl bg-salvia p-6 text-verde-scuro">
              <LogoArch className="w-48" />
            </div>
            <div className="flex h-48 items-end justify-center rounded-3xl bg-bianco p-6 text-beige-scuro">
              <LogoArch className="w-48" />
            </div>
          </div>
        </Section>

        <Section id="risalita" title="La risalita" intro="I titoli salgono una riga alla volta, a 150 ms di distanza. Il testo normale compare tutto insieme.">
          <RiseTitle className="text-[40px] leading-[1.05] md:text-[56px]" lines={["Accesso in ZTL.", "Parcheggi davanti.", "Tutto qui."]} />
        </Section>

        <Section id="aperto" title="Aperto ora" intro="Calcolato dagli orari in data/farmacia.json, sempre in ora italiana. Solo i dati in tempo reale «respirano». Turni e festivi arriveranno con l'Agenda.">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
              <span className="w-36 text-[15px] font-semibold">Adesso</span>
              <OpenBadge initial={initialOpen} className="self-start md:self-auto" />
            </div>
            {examples.map(([label, iso]) => (
              <div key={iso} className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                <span className="w-36 text-[15px]">{label}</span>
                <OpenBadge now={new Date(iso)} />
              </div>
            ))}
          </div>
        </Section>

        <Section id="movimento" title="Movimento" intro="Si muove con calma. Mai per fare scena.">
          <dl className="grid gap-3 sm:grid-cols-3">
            {[
              ["Veloce", `${motion.fast} ms`, "tocchi, pulsanti"],
              ["Base", `${motion.base} ms`, "schede, liste"],
              ["Lenta", `${motion.slow} ms`, "ingressi di pagina"],
            ].map(([n, v, d]) => (
              <div key={n} className="rounded-2xl bg-bianco p-4">
                <dt className="font-semibold">
                  {n} · {v}
                </dt>
                <dd className="text-[15px] text-verde">{d}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[15px] text-verde">
            Curva: <code>{motion.easeOut}</code> · Con «Riduci movimento» tutto resta fermo e già al suo posto.
          </p>
        </Section>
      </div>
    </main>
  );
}
