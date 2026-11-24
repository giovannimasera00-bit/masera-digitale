// Dati comuni alle pagine legali. I testi vanno fatti rileggere a un consulente prima del lancio (BRIEF §17).
import { farmacia, isMissing } from "@masera/core";

/** Data di aggiornamento dei testi legali: si cambia ogni volta che un testo cambia. */
export const legalUpdated = "[DA CONFERMARE alla revisione del consulente]";

const a = farmacia.address;
export const titolare = {
  nome: farmacia.legal_name,
  sede: `${a.street}, ${a.zip} ${a.city} (${a.province})`,
  piva: farmacia.vat,
  pec: farmacia.pec,
  email: farmacia.email,
  telefono: farmacia.phone,
  direttore: farmacia.director,
  ordine: farmacia.professional_order,
};

/** Il canale per scrivere al titolare: l'email se c'è, altrimenti la PEC, altrimenti "[DA INSERIRE]". */
export const contattoPrivacy = !isMissing(farmacia.email) ? farmacia.email : farmacia.pec;
