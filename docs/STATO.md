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

### Fase 1a – Homepage (unita in main il 14/11/2026, online su https://masera-digitale.vercel.app)
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

- **Funzioni "in arrivo"** (decisione di Giovanni, 14/11/2026): shop, MyMasera, Invia una ricetta (Fase 2) e
  videoconsulenza (Fase 3) compaiono con l'etichetta "in arrivo" e **nessun link**. Interruttori in
  `apps/web/src/content/home.ts` → `features`: quando una funzione è pronta si mette `true` e tornano i pulsanti.
  Verificato: nella homepage non c'è nessun link a `/shop`, `/my`, `/ricetta`, `/linee`.

### Da decidere sulla homepage
- Testo barra di stato: proposto "Accesso in ZTL per i clienti" (il brief dice "Accesso libero in ZTL").
- Marchi della veterinaria: `[DA CONFERMARE]` visibile nella scheda Reparti.
- Il canvas indicava 10 minuti per l'analisi della pelle: ho usato 15 minuti e 25 € come da brief e `servizi.json`.
- I link a pagine non ancora fatte (servizi, prenota, ztl, robot, famiglia, legali…) per ora portano a "pagina non trovata".

### Fase 1a – Servizi e prezzi (unita in main il 14/11/2026, online su https://masera-digitale.vercel.app/servizi)
- `/servizi`: 6 gruppi per bisogno (navigazione a pillole), per ogni servizio nome, descrizione breve, "Come prepararti",
  prezzo, durata e pulsante Prenota. Riquadro "Come prenotare", "Prezzi aggiornati a novembre 2026", sezione "Anche in farmacia".
- `/servizi/[slug]`: una scheda per ognuno dei 21 servizi del listino, con prezzo, durata, dove, preparazione, note,
  riquadro Prenota (online + WhatsApp), altri servizi dello stesso gruppo. Indirizzi sbagliati → pagina non trovata.
- Dati strutturati per Google: `Service` con prezzo su ogni scheda, `BreadcrumbList` sulle due pagine.
- Layout comune (barra in alto, menu, piè di pagina) spostato in `app/(sito)/layout.tsx`: vale per tutte le pagine nuove.
- `data/servizi.json`: aggiunte le **descrizioni brevi già pubblicate** sul listino del sito attuale; nota dell'ECG riscritta
  senza sigle ("ricetta del medico di base" invece di "MMG"), stesso contenuto. Durate oltre le 2 ore mostrate come "circa 4 ore".
- 7 nuovi test sui dati dei servizi (slug unici, gruppi esistenti, durate del brief, "depila il petto" per ECG e Holter). Totale: 54.
- Provate a 390 px e 1440 px, nessuno scorrimento laterale.

### Da decidere su Servizi
- Preparazioni ancora `[DA CONFERMARE]` e visibili: profilo lipidico, funzionalità renale, profilo completo (digiuno 8 ore),
  coagulazione, breath test (testo della dieta), profilo allergie, Food Recaller, PerMè Recaller, cuoio capelluto.
- Prezzo dell'analisi del cuoio capelluto: `[DA CONFERMARE]`.
- Test Natrix: manca l'elenco, per ora "te li spieghiamo al banco o su WhatsApp".
- I pulsanti **Prenota** portano a `/prenota?servizio=…`: la pagina arriva con Agenda Masera (prossimo pezzo della Fase 1).
- Vaccini e tampone COVID: esclusi finché non decidi (domande aperte in `servizi.json`).

### Fase 1a – ZTL (unita in main il 15/11/2026, online su https://masera-digitale.vercel.app/ztl)
- Componente `<ZtlMap />` (`apps/web/src/components/ztl/`): geometria reale del prototipo `design/canvas/ZtlMap.dc.html`
  (generata con `node scripts/build-ztl-map.mjs`). L'auto arriva da via Cairoli, passa il varco (al 51% del percorso, tratteggio
  sincronizzato), entra nello stallo riservato, parte il timer 30', compare la targa, "Tutto qui.". **Si gioca una volta** quando
  entra in vista, poi resta ferma sullo stato finale; pulsante "Rivedi il percorso". Con "riduci movimento" mostra subito lo stato finale.
