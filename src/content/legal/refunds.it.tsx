import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Puoi chiedere il rimborso di qualsiasi addebito di un piano a pagamento entro 14 giorni di calendario dalla sua esecuzione.",
  "La prova gratuita non costa nulla: se disdici prima che finisca, il piano Pro non viene addebitato.",
  "La richiesta si fa su paddle.net o via email, e il denaro torna sullo stesso mezzo di pagamento.",
  "Puoi disdire quando vuoi; il piano resta attivo fino alla fine del periodo pagato.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "plazo",
    title: "Termine per il rimborso",
    brief:
      "14 giorni di calendario da ogni addebito.",
    content: (
      <>
        <p>
          Puoi chiedere il rimborso di qualsiasi addebito di un piano a
          pagamento di Tivvu, sia il primo pagamento sia un rinnovo, entro 14
          giorni di calendario dalla sua esecuzione. Se approvato, ti
          restituiamo l’importo intero di quell’addebito, comprese le imposte
          pagate.
        </p>
        <p>
          Trascorso tale termine non rimborsiamo i periodi già iniziati, salvo
          che la legge applicabile disponga diversamente o che l’addebito sia
          stato un errore.
        </p>
      </>
    ),
  },
  {
    id: "prueba-gratis",
    title: "Prova gratuita",
    brief:
      "Nei 14 giorni non si addebita nulla.",
    content: (
      <>
        <p>
          La prova gratuita dura 14 giorni e non costa nulla. Se disdici prima
          che finisca, il piano Pro non viene addebitato. Se non disdici, alla
          fine della prova parte il piano Pro e ne viene addebitato il primo
          periodo; da quell’addebito vale il termine di 14 giorni.
        </p>
      </>
    ),
  },
  {
    id: "como-pedirlo",
    title: "Come chiedere un rimborso",
    brief:
      "Su paddle.net o via email.",
    content: (
      <>
        <p>
          Paddle, che è il merchant of record dei nostri piani, gestisce
          addebiti e rimborsi. Puoi chiederlo su{" "}
          <LegalLink href="https://paddle.net">paddle.net</LegalLink> con
          l’email del tuo acquisto, oppure scriverci a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>{" "}
          e ti aiutiamo a gestirlo.
        </p>
        <p>
          L’importo torna sul mezzo di pagamento che hai usato. Il tempo
          necessario perché compaia dipende dalla tua banca o dalla carta.
        </p>
      </>
    ),
  },
  {
    id: "cancelar",
    title: "Disdire il piano",
    brief:
      "Puoi disdire quando vuoi.",
    content: (
      <>
        <p>
          Disdire e chiedere un rimborso sono cose diverse. Puoi disdire il
          piano in qualsiasi momento dalle impostazioni dell’account; resta
          attivo fino alla fine del periodo già pagato. Come si disdice e cosa
          succede ai tuoi dati è spiegato nei <LegalLink href="/terms">Termini e
          condizioni</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "tus-derechos",
    title: "I tuoi diritti",
    brief:
      "Questa politica non limita i diritti che la legge ti riconosce.",
    content: (
      <>
        <p>
          Questa politica non limita i diritti che la legge ti riconosce come
          consumatore, per esempio il diritto di recesso. Per qualsiasi dubbio
          scrivici a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Politica di rimborso",
  metaDescription:
    "Quando e come chiedere il rimborso di un pagamento Tivvu.",
  title: "Politica di rimborso",
  intro: (
    <p>
      Quando puoi chiedere la restituzione di un pagamento, come fare e cosa
      succede con la prova gratuita.
    </p>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Termini e condizioni" },
};
