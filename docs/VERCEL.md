# Mettere il sito su Vercel (una volta sola)

Tempo: circa 10 minuti. Le cose da cliccare sono in **grassetto**.

## 1. Il codice su GitHub
1. Su github.com crea il repository **privato** `masera-digitale`, **vuoto** (senza README).
2. Dai il link a Claude Code: carica lui il codice.

## 2. Il progetto su Vercel
1. Su vercel.com → **Add New… → Project** → scegli `masera-digitale` → **Import**.
2. **Root Directory**: clicca **Edit** e scegli `apps/web`.
3. Framework: deve comparire **Next.js** (lo riconosce da solo). Il resto lascialo com'è.
4. **Deploy**. Dopo un paio di minuti ricevi un link `…vercel.app`.

La regione di Francoforte (`fra1`) è già impostata nel file `apps/web/vercel.json`.

## 3. Anteprime protette e nascoste a Google
- **Settings → Deployment Protection → Vercel Authentication**: deve essere attiva (**Standard Protection**).
  Così le anteprime di ogni modifica si aprono solo dopo l'accesso con il tuo account Vercel.
- Il sito dice già a Google di **non indicizzarlo** (intestazione `X-Robots-Tag: noindex` e `robots.txt` che blocca tutto).
  Diventerà visibile solo quando su Vercel aggiungeremo la variabile `SITE_INDEXABLE` = `true`, il giorno dello switch.

Attenzione: con il piano gratuito (Hobby) l'indirizzo principale `…vercel.app` resta raggiungibile da chi conosce il link
(nascosto a Google, ma non protetto da password). La protezione con password e il dominio di prova `nuovo.farmaciamasera.com`
protetto richiedono il piano **Pro** (~20 $/mese). Il piano Pro serve comunque per un uso commerciale.

## 4. Chiavi segrete (più avanti)
Non servono in Fase 0. Quando serviranno: **Settings → Environment Variables**, nome e valore indicati da Claude Code.
Mai incollarle in chat.