- Usata in `/ztl` e in homepage (al posto della mappa statica, eliminata).
- `/ztl`: testi ripresi dalla pagina ZTL già pubblicata: 3 passi, "Tutto qui." (nessuna registrazione, nessun modulo, nessun costo),
  "In breve" con 0 € · 30' · 1, domande frequenti (con dati strutturati `FAQPage`), indirizzo, Google Maps, WhatsApp, orari.
- Pillola sul varco: "ACCESSO CLIENTI" (il prototipo diceva "ACCESSO LIBERO"), coerente con la barra in alto.
- Nuovo test sulle **regole fisse nei testi** (dati e sito): mai "Carepy", mai "Farmaestetica by Farmacia Masera",
  nessun parcheggio a pagamento, niente "sconti pazzi". Totale test: 59.
- Provata a 390 px e 1440 px; al telefono le scritte dentro la mappa sono piccole, ma i 3 passi sono scritti sotto in grande.

### Fase 1a – La farmacia e la famiglia (unite in main il 21/11/2026, online su https://masera-digitale.vercel.app/la-farmacia e /famiglia)
- `/famiglia`: "Quattro generazioni, una sola missione: la tua salute.", 4 schede delle generazioni (testi della pagina ponte già
  pubblicata) con riquadro **"Foto in arrivo"**, linea del tempo 1908 → 2026 con i testi ufficiali del BRIEF §3.
- `/la-farmacia`: "Più spazio, più servizi, più tempo per te.", foto del nuovo banco, "Cosa trovi di nuovo" (1 robot, 5 postazioni,
  2 cabine, 1 banco cosmesi), foto di scivoli e caricatore, mappa ZTL, rimando alla famiglia, indirizzo e orari.
- `data/farmacia.json`: linea del tempo con titolo e testo ufficiale, nuove `generations`. Per il 2026 uso "cinque postazioni al banco"
  (come nella pagina ponte già pubblicata) invece di "banco nuovo".
- Componenti nuovi riusabili: `Reveal` (contenuto che sale una volta) e `VisitInfo` (indirizzo, Google Maps, WhatsApp, orari).
- Homepage: il testo alternativo della foto d'epoca non dice più chi è (era una mia supposizione).
- Test regole: ora blocca anche la data della reinaugurazione ("21 novembre 2026"). Totale test: 60.

### Da decidere su farmacia e famiglia
- **Data della reinaugurazione**: nella pagina ponte c'è "sabato 21 novembre 2026"; nel nuovo sito non è pubblicata (brief §7.5).
- ~~Telefono 0362 231660~~: risolto, è di Farmaestetica (`data/farmaestetica.json`); per la farmacia solo WhatsApp.
- **Foto della famiglia** (4 generazioni) e chi è nella foto d'epoca del laboratorio.
- La foto del banco mostra due persone del personale: va bene pubblicarla? (consenso)
- Locker esterno (brief §3): non l'ho citato finché non mi confermi che è attivo.

### Fase 1a – Il robot (unito in main il 21/11/2026, online su https://masera-digitale.vercel.app/robot)
- "Dietro il banco c'è un robot.": 4 numeri (5,72 m, 3,90 m, 3 scivoli, ripiani in vetro) che salgono uno alla volta.
- **Schema animato** (da `design/canvas/Robot.dc.html`): la confezione rossa fa caricatore → scaffali → braccio → nastro →
  scivolo → banco **una volta** quando entra in vista, con "Rivedi". Con "riduci movimento": confezione già al banco.
- **5 tappe** a schede (anche con le frecce della tastiera): foto, testo semplice, Indietro/Avanti; la parte scelta si illumina nello schema.
- "Perché un robot?" (più tempo della farmacista con te), galleria "Da vicino" (tramoggia, ripiani, pannello, porta in vetro).
- **"Per gli appassionati"**: scheda tecnica apribile (modello, manipolatore V5, dimensioni, ripiani RAL 9016, carico, 145 mm,
  nastro con deviatori, 3 scivoli a 93 cm, in servizio dal 21 settembre 2026). Tutto da `data/farmacia.json`.
