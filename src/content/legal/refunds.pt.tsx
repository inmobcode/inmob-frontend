import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Pode pedir o reembolso de qualquer cobrança de um plano pago nos 14 dias seguidos após a sua realização.",
  "O teste gratuito não custa nada: se cancelar antes de terminar, não é cobrado o plano Pro.",
  "O pedido faz-se em paddle.net ou por email, e o dinheiro volta ao mesmo meio de pagamento.",
  "Pode cancelar quando quiser; o plano continua até ao fim do período pago.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "plazo",
    title: "Prazo de reembolso",
    brief:
      "14 dias seguidos desde cada cobrança.",
    content: (
      <>
        <p>
          Pode pedir o reembolso de qualquer cobrança de um plano pago da Tivvu,
          seja o primeiro pagamento ou uma renovação, nos 14 dias seguidos após
          a sua realização. Se for aprovado, devolvemos o valor total dessa
          cobrança, com os impostos que tenha pago.
        </p>
        <p>
          Passado esse prazo não fazemos reembolsos de períodos já iniciados,
          salvo se a lei aplicável dispuser de outro modo ou se a cobrança tiver
          sido um erro.
        </p>
      </>
    ),
  },
  {
    id: "prueba-gratis",
    title: "Teste gratuito",
    brief:
      "Durante os 14 dias não é cobrado nada.",
    content: (
      <>
        <p>
          O teste gratuito dura 14 dias e não tem custo. Se cancelar antes de
          terminar, não é cobrado o plano Pro. Se não cancelar, quando o teste
          termina começa o plano Pro e é cobrado o primeiro período; a partir
          dessa cobrança aplica-se o prazo de 14 dias.
        </p>
      </>
    ),
  },
  {
    id: "como-pedirlo",
    title: "Como pedir um reembolso",
    brief:
      "Em paddle.net ou por email.",
    content: (
      <>
        <p>
          A Paddle, que é o comerciante de registo (merchant of record) dos
          nossos planos, gere as cobranças e os reembolsos. Pode pedi-lo em{" "}
          <LegalLink href="https://paddle.net">paddle.net</LegalLink> com o
          email da sua compra, ou escrever-nos para{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>{" "}
          e ajudamos a geri-lo.
        </p>
        <p>
          O valor volta ao mesmo meio de pagamento que utilizou. O tempo que
          demora a aparecer depende do seu banco ou do cartão.
        </p>
      </>
    ),
  },
  {
    id: "cancelar",
    title: "Cancelar o seu plano",
    brief:
      "Pode cancelar quando quiser.",
    content: (
      <>
        <p>
          Cancelar e pedir um reembolso são coisas diferentes. Pode cancelar o
          seu plano a qualquer momento nas definições da conta; o plano continua
          ativo até ao fim do período já pago. Como se cancela e o que acontece
          com os seus dados está nos <LegalLink href="/terms">Termos e
          condições</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "tus-derechos",
    title: "Os seus direitos",
    brief:
      "Esta política não limita os direitos que a lei lhe reconhece.",
    content: (
      <>
        <p>
          Esta política não limita os direitos que a lei lhe reconheça como
          consumidor, por exemplo o direito de livre resolução do contrato. Em
          caso de dúvida, escreva-nos para{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Política de reembolsos",
  metaDescription:
    "Quando e como pode pedir o reembolso de um pagamento da Tivvu.",
  title: "Política de reembolsos",
  intro: (
    <p>
      Quando pode pedir que lhe devolvamos um pagamento, como fazê-lo e o que
      acontece com o teste gratuito.
    </p>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Termos e condições" },
};
