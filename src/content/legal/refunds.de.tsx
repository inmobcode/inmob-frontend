import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Sie können die Erstattung jeder Abbuchung eines kostenpflichtigen Tarifs innerhalb von 14 Kalendertagen nach der Abbuchung beantragen.",
  "Die kostenlose Testphase kostet nichts: Kündigen Sie vor ihrem Ende, wird der Pro-Tarif nicht berechnet.",
  "Der Antrag läuft über paddle.net oder per E-Mail, und das Geld geht auf dasselbe Zahlungsmittel zurück.",
  "Sie können jederzeit kündigen; der Tarif läuft bis zum Ende des bezahlten Zeitraums weiter.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "plazo",
    title: "Erstattungsfrist",
    brief:
      "14 Kalendertage ab jeder Abbuchung.",
    content: (
      <>
        <p>
          Sie können die Erstattung jeder Abbuchung eines kostenpflichtigen
          Tivvu-Tarifs beantragen, sei es die erste Zahlung oder eine
          Verlängerung, und zwar innerhalb von 14 Kalendertagen nach der
          Abbuchung. Wird sie genehmigt, erstatten wir den vollen Betrag dieser
          Abbuchung einschließlich der gezahlten Steuern.
        </p>
        <p>
          Nach Ablauf dieser Frist erstatten wir keine bereits begonnenen
          Zeiträume, es sei denn, das anwendbare Recht sieht etwas anderes vor
          oder die Abbuchung beruhte auf einem Fehler.
        </p>
      </>
    ),
  },
  {
    id: "prueba-gratis",
    title: "Kostenlose Testphase",
    brief:
      "In den 14 Tagen wird nichts abgebucht.",
    content: (
      <>
        <p>
          Die kostenlose Testphase dauert 14 Tage und ist kostenlos. Kündigen Sie
          vor ihrem Ende, wird der Pro-Tarif nicht berechnet. Kündigen Sie
          nicht, startet am Ende der Testphase der Pro-Tarif und der erste
          Zeitraum wird abgerechnet; ab dieser Abbuchung gilt die 14-Tage-Frist.
        </p>
      </>
    ),
  },
  {
    id: "como-pedirlo",
    title: "So beantragen Sie eine Erstattung",
    brief:
      "Über paddle.net oder per E-Mail.",
    content: (
      <>
        <p>
          Paddle, der Merchant of Record (offizielle Verkäufer) unserer Tarife,
          wickelt Zahlungen und Erstattungen ab. Sie können sie auf{" "}
          <LegalLink href="https://paddle.net">paddle.net</LegalLink> mit der
          E-Mail-Adresse Ihres Kaufs beantragen oder uns an{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>{" "}
          schreiben, dann helfen wir Ihnen dabei.
        </p>
        <p>
          Der Betrag geht auf das von Ihnen verwendete Zahlungsmittel zurück.
          Wie lange es dauert, bis er sichtbar ist, hängt von Ihrer Bank oder
          Karte ab.
        </p>
      </>
    ),
  },
  {
    id: "cancelar",
    title: "Tarif kündigen",
    brief:
      "Sie können jederzeit kündigen.",
    content: (
      <>
        <p>
          Kündigen und eine Erstattung beantragen sind zwei verschiedene Dinge.
          Sie können Ihren Tarif jederzeit in den Kontoeinstellungen kündigen;
          er bleibt bis zum Ende des bereits bezahlten Zeitraums aktiv. Wie die
          Kündigung funktioniert und was mit Ihren Daten geschieht, finden Sie
          hier: <LegalLink href="/terms">Allgemeine
          Geschäftsbedingungen</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "tus-derechos",
    title: "Ihre Rechte",
    brief:
      "Diese Richtlinie schränkt Ihre gesetzlichen Rechte nicht ein.",
    content: (
      <>
        <p>
          Diese Richtlinie schränkt die Rechte nicht ein, die Ihnen das Gesetz
          als Verbraucher einräumt, zum Beispiel das Widerrufsrecht. Bei Fragen
          schreiben Sie uns an{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Erstattungsrichtlinie",
  metaDescription:
    "Wann und wie Sie die Erstattung einer Tivvu-Zahlung beantragen können.",
  title: "Erstattungsrichtlinie",
  intro: (
    <p>
      Wann Sie eine Rückzahlung verlangen können, wie das geht und was für die
      kostenlose Testphase gilt.
    </p>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Allgemeine Geschäftsbedingungen" },
};