- Foto da `design/robot/` (9 nuove, `node scripts/prepare-images.mjs`).

### Da decidere sul robot
- **Numeri dal costruttore**: confezioni gestite e secondi per un prelievo, oggi `[DA CONFERMARE]` nella scheda tecnica.
- Testo "Perché un robot?": l'ho scritto io partendo dal brief ("libera tempo al banco"), da rileggere.
- Foto della tappa "Il nastro": è la parte alta con gli scivoli, se hai una foto del nastro vero la sostituisco.

### Fase 1a – Skin LAB (unita in main il 21/11/2026, online su https://masera-digitale.vercel.app/skinlab)
- Colori tortora di Skin LAB (`#B7A999 #8C7D6C #6E6153 #3A332B`) aggiunti ai token come `tortora-1…4`, con 6 nuove coppie
  nel test del contrasto (tutte AA). Marchio "Skin" Bodoni corsivo + "LAB" sans light, "by Farmacia Masera".
- Hero "Prima guardiamo la tua pelle. Poi scegliamo insieme." con **report di esempio animato** (scansione del viso 2 volte,
  barre che si riempiono, una volta) — valori descrittivi ("Da migliorare", "Buona"…), dichiarato come esempio.
- "Come funziona" in 3 passi (analisi → routine → riordino), schede **Viso / Cuoio capelluto** con durata, prezzo, preparazione, Prenota.
- "La tua routine, nel telefono": SkinLab Routine segnata **in arrivo** (Fase 3).
- **Ponte con Farmaestetica**: Hydrashine 70 € e Purity Skin 55 € (circa 50 min) dalla Miamo Lounge, da `data/miamo-lounge.json`.
- Marchi delle routine dal brief (Miamo, SkinCeuticals, La Roche-Posay, Caudalie, Dolomia, Bakel, Farmacisti Preparatori, Ceramol, Dercos, Triunico).

### Da decidere su Skin LAB
- Prezzo dell'analisi del cuoio capelluto: `[DA CONFERMARE]` (visibile nella scheda).
- Strumento per il cuoio capelluto: il prototipo dice "microcamera", confermi?
- Il prototipo aveva anche **Lovren** tra i marchi e non aveva Dercos: ho seguito l'elenco del brief.
- Le frasi "per la pelle che ha bisogno di idratazione / grassa o con imperfezioni" su Hydrashine e Purity Skin sono mie: da rileggere.

### Fase 1a – Farmaestetica (unita in main il 24/11/2026, online su https://masera-digitale.vercel.app/farmaestetica)
- Hero salvia con "FARMA ESTETICA · by Dottor Masera" come il cartello, "La bellezza, un piano sopra la farmacia.",
  riquadro **PIANO 1** (ingresso da via Garibaldi 103 o via Ballerini 10) con "Aperto ora" calcolato sugli orari di Farmaestetica.
- **Listino completo** a schede (Viso · Corpo · Laser · Cera e mani-piedi · Miamo Lounge) da `data/farmaestetica.json` e
  `data/miamo-lounge.json`: durate Farmaestetica come "circa", pacchetti 5+1 sul Corpo, + per prenotare ogni trattamento.
- Buono regalo online **in arrivo**; orari e contatti di Farmaestetica (telefono 0362 231660, WhatsApp 366 199 2302, Instagram).
- `packages/core/src/farmaestetica.ts` + 7 test: prezzi e durate presenti, **pacchetto 5+1 = 5 sedute**, ordine delle schede,
  identificativi unici per la prenotazione, orari e "Aperto ora" di Farmaestetica. Totale test: 73.
- Il telefono 0362 231660 è di Farmaestetica (lo dice `data/farmaestetica.json`): la pagina ponte lo mostrava come numero della farmacia.

### Da decidere su Farmaestetica
- **Blu Miamo** per le schede della Miamo Lounge (brief §4): mi serve il codice colore ufficiale; per ora stesse schede del resto.
- Logo Farmaestetica in file (per ora il nome è scritto in testo come sul cartello).
- Foto della cabina e della Miamo Lounge.

