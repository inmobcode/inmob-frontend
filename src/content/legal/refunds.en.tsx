import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "You can request a refund of any charge for a paid plan within 14 calendar days of it being made.",
  "The free trial costs nothing: if you cancel before it ends, the Pro plan is not charged.",
  "Requests are made at paddle.net or by email, and the money goes back to the same payment method.",
  "You can cancel at any time; the plan stays active until the end of the paid period.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "plazo",
    title: "Refund period",
    brief:
      "14 calendar days from each charge.",
    content: (
      <>
        <p>
          You can request a refund of any charge for a paid Tivvu plan, whether
          the first payment or a renewal, within 14 calendar days of it being
          made. If approved, we refund the full amount of that charge, including
          any taxes you paid.
        </p>
        <p>
          After that period we do not refund periods that have already started,
          unless applicable law provides otherwise or the charge was made in
          error.
        </p>
      </>
    ),
  },
  {
    id: "prueba-gratis",
    title: "Free trial",
    brief:
      "Nothing is charged during the 14 days.",
    content: (
      <>
        <p>
          The free trial lasts 14 days and costs nothing. If you cancel before it
          ends, the Pro plan is not charged. If you do not cancel, the Pro plan
          starts when the trial ends and its first period is charged; the 14-day
          period applies from that charge.
        </p>
      </>
    ),
  },
  {
    id: "como-pedirlo",
    title: "How to request a refund",
    brief:
      "At paddle.net or by email.",
    content: (
      <>
        <p>
          Paddle, which is the merchant of record for our plans, handles charges
          and refunds. You can request one at{" "}
          <LegalLink href="https://paddle.net">paddle.net</LegalLink> using the
          email of your purchase, or write to us at{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>{" "}
          and we will help you with it.
        </p>
        <p>
          The amount goes back to the payment method you used. How long it takes
          to show up depends on your bank or card.
        </p>
      </>
    ),
  },
  {
    id: "cancelar",
    title: "Cancelling your plan",
    brief:
      "You can cancel at any time.",
    content: (
      <>
        <p>
          Cancelling and requesting a refund are different things. You can
          cancel your plan at any time from the account settings; it stays
          active until the end of the period already paid. How cancellation
          works and what happens to your data is in the{" "}
          <LegalLink href="/terms">Terms and conditions</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "tus-derechos",
    title: "Your rights",
    brief:
      "This policy does not limit the rights the law gives you.",
    content: (
      <>
        <p>
          This policy does not limit the rights the law gives you as a consumer,
          for example the right of withdrawal. If in doubt, write to us at{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Refund Policy",
  metaDescription:
    "When and how you can request a refund of a Tivvu payment.",
  title: "Refund Policy",
  intro: (
    <p>
      When you can ask for a payment to be refunded, how to do it, and what
      applies to the free trial.
    </p>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Terms and conditions" },
};
