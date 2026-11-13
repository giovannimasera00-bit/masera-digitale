# Farmacia Masera — Nuovo ecosistema digitale
## Brief completo per lo sviluppo

Versione 1.0 · 13 novembre 2026 · Autore: Giovanni Masera, con Claude.
Lingua del progetto: **italiano** (testi, interfaccia, commit leggibili). Codice e nomi di variabili in inglese.

Questo documento raccoglie tutto ciò che è stato deciso nella fase di progettazione. È la fonte di verità per lo sviluppo. Dove qualcosa non è deciso c'è scritto **[DA CONFERMARE]**: non inventare, chiedi.

---

## Indice

1. Cosa stiamo costruendo
2. Regole fisse (non negoziabili)
3. La farmacia: dati di riferimento
4. Identità visiva
5. Sistema di movimento (motion)
6. Mappa del sito e pagine
7. Componenti speciali (mappa ZTL, tour robot, SkinLab, Farmaestetica)
8. Shop e consegne
9. Agenda Masera (prenotazioni)
10. MyMasera (area cliente) e SkinLab Routine
11. Ricette, galenico, deblistering
12. Assistenti AI e videoconsulenza
13. App MyMasera (iOS e Android)
14. Architettura tecnica
15. Modello dati
16. Integrazioni esterne (Farmaconsult, Shopify, WhatsApp, rider)
17. Privacy, legale, accessibilità, SEO
18. Fasi di sviluppo e criteri di "fatto"
19. Piano di switch dal sito attuale
20. Costi ricorrenti
21. Decisioni aperte
22. Materiali di riferimento nel kit

---

## 1. Cosa stiamo costruendo

**Un solo ecosistema digitale** per la Farmacia Masera di Seregno (MB), costruito attorno al cliente:

| Pezzo | In una frase |
|---|---|
| **Sito** farmaciamasera.com | La vetrina: farmacia, servizi, reparti, famiglia, robot, ZTL, Farmaestetica, Skin LAB. |
| **Shop** | Tutto il parafarmaco della farmacia, consegna in giornata a Seregno, spedizione in Italia. |
| **Agenda Masera** | Prenotazioni di cabina analisi, Skin LAB, Farmaestetica, videoconsulenze, eventi. Sostituisce l'agenda del consorzio e il Google Calendar di Farmaestetica. |
| **MyMasera** | L'area cliente unica (sito e app), legata alla tessera fedeltà. |
| **SkinLab Routine** | Dopo l'analisi della pelle, una routine personale da seguire ogni giorno, con riordino dei prodotti in finitura. |
| **Invia una ricetta** | Foto della ricetta per il preventivo (solo Seregno). |
| **Assistenti** | Integratori, skincare, salute di tutti i giorni. Chiudono sempre offrendo la farmacista. |
| **App MyMasera** | iOS e Android, stesso account e stessi dati del sito. |

**Visione.** Il cliente non visita il sito una volta: ci torna. Prenota in 30 secondi, ordina entro le 16 e riceve alle 19, sa quando la galenica è pronta, segue la sua routine.

**Posizionamento.** Non facciamo la guerra di prezzo. L'obiettivo è **consigliare il prodotto giusto al momento giusto**. Mai banner "sconti pazzi", mai countdown finti, mai "il prezzo più basso".

**Cosa ci rende unici (da raccontare):** quattro generazioni dal 1908, il laboratorio galenico, il robot, le linee proprietarie, l'accesso in ZTL ottenuto dai Dottori Masera.

**Pubblico.** Clienti storici di Seregno (anche anziani: testo leggibile, pulsanti grandi) e under 35 che arrivano dai social di @dottormasera (~13k su TikTok).

---

## 2. Regole fisse (non negoziabili)

1. **"Farmaestetica by Dottor Masera"**. Mai "Farmaestetica by Farmacia Masera". ("Skin LAB by Farmacia Masera" invece è corretto.)
2. **Consegna e ricette.**
   - A **Seregno**: consegna **in giornata, sempre gratuita**. Ordine entro le 16:00 (lun–sab), consegna verso le 19:00 con rider. Pagamento alla consegna (POS o contanti).
   - **Invio della ricetta: solo Seregno**, perché lo prevede la legge. Fuori Seregno il pulsante non compare o spiega che non è disponibile.
   - **Resto d'Italia**: spedizione in **2–3 giorni lavorativi**, **gratuita sopra 59 €**.
3. **Niente farmaci online al lancio.** Solo parafarmaco. Farmaci SOP/OTC in una fase successiva, solo con autorizzazione regionale e logo ministeriale. Il catalogo deve già prevedere il campo "tipo prodotto".
4. **Nessuna proprietà terapeutica non autorizzata** per integratori e cosmetici. Solo indicazioni ammesse.
5. **Promo**: se c'è un prezzo barrato, la **percentuale di sconto è sempre indicata** (obbligo di legge). Le promo non devono mai dominare la pagina.
6. **Assistenti AI**: nessuna diagnosi, nessun dosaggio personalizzato; riconoscono i segnali d'allarme e rimandano a medico, guardia medica o 112.
7. **Mai nominare in pubblico i fornitori software** del deblistering (in particolare non nominare Carepy) né del gestionale.
8. **ZTL**: nessun riferimento ai parcheggi a pagamento.
9. **Testi**: italiano semplice e diretto, frasi brevi, niente gergo tecnico, niente frasi vaghe ("qualità e professionalità"): sempre fatti concreti (prezzo, durata, cosa portare).
10. **Dati sanitari su server in UE.**
11. **Tutto gestibile da Giovanni senza codice**: promo, eventi, newsletter, testi, foto, prezzi dei servizi.
12. **Strumenti interni velocissimi**: ogni operazione del personale si fa in meno di 2 minuti (penna ottica, tocchi, niente moduli lunghi).

---

## 3. La farmacia: dati di riferimento

| Voce | Valore |
|---|---|
| Nome pubblico | **Farmacia Masera** |
| Ragione sociale | Farmacia S. Valeria – Farmacia Dott. Masera Giuseppe |
| Indirizzo | Via Garibaldi 103, 20831 Seregno (MB) — centro storico, in ZTL |
| Coordinate | 45.6510625, 9.2010460 |
| Claim | "Medicina per tradizione. Dal 1908." · "Quattro generazioni, una sola missione: la tua salute." |
| Orari | Lun–ven 8:30–19:30 continuato · Sab 8:30–12:30 e 15:00–19:00 · Dom chiuso (salvo turni) |
| WhatsApp | 373 770 5485 (WhatsApp Business) |
| Instagram | @farmaciamasera · personale @dottormasera |
| Locker | Esterno, per ritirare gli ordini anche a farmacia chiusa |
| Titolare | Dott. Giuseppe Masera |

**Farmaestetica by Dottor Masera** (piano superiore): ingresso Via Garibaldi 103 / Via Ballerini 10 · tel 0362 231660 · WhatsApp 366 199 2302 · IG @farmaestetica.seregno · Lun–ven 9:30–19:30, sab 8:30–18:30. Una sola estetista (anche laser). Al suo interno la **Miamo Lounge**.