### Fase 1a – Galenico e deblistering (unite in main il 24/11/2026)
- **/galenico**: foto d'epoca del laboratorio, preparazioni **officinali** (senza ricetta, con il Gel all'Arnica) e **magistrali**
  (su prescrizione) secondo il brief §11, i 4 passaggi (ricetta originale → preventivo → in preparazione → pronta),
  "Invia la ricetta" **in arrivo**, WhatsApp per le domande.
- **/deblistering**: 1 € al giorno, 28 € al mese (4 settimane), "meno di un caffè"; striscia di 7 bustine animata; 4 passi
  (verifica terapia → medico → bustine con doppio controllo → ritiro); **calcolatrice** periodo × persone; sezioni per chi prende
  tante pastiglie, caregiver, RSA e comunità; prenotazione della chiacchierata gratuita (15 min). Nessun nome di fornitore.
- `packages/core/src/deblistering.ts` + 5 test (prezzi dal file, 4 settimane = 28 €, calcolo, valori non validi). Totale test: 78.

### Fase 1a – Contatti e pagine legali (unite in main il 24/11/2026)
- **/contatti**: "aperto ora", canali (WhatsApp, Instagram; telefono ed email compaiono da soli quando sono inseriti in `data/farmacia.json`),
  orari, indirizzo con Google Maps, mappa ZTL con i 3 passi, rimando ai contatti di Farmaestetica.
- **Pagine legali** con impaginazione comune (`LegalPage`): privacy, cookie, note legali (dati della farmacia), accessibilità.
  Testi chiari ma **da far rileggere a un consulente** prima del lancio; i dati mancanti sono segnati `[DA INSERIRE]` / `[DA CONFERMARE]`.
- Cookie: verificato che il sito non imposta cookie, quindi niente banner per ora. "Termini di vendita" comparirà con lo shop.
- Nuovi campi in `data/farmacia.json`: pec, phone, email, director, professional_order. +3 test (totale 81).
- Famiglia: tolta la voce 1963 (Farmacia Santa Valeria) dalla linea del tempo, su richiesta di Giovanni.

### Da decidere su galenico e deblistering
- **Tempi** della galenica (in quanto è pronta di solito) e come avvisiamo: per ora la pagina dice solo "ti avvisiamo".
- Deblistering: si può anche **consegnare a casa** o solo ritiro? Per ora solo ritiro, come nel brief.
- RSA e comunità: per ora "le condizioni le definiamo insieme", senza prezzi.
- Foto attuale del laboratorio galenico, se c'è.

### Fase 1b – Agenda Masera, tappa 1: orari liberi e /prenota (unita in main il 24/11/2026)
- Piano in 4 tappe: (1) calcolo orari + pagina /prenota con dati di prova; (2) database Supabase a Francoforte,
  blocco anti-doppione e posto tenuto 5 minuti; (3) /staff/agenda per il personale; (4) promemoria e conferme.
- `packages/core/src/agenda.ts`: orari liberi nell'ora di Seregno (dentro gli orari, ogni 15 minuti, l'appuntamento
  finisce entro la chiusura, pulizia 5' dopo ogni appuntamento, chiusure intere o a fasce, in giornata 1 ora di preavviso,
  14 giorni avanti), giorni e date in italiano, cellulare italiano. +14 test (totale 95).
- **/prenota** come il canvas: bisogno → servizio → giorno → orario → nome, cellulare, presa visione privacy → "Ti aspettiamo."
  con le istruzioni di preparazione. `?servizio=slug` preseleziona (es. dal deblistering). Barra di riepilogo fissa in basso.
- **Prova**: orari occupati finti e prenotazione non salvata (`AGENDA_DEMO` in `content/prenota.ts`), con avviso in pagina.
- Prenotabili online oggi: servizi di cabina analisi e Skin LAB. Videoconsulenza e Farmaestetica arriveranno dopo.

### Fase 1b – Agenda Masera, tappa 2: database (unita in main il 24/11/2026, attiva anche su masera-digitale.vercel.app)
- **Supabase**: progetto `masera-digitale` in **eu-central-1 (Francoforte)**, piano gratuito. (Nella stessa organizzazione c'è un vecchio
  progetto vuoto a Londra, eu-west-2: non usato, Giovanni può cancellarlo.)
