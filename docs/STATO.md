# Stato dei lavori

Aggiornato da Claude Code a fine di ogni sessione.

## Fatto

### Progettazione (in chat)
- Documento di progetto e brief completo (`docs/BRIEF.md`).
- Concept visivo e motion nel canvas di Claude Design (`design/canvas/`).
- Mappa ZTL reale animata, già online sul sito attuale.
- Sito attuale migliorato (listino prezzi, La Farmacia, linea del tempo, descrizioni Google, contrasto).

### Fase 0 – Fondamenta (sessione del 14/11/2026)
- Progetto in `C:\Users\giova\Projects\masera-digitale` (fuori da OneDrive), con git.
- Monorepo pnpm + Turborepo: `apps/web` (Next.js 16, TypeScript, Tailwind 4), `packages/ui`, `packages/core`, `packages/config`.
- Loghi PNG originali in `assets/logo/`, PDF dell'immagine coordinata in `docs/riferimenti/`.
- **Token** di colore e movimento letti da `data/farmacia.json` (`pnpm tokens` rigenera `packages/ui/src/tokens.css`).
- **Font** Bodoni Moda corsivo (asse ottico 14) e DM Sans con `next/font`: serviti dal nostro sito, nessuna richiesta a Google dal browser.
- **Componenti**: pulsante (4 varianti, ≥ 48 px), card (5 toni), chip, barra a 5 colori (anche come indicatore di avanzamento),
  arco del logo che si disegna, titolo che sale riga per riga, badge "Aperto ora" (ora italiana, aggiornato ogni minuto).
- **Pagina `/design`** con tutti i componenti, le coppie di colori ammesse e un interruttore "Riduci movimento" per provarlo.
- **Riduci movimento**: con la preferenza del dispositivo (o l'interruttore) tutto resta fermo e già al suo posto. Verificato nel browser.
- **Test automatici** (`pnpm test`): 17 sul contrasto WCAG AA e sull'allineamento dei token, 10 su "Aperto ora"
  (pausa del sabato, domenica, ora legale, orari scritti male nel JSON).
- **Nascosto a Google**: `X-Robots-Tag: noindex`, meta robots e `robots.txt` bloccano tutto finché `SITE_INDEXABLE` non vale `true`.
- Regione Vercel `fra1` in `apps/web/vercel.json`. Istruzioni passo passo in `docs/VERCEL.md`.
- Provato a 390 px e 1440 px.

- **Online su Vercel** (14/11/2026): https://masera-digitale.vercel.app, codice su GitHub `giovannimasera00-bit/masera-digitale`.
  Verificato: risponde da `fra1` (Francoforte), `noindex` attivo, `robots.txt` blocca tutto,
  Vercel Authentication (Standard Protection) attiva sulle anteprime. Piano Hobby: l'indirizzo principale è raggiungibile da chi ha il link.

### Fase 1a – Homepage (branch `fase1/homepage`, in revisione)
- Anteprima: https://masera-digitale-git-fase1-homepage-giovanni-7bbb.vercel.app (serve l'accesso Vercel).
- Sezioni come BRIEF §6: barra di stato, testata con menu (anche da telefono), hero con archi, "Di cosa hai bisogno oggi?",
  4 azioni rapide, Seregno / Tutta Italia, striscia servizi (con pulsante "Ferma"), reparti a schede, ZTL, robot,
  ieri/oggi, MyMasera, footer con orari, indirizzo, spedizioni, ragione sociale. Dati strutturati `Pharmacy` per Google.
- Prezzi, durate, orari e regole di consegna arrivano da `data/*.json`; i testi stanno in `apps/web/src/content/home.ts` (poi su Sanity).
- Nuova logica in `packages/core` con test: consegna Seregno (entro le 16, sabato sì, domenica no), zona dal CAP,
  soglia 59 €, prezzi e orari formattati. Totale test: 47.
- Card "Consegna": il conto alla rovescia compare solo nelle ultime 4 ore prima delle 16 (informazione vera, non urgenza finta).
- Provata a 390 px e 1440 px, nessuno scorrimento laterale, "riduci movimento" ferma tutto (anche la striscia e il furgone).
- Foto: ieri/oggi ritagliate dalla grafica della home attuale, robot da `design/robot/IMG_8685.jpg` (`node scripts/prepare-images.mjs`).

### Da decidere sulla homepage
- **Shop e MyMasera non esisteranno ancora al giorno dello switch** (arrivano in Fase 2), ma la homepage li promuove
  ("Vai allo shop", consegne, "La farmacia in tasca"). Al lancio della Fase 1: nasconderli, oppure mostrarli come "in arrivo"?
- Testo barra di stato: proposto "Accesso in ZTL per i clienti" (il brief dice "Accesso libero in ZTL").
- Marchi della veterinaria: `[DA CONFERMARE]` visibile nella scheda Reparti.
- La mappa ZTL in home è **statica** per ora: quella animata arriva con la pagina `/ztl`.
- Il canvas indicava 10 minuti per l'analisi della pelle: ho usato 15 minuti e 25 € come da brief e `servizi.json`.
- I link a pagine non ancora fatte (servizi, prenota, ztl, robot, famiglia, legali…) per ora portano a "pagina non trovata".

## Manca per chiudere la Fase 0
- Collegare Supabase (Francoforte) e Sanity: proposto di farlo all'inizio della Fase 1, quando servono.
- Piano Vercel Pro (password e dominio `nuovo.farmaciamasera.com`) prima di condividere i link fuori dalla farmacia.

## Scelte provvisorie (da confermare)
- L'**arco** è ridisegnato a mano (3 archi annidati, come nel canvas): da sostituire con i tracciati del logo vettoriale.
- La **barra a 5 colori** si usa solo su fondi chiari: sul verde scuro il primo segmento sparirebbe.
- "Aperto ora" conosce solo gli orari settimanali: **turni, festivi e chiusure** arriveranno con Agenda Masera.
- Il verde chiaro `#C9DB6A` del canvas Motion **non** è tra i token: in attesa di conferma.

## Serve da Giovanni
- Ok o correzioni sulla homepage (anteprima sopra), poi "unisci" per portarla su main.
- Logo in formato vettoriale (SVG, AI o PDF vettoriale) per l'arco animato.
- Risposte: verde chiaro `#C9DB6A` sì/no; testo della barra di stato "Accesso libero in ZTL" → "Accesso in ZTL per i clienti";
  timeline 2026 "cinque postazioni al banco" o "banco nuovo"; piano Vercel Pro prima di condividere i link.
- Decisioni aperte del `docs/BRIEF.md`, paragrafo 21.

## Come provare in locale
```
pnpm install
pnpm test
pnpm dev        # poi apri http://localhost:3000/design
```
