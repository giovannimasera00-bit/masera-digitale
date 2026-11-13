# Kit di progetto — Farmacia Masera digitale

Prima di tutto leggi **GUIDA-OPERATIVA.md** (per Giovanni) e **docs/BRIEF.md** (per Claude Code).

---

# Guida operativa — dal progetto al sito online

Per Giovanni. Passi in ordine. ✋ = lo fai tu. 🤖 = lo fa Claude Code.

---

## Parte A — Preparare gli account (una volta sola, ~1 ora)

| # | Cosa | Dove | Note |
|---|---|---|---|
| A1 ✋ | Crea un account **GitHub** | github.com | Meglio con la mail della farmacia. |
| A2 ✋ | Crea un account **Vercel** e collegalo a GitHub | vercel.com → "Continue with GitHub" | Piano Hobby per iniziare, Pro (~20 $/mese) prima del lancio. |
| A3 ✋ | Crea un account **Supabase** | supabase.com | Il progetto lo crea Claude Code; tu scegli regione **Frankfurt (UE)**. |
| A4 ✋ | Crea un account **Sanity** | sanity.io | Servirà per modificare testi, promo, newsletter. |
| A5 ✋ | Crea un **nuovo negozio Shopify** (non toccare dottormasera.it) | shopify.com | Serve dalla fase 2. Puoi farlo dopo. |
| A6 ✋ | Richiedi il **codice D-U-N-S** della farmacia | dnb.com (gratuito) | Serve per l'app su App Store. Ci vogliono giorni: fallo subito. |
| A7 ✋ | Account sviluppatore **Apple** (99 $/anno) e **Google Play** (25 $) | developer.apple.com, play.google.com/console | Intestati alla farmacia. Solo per la fase 4. |
| A8 ✋ | Chiave **Anthropic** per gli assistenti | console.anthropic.com | Solo dalla fase 3. |

Le chiavi segrete non vanno mai incollate nel codice o in chat: si inseriscono su Vercel → Settings → Environment Variables. Claude Code ti dice il nome esatto di ciascuna.

---

## Parte B — Avviare Claude Code (~15 minuti)

1. ✋ Vai su **claude.ai/code** (oppure installa Claude Code sul PC).
2. ✋ Collega **GitHub** quando te lo chiede.
3. ✋ Crea un repository vuoto chiamato `masera-digitale` (privato).
4. ✋ Carica dentro **tutto il contenuto di questo kit** (cartella `masera-digitale`), così com'è.
5. ✋ Dal progetto Claude "Sito Farmacia Masera" scarica i 4 PDF (documento di progetto, prezzi servizi, report robot, immagine coordinata) e mettili in `docs/riferimenti/`.
6. ✋ Apri Claude Code sul repository e incolla il **primo messaggio** qui sotto.

### Primo messaggio da incollare

```
Ciao. Questo repository è il nuovo ecosistema digitale della Farmacia Masera.
Leggi CLAUDE.md e docs/BRIEF.md per intero, poi guarda design/ e data/.

Iniziamo dalla Fase 0 – Fondamenta:
1. monorepo pnpm + Turborepo con apps/web (Next.js, TypeScript, Tailwind);
2. token di colore, font, motion e i componenti base (pulsante, card, barra a 5 colori, arco del logo, titolo che sale);
3. una pagina /design che mostra tutti i componenti;
4. collegamento a Vercel con anteprima protetta.

Prima di scrivere codice fammi un piano breve a punti e dimmi cosa ti serve da me.
Parla semplice: non sono uno sviluppatore.
```

---

## Parte C — Come procedere, fase per fase

Ogni fase segue lo stesso ritmo:
1. 🤖 Claude Code propone un piano breve. ✋ Tu dici "ok" o correggi.
2. 🤖 Costruisce su un branch e ti dà un **link di anteprima**.
3. ✋ Apri il link **sul telefono e sul PC**, controlli testi, prezzi, animazioni.
4. ✋ Scrivi cosa cambiare, in modo semplice ("il titolo è troppo grande sul telefono").
5. 🤖 Corregge. Quando ti va bene: "unisci". 
6. 🤖 Aggiorna `docs/STATO.md`.

### Messaggi pronti per ogni fase