- Tabelle create con `supabase/migrations/0001_agenda.sql` (eseguito nel SQL Editor il 24/11/2026): `appointments`, `closures`,
  vista `agenda_busy` (solo orari, niente dati dei clienti), funzioni `hold_slot` / `confirm_hold` / `release_hold`.
  RLS attiva senza policy: dal browser non si legge né si scrive niente, tutto passa dal server del sito.
- **Anti-doppione nel database**: vincolo di esclusione su risorsa + [inizio, fine della pulizia). Provato: secondo ECG alle 10:00 rifiutato,
  10:30 (durante la pulizia) rifiutato, 10:45 accettato, Skin LAB alle 10:00 accettato.
- **Posto tenuto 5 minuti** quando il cliente sceglie l'orario; si libera se cambia scelta; se scade, la pagina lo dice.
- Chiavi su Vercel (Production e Preview), inserite da Giovanni: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (secret).
  Senza chiavi la pagina torna in prova con orari finti.
- Provato in anteprima: prenotazione ECG 1/12 ore 10:00 salvata come "confermato", poi l'orario sparisce (9:30–10:30); prenotazione di prova cancellata.
- Avviso in pagina finché `AGENDA_LIVE` è false: "le prenotazioni si salvano, ma la farmacia non usa ancora questa agenda".
- **Da fare prima del lancio**: limite ai tentativi (oggi chiunque potrebbe tenere molti posti di fila), verifica del cellulare,
  festivi e chiusure inseriti (tabella `closures`, si gestiranno dalla vista del personale).

### Fase 1b – Agenda Masera, tappa 3: vista del personale (unita in main il 24/11/2026: https://masera-digitale.vercel.app/staff)
- **Accesso**: password unica per tutto il personale (dottoresse ed estetista usano la mail della farmacia, scelta di Giovanni),
  salvata solo su Vercel come `STAFF_PASSWORD` (Secret, Production e Preview). Cookie tecnico firmato, 30 giorni, solo su /staff;
  cambiando la password (e ripubblicando) tutti devono rientrare. Pausa dopo password sbagliata. /staff escluso da Google.
- **/staff/agenda**: giorno con una colonna per zona (Cabina analisi, Skin LAB), orari, servizio, cliente, cellulare cliccabile, canale;
  pulsanti Arrivato / Fatto / Non presentato / Annulla (ripremere torna a Confermato); giorno prima/dopo/oggi o data a scelta.
