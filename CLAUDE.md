# CLAUDE.md — Farmacia Masera, nuovo ecosistema digitale

Leggi sempre `docs/BRIEF.md` prima di iniziare un compito nuovo. È la fonte di verità.

## Chi è il cliente
Giovanni Masera, farmacista (quarta generazione) della Farmacia Masera di Seregno. Non è uno sviluppatore: spiega le cose in modo semplice, breve, in italiano. Prima di scelte irreversibili (dominio, DNS, dati reali, pagamenti, invii WhatsApp) chiedi conferma.

## Regole fisse
- Testi in **italiano**, semplici e diretti. Fatti concreti (prezzo, durata, cosa portare), mai frasi vaghe.
- **"Farmaestetica by Dottor Masera"**, mai "by Farmacia Masera".
- **Seregno**: consegna in giornata **gratuita** (ordine entro 16:00, consegna ~19:00, pagamento alla consegna) e **invio della ricetta** (solo Seregno, per legge).
- **Resto d'Italia**: 2–3 giorni lavorativi, **gratis sopra 59 €**. Niente ricette.
- **Niente farmaci** nello shop al lancio. Nessuna proprietà terapeutica non autorizzata.
- Obiettivo: **consigliare il prodotto giusto al momento giusto**. Mai guerra di prezzo, mai urgenza finta.
- Promo: prezzo barrato **sempre con la percentuale di sconto**.
- Assistenti AI: niente diagnosi né dosaggi; segnali d'allarme → medico/112; chiudono offrendo la farmacista.
- Non nominare mai fornitori software del deblistering (in particolare Carepy).
- ZTL: niente riferimenti ai parcheggi a pagamento.
- Dati sanitari solo su server UE. Nessuna chiave o segreto nel codice.
- Se un dato non c'è nel brief (prezzo, testo legale, numero), **non inventarlo**: segnaposto `[DA CONFERMARE]` e chiedi.

## Identità
Colori: `#2E3F2D` verde scuro · `#425D3A` verde · `#A3BE19` mela (mai testo piccolo su bianco) · `#9AB9AD` salvia · `#D6D2C4` beige chiaro · `#B7A999` beige scuro · `#1D1D1B` nero · `#F4F1E8` carta.
Font: Bodoni Moda corsivo (titoli, opsz 11–14) + DM Sans (testi), serviti con `next/font`.
Firma grafica: archi "a fontana" del logo, barra a 5 colori. Contrasto WCAG AA obbligatorio.

## Motion
200 / 450 / 900 ms · curva `cubic-bezier(.2,.8,.2,1)` · titoli che salgono riga per riga (150 ms) · solo i dati in tempo reale si muovono da soli · `prefers-reduced-motion` = tutto fermo. Solo `transform`, `opacity`, `stroke-dashoffset`.

## Stack
pnpm + Turborepo · `apps/web` Next.js (App Router, TS) su Vercel `fra1` · Tailwind · Motion · Supabase UE (Postgres, Auth OTP telefono, Storage, RLS) · Sanity (contenuti) · Shopify headless (Storefront + Admin API) · WhatsApp Business API · Resend · Claude API · `apps/mobile` Expo (fase 4).

## Come lavorare
- Una funzione alla volta, su un branch, con anteprima Vercel. Commit piccoli e descrittivi.
- Test per la logica: regole di consegna, disponibilità agenda, stima fine prodotto, contrasto.
- Ogni pagina provata a 390 px e 1440 px.
- I file in `design/canvas/*.dc.html` sono **riferimenti visivi** del canvas di Claude Design: ricostruiscili in React, non copiarli.
- I dati iniziali sono in `data/*.json`: usali come seed, non riscriverli a mano nel codice.
- Alla fine di ogni sessione aggiorna `docs/STATO.md`: cosa è fatto, cosa manca, cosa serve da Giovanni.
