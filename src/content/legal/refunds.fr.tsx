import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Vous pouvez demander le remboursement de tout prélèvement d’une offre payante dans les 14 jours calendaires suivant son exécution.",
  "L’essai gratuit ne coûte rien : si vous résiliez avant sa fin, l’offre Pro ne vous est pas facturée.",
  "La demande se fait sur paddle.net ou par e-mail, et l’argent revient sur le même moyen de paiement.",
  "Vous pouvez résilier à tout moment ; l’offre reste active jusqu’à la fin de la période payée.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "plazo",
    title: "Délai de remboursement",
    brief:
      "14 jours calendaires à compter de chaque prélèvement.",
    content: (
      <>
        <p>
          Vous pouvez demander le remboursement de tout prélèvement d’une offre
          payante Tivvu, qu’il s’agisse du premier paiement ou d’un
          renouvellement, dans les 14 jours calendaires suivant son exécution.
          S’il est accepté, nous vous rendons le montant total de ce
          prélèvement, taxes payées comprises.
        </p>
        <p>
          Passé ce délai, nous ne remboursons pas les périodes déjà commencées,
          sauf si la loi applicable en dispose autrement ou si le prélèvement
          résulte d’une erreur.
        </p>
      </>
    ),
  },
  {
    id: "prueba-gratis",
    title: "Essai gratuit",
    brief:
      "Rien n’est débité pendant les 14 jours.",
    content: (
      <>
        <p>
          L’essai gratuit dure 14 jours et ne coûte rien. Si vous résiliez avant
          sa fin, l’offre Pro ne vous est pas facturée. Si vous ne résiliez pas,
          l’offre Pro commence à la fin de l’essai et sa première période est
          facturée ; à partir de ce prélèvement, le délai de 14 jours
          s’applique.
        </p>
      </>
    ),
  },
  {
    id: "como-pedirlo",
    title: "Comment demander un remboursement",
    brief:
      "Sur paddle.net ou par e-mail.",
    content: (
      <>
        <p>
          Paddle, qui est le vendeur officiel (merchant of record) de nos
          offres, gère les paiements et les remboursements. Vous pouvez en faire
          la demande sur{" "}
          <LegalLink href="https://paddle.net">paddle.net</LegalLink> avec
          l’e-mail de votre achat, ou nous écrire à{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>{" "}
          et nous vous aidons dans la démarche.
        </p>
        <p>
          Le montant revient sur le moyen de paiement que vous avez utilisé. Le
          délai avant de le voir apparaître dépend de votre banque ou de votre
          carte.
        </p>
      </>
    ),
  },
  {
    id: "cancelar",
    title: "Résilier votre offre",
    brief:
      "Vous pouvez résilier à tout moment.",
    content: (
      <>
        <p>
          Résilier et demander un remboursement sont deux choses différentes.
          Vous pouvez résilier votre offre à tout moment depuis les paramètres
          du compte ; elle reste active jusqu’à la fin de la période déjà payée.
          La façon de résilier et le sort de vos données figurent dans les{" "}
          <LegalLink href="/terms">Conditions générales</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "tus-derechos",
    title: "Vos droits",
    brief:
      "Cette politique ne limite pas les droits que la loi vous reconnaît.",
    content: (
      <>
        <p>
          Cette politique ne limite pas les droits que la loi vous reconnaît en
          tant que consommateur, par exemple le droit de rétractation. En cas de
          doute, écrivez-nous à{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Politique de remboursement",
  metaDescription:
    "Quand et comment demander le remboursement d’un paiement Tivvu.",
  title: "Politique de remboursement",
  intro: (
    <p>
      Quand vous pouvez demander qu’on vous rembourse un paiement, comment faire
      et ce qu’il en est de l’essai gratuit.
    </p>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Conditions générales" },
};