**Fase 1a – Sito vetrina**
```
Fase 1: costruisci il sito vetrina seguendo docs/BRIEF.md paragrafi 6 e 7.
Ordine: homepage → servizi e prezzi (da data/servizi.json) → ZTL con la mappa animata
→ la farmacia e la famiglia → robot → Skin LAB → Farmaestetica → galenico e deblistering
→ contatti e pagine legali. Una pagina alla volta, con anteprima.
```

**Fase 1b – Agenda Masera**
```
Fase 1: costruisci Agenda Masera (BRIEF paragrafo 9) con Supabase in UE:
prenotazione online con conferma immediata, buffer di pulizia, promemoria,
vista del personale per cabina con inserimento rapido. Tutto con dati di prova.
```

**Switch** → vedi Parte D.

**Fase 2 – Shop e MyMasera**
```
Fase 2: shop headless con Shopify (BRIEF paragrafi 8, 10, 11, 16):
catalogo, regole di consegna Seregno/Italia, promo, Le Nostre Linee,
Invia una ricetta solo per Seregno, MyMasera con accesso via codice sul telefono e tessera.
Prima prepara il ponte con il file del gestionale Farmaconsult.
```

**Fase 3 – Intelligenza**
```
Fase 3: SkinLab Routine (pannello con penna ottica + rituale del cliente),
assistenti con Claude e relativi test, videoconsulenza con credito, buoni regalo.
BRIEF paragrafi 10 e 12.
```

**Fase 4 – App**
```
Fase 4: app MyMasera con Expo in apps/mobile, stesse API del sito,
notifiche push, tessera in Apple Wallet e Google Wallet. BRIEF paragrafo 13.
```

---

## Parte D — Il giorno dello switch (fine fase 1)

| # | Quando | Cosa |
|---|---|---|
| D1 | 2 settimane prima | ✋ Le dottoresse usano Agenda Masera in parallelo alla vecchia. |
| D2 | 1 settimana prima | 🤖 Crawl del sito attuale e lista completa dei reindirizzamenti. ✋ Controlli la lista. |
| D3 | Domenica sera | ✋ Esporti appuntamenti e clienti dall'agenda del consorzio. 🤖 Li importa. ✋ Controlli gli appuntamenti futuri. |
| D4 | Domenica sera | ✋ Su **Register** cambi **solo** i record del sito (A/CNAME) come indica Vercel. **Non toccare la posta (MX).** |
| D5 | Lunedì | 🤖 Controllo pagine, 404, sitemap su Google Search Console. ✋ Aggiorni link in bio e Google Business Profile. |
| D6 | Dopo qualche settimana | ✋ Disdici il servizio del consorzio. |

---

## Parte E — Cose da fare in parallelo (tu)

- [ ] Rispondere alle **decisioni aperte** (BRIEF paragrafo 21).
- [ ] Mail a **Farmaconsult** (Danilo): estrazione catalogo ogni 30 minuti, ordini come prenotati, saldo punti, documentazione servizio web.
- [ ] Esportare l'elenco prodotti dal gestionale (archivio prodotti → utilità → Esporta) e darlo a Claude Code.
- [ ] Numeri tecnici del robot dal costruttore.
- [ ] Foto e video definitivi della farmacia a lavori finiti; foto della famiglia per la linea del tempo.
- [ ] Testi di preparazione agli esami confermati dalle farmaciste.
- [ ] Domande difficili per testare gli assistenti (dalle farmaciste).
- [ ] Parere di consulente privacy / Ordine su privacy, termini e flusso ricette.

---

## Regole d'oro per lavorare con Claude Code

1. **Un compito alla volta.** Meglio "fai la pagina ZTL" che "fai il sito".
2. **Guarda sempre l'anteprima** prima di dire ok.
3. **Se non capisci, chiedi** "spiegamelo semplice".
4. **Mai incollare password o chiavi in chat.**
5. **Decisioni irreversibili** (DNS, invii WhatsApp ai clienti, pagamenti veri): solo dopo il tuo ok esplicito.
6. Se una sessione si allunga troppo, chiedi: "aggiorna docs/STATO.md e chiudiamo qui". Nella prossima: "leggi STATO.md e riprendi".