- **Nuova prenotazione** (telefono o banco) per il giorno mostrato: solo orari liberi, subito confermata, stesso anti-doppione.
- **Chiusure, ferie, festivi**: tutto il giorno o una fascia, per la farmacia o una cabina; spariscono subito anche da /prenota
  (al pubblico arriva solo l'orario, non il motivo). Elenco dei prossimi 90 giorni con "Togli".
- Database: `supabase/migrations/0002_staff.sql` (vista `staff_appointments`, funzioni `book_direct`, `set_appointment_status`), eseguito il 24/11/2026.
- Provato in anteprima (Giovanni ha fatto l'accesso): prenotazione al banco, "Arrivato", chiusura 14–16 visibile anche in /prenota,
  "Togli" e "Annulla" liberano gli orari. Prove cancellate. +1 test (totale 96).
- Le tre zone sono indipendenti: un ECG occupa solo la cabina analisi. Farmaestetica (centro estetico separato) arriverà come terza colonna.

### Agenda – Farmaestetica (unita in main il 25/11/2026, online su https://masera-digitale.vercel.app/prenota?zona=farmaestetica)
- Terza zona **Farmaestetica**: orari propri (lun–ven 9:30–19:30, sab 8:30–18:30), 10' di pulizia, indipendente da cabina e Skin LAB.
- /prenota: nuovo passo "1 · Dove?" (Farmacia / Farmaestetica by Dottor Masera). Prenotabili online tutto il listino
  (Viso, Corpo, Laser, Cera e mani-piedi, durate "circa") e la Miamo Lounge. Una seduta alla volta: i pacchetti 5+1 restano al banco.
  Schermata finale con ingresso piano 1 e WhatsApp di Farmaestetica. /farmaestetica: tasto "Prenota un trattamento"; ogni "+" del listino apre il trattamento.
- /staff/agenda: terza colonna. Nuova variabile su Vercel **ESTETISTA_PASSWORD** (inserita da Giovanni): l'estetista vede e gestisce
  solo Farmaestetica (prenota, stati, chiusure della sua zona; non "tutta la farmacia"). La password delle dottoresse vede tutto.
- Breath test: si fa a casa, kit al banco senza appuntamento (non più prenotabile online).
- Provato in anteprima con le due password (prova al banco cancellata). Test: core 75 + ui 26.

### Agenda – tappa 4A: sposta o annulla da soli (unita in main il 26/11/2026, online su https://masera-digitale.vercel.app/prenota)
- Risposte di Giovanni (25/11/2026): prenotazioni online fino a **30 giorni** prima; il cliente sposta o annulla da solo
  **fino a 1 ora prima**; promemoria dal numero della farmacia **373 770 5485** (WhatsApp Business).
- Dopo la conferma il cliente riceve il **link personale** "Il mio appuntamento" (/appuntamento/…): vede giorno, ora e indirizzo
  (mai nome e telefono), può **spostare** (stesso servizio, stessa durata, stesse regole della prenotazione) o **annullare**.
  Meno di un'ora prima: il link dice di chiamare o scrivere su WhatsApp. Il personale in agenda può sempre tutto.
- Sicurezza: il link ha un codice casuale lungo; nel database c'è solo la sua impronta (sha256). Pagina esclusa da Google e
  l'indirizzo non passa ad altri siti.
- Database: `supabase/migrations/0003_gestione.sql` **già eseguito** su Supabase il 25/11/2026 (aggiunge soltanto: la versione online continua a funzionare).
- Provato in anteprima: prenotazione ECG → link → spostata di 15 minuti → annullata (prova cancellata dal database). Test: core 78 + ui 26.
- Verificato online il 26/11/2026: 16 pagine pubbliche a 200 senza cookie, /prenota con 30 giorni, link non valido gestito, /staff/agenda rimanda all’accesso.

### Da decidere sull'Agenda
- Risposte di Giovanni (25/11/2026): Skin LAB **senza pausa** tra un appuntamento e l'altro; preavviso minimo **1 ora, sempre**;
  teledermatologia e chiacchierata sul deblistering **in cabina analisi**; il breath test **si fa a casa** e non occupa la cabina.
- Breath test: non si prenota più online; nella scheda c'è scritto che si ritira il kit al banco, senza appuntamento.
- Tappa 4B (messaggi automatici su WhatsApp: conferma e promemoria del giorno prima, testo senza dati di salute):
  serve l'account Meta Business della farmacia collegato al 373 770 5485, metodo di pagamento su Meta (lo inserisce Giovanni),
  approvazione dei due testi da parte di Meta, e Meta (WhatsApp) nell'informativa privacy (consulente).
- Festivi (8 dicembre, Natale…) e chiusure: arrivano con il database nella tappa 2.

### Fase 2 – pezzo 1: regole di consegna (unita in main il 28/11/2026, online su https://masera-digitale.vercel.app/consegne)
- Piano Fase 2 e 3 approvato da Giovanni il 27/11/2026, in 10 pezzi: 1 consegne, 2 ponte catalogo, 3 shop, 4 /staff/consegne,
  5 Invia una ricetta, 6 MyMasera, 7 motore SkinLab Routine, 8 pannello SkinLab al banco, 9 routine del cliente, 10 assistenti;
  poi videoconsulenza e buoni regalo. Si lavora in prova (dati finti) finché mancano negozio, file e chiavi.
- In `packages/core/src/delivery.ts`: preventivo per il carrello dal CAP (CAP non valido → messaggio), Seregno gratis con pagamento
  alla consegna (carta o contanti) o online, Italia solo online e gratis sopra 59 €, ricette solo Seregno, conti in centesimi,
  giorni di chiusura saltati (es. 8 dicembre → mercoledì), prezzo promo con barrato e percentuale sempre insieme. +11 test (core 89).
- I giorni di chiusura arrivano dalle chiusure "tutta la farmacia, tutto il giorno" segnate in /staff/agenda.
- Pagina `/consegne` con calcolatore (CAP + totale) e tabella delle regole: non è nel menu finché lo shop è "in arrivo".
- Costo della spedizione in Italia sotto 59 €: resta [DA CONFERMARE], il sito non lo inventa.

### Fase 2 – pezzo 2: ponte catalogo (in anteprima sul ramo fase2/ponte-catalogo)
- In `packages/core/src/catalog.ts`, senza rete: legge il CSV del gestionale (separatore ; , o tab, virgolette, numeri e date
  all'italiana, file in UTF-8 o Windows-1252), controlla l'EAN con la cifra di controllo, segnala righe ripetute e prezzi sbagliati.
- **Farmaci fuori, nel dubbio fuori**: si vende solo il tipo riconosciuto come parafarmaco; farmaci (SOP, OTC, etico…) e tipi
  sconosciuti restano esclusi. Elenco dei tipi in `SELLABLE_TYPES` [DA CONFERMARE con i codici veri].
- Nomi delle colonne in `CATALOG_COLUMNS` [DA CONFERMARE con il primo file vero]: si aggiungono senza toccare la logica.
- Promo con date (comprese): prezzo pieno barrato + percentuale. Promo non più bassa del prezzo pieno → ignorata e segnalata.
- Confronto per EAN con lo shop: crea i nuovi, aggiorna **solo** prezzo, barrato, giacenza e visibilità; il nome del gestionale
  si usa solo alla creazione; foto, testi e titolo ritoccati a mano non si toccano mai; mai cancellare: chi esce dal file
  o diventa farmaco viene nascosto. Allarme dopo due errori di fila. +19 test (core 108).
- `/staff/catalogo` (solo password delle dottoresse): si sceglie il file e si vede cosa andrebbe nello shop, farmaci esclusi,
  tipi sconosciuti, righe da controllare, promo attive. Il file si legge nel browser: non viene inviato né salvato.
  File di prova con dati finti: `docs/esempi/catalogo-prova.csv`.
- Manca: il collegamento a Shopify ogni 30 minuti (quando c'è il negozio) e la consegna del file da Farmaconsult (SFTP).

## Manca per chiudere la Fase 0
- Collegare Supabase (Francoforte) e Sanity: proposto di farlo all'inizio della Fase 1, quando servono.
- Piano Vercel Pro (password e dominio `nuovo.farmaciamasera.com`) prima di condividere i link fuori dalla farmacia.

## Scelte provvisorie (da confermare)
- L'**arco** è ridisegnato a mano (3 archi annidati, come nel canvas): da sostituire con i tracciati del logo vettoriale.
- La **barra a 5 colori** si usa solo su fondi chiari: sul verde scuro il primo segmento sparirebbe.
- "Aperto ora" conosce solo gli orari settimanali: **turni, festivi e chiusure** arriveranno con Agenda Masera.
- Il verde chiaro `#C9DB6A` del canvas Motion **non** è tra i token: in attesa di conferma.

## Serve da Giovanni
- Costo della spedizione in Italia sotto i 59 € (BRIEF §21 n. 1) e un estratto del file esportato da Farmaconsult (quale colonna distingue i farmaci).
- Per la tappa 4B: creare l'account Meta Business della farmacia (business.facebook.com) e avere a portata il telefono del 373 770 5485.
- Dati legali: telefono principale, email, PEC, P.IVA, conferma ragione sociale, direttore responsabile, Ordine e numero di iscrizione.
- Privacy: dove sono i server, per quanto teniamo dati tecnici e messaggi, eventuale informativa già in uso (con il consulente).
- Per Farmaestetica: codice del blu Miamo, logo in file, foto di cabina e Miamo Lounge.
- Testi di preparazione confermati dalle farmaciste (elenco in "Da decidere su Servizi").
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