**Reparti e marchi**
- Dermocosmesi: Miamo, SkinCeuticals, Dolomia, Bakel, Farmacisti Preparatori, Ceramol, La Roche-Posay, Caudalie, Dercos, Triunico.
- Integratori: Dottor Masera, LDF, Unifarco.
- Alimenti speciali: Keylife, Dietalab.
- Veterinaria: **[DA CONFERMARE i marchi]**.
- Galenico.

**Le Nostre Linee**

| Linea | Chi la produce | Tono |
|---|---|---|
| Dottor Masera (integratori) | Formulati dal Dott. Giuseppe Masera | Il medico di famiglia: scienza e cura. Video di Giovanni al banco. |
| LDF – Laboratorio della Farmacia (integratori e cosmetici a marchio Masera) | LDF, Quarto d'Altino | Personalizzazione, "fatto per noi". |
| Farmacisti Preparatori (cosmetica a marchio Masera) | Unifarco | Premium, ricercata. **Mantiene la sua etichetta storica**: non uniformarla alla nuova identità. |

Prodotti Dottor Masera noti: Dormi Meglio, Sempre Snelli Drenante, Gambe Gonfie, Più Capelli Donna/Uomo, Omega+, Meno Colesterolo RR+Q10, Artro No-Dolor, 5Probio Complex, BlisterPop (49,90 €), Gel all'Arnica (galenico storico).

**Storia: quattro generazioni** (testi ufficiali)

| Anno | Evento |
|---|---|
| 1908 | Inizia la tradizione medica: Prof. Giuseppe Masera, chirurgo, docente di patologia chirurgica a Pavia, oltre 35 anni alla guida dell'ospedale di Carate Brianza. |
| 1918 | Medaglia d'argento al valor militare nella battaglia del Piave. |
| 1963 | Il dott. Gianfranco Colombo apre la Farmacia Santa Valeria a Seregno. |
| Fine anni '60 | Il Dr. Vittorio Masera (informazione medico-scientifica in multinazionali) rileva la farmacia e la trasforma in luogo di consiglio e ascolto. |
| 2002 | Il Dr. Giuseppe Masera diventa titolare: integrazione, omeopatia, galenica; volto di Canale 5 negli anni '90; commissione medico-scientifica FISI; formula la linea Dottor Masera. |
| 2024 | Il Dr. Giovanni Masera, quarta generazione: laurea in Farmacia a Pavia, servizi innovativi, divulgazione come @dottormasera. |
| 2026 | La farmacia si rinnova: robot, cinque postazioni al banco, cabine nuove. Accesso in ZTL per i clienti. |

**Il robot**: Medistore HL di Label Elettronica (Limena, PD), manipolatore V5. 5,72 m di lunghezza × 3,90 m di altezza. Ripiani in vetro, pannelli bianchi RAL 9016. Caricatore automatico con tramoggia e mensola di carico semiautomatico. Altezza massima confezione 145 mm. Nastro con deviatori, 3 scivoli elicoidali fino al banco (h 93 cm). Installato dal 21/09/2026. **[DA CONFERMARE: numero di confezioni gestite e secondi per un prelievo, dal costruttore]**.

