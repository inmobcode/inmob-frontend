import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Podés pedir el reembolso de cualquier cobro de un plan pago dentro de los 14 días corridos desde que se hizo.",
  "La prueba gratis no cuesta nada: si cancelás antes de que termine, no se te cobra el plan Pro.",
  "El pedido se hace en paddle.net o por email, y el dinero vuelve al mismo medio de pago.",
  "Podés cancelar cuando quieras; el plan sigue hasta el final del período pagado.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "plazo",
    title: "Plazo de reembolso",
    brief:
      "14 días corridos desde cada cobro.",
    content: (
      <>
        <p>
          Podés pedir el reembolso de cualquier cobro de un plan pago de Tivvu,
          ya sea el primer pago o una renovación, dentro de los 14 días corridos
          desde que se realizó. Si se aprueba, te devolvemos el importe completo
          de ese cobro, con los impuestos que hayas pagado.
        </p>
        <p>
          Pasado ese plazo no hacemos reembolsos de períodos ya comenzados,
          salvo que la ley aplicable disponga otra cosa o que el cobro haya sido
          un error.
        </p>
      </>
    ),
  },
  {
    id: "prueba-gratis",
    title: "Prueba gratis",
    brief:
      "Durante los 14 días no se cobra nada.",
    content: (
      <>
        <p>
          La prueba gratis dura 14 días y no tiene costo. Si cancelás antes de
          que termine, no se te cobra el plan Pro. Si no cancelás, al terminar
          la prueba empieza el plan Pro y se cobra su primer período; desde ese
          cobro rige el plazo de 14 días.
        </p>
      </>
    ),
  },
  {
    id: "como-pedirlo",
    title: "Cómo pedir un reembolso",
    brief:
      "En paddle.net o por email.",
    content: (
      <>
        <p>
          Paddle, que es el vendedor oficial (merchant of record) de nuestros
          planes, gestiona los cobros y los reembolsos. Podés pedirlo en{" "}
          <LegalLink href="https://paddle.net">paddle.net</LegalLink> con el
          email de tu compra, o escribirnos a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>{" "}
          y te ayudamos a gestionarlo.
        </p>
        <p>
          El importe vuelve al mismo medio de pago que usaste. Cuánto tarda en
          verse depende de tu banco o de tu tarjeta.
        </p>
      </>
    ),
  },
  {
    id: "cancelar",
    title: "Cancelar tu plan",
    brief:
      "Podés cancelar cuando quieras.",
    content: (
      <>
        <p>
          Cancelar y pedir un reembolso son cosas distintas. Podés cancelar tu
          plan en cualquier momento desde los ajustes de la cuenta; el plan
          sigue activo hasta el final del período ya pagado. Cómo se cancela y
          qué pasa con tus datos está en los <LegalLink href="/terms">Términos y
          condiciones</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "tus-derechos",
    title: "Tus derechos",
    brief:
      "Esta política no limita los derechos que te da la ley.",
    content: (
      <>
        <p>
          Esta política no limita los derechos que la ley te reconozca como
          consumidor, por ejemplo el derecho de revocación de la contratación.
          Si tenés dudas, escribinos a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Política de reembolsos",
  metaDescription:
    "Cuándo y cómo podés pedir el reembolso de un pago de Tivvu.",
  title: "Política de reembolsos",
  intro: (
    <p>
      Cuándo podés pedir que te devolvamos un pago, cómo hacerlo y qué pasa con
      la prueba gratis.
    </p>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Términos y condiciones" },
};
