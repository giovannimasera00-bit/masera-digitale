import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { contattoPrivacy, legalUpdated, titolare } from "@/content/legale";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Come la Farmacia Masera tratta i dati personali di chi visita il sito.",
};

// Testo in revisione: va riletto da un consulente privacy prima del lancio (BRIEF §17).
// Descrive il sito di oggi: nessun account, nessun modulo, nessun cookie di profilazione.
// Quando arrivano prenotazioni, MyMasera, shop e ricette va ampliato.
export default function PrivacyPage() {
  return (
    <LegalPage
      path="/privacy"
      crumb="Privacy"
      kicker="Informativa privacy"
      title={["I tuoi dati,", <span key="t" className="text-verde">trattati con cura.</span>]}
      lead="Questa pagina spiega quali dati raccoglie il sito della Farmacia Masera, perché e quali sono i tuoi diritti. Oggi il sito è una vetrina: non ti chiede di registrarti e non usa cookie di profilazione."
      updated={legalUpdated}
      sections={[
        {
          id: "titolare",
          title: "Chi tratta i dati",
          body: (
            <>
              <p>
                Il titolare del trattamento è <b>{titolare.nome}</b>, {titolare.sede}, P.IVA {titolare.piva}.
              </p>
              <p>Per qualsiasi domanda sui tuoi dati puoi scriverci a {contattoPrivacy}.</p>
            </>
          ),
        },
        {
          id: "quali",
          title: "Quali dati raccoglie il sito",
          body: (
            <>
              <p>Il sito oggi non ha moduli, non chiede di creare un account e non vende online.</p>
              <ul>
                <li>
                  <b>Dati tecnici di navigazione.</b> Come ogni sito, i server che lo ospitano registrano dati tecnici (per esempio indirizzo IP, tipo di
                  browser, pagina richiesta e orario). Servono solo a far funzionare il sito e a proteggerlo da abusi.
                </li>
                <li>
                  <b>Messaggi che ci mandi.</b> Se ci scrivi su WhatsApp o ci chiami, usiamo il tuo numero e quello che ci scrivi solo per risponderti.
                </li>
              </ul>
              <p>
                Il sito non usa cookie di profilazione né strumenti di statistica che ti tracciano. I dettagli sono nella pagina{" "}
                <Link href="/cookie">Cookie</Link>.
              </p>
            </>
          ),
        },
        {
          id: "perche",
          title: "Perché e su quale base",
          body: (
            <ul>
              <li>Far funzionare il sito e proteggerlo: legittimo interesse del titolare.</li>
              <li>Rispondere alle tue richieste: misure precontrattuali o richiesta dell&apos;interessato.</li>
            </ul>
          ),
        },
        {
          id: "chi",
          title: "Chi può vedere i dati",
          body: (
            <>
              <p>
                I dati sono trattati dal personale della farmacia autorizzato e dai fornitori tecnici che ci aiutano a far funzionare il sito (per esempio
                il servizio di hosting), nominati responsabili del trattamento. L&apos;elenco aggiornato è disponibile su richiesta.
              </p>
              <p>Non vendiamo i tuoi dati e non li cediamo a terzi per pubblicità.</p>
              <p>Dove sono conservati i server: [DA CONFERMARE].</p>
            </>
          ),
        },
        {
          id: "quanto",
          title: "Per quanto tempo",
          body: (
            <ul>
              <li>Dati tecnici di navigazione: [DA CONFERMARE].</li>
              <li>Messaggi e richieste: il tempo necessario a rispondere e gestire la richiesta, [DA CONFERMARE].</li>
            </ul>
          ),
        },
        {
          id: "diritti",
          title: "I tuoi diritti",
          body: (
            <>
              <p>
                Puoi chiedere in ogni momento di vedere i tuoi dati, correggerli, cancellarli, limitarne l&apos;uso, riceverne una copia o opporti al
                trattamento (articoli 15–22 del Regolamento UE 2016/679, GDPR). Basta scriverci a {contattoPrivacy}.
              </p>
              <p>
                Se pensi che i tuoi dati siano trattati in modo non corretto puoi presentare reclamo al Garante per la protezione dei dati personali
                (garanteprivacy.it).
              </p>
            </>
          ),
        },
        {
          id: "novita",
          title: "Cosa cambierà",
          body: (
            <p>
              Con le prenotazioni online, l&apos;area clienti MyMasera e lo shop questa informativa verrà ampliata, con consensi specifici per i dati
              sanitari. Pubblicheremo qui ogni modifica, con la data di aggiornamento.
            </p>
          ),
        },
      ]}
    />
  );
}