**Accesso in ZTL** (attivo dal 1° novembre 2026, gratuito, per acquisto farmaci o prestazioni sanitarie):
1. Entra in ZTL da via Garibaldi (il varco è all'incrocio con via Fratelli Cairoli).
2. Parcheggia negli spazi riservati alla Farmacia Masera, davanti alla farmacia, massimo 30 minuti.
3. Al banco comunica la targa.
Chiusura: **"Tutto qui."**

---

## 4. Identità visiva

Fonte: immagine coordinata CAEM del 28/10/2026 e 03/11/2026 (`riferimenti/MASERA_IMG-COORDINATA_03.11.26.pdf` nel progetto Claude).

### Colori (token)

```css
:root {
  --fm-verde-scuro: #2E3F2D;   /* testi principali, fondi pieni, header */
  --fm-verde:       #425D3A;   /* pulsanti secondari, link */
  --fm-mela:        #A3BE19;   /* accento: CTA, stato "aperto", progressi. Mai per testo su bianco */
  --fm-salvia:      #9AB9AD;   /* fondi tenui, Farmaestetica */
  --fm-beige-chiaro:#D6D2C4;
  --fm-beige-scuro: #B7A999;
  --fm-nero:        #1D1D1B;
  --fm-carta:       #F4F1E8;   /* fondo pagina caldo */
  --fm-bianco:      #FFFFFF;
}
```

**Contrasto (WCAG AA obbligatorio)**: testo normale ≥ 4,5:1, testo grande ≥ 3:1. Il verde mela non supera 4,5:1 su bianco: usarlo per superfici, icone, barre, mai per il testo piccolo. Su fondo verde scuro il testo è bianco o carta. Sul sito attuale abbiamo già avuto testi bianchi su fondi chiari: aggiungere un test automatico del contrasto.

### Sotto-marchi

| Marchio | Colori guida | Note |
|---|---|---|
| Farmacia Masera | Verde scuro, mela, carta | — |
| **Skin LAB by Farmacia Masera** | Tortora: `#B7A999`, `#8C7D6C`, `#6E6153`, `#3A332B` | "Skin" in Bodoni corsivo + "LAB" in sans light |
| **Farmaestetica by Dottor Masera** | Fondo salvia `#9AB9AD`, logo e testo verde scuro `#2E3F2D` | Come il cartello reale: "FARMA ESTETICA", "PIANO 1" con freccia. Buono regalo beige. |
| Miamo Lounge | Mantiene il blu Miamo nelle sue schede | Promozione libera |
| Farmacisti Preparatori | La sua etichetta storica | Non uniformare |

### Tipografia

| Uso | Font web | Note |
|---|---|---|
| Titoli e claim | **Bodoni Moda**, corsivo, grassetto (Google Fonts) | Usare l'asse ottico basso (`opsz` 11–14): più leggibile. Mai sotto i 28 px. |
| Testi, interfaccia | **DM Sans** (Google Fonts) | 16 px minimo per il corpo, 18 px per i testi lunghi. |

Nella grafica stampata ci sono Bodoni MT Condensed e TT Fors: TT Fors è a pagamento. **[DA CONFERMARE se comprare la licenza web di TT Fors]**; fino ad allora DM Sans. Font serviti in locale con `next/font` (niente richieste a Google dal browser: privacy).

### Elementi grafici

- **Archi "a fontana" del logo**: tono su tono sui fondi pieni. Non cerchi concentrici.
- **Barra a 5 colori** (verde scuro, mela, salvia, beige chiaro, beige scuro) a piè di sezione e come **indicatore di progresso** (consegna, routine, punti).
- Logo: croce + mortaio con bastone di Esculapio e archi. Versioni orizzontale, verticale, bollo; colori: color, verde scuro, verde chiaro, mela, azzurro, beige, nero, bianco. File in `assets/`.
- Foto vere della farmacia, mai stock generiche di "farmacista sorridente".

---

## 5. Sistema di movimento (motion)

Principio: **"Si muove con calma. Mai per fare scena."** Riferimento animato: `design/canvas/Motion.dc.html`.

### Token

```ts
export const motion = {
  fast: 200,   // tocchi, pulsanti
  base: 450,   // schede, liste
  slow: 900,   // ingressi di pagina
  easeOut: 'cubic-bezier(.2, .8, .2, 1)',      // curva di uscita per tutto
  easeInOut: 'cubic-bezier(.65, 0, .35, 1)',   // percorsi (auto ZTL, nastro robot)
  spring: 'cubic-bezier(.3, 1.3, .5, 1)',      // solo la carta fedeltà
  stagger: 150,  // tra una riga di titolo e la successiva
};
```

### I sei gesti

1. **L'arco**: gli archi del logo si disegnano all'ingresso di ogni pagina (stroke-dashoffset). È la firma: c'è solo lì.
2. **La risalita**: i titoli salgono una riga alla volta, a 150 ms di distanza. Il testo normale compare tutto insieme.
3. **La barra**: la barra a 5 colori si riempie da sinistra; è anche l'indicatore di ogni progresso.
4. **Il respiro**: solo i dati in tempo reale si muovono da soli ("aperto ora", consegna in corso, timer ZTL).
5. **La carta**: la carta fedeltà si gira con una piccola molla (davanti saldo, dietro codice a barre per il banco).
6. **La spunta**: ogni conferma finisce con una spunta che si disegna.

### Regole tecniche

- Animare solo `transform` e `opacity` (e `stroke-dashoffset` per gli SVG). Niente animazioni di layout.
- Animazioni allo scroll con `IntersectionObserver` (o Motion/Framer Motion `whileInView`), una volta sola.
- **`prefers-reduced-motion: reduce`**: tutto fermo e già al suo posto. Obbligatorio, con test.
- Libreria consigliata: **Motion** (ex Framer Motion) per React; CSS keyframes per le animazioni SVG continue (mappa ZTL, robot).
- Nessuna animazione deve ritardare l'accesso a un contenuto o a un pulsante.

---

## 6. Mappa del sito e pagine

Navigazione principale: **Servizi · Reparti · Shop · Ricette · Il robot · La famiglia** + **MyMasera** sempre in alto a destra.

Indirizzi brevi **fissi** (stampati nei QR, non devono mai cambiare): `/prenota`, `/ztl`, `/skinlab`, `/galenico`, `/shop`, `/promo`, `/farmaestetica`, `/newsletter`, `/my`.

| Area | Pagine | Indirizzi |
|---|---|---|
| La Farmacia | Home · La nuova Farmacia Masera (tour degli spazi) · Il robot · Quattro generazioni · Il team · Come arrivare / ZTL · Orari e contatti · Farmacie di turno | `/`, `/la-farmacia`, `/robot`, `/famiglia`, `/team`, `/ztl`, `/contatti`, `/turni` |
| Servizi | Servizi e prezzi (per bisogno) · scheda per servizio · Skin LAB · Deblistering · Laboratorio galenico · Vaccinazioni · Giornate evento | `/servizi`, `/servizi/[slug]`, `/skinlab`, `/deblistering`, `/galenico`, `/vaccini`, `/eventi` |
| Shop | Catalogo per reparto · Le Nostre Linee · Integratori + assistente · Skincare + assistente · Promo · Invia una ricetta | `/shop`, `/shop/[reparto]`, `/prodotto/[handle]`, `/linee/[linea]`, `/promo`, `/ricetta` |
| Farmaestetica | Farmaestetica by Dottor Masera · Miamo Lounge · Listino · Pacchetti 5+1 · Buoni regalo · Prenota | `/farmaestetica`, `/farmaestetica/miamo-lounge`, `/farmaestetica/buoni-regalo` |
| Magazine | Newsletter (archivio) · Il Dottor Masera consiglia (video social) · Salute di tutti i giorni (assistente + guide) | `/newsletter`, `/consigli`, `/salute` |
| MyMasera | Profilo e tessera · Appuntamenti · SkinLab Routine · Ordini · Ricette e galenica · Referti · Credito consulenza · Punti | `/my/...` |
| Interno (personale) | Agenda per cabina · Pannello SkinLab (penna ottica) · Ricette da valutare · Ordini del giorno / rider | `/staff/...` (accesso per ruolo) |
| Legale | Privacy · Cookie · Termini di vendita · Accessibilità · Dati della farmacia | footer |

### Homepage (riferimento: `design/canvas/Main.dc.html`)

Dall'alto in basso:
1. **Barra di stato**: "Aperto ora · chiude alle 19:30" (calcolato dagli orari, con il "respiro") + "Spedizione gratuita in Italia sopra 59 €" + "Accesso libero in ZTL" + WhatsApp.
2. **Hero**: "Medicina / per tradizione. / Dal 1908." con arco che si disegna; sottotitolo "Quattro generazioni, una sola missione: la tua salute."; CTA "Prenota un servizio" e "Vai allo shop".
3. **"Di cosa hai bisogno oggi?"**: chip (Consegna, Analisi, Cuore, Pelle, Ricetta) che cambiano la card accanto.
4. **Quattro azioni rapide**.
5. **Seregno / Tutta Italia**: due riquadri con le regole di consegna; barra "Ti mancano X € alla spedizione gratis".
6. **Striscia di servizi** che scorre (si ferma al passaggio del mouse; ferma con riduci movimento).
7. **I nostri reparti** con i marchi.
8. **Come arrivare in ZTL** con la mappa animata.
9. **Teaser del robot** → `/robot`.
10. **Ieri / Oggi**: laboratorio galenico d'epoca / robot.
11. **MyMasera**: "La farmacia in tasca."
12. **Footer**: orari, dove siamo, spedizioni, barra a 5 colori.

### Pagina Servizi e prezzi

Servizi **raggruppati per bisogno**: Cuore e pressione · Sangue e urine · Intolleranze e allergie · Pelle · Tamponi · Test Natrix. Per ogni servizio: **prezzo, durata, preparazione in una riga, pulsante Prenota**. Dati completi in `data/servizi.json`.

Durate: **ECG e Holter 30 minuti, tutto il resto 15 minuti** (breath test: circa 4 ore di presenza).

Preparazioni chiave:
- **ECG e Holter cardiaco: depilare il petto**, altrimenti gli elettrodi non aderiscono e non registrano. ECG: niente creme sul torace. Holter cardiaco: doccia prima, durante la registrazione non va bagnato.
- Holter pressorio: maglia comoda a maniche larghe.
- Profilo lipidico, funzionalità renale, profilo completo: digiuno da almeno 8 ore **[DA CONFERMARE con le farmaciste]**.
- Breath test: a digiuno, dieta il giorno prima **[DA CONFERMARE il testo della dieta]**.
- Analisi della pelle: pelle pulita, senza trucco.

---

## 7. Componenti speciali

### 7.1 Mappa ZTL animata

Riferimento: `design/canvas/ZtlMap.dc.html` (versione con keyframes CSS, da usare nel nuovo sito) e `design/ztl/ztl-map-zoom.svg` (versione SMIL in uso sul sito attuale).

- Geometria **reale** da OpenStreetMap (Nominatim + Overpass). Farmacia a 45.6510625, 9.2010460.
- Vista **ravvicinata**: si vede solo l'incrocio e l'inizio di via Garibaldi (l'utente ha chiesto esplicitamente di non allontanare la vista).
- Strade: via F.lli Cairoli → diventa via Garibaldi al varco; via San Vitale a nord; via C. Colombo a sud; via Ballerini.
- Sequenza: l'auto arriva da via Cairoli, passa il varco (al 51% del percorso) con pillola "ZTL · CENTRO STORICO", entra nello stallo riservato, parte il timer 30', compare la card "comunica la targa", chiusura "Tutto qui."
- Il tratteggio del percorso deve restare sincronizzato con l'auto.
- Componente React `<ZtlMap />` riutilizzabile in home, `/ztl`, `/contatti`. Con riduci movimento: mostra lo stato finale.
- Esiste anche il poster statico 1000×1800 "Come raggiungerci" (`design/ztl/poster.png`).

### 7.2 Tour virtuale del robot (`/robot`)

Riferimento: `design/canvas/Robot.dc.html`. Foto in `design/robot/`.
- Statistiche animate (dimensioni, altezza max confezione, scivoli).
- **Schema in sezione animato ("vista anatomy")**: una confezione rossa percorre caricatore → scaffali → braccio → nastro → scivolo → banco.
- **5 tappe interattive** con foto e galleria: caricatore/tramoggia, scaffali, braccio (manipolatore V5), nastro con deviatori, scivoli elicoidali.
- Due livelli: in superficie "dietro le quinte" semplice; sotto, "per gli appassionati" (meccanica, software, perché libera tempo al banco).
- Coinvolgente ma semplice. Niente 3D pesante al lancio (eventuale modellino 3D è un "dopo", da valutare con Three.js solo se le prestazioni restano buone).

### 7.3 Skin LAB (`/skinlab`)

Riferimento: `design/canvas/SkinLabPage.dc.html`.
- **Analisi della pelle e del viso: 25 €, scalabili sull'acquisto dei prodotti consigliati**. Strumento SpectroSkin. 15 minuti.
- Analisi del cuoio capelluto: **[DA CONFERMARE prezzo]**.
- Report di esempio animato, 3 passi (analisi → routine → riordino), schede Viso e Cuoio capelluto, routine nell'app, marchi.
- Ponte con Farmaestetica: dalla routine si può prenotare un trattamento in cabina (es. Hydrashine, Purity Skin).

### 7.4 Farmaestetica (`/farmaestetica`)

Riferimento: `design/canvas/Farmaestetica.dc.html`. Listino completo in `data/farmaestetica.json`.
- Schede: Viso · Corpo · Laser · Cera e mani-piedi · Miamo Lounge.
- Prezzi reali; durate **stimate, mostrate come "circa"**.
- Pacchetti 5+1 scalati a ogni seduta in MyMasera.
- Buoni regalo digitali (acquisto online, invio WhatsApp o mail, riscatto in agenda).
- Contatti e orari propri.

### 7.5 Pagina ponte "La nuova Farmacia Masera"

Esiste già una versione per il sito attuale (`design/pagina-ponte-nuova-farmacia-masera.html`). **Non pubblicare la data della reinaugurazione finché non è ufficiale.**

---

## 8. Shop e consegne

**Cosa si vende al lancio:** tutto il parafarmaco della farmacia (dermocosmesi, integratori, alimenti speciali, veterinaria, sanitari). Niente farmaci.

**Regole di consegna** (le stesse in home, carrello, scheda prodotto, footer, termini):

| | Seregno (CAP 20831, frazioni comprese) | Resto d'Italia |
|---|---|---|
| Tempi | Ordine entro 16:00 lun–sab → consegna verso le 19:00 | 2–3 giorni lavorativi |
| Costo | **Sempre gratuita** | **Gratuita sopra 59 €**; sotto: **[DA CONFERMARE costo]** |
| Pagamento | Alla consegna (POS o contanti); online facoltativo | Online |
| Dopo le 16 / domenica | Consegna il giorno lavorativo successivo, oppure ritiro al locker o in farmacia | — |
| Ricetta | **Sì** (foto per preventivo) | **No** |
| Avvisi | WhatsApp: "in preparazione", "il rider sta arrivando" | Mail + tracking corriere |

Il CAP inserito (o la posizione) decide il percorso. Scheda prodotto con interruttore **Seregno / Resto d'Italia** che mostra i due percorsi (riferimento `design/canvas/Prodotto.dc.html`).

**Controlli contro ordini falsi** (pagamento alla consegna): telefono verificato in MyMasera + conferma WhatsApp per i primi ordini.

**Scheda prodotto**: foto, prezzo, disponibilità reale (giacenza al netto dei prenotati), "chi lo ha formulato e perché" per le nostre linee, come si usa, video del consiglio al banco (TikTok/Instagram incorporato), "Chiedi consiglio", consegna. **Nessuna proprietà terapeutica non autorizzata.**

**Configuratore "Trova il tuo integratore"**: poche domande → 1–3 prodotti, sempre con "parla con la farmacista".

**Promo**: sezione `/promo` alimentata dalle promozioni del gestionale; prezzo barrato + percentuale sempre indicati. Tono sobrio.

**"Metti da parte"**: il cliente prenota il prodotto e lo ritira in farmacia; diventa un "prenotato" nel gestionale.

**Checkout**: Shopify (grafica Masera). Metodi: carta, Apple Pay/Google Pay, PayPal **[DA CONFERMARE]**; contrassegno solo Seregno.

**dottormasera.it** (Shopify esistente): resta separato all'inizio; i prodotti Dottor Masera sono nel nuovo shop dal primo giorno. Quando il nuovo shop è rodato: spostare i clienti e reindirizzare dottormasera.it pagina per pagina (301).

---

## 9. Agenda Masera (prenotazioni)

È il **primo pezzo da costruire**: non dipende dal gestionale e sostituisce l'agenda del consorzio (agenda.farmacialaboratorio.it) e il Google Calendar di Farmaestetica.

### Risorse

| Risorsa | Chi | Orari |
|---|---|---|
| Cabina analisi (~9,2 m²) | Farmaciste abilitate per servizio | Orari farmacia |
| Cabina Skin LAB | Farmaciste Skin LAB | Orari farmacia |
| Farmaestetica + Miamo Lounge (laser incluso) | Solo l'estetista | Lun–ven 9:30–19:30, sab 8:30–18:30 |
| Videoconsulenza | Farmacista | Da definire |
| Giornate evento | Specialist ospite o farmacista, posti limitati | Per evento |

### Regole

- Il cliente vede **solo gli orari davvero liberi** e riceve **conferma immediata**.
- Tempi di pulizia tra appuntamenti: **5' cabina analisi, 10' Farmaestetica**.
- Durate: ECG e Holter 30', resto della cabina 15', Farmaestetica come da listino stimato.
- Promemoria WhatsApp con "confermo / sposto" (sostituisce gli SMS a 0,11 € + IVA).
- Istruzioni di preparazione automatiche nella conferma.
- Sposta/annulla dal link o da MyMasera (fino a **[DA CONFERMARE: quante ore prima]**).
- Prenotazione senza account possibile (nome + cellulare verificato), che crea un profilo MyMasera leggero.
- Blocco del posto per 5 minuti durante la prenotazione (evitare doppie prenotazioni: vincolo di esclusione nel database).

### Vista personale (`/staff/agenda`)

- Giorno per cabina, colonne per risorsa.
- **Inserimento rapido** per prenotazioni al telefono e al banco (nome, cellulare, servizio, ora: 3 tocchi).
- Segna "arrivato", "fatto", "non presentato".
- Chiusure, ferie, giornate evento.
- Prezzi e servizi modificabili da Giovanni.

### Trasloco dal consorzio

Esportare clienti e appuntamenti futuri dall'agenda attuale, importarli il giorno dello switch. Prima ripulire il catalogo: offerte scadute ancora attive, doppioni (teledermatologia MedEA 59,90 € vs consorzio 49 €; breath test). **Valgono i prezzi in `data/servizi.json`.**

Riferimento schermata: `design/canvas/Prenota.dc.html`.

---

## 10. MyMasera e SkinLab Routine

### MyMasera

Riferimento: `design/canvas/MyMasera.dc.html`.

- **Accesso**: numero di cellulare + codice via SMS o WhatsApp (niente password). Poi aggancio della **tessera fedeltà** (nuova tessera con codice a barre compatibile con il gestionale Farmaconsult).
- Al banco la farmacista passa la tessera e apre lo stesso profilo.

| Cosa vede il cliente | Da dove arriva |
|---|---|
| Carta fedeltà (si gira: saldo / codice a barre) e punti | Farmaconsult |
| Appuntamenti (prossimi e passati), sposta e annulla | Agenda Masera |
| SkinLab Routine attive, prodotti "in finitura" | SkinLab Routine |
| Ordini, messi da parte, stato consegna | Shopify + gestionale |
| Richieste ricetta e galenica, preventivo da approvare | Modulo ricette |
| Referti e documenti (cartella referti digitale) | Caricati dalla farmacia |
| Piano deblistering (se attivo) | Gestione deblistering |
| Credito consulenza residuo | Videoconsulenza |
| Pacchetti Farmaestetica (sedute rimaste) | Agenda |

**Notifiche** (WhatsApp, poi push in app): conferma e promemoria appuntamento, "è pronta", "il rider sta arrivando", "la tua crema sta finendo", rinnovo analisi SkinLab.

**Consensi**: separati per servizio e per marketing; moduli cartacei firmati in farmacia + casella digitale per chi si iscrive da casa. Ogni consenso salvato con data, versione del testo e canale.

### SkinLab Routine

Riferimento: `design/canvas/SkinLab.dc.html` (colori Skin LAB tortora).

**Lato farmacista** (PC del banco cosmesi con penna ottica, meno di 2 minuti):
1. Passa la tessera del cliente → si apre il profilo.
2. Passa il codice a barre (EAN) di ogni prodotto consigliato → si inserisce da solo nella sequenza corretta: detergente → tonico → siero → contorno occhi → crema → protezione solare; capello: shampoo → trattamento → lozione.
3. Per ogni prodotto tre pulsanti: **quando** (mattina / sera / entrambi), **quanto spesso** (ogni giorno / 2–3 volte a settimana / 1 volta a settimana), **quanto** (una goccia / un pisello / una noce / 2 erogazioni).
4. Allega il risultato dell'analisi (foto o PDF) e, se serve, una nota vocale.
5. "Invia": il cliente riceve il link su WhatsApp; i prodotti diventano "li prende ora / metti da parte / ordina online".

La penna ottica funziona come una tastiera: il campo di input deve restare sempre a fuoco e riconoscere un EAN di 8/13 cifre seguito da Invio.

**Lato cliente ("il rituale")**:
- Interruttore mattina / sera con cielo che cambia dall'alba alla notte.
- Passaggi da sfogliare come storie: foto prodotto, animazione di applicazione, quantità in scala, timer tra un passaggio e l'altro.
- Spunta serale e serie di giorni consecutivi; trattamenti settimanali nel calendario.
- **Sta per finire**: dalla capacità del flacone, dalla dose e dalla frequenza si stima la data di fine e si propone il riordino.
- Dopo 8 settimane: "Rifacciamo l'analisi?" con prenotazione in un tocco e confronto prima/dopo.

**Un motore, più usi**: lo stesso motore gestirà routine capelli, cicli di integratori (es. 1 al giorno per 3 mesi) e in futuro promemoria di terapia.

Dati per ogni prodotto: EAN, capacità (ml o pezzi), categoria del passaggio, dose standard in ml, istruzioni brevi. Si parte da Miamo, SkinCeuticals, Dolomia, Farmacisti Preparatori, La Roche-Posay, Caudalie, Dercos.

---

## 11. Ricette, galenico, deblistering

### Invia una ricetta (`/ricetta`) — **solo Seregno**

1. Il cliente carica la foto della ricetta, oppure il codice NRE della ricetta elettronica con il codice fiscale.
2. La farmacista valuta: fattibilità, preventivo, tempi.
3. Il cliente riceve il preventivo su WhatsApp e in MyMasera e approva con un tocco.
4. Sceglie ritiro in farmacia o al locker, oppure consegna serale: **i farmaci su ricetta viaggiano in un pacco sigillato da un farmacista**.
5. Per la galenica porta l'originale; riceve "in preparazione" e poi "è pronta".

La foto serve **solo** per valutare e fare il preventivo; **l'originale resta obbligatorio**. Le immagini delle ricette sono dati sanitari: bucket privato, accesso solo al personale, cancellazione automatica dopo **[DA CONFERMARE: es. 90 giorni]**.

### Laboratorio galenico (`/galenico`)

Panoramica secondo la Farmacopea Ufficiale Italiana:
- **Officinali, senza ricetta**: tinture madri, gel e pomate topiche, preparazioni fitoterapiche (tra le storiche, il Gel all'Arnica del Dottor Masera).
- **Magistrali, su prescrizione**: capsule, compresse, pomate, creme dermatologiche, lozioni, gel, preparazioni liquide non sterili.

### Deblistering (`/deblistering`)

- "La terapia pronta, ordinata e controllata dalla farmacia." **1 € al giorno (28 € al mese)**, "meno di un caffè al giorno".
- Tour in 4 passi: verifica della terapia → richieste al medico → preparazione delle bustine con doppio controllo → ritiro.
- Calcolatrice "quanto costa davvero"; sezioni per anziani, caregiver, RSA e comunità.
- Prenotazione di una chiacchierata gratuita con la farmacista.
- **Nessun nome di fornitore del software.**

---

## 12. Assistenti AI e videoconsulenza

Tre assistenti gratuiti, stesso stile, regole diverse. Modello: **Claude** (API Anthropic), con risposte basate **solo** sulle schede prodotto e sui contenuti della farmacia.

| Assistente | Risponde su | Limiti fissi |
|---|---|---|
| Integratori | Catalogo integratori: a cosa servono, per chi, come si assumono | Solo indicazioni autorizzate; nessuna promessa terapeutica |
| Skincare | Dermocosmesi e routine; invita all'analisi Skin LAB | Nessuna diagnosi di patologie cutanee |
| Salute di tutti i giorni | Come si usa un farmaco, piccola ferita, febbre, raffreddore, punture d'insetto | Mai diagnosi né dosaggi personalizzati; segnali d'allarme → medico, guardia medica, 112 |

Regole tecniche:
- Ogni risposta chiude offrendo la farmacista (in farmacia, WhatsApp o videoconsulenza).
- Recupero dei contenuti (RAG) sul catalogo e sulle guide; mostrare i prodotti come card cliccabili.
- Il prompt di sistema contiene i limiti; in più un filtro di uscita per parole a rischio (dosaggi, diagnosi).
- Gravidanza, allattamento, bambini, farmaci in corso, sintomi gravi → risposta prudente e rinvio.
- **Batteria di test** con domande difficili preparate dalle farmaciste, eseguita prima di ogni rilascio.
- Registro anonimizzato delle conversazioni per migliorare; nessun dato sanitario identificabile conservato senza consenso.
- Limite di richieste per utente/IP.

**Videoconsulenza**: 15 minuti a 15 €, **interamente trasformati in credito spendibile entro 12 mesi** su qualsiasi acquisto. Formula "interamente scalata dalla spesa" (non "credito non rimborsabile"), per il Codice del Consumo. Prenotata in Agenda Masera; videochiamata con link (es. Whereby/Daily embedded) **[DA CONFERMARE fornitore]**.

---

## 13. App MyMasera (iOS e Android)

- Un solo codice: **React Native con Expo**, sugli stessi dati e le stesse API del sito.
- In più rispetto al sito: notifiche push, tessera in **Apple Wallet e Google Wallet**, accesso con Face ID o impronta.
- Prima dell'app: il sito è installabile come mini-app (PWA) con icona Masera.
- Account sviluppatore **intestati alla farmacia come azienda**: Apple ~99 $/anno (serve il **D-U-N-S**, gratuito, da richiedere subito), Google Play 25 $ una tantum.
- Riferimenti schermate: `design/canvas/HomeMobile.dc.html`, `MyMasera.dc.html`, `SkinLab.dc.html`, `Prenota.dc.html`, `Prodotto.dc.html` (390×844).
- Pubblicazione dopo sito e MyMasera; revisione degli store da qualche giorno a una settimana. Le app di farmacia con contenuti sanitari possono ricevere più domande in revisione: preparare note per i revisori e account di prova.

---

## 14. Architettura tecnica

Il sito è nostro e su misura; Shopify fa solo da **motore dello shop dietro le quinte** (headless).

| Pezzo | Tecnologia | Dove gira |
|---|---|---|
| Sito + area personale + API | **Next.js** (App Router, TypeScript, React Server Components) | **Vercel**, regione UE (`fra1`) |
| Stile | Tailwind CSS con i token del paragrafo 4; componenti propri (eventualmente shadcn/ui come base) | — |
| Animazioni | Motion (React) + CSS/SVG | — |
| Shop | **Shopify** Storefront API (catalogo, carrello, checkout) + Admin API (ordini, sincronizzazione) | Shopify |
| Database, accesso, file | **Supabase** (Postgres, Auth con OTP via telefono, Storage, Row Level Security) | Regione UE (Francoforte) |
| Contenuti modificabili | **Sanity** (CMS): pagine, newsletter, eventi, promo editoriali, FAQ, team, prezzi servizi | Sanity |
| Ponte gestionale | Job programmati (Vercel Cron o Supabase Edge Functions + pg_cron) | Vercel/Supabase |
| Notifiche | **WhatsApp Business API** tramite fornitore (Twilio o 360dialog) + mail transazionali (Resend) | — |
| Assistenti | **Claude API** (Anthropic) + ricerca vettoriale (pgvector su Supabase) | — |
| App | **Expo** (React Native) | App Store, Google Play |
| Monitoraggio | Sentry (errori), Vercel Analytics (prestazioni), analytics rispettosi della privacy (Plausible o simile, senza cookie) | — |

**Perché non tutto su Shopify**: agenda, routine, ricette e MyMasera richiederebbero molte app a pagamento con un'esperienza standard e poco controllo.

### Struttura del repository (monorepo)

```
masera-digitale/
├── CLAUDE.md
├── docs/                    # questo brief e i documenti di progetto
├── design/                  # riferimenti visivi (canvas, mappa, robot)
├── data/                    # dati iniziali (servizi, listini, orari)
├── apps/
│   ├── web/                 # Next.js: sito, shop, MyMasera web, /staff
│   └── mobile/              # Expo: app MyMasera (fase 4)
├── packages/
│   ├── ui/                  # componenti condivisi, token, motion
│   ├── db/                  # schema SQL, migrazioni, tipi generati
│   ├── core/                # logica condivisa: agenda, routine, regole consegna
│   └── config/              # eslint, tsconfig, tailwind preset
└── supabase/                # migrazioni, seed, edge functions
```

Gestore pacchetti: **pnpm** + **Turborepo**.

### Ambienti

| Ambiente | Indirizzo | Note |
|---|---|---|
| Locale | localhost | dati di prova |
| Anteprima | URL automatico Vercel per ogni branch | protetto |
| Prova | `nuovo.farmaciamasera.com` | protetto da password, `noindex` |
| Produzione | `farmaciamasera.com` | dopo lo switch |

### Variabili d'ambiente (nomi indicativi)

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN / SHOPIFY_ADMIN_TOKEN / SHOPIFY_WEBHOOK_SECRET
SANITY_PROJECT_ID / SANITY_DATASET / SANITY_API_TOKEN
ANTHROPIC_API_KEY
WHATSAPP_PROVIDER_* (account, token, numero mittente, template)
RESEND_API_KEY
FARMACONSULT_SFTP_* (host, utente, chiave) — quando disponibili
SENTRY_DSN
```

Nessuna chiave nel codice. Le chiavi le inserisce Giovanni su Vercel.

---

## 15. Modello dati (Supabase / Postgres)

Schema indicativo, da rifinire. Tutte le tabelle con `id uuid`, `created_at`, `updated_at`. **Row Level Security attiva ovunque.**

**Persone e accesso**
- `profiles` (id = auth.users.id, nome, cognome, telefono verificato, email, data di nascita facoltativa, comune, CAP, ruolo: `customer` | `staff` | `beauty` | `admin`)
- `loyalty_cards` (profile_id, numero tessera, codice a barre, collegata il)
- `consents` (profile_id, tipo: privacy/servizi_sanitari/marketing/whatsapp, versione testo, canale: carta/online, data, revocato il)

**Agenda**
- `resources` (nome, tipo: cabina_analisi/skinlab/farmaestetica/video/evento, orari settimanali, buffer minuti)
- `services` (slug, nome, gruppo/bisogno, prezzo, durata, preparazione, risorse ammesse, prenotabile online sì/no, attivo, ordine)
- `opening_hours`, `closures` (date, risorsa, motivo)
- `appointments` (profile_id, service_id, resource_id, inizio, fine, stato: in_attesa/confermato/arrivato/fatto/annullato/non_presentato, canale: online/telefono/banco, note) — **vincolo di esclusione** su `tstzrange(inizio, fine + buffer)` per risorsa
- `appointment_holds` (blocco temporaneo 5 minuti)
- `packages` (profile_id, servizio, sedute totali, sedute usate) — pacchetti 5+1
- `gift_vouchers` (codice, importo o servizio, acquirente, destinatario, scadenza, riscattato)

**SkinLab Routine**
- `product_meta` (ean, nome, marchio, capacità, unità, categoria passaggio, dose standard, istruzioni, shopify_variant_id)
- `routines` (profile_id, tipo: viso/capelli/integratore, creata da staff_id, allegati, nota vocale, attiva, data prossima analisi)
- `routine_steps` (routine_id, ean, ordine, momento: mattina/sera/entrambi, frequenza, quantità)
- `routine_logs` (routine_id, data, momento, fatto)

**Ricette e documenti**
- `prescription_requests` (profile_id, tipo: normale/galenica, foto (storage privato), NRE, stato: inviata/in_valutazione/preventivo/approvata/in_preparazione/pronta/consegnata/rifiutata, preventivo, consegna: ritiro/locker/rider)
- `documents` (profile_id, tipo: referto/analisi/altro, file, caricato da)

**Commercio**
- `orders_mirror` (shopify_order_id, profile_id, zona: seregno/italia, stato consegna, rider, inviato al gestionale come prenotato sì/no)
- `credits` (profile_id, importo, origine: videoconsulenza/analisi_pelle, scadenza, usato)

**Comunicazioni**
- `notifications` (profile_id, canale, template, stato, inviato il) — registro di tutto ciò che parte
- `newsletter_subscribers` (email/telefono, consenso, origine)

**Assistenti**
- `kb_chunks` (fonte, testo, embedding vector) per il RAG
- `assistant_logs` (anonimizzati)

Ruoli: il personale vede l'agenda e i profili; solo `admin` modifica prezzi e servizi; `beauty` vede solo la risorsa Farmaestetica. Le foto delle ricette e i referti sono leggibili solo dal cliente proprietario e dal personale.

---

## 16. Integrazioni esterne

### Farmaconsult (gestionale della farmacia)

Cosa sappiamo (versione ottobre 2026): operazioni automatiche programmabili con estrazioni già attive verso software esterni; archivio prodotti con funzione Esporta (giacenza, prenotati, ditta, ricarico, scadenza, prezzo); "elenco prenotati"; fidelity a punti; in configurazione "genera token auth" e "g.remota" (indizi di un servizio web).

Richieste inviate/da inviare a Farmaconsult (referente Danilo):
1. **Estrazione catalogo ogni 30 minuti** su SFTP: EAN, Minsan, descrizione, ditta, reparto, tipo prodotto, prezzo, promo con date, IVA, giacenza al netto dei prenotati.
2. **Ordini e "metti da parte"** dal sito importati come **prenotati**, collegati al cliente.
3. **Saldo punti** per numero tessera e punti sugli acquisti online.
4. Documentazione del servizio web legato a "genera token auth".
5. Prenotati online prelevabili dal robot.

**Piano B** se il servizio web non c'è: estrazione a file per catalogo e giacenze; ordini registrati come prenotati dal banco con un clic da `/staff/ordini`.

### Ponte catalogo (job ogni 30 minuti)

Legge il file Farmaconsult → normalizza → crea/aggiorna prodotti e varianti su Shopify (per EAN), aggiorna giacenze e prezzi, applica promo con date di inizio/fine (prezzo barrato = `compareAtPrice`), esclude i farmaci (tipo prodotto) finché non sono autorizzati. Arricchimento manuale (foto, testi, video, "chi lo ha formulato") su Shopify o Sanity: **non deve essere sovrascritto** dal ponte. Registro di ogni esecuzione e allarme se fallisce due volte di fila.

### Shopify

Nuovo negozio (separato da dottormasera.it). Webhook `orders/create`, `orders/updated` → `orders_mirror` + notifiche + invio al gestionale. Tariffe di spedizione: Seregno (CAP 20831) gratis in giornata con contrassegno; Italia gratis sopra 59 €.

### WhatsApp Business API

Numero: quello della farmacia (373 770 5485) **[DA CONFERMARE: la migrazione all'API toglie il numero dall'app WhatsApp Business normale — valutare un numero dedicato]**. Template da far approvare a Meta: conferma appuntamento, promemoria con "confermo/sposto", è pronta, rider in arrivo, preventivo ricetta, routine inviata, prodotto in finitura, codice di accesso.

### Rider

Costo e modalità li gestisce Giovanni. Il sistema produce alle 16:00 l'**elenco consegne del giorno** (`/staff/consegne`) con indirizzi ordinati e un pulsante "partito" che invia "il rider sta arrivando".

---

## 17. Privacy, legale, accessibilità, SEO

| Tema | Come lo gestiamo |
|---|---|
| Dati sanitari (ricette, referti, analisi, routine) | Server in UE, accessi per ruolo, consensi specifici, cifratura a riposo, registro accessi |
| Fornitori (Shopify, Supabase, Vercel, WhatsApp, Sanity, Anthropic, Farmaconsult) | Nomina a responsabile del trattamento (DPA) per ciascuno |
| Privacy e cookie policy, termini di vendita | Testi nuovi completi; banner cookie con "rifiuta" facile quanto "accetta"; nessun cookie non tecnico prima del consenso |
| Vendita online | Al lancio solo parafarmaco; farmaci SOP/OTC solo con autorizzazione regionale e logo ministeriale |
| Ricette | Foto solo per preventivo, originale obbligatorio; solo Seregno; pacco sigillato da un farmacista |
| Assistenti | Informazioni generali, nessuna diagnosi, rinvio a medico e 112 |
| Integratori e cosmetici | Solo indicazioni ammesse |
| Credito consulenza | Formula "scalata dalla spesa" |
| Promo | Prezzo barrato e percentuale sempre indicati |
| Diritto di recesso | 14 giorni per gli acquisti online, con le esclusioni di legge per prodotti sigillati aperti per motivi igienici |
| Dati della farmacia nel footer | Ragione sociale, P.IVA **[DA INSERIRE]**, direttore responsabile, ordine professionale |

Prima del lancio: far rileggere privacy, termini e flusso ricette a un consulente o all'Ordine/Federfarma.

**Accessibilità**: WCAG 2.1 AA (contrasto, testo alternativo, navigazione da tastiera, focus visibile, etichette dei moduli, riduci movimento). Pubblico anche anziano: corpo 16–18 px, pulsanti ≥ 44×44 px.

**SEO e prestazioni**
- Dati strutturati: `Pharmacy` / `LocalBusiness` (indirizzo, orari, telefono, coordinate), `Product`, `Service`, `FAQPage`, `BreadcrumbList`.
- Meta title e description per ogni pagina (già scritti per il sito attuale: riprenderli).
- Sitemap, robots, canonical, Open Graph con immagini del marchio.
- Core Web Vitals: LCP < 2,5 s, CLS < 0,1, INP < 200 ms su telefono.
- **Reindirizzamenti 301** di tutte le pagine del sito attuale (vedi paragrafo 19).

---

## 18. Fasi di sviluppo e criteri di "fatto"

| Fase | Contenuto | Periodo indicativo |
|---|---|---|
| **0 – Fondamenta** | Repository, monorepo, token e componenti base, motion, Supabase e Sanity collegati, ambiente di prova protetto, D-U-N-S richiesto, risposta Farmaconsult | Novembre 2026 |
| **1 – Sito e Agenda** | Sito vetrina completo (home, farmacia, servizi e prezzi, famiglia, robot, ZTL, galenico, deblistering, Skin LAB, Farmaestetica, newsletter, legale) + Agenda Masera con vista personale → **switch del dominio** | Dicembre 2026 – gennaio 2027 |
| **2 – Shop e MyMasera** | Shop con catalogo dal gestionale, consegna Seregno/Italia, promo, Le Nostre Linee, Invia una ricetta, MyMasera, tessera | Febbraio – marzo 2027 |
| **3 – Intelligenza** | SkinLab Routine (pannello penna ottica + rituale), assistenti, videoconsulenza con credito, buoni regalo digitali | Aprile – maggio 2027 |
| **4 – App** | App su App Store e Google Play, Wallet, push; dismissione di dottormasera.it | Da giugno 2027 |

**Ogni funzione è "fatta" quando:**
- funziona su telefono (390 px) e desktop (1440 px);
- rispetta contrasto AA e riduci movimento;
- ha i testi definitivi in italiano (niente "Lorem ipsum");
- ha test automatici per la logica (regole di consegna, disponibilità agenda, stima fine prodotto);
- Giovanni l'ha provata sull'ambiente di prova e ha detto ok.

---

## 19. Piano di switch dal sito attuale

Sito attuale: CMS del Consorzio Farmacia Laboratorio (`farmaciamasera.com/admin`). Agenda attuale: `agenda.farmacialaboratorio.it`. Dominio su **Register** (hosting Linux Smart, rinnovo 31/05/2027, intestato a Giuseppe Masera). **Le impostazioni della posta non si toccano.**

1. Costruzione su `nuovo.farmaciamasera.com`, protetto e nascosto a Google.
2. Prova generale 1–2 settimane prima: le dottoresse usano Agenda Masera in parallelo a quella del consorzio.
3. **Mappa dei vecchi indirizzi** → 301 verso le nuove pagine. Pagine note del sito attuale: `/` , `/la-farmacia`, `/servizi/...` (es. `/servizi/autoanalisi-del-sangue`), `/contatti`, `/farmacie-di-turno`, `/carta-fedelta`, `/famiglia-masera`, `/ztl`, `/prezzi-servizi`, `/prenotazione-servizi`, `/reparti/...` (dermocosmesi, integratori, alimentazione, veterinaria, galenico, deblistering). **Fare un crawl completo prima dello switch** per non dimenticarne nessuna.
4. Giorno dello switch (domenica sera): ultima esportazione dall'agenda del consorzio, importazione, controllo degli appuntamenti futuri, cambio DNS (solo record A/CNAME del sito, **mai gli MX**).
5. Il vecchio sito resta salvato e spento per qualche settimana come paracadute; poi disdetta del servizio del consorzio.
6. Dopo lo switch: Google Search Console, sitemap, controllo 404, aggiornamento link in bio e su Google Business Profile, Cup24/"Prenota con Google" **[DA CONFERMARE se mantenere]**.

---

## 20. Costi ricorrenti indicativi

(da verificare sui listini aggiornati prima di attivare)

| Voce | Ordine di grandezza |
|---|---|
| Shopify (piano Basic) | ~30–40 €/mese |
| Vercel (Pro) | ~20 $/mese |
| Supabase (Pro, UE) | ~25 $/mese |
| Sanity | 0–15 $/mese |
| WhatsApp Business API | a messaggio, pochi centesimi |
| Assistenti (Claude) | a consumo |
| Resend (mail) | 0–20 $/mese |
| Apple / Google | ~99 $/anno / 25 $ una tantum |
| Dominio (Register) | già attivo |

Il costo dell'agenda del consorzio e degli SMS sparisce dopo lo switch.

---

## 21. Decisioni aperte

| # | Tema | Chi decide |
|---|---|---|
| 1 | Costo di spedizione in Italia sotto i 59 € | Giovanni |
| 2 | Prezzo dell'analisi del cuoio capelluto | Giovanni |
| 3 | Testi di preparazione (digiuno 8 ore, dieta breath test) | Farmaciste |
| 4 | Vaccino COVID: tenerlo o no tra i servizi | Giovanni |
| 5 | Marchi del reparto veterinaria | Giovanni |
| 6 | Numeri tecnici del robot (confezioni, secondi per prelievo) | Costruttore |
| 7 | Licenza web TT Fors o restare su DM Sans | Giovanni |
| 8 | Numero WhatsApp per l'API (attuale o dedicato) | Giovanni |
| 9 | Fornitore videochiamata e metodi di pagamento online | Claude Code propone, Giovanni sceglie |
| 10 | Quante ore prima si può spostare/annullare un appuntamento | Giovanni |
| 11 | Durata di conservazione delle foto delle ricette | Giovanni + consulente privacy |
| 12 | Mantenere Cup24 / "Prenota con Google" | Giovanni |
| 13 | Data ufficiale della reinaugurazione (non pubblicare prima) | Giovanni |
| 14 | P.IVA e dati legali del footer | Giovanni |
| 15 | Parere di Ordine/Federfarma sulla consegna a domicilio dei farmaci su ricetta | Giovanni |

---

## 22. Materiali di riferimento nel kit

| Cartella | Contenuto |
|---|---|
| `design/canvas/` | Prototipi HTML del concept (homepage, mappa ZTL, robot, Farmaestetica, Skin LAB, schermate app, sistema di movimento). Si aprono nel browser solo come riferimento: il formato `.dc.html` è del canvas di Claude Design, **non è codice da copiare** ma da ricostruire in React. Versione navigabile: https://claude.ai/artifact/26e2RKLWbw4519nh9ENnRs |
| `design/ztl/` | Mappa ZTL reale (SVG animato ravvicinato, statico) e poster "Come raggiungerci" |
| `design/robot/` | Foto del robot Medistore HL |
| `design/sito-attuale/` | Pagine HTML fatte per il sito attuale (listino servizi, pagina ZTL, pagina ponte) |
| `assets/` | Logo web (colore, bianco, bollo) e immagine "ieri/oggi" |
| `data/` | `servizi.json`, `farmaestetica.json`, `miamo-lounge.json`, `farmacia.json` (orari, contatti, regole consegna) |

Documenti nel progetto Claude "Sito Farmacia Masera" (scaricarli e metterli in `docs/riferimenti/`): documento di progetto (PDF, 17 pagine), prezzi servizi (PDF), report tecnico del robot (PDF), immagine coordinata CAEM (PDF).
