import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, jurisdiction, contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Tivvu ist ein Werkzeug, mit dem Ihre Agentur Objekte, Kunden, Angebote und Buchungen verwaltet und eine eigene Website veröffentlicht. Wir sind nicht Partei der Geschäfte, die Sie mit Ihren Kunden abschließen.",
  "Die Daten, die Sie erfassen, gehören Ihrer Agentur. Wir speichern und verarbeiten sie, um den Dienst zu erbringen, und Sie können sie exportieren.",
  "Ihre Agentur ist dafür verantwortlich, die Regeln ihrer Tätigkeit einzuhalten: Zulassung, wahrheitsgemäße Werbung, Mietverträge und Schutz der Daten ihrer Kunden.",
  "Sie können Ihren Tarif jederzeit kündigen, auf demselben Weg, auf dem Sie ihn abgeschlossen haben. Ändern sich Preise oder diese Bedingungen, informieren wir Sie 30 Tage im Voraus.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "quienes-somos",
    title: "Wer wir sind und was diese Bedingungen regeln",
    brief:
      "Diese Bedingungen, die Datenschutzerklärung und die Bedingungen Ihres Tarifs bilden die gesamte Vereinbarung zwischen Tivvu und Ihrer Agentur.",
    content: (
      <>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (die „Bedingungen“) regeln den
          Zugang zu und die Nutzung von Tivvu, dem Verwaltungssystem für
          Immobilienagenturen unter tivvu.app und seinen Subdomains (der
          „Dienst“). Der Dienst wird erbracht von {name}, Steuernummer (CUIT){" "}
          {taxId}, mit Sitz in {address} („Tivvu“, „wir“).
        </p>
        <p>
          Die Bedingungen bilden zusammen mit der{" "}
          <LegalLink href="/privacy">Datenschutzerklärung</LegalLink> und den
          Bedingungen des von Ihnen gewählten Tarifs die gesamte Vereinbarung
          zwischen Tivvu und der Agentur. Weicht eine besondere Bedingung Ihres
          Tarifs (zum Beispiel ein unterzeichneter Enterprise-Vertrag) davon ab,
          hat die besondere Bedingung Vorrang.
        </p>
      </>
    ),
  },
  {
    id: "definiciones",
    title: "Begriffsbestimmungen",
    brief:
      "Die Agentur ist, wer das Konto eröffnet, Nutzer sind die Personen, die darin arbeiten, und Endkunden die Personen, deren Daten erfasst werden.",
    content: (
      <ul>
        <li>
          <strong>Agentur:</strong> die natürliche oder juristische Person, die
          ein Tivvu-Konto anlegt, um ihre Immobilientätigkeit zu verwalten.
        </li>
        <li>
          <strong>Nutzer:</strong> die Personen, denen die Agentur die Nutzung
          ihres Kontos erlaubt (Inhaber, Administratoren, Makler und weitere
          Rollen).
        </li>
        <li>
          <strong>Endkunden:</strong> die Personen, deren Daten die Agentur über
          den Dienst erfasst oder erhält: Interessenten, Käufer, Mieter, Gäste
          und Eigentümer.
        </li>
        <li>
          <strong>Daten der Agentur:</strong> alle Informationen, die die
          Agentur und ihre Nutzer im Dienst erfassen oder über ihn erhalten:
          Objekte, Fotos, Texte, Tarife, Kunden, Anfragen, Angebote, Buchungen,
          erfasste Zahlungen und Dokumente.
        </li>
        <li>
          <strong>Website der Agentur:</strong> die öffentliche Website, die die
          Agentur mit dem Tivvu-Editor erstellt und die auf einer Tivvu-Subdomain
          unter dem Namen der Agentur veröffentlicht wird.
        </li>
      </ul>
    ),
  },
  {
    id: "aceptacion",
    title: "Annahme und Geschäftsfähigkeit",
    brief:
      "Mit der Nutzung von Tivvu akzeptieren Sie diese Bedingungen. Sie müssen volljährig und geschäftsfähig sein.",
    content: (
      <>
        <p>
          Indem Sie ein Konto anlegen, sich mit Google oder Apple anmelden oder
          den Dienst nutzen, akzeptieren Sie diese Bedingungen. Wenn Sie nicht
          einverstanden sind, nutzen Sie den Dienst nicht.
        </p>
        <p>
          Um ein Konto anzulegen, müssen Sie über 18 Jahre alt und
          geschäftsfähig sein. Legen Sie es im Namen eines Unternehmens oder
          einer anderen Person an, erklären Sie, ausreichend bevollmächtigt zu
          sein, diese zu verpflichten; in diesem Fall beziehen sich „Sie“ und
          „die Agentur“ auf dieses Unternehmen bzw. diese Person.
        </p>
        <p>
          Diese Bedingungen sind ein Formularvertrag im Sinne der Artikel 984 ff.
          des argentinischen Zivil- und Handelsgesetzbuchs. Wir haben sie so
          geschrieben, dass sie ohne Hilfe verständlich sind; ist etwas unklar,
          schreiben Sie uns, bevor Sie sie annehmen.
        </p>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "Konto, Nutzer und Sicherheit",
    brief:
      "Halten Sie Ihre Daten aktuell, teilen Sie keine Passwörter und melden Sie uns, wenn Sie einen fremden Zugriff auf Ihr Konto vermuten.",
    content: (
      <>
        <p>
          Die Agentur muss wahrheitsgemäße Angaben machen und sie aktuell
          halten, insbesondere die Kontakt-E-Mail, da wir Sie darüber über
          wichtige Änderungen informieren.
        </p>
        <p>
          Die Agentur entscheidet, wer mit welchen Berechtigungen auf ihr Konto
          zugreift, und haftet für das Handeln ihrer Nutzer im Dienst. Jeder
          Nutzer muss eigene Zugangsdaten haben: Teilen Sie keine Passwörter
          zwischen Personen.
        </p>
        <p>
          Vermuten Sie einen unbefugten Zugriff auf Ihr Konto, ändern Sie das
          Passwort und informieren Sie uns sofort unter{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "servicio",
    title: "Was der Dienst umfasst",
    brief:
      "Was Sie tun können, hängt von Ihrem Tarif ab. Wir können Funktionen ändern; entfernen wir eine wesentliche aus einem kostenpflichtigen Tarif, kündigen wir dies 30 Tage vorher an.",
    content: (
      <>
        <p>Je nach Tarif ermöglicht der Dienst unter anderem:</p>
        <ul>
          <li>Objekte zum Verkauf und zur Ferienvermietung erfassen und veröffentlichen;</li>
          <li>
            Kunden, Anfragen, Angebote, Buchungen, Verfügbarkeiten, Saisontarife
            und erfasste Zahlungen verwalten;
          </li>
          <li>
            Angebote, Buchungen und das Eigentümerportal über private Links
            teilen;
          </li>
          <li>die Website der Agentur erstellen und veröffentlichen;</li>
          <li>im Team mit Rollen und Berechtigungen arbeiten.</li>
        </ul>
        <p>
          Tivvu verbessert den Dienst laufend: Wir können Funktionen hinzufügen,
          ändern oder entfernen. Entfernen wir eine wesentliche Funktion aus
          einem kostenpflichtigen Tarif, informieren wir Sie mindestens 30 Tage
          im Voraus, und wenn die Änderung für Sie nicht passt, können Sie den
          Tarif kostenlos kündigen.
        </p>
        <p>
          Einige Funktionen können als „Beta“ oder Testversion angeboten werden.
          Sie werden so bereitgestellt, wie sie sind, können sich ohne Ankündigung
          ändern und sollten nicht für kritische Aufgaben verwendet werden.
        </p>
      </>
    ),
  },
  {
    id: "rol-de-tivvu",
    title: "Tivvu ist nicht Partei Ihrer Geschäfte",
    brief:
      "Tivvu ist Software: weder Immobilienagentur noch Vermittler, und es wickelt Ihre Zahlungen weder ab noch verwahrt es sie.",
    content: (
      <>
        <p>
          Tivvu ist ein Software-Werkzeug. Es ist keine Immobilienagentur,
          handelt weder als Makler noch als Vermittler, kassiert nicht im Namen
          der Agentur und garantiert nicht, dass ein Geschäft zustande kommt.
          Verkäufe, Vermietungen, Buchungen, Anzahlungen, Provisionen und
          Zahlungen sind Vereinbarungen zwischen der Agentur, ihren Kunden und
          den Eigentümern.
        </p>
        <p>
          Die Zahlungen, die die Agentur in Tivvu erfasst, sind Vermerke zu
          ihrer eigenen Kontrolle; Tivvu wickelt sie weder ab noch verwahrt es
          sie. Mit externen Kalendern synchronisierte Verfügbarkeiten (zum
          Beispiel über iCal) hängen von diesen Diensten ab und können verzögert
          sein: Die Agentur muss die Verfügbarkeit bestätigen, bevor sie eine
          Buchung abschließt.
        </p>
      </>
    ),
  },
  {
    id: "obligaciones-agencia",
    title: "Pflichten der Agentur",
    brief:
      "Ihre Agentur haftet für ihre Zulassung, die Richtigkeit ihrer Inserate, ihre Verträge, die Daten ihrer Kunden und ihre Steuern.",
    content: (
      <>
        <p>
          Die Agentur ist allein für ihre Tätigkeit verantwortlich, insbesondere
          dafür,
        </p>
        <ul>
          <li>
            die für sie geltenden Regeln der Immobilienvermittlung einzuhalten
            (Zulassung, Berufskammern und Gesetze jedes Gebiets, in dem sie
            tätig ist);
          </li>
          <li>
            dass die Angaben zu ihren Objekten, Preisen und Bedingungen
            wahrheitsgemäß, vollständig und aktuell sind, wie es das
            Verbraucherschutzrecht verlangt (in Argentinien das Gesetz 24.240);
          </li>
          <li>
            die Verträge, die sie mit ihren Kunden und Eigentümern schließt,
            einschließlich der Regeln zu Mietverhältnissen und Ferienvermietung;
          </li>
          <li>
            die personenbezogenen Daten ihrer Endkunden nach dem anwendbaren
            Recht zu verarbeiten (in Argentinien das Gesetz 25.326; siehe den
            Abschnitt „Daten der Agentur und personenbezogene Daten“);
          </li>
          <li>
            die Rechte an den von ihr veröffentlichten Fotos, Grundrissen, Texten
            und Marken sowie die Erlaubnis der Eigentümer zur Veröffentlichung
            ihrer Objekte zu haben;
          </li>
          <li>die aus ihrer Tätigkeit entstehenden Steuern und Abgaben.</li>
        </ul>
      </>
    ),
  },
  {
    id: "uso-aceptable",
    title: "Zulässige Nutzung",
    brief:
      "Keine falschen Inserate, kein Spam, keine unnötigen sensiblen Daten, kein Scraping und keine Versuche, in fremde Konten einzudringen.",
    content: (
      <>
        <p>Es ist nicht gestattet, den Dienst zu nutzen, um:</p>
        <ul>
          <li>nicht existierende Objekte, irreführende Preise oder rechtswidrige Inhalte zu veröffentlichen;</li>
          <li>
            unerwünschte Werbung zu versenden oder ohne Rechtsgrundlage erlangte
            Kontaktdaten zu verwenden;
          </li>
          <li>
            sensible Daten (Gesundheit, rassische oder ethnische Herkunft,
            politische Meinungen, religiöse Überzeugungen, Sexualleben) zu
            erfassen, sofern das Gesetz es nicht erlaubt und es nicht
            unerlässlich ist;
          </li>
          <li>
            geistige Eigentums-, Bild- oder Persönlichkeitsrechte Dritter zu
            verletzen;
          </li>
          <li>
            auf Konten oder Daten anderer Agenturen zuzugreifen, Schwachstellen
            ohne Erlaubnis zu testen, die Infrastruktur zu überlasten oder
            Schadsoftware zu verbreiten;
          </li>
          <li>
            den Dienst automatisiert zu kopieren (Scraping), ihn zurückzuentwickeln
            oder ohne schriftliche Vereinbarung mit Tivvu weiterzuverkaufen.
          </li>
        </ul>
        <p>
          Finden Sie eine Schwachstelle, melden Sie sie an{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>:
          Wir prüfen sie und antworten Ihnen.
        </p>
      </>
    ),
  },
  {
    id: "planes-y-pagos",
    title: "Tarife, Preise und Zahlungen",
    brief:
      "Abrechnung im Voraus mit automatischer Verlängerung. Preisänderungen kündigen wir 30 Tage vorher an; schlägt eine Zahlung fehl, haben Sie 15 Tage Zeit, sie nachzuholen.",
    content: (
      <>
        <p>
          Tivvu bietet einen kostenlosen Tarif mit Grenzen (zum Beispiel bei der
          Anzahl der Objekte und Nutzer) und kostenpflichtige Tarife. Die
          geltenden Preise, Grenzen und Funktionen jedes Tarifs werden auf{" "}
          <LegalLink href="/#planes">tivvu.app</LegalLink> veröffentlicht oder
          bei individuellen Tarifen schriftlich vereinbart.
        </p>
        <ul>
          <li>
            Kostenpflichtige Tarife werden monatlich (oder für den vereinbarten
            Zeitraum) im Voraus abgerechnet und verlängern sich automatisch, bis
            die Agentur sie kündigt.
          </li>
          <li>
            In US-Dollar veröffentlichte Preise können in argentinischen Pesos
            zum bei Zahlung angegebenen Wechselkurs beglichen werden. Anfallende
            Steuern kommen zum Preis hinzu, sofern nicht anders angegeben.
          </li>
          <li>
            Ändern wir den Preis Ihres Tarifs, informieren wir Sie mindestens 30
            Tage im Voraus per E-Mail. Der neue Preis gilt ab dem Zeitraum nach
            der Mitteilung; sind Sie nicht einverstanden, können Sie den Tarif
            vorher kündigen.
          </li>
          <li>
            Geht eine Zahlung nicht ein, informieren wir Sie, und Sie haben 15
            Kalendertage Zeit, sie nachzuholen. Danach können wir das Konto auf
            den kostenlosen Tarif umstellen oder sperren. Ihre Daten werden durch
            die Sperre nicht gelöscht.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "baja",
    title: "Kündigung und Widerrufsrecht",
    brief:
      "Sie können jederzeit kündigen. Die Kündigung wirkt zum Ende des bezahlten Zeitraums, ohne anteilige Erstattung, sofern das Gesetz nichts anderes bestimmt.",
    content: (
      <>
        <p>
          Die Agentur kann ihren Tarif jederzeit ohne Angabe von Gründen und
          ohne Vertragsstrafe kündigen, auf demselben Weg, auf dem sie ihn
          abgeschlossen hat, oder per E-Mail an{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
          Innerhalb von 24 Stunden senden wir Ihnen auf demselben Weg einen Code,
          der Ihre Kündigung identifiziert.
        </p>
        <p>
          Die Kündigung wirkt zum Ende des bereits bezahlten Zeitraums: Bis dahin
          behalten Sie Zugang zum Tarif. Bereits begonnene Zeiträume erstatten
          wir nicht anteilig, sofern das Gesetz nichts anderes bestimmt.
        </p>
        <p>
          Schließen Sie den Vertrag als Verbraucher im Sinne des argentinischen
          Gesetzes 24.240, können Sie ihn innerhalb von 10 Kalendertagen nach
          Abschluss widerrufen (Artikel 34 dieses Gesetzes und Artikel 1110 des
          Zivil- und Handelsgesetzbuchs), ohne Kosten oder Haftung, und wir
          erstatten Ihnen das Gezahlte. Dieses Recht gilt nicht, wenn der Dienst
          für eine gewerbliche oder berufliche Tätigkeit abgeschlossen wird, was
          bei einer Agentur der übliche Fall ist.
        </p>
      </>
    ),
  },
  {
    id: "datos-personales",
    title: "Daten der Agentur und personenbezogene Daten",
    brief:
      "Die Daten gehören Ihrer Agentur, und wir verkaufen sie nicht. Für die Daten Ihrer Kunden sind Sie verantwortlich; wir verarbeiten sie in Ihrem Auftrag.",
    content: (
      <>
        <p>
          Die Daten der Agentur gehören der Agentur. Tivvu nutzt sie nur, um den
          Dienst zu erbringen, zu warten und zu verbessern, Sie zu unterstützen
          und das Gesetz einzuhalten; es verkauft sie nicht und nutzt sie nicht,
          um Ihre Kunden auf eigene Rechnung zu kontaktieren.
        </p>
        <p>
          Hinsichtlich der personenbezogenen Daten der Endkunden ist die Agentur
          die Verantwortliche für die Datenbank, und Tivvu handelt als
          Dienstleister, der sie in ihrem Auftrag verarbeitet, im Sinne von
          Artikel 25 des argentinischen Gesetzes 25.326. Entsprechend:
        </p>
        <ul>
          <li>
            verarbeitet Tivvu diese Daten nur zur Erbringung des Dienstes und
            nach den Weisungen der Agentur, die sich aus diesen Bedingungen und
            der Art ergeben, wie sie den Dienst konfiguriert und nutzt;
          </li>
          <li>
            gibt Tivvu sie nicht an Dritte weiter, außer an die Dienstleister,
            die es für den Betrieb benötigt, oder auf behördliche Anordnung;
          </li>
          <li>
            wendet Tivvu technische und organisatorische Sicherheitsmaßnahmen an
            und verpflichtet sein Personal und seine Dienstleister zur
            Vertraulichkeit;
          </li>
          <li>
            informiert Tivvu die Agentur unverzüglich, wenn es einen
            Sicherheitsvorfall feststellt, der ihre Daten betrifft;
          </li>
          <li>
            unterstützt Tivvu die Agentur bei Auskunfts-, Berichtigungs- oder
            Löschungsanfragen der Endkunden;
          </li>
          <li>
            löscht Tivvu diese Daten nach Ende des Dienstes innerhalb der Fristen
            des Abschnitts „Export und Löschung von Daten“.
          </li>
        </ul>
        <p>
          Die Agentur ihrerseits sichert zu, dass sie eine Rechtsgrundlage für
          die Erfassung dieser Daten hat und ihre Endkunden über die Verarbeitung
          informiert. Die <LegalLink href="/privacy">Datenschutzerklärung</LegalLink>{" "}
          erläutert, welche Daten Tivvu verarbeitet, mit welchen Dienstleistern
          und in welchen Ländern.
        </p>
      </>
    ),
  },
  {
    id: "contenido",
    title: "Inhalte der Agentur und Lizenz",
    brief:
      "Ihre Inhalte bleiben Ihre; Sie erlauben uns nur, sie zu hosten und anzuzeigen, solange Sie den Dienst nutzen.",
    content: (
      <>
        <p>
          Die Agentur behält alle Rechte an den Fotos, Texten, Logos und sonstigen
          Inhalten, die sie hochlädt. Sie räumt uns eine nicht ausschließliche,
          unentgeltliche und auf die Laufzeit des Dienstes beschränkte Lizenz
          ein, diese Inhalte zu hosten, zu kopieren, anzupassen (zum Beispiel
          Bilder zu verkleinern) und anzuzeigen, ausschließlich um den Dienst zu
          erbringen und die Website der Agentur zu veröffentlichen.
        </p>
        <p>
          Erhalten wir eine begründete Beschwerde, dass ein Inhalt Rechte Dritter
          verletzt, können wir ihn entfernen und informieren Sie darüber.
        </p>
      </>
    ),
  },
  {
    id: "sitio-y-links",
    title: "Website der Agentur und geteilte Links",
    brief:
      "Die Website gehört Ihrer Agentur. Private Links kann jeder öffnen, der sie hat: Senden Sie sie nur an die richtige Person.",
    content: (
      <>
        <p>
          Die Website der Agentur gehört der Agentur: Sie entscheidet, was sie
          veröffentlicht, und ist für den Inhalt verantwortlich. Anfragen über
          die Website, Objektseiten oder Angebote werden im Konto der Agentur
          gespeichert, und Tivvu versendet in ihrem Namen die Benachrichtigungs-
          und Bestätigungs-E-Mails.
        </p>
        <p>
          Angebote, Buchungen und das Eigentümerportal werden über schwer zu
          erratende private Links geteilt. Jeder, der den Link hat, kann den
          Inhalt sehen; die Agentur darf sie daher nur an die betreffende Person
          senden.
        </p>
        <p>
          Derzeit wird die Website der Agentur auf einer Tivvu-Subdomain
          veröffentlicht. Verlässt die Agentur den Dienst, ist die Website nicht
          mehr verfügbar.
        </p>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    title: "Geistiges Eigentum von Tivvu",
    brief:
      "Die Software und die Marke Tivvu gehören uns; Sie dürfen sie nutzen, solange Ihr Konto besteht.",
    content: (
      <p>
        Die Software, das Design, die Website-Vorlagen, die Marke Tivvu und ihr
        Logo gehören Tivvu oder seinen Lizenzgebern. Diese Bedingungen
        übertragen Ihnen keine Rechte daran, über die Erlaubnis hinaus, den
        Dienst zu nutzen, solange Ihr Konto besteht. Senden Sie uns Ideen oder
        Vorschläge, dürfen wir sie frei zur Verbesserung des Dienstes nutzen,
        ohne Verpflichtung zu einer Vergütung.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "Dienste Dritter",
    brief:
      "Google, Apple und externe Kalender unterliegen ihren eigenen Bedingungen, und wir haften nicht für sie.",
    content: (
      <p>
        Der Dienst ist mit Diensten Dritter verbunden, etwa der Anmeldung mit
        Google oder Apple oder der Synchronisierung von Kalendern von
        Vermietungsplattformen. Diese Dienste unterliegen ihren eigenen
        Bedingungen und Richtlinien, und Tivvu haftet weder für ihren Betrieb
        noch für Änderungen ihrer Bedingungen.
      </p>
    ),
  },
  {
    id: "disponibilidad",
    title: "Verfügbarkeit und Support",
    brief:
      "Wir tun das Zumutbare, damit alles gut läuft, ohne eine unterbrechungsfreie Verfügbarkeit zu garantieren. Support per E-Mail an Werktagen.",
    content: (
      <>
        <p>
          Wir unternehmen angemessene Anstrengungen, damit der Dienst verfügbar
          ist und gut funktioniert, können aber nicht garantieren, dass er frei
          von Unterbrechungen oder Fehlern ist. Wartungen planen wir nach
          Möglichkeit zu nutzungsarmen Zeiten und kündigen sie vorher an.
        </p>
        <p>
          Fragen und Beschwerden bearbeiten wir per E-Mail unter{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>,
          an Werktagen von Montag bis Freitag. Zusagen zu Verfügbarkeit oder
          Reaktionszeiten (Service-Level-Vereinbarungen) bestehen nur, wenn sie
          schriftlich vereinbart sind, zum Beispiel in einem Enterprise-Tarif.
        </p>
      </>
    ),
  },
  {
    id: "exportacion",
    title: "Export und Löschung von Daten",
    brief:
      "Was Sie löschen, liegt 30 Tage im Papierkorb. Schließen Sie das Konto, haben Sie 30 Tage Zeit, Ihre Daten zu exportieren.",
    content: (
      <>
        <p>
          Was im Dienst gelöscht wird, landet im Papierkorb und kann dort 30 Tage
          lang wiederhergestellt werden; danach wird es endgültig gelöscht.
        </p>
        <p>
          Kündigt die Agentur ihr Konto oder wird das Konto aus irgendeinem Grund
          geschlossen, stehen die Daten der Agentur 30 Tage lang zum Export
          bereit. Danach löschen wir sie aus unseren aktiven Systemen, und
          Sicherungen werden in ihrem normalen Zyklus überschrieben, der 90 Tage
          nicht überschreitet. Länger bewahren wir nur auf, was wir gesetzlich
          aufbewahren müssen (zum Beispiel Abrechnungsunterlagen) oder, für
          höchstens zwei Jahre, was die Agentur uns ausdrücklich zu bewahren
          erlaubt, wie es Artikel 25 des argentinischen Gesetzes 25.326 gestattet.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Sperrung und Kündigung durch Tivvu",
    brief:
      "Wir können ein Konto bei schweren Verstößen oder Sicherheitsrisiken sperren und informieren vorher, außer in dringenden Fällen.",
    content: (
      <>
        <p>
          Wir können ein Konto sperren oder schließen, wenn die Agentur schwer
          gegen diese Bedingungen verstößt, wenn die Nutzung des Kontos die
          Sicherheit des Dienstes oder anderer Agenturen gefährdet oder wenn eine
          zuständige Behörde es anordnet. Außer in dringenden Fällen oder bei
          rechtlichen Hindernissen informieren wir Sie vorher und geben Ihnen eine
          angemessene Frist, das Problem zu beheben.
        </p>
        <p>
          Wir können den Dienst auch insgesamt einstellen, mit einer Frist von
          mindestens 90 Tagen und unter anteiliger Erstattung dessen, was Sie im
          Voraus gezahlt haben.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Haftungsbeschränkung",
    brief:
      "Wir haften weder für entgangenen Gewinn noch für Ihre Geschäfte; die Obergrenze ist, was Sie in den letzten 12 Monaten gezahlt haben, mit den gesetzlichen Ausnahmen.",
    content: (
      <>
        <p>
          Soweit gesetzlich zulässig, haftet Tivvu nicht für entgangenen Gewinn,
          verlorene Geschäftschancen oder indirekte Schäden, die aus der Nutzung
          oder Nichtnutzbarkeit des Dienstes entstehen, noch für die Geschäfte
          zwischen der Agentur, ihren Kunden und den Eigentümern.
        </p>
        <p>
          Die Gesamthaftung von Tivvu gegenüber der Agentur für jeden Anspruch im
          Zusammenhang mit dem Dienst ist auf den Betrag begrenzt, den die Agentur
          in den 12 Monaten vor dem anspruchsbegründenden Ereignis an Tivvu
          gezahlt hat.
        </p>
        <p>
          Diese Grenzen gelten nicht bei Vorsatz oder grober Fahrlässigkeit von
          Tivvu und schränken die Rechte nicht ein, die zwingende Vorschriften wie
          das argentinische Gesetz 24.240 Verbrauchern gewähren.
        </p>
      </>
    ),
  },
  {
    id: "indemnidad",
    title: "Freistellung",
    brief:
      "Erhebt ein Dritter Ansprüche wegen Ihrer Veröffentlichungen oder Geschäfte, trägt Ihre Agentur die Verantwortung.",
    content: (
      <p>
        Die Agentur stellt Tivvu von Ansprüchen Dritter frei (einschließlich
        Endkunden, Eigentümern und Behörden), die aus den von ihr
        veröffentlichten Inhalten, ihren Geschäften oder der Verletzung dieser
        Bedingungen oder der für ihre Tätigkeit geltenden Vorschriften entstehen,
        einschließlich angemessener Verteidigungskosten.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Änderungen dieser Bedingungen",
    brief:
      "Wesentliche Änderungen kündigen wir 30 Tage vorher an, und Sie können vor Inkrafttreten kündigen.",
    content: (
      <>
        <p>
          Wir können diese Bedingungen aktualisieren. Ist die Änderung
          wesentlich, informieren wir Sie per E-Mail und im Dienst mindestens 30
          Tage vor dem Inkrafttreten. Gesetzlich vorgeschriebene oder
          ausschließlich vorteilhafte Änderungen können früher gelten.
        </p>
        <p>
          Sind Sie mit der neuen Fassung nicht einverstanden, können Sie Ihr
          Konto vor dem Inkrafttreten kündigen. Nutzen Sie den Dienst danach
          weiter, gilt dies als Zustimmung. Das Datum der geltenden Fassung steht
          oben auf dieser Seite.
        </p>
      </>
    ),
  },
  {
    id: "ley-aplicable",
    title: "Anwendbares Recht und Gerichtsstand",
    brief:
      "Es gilt argentinisches Recht. Zuerst versuchen wir eine gütliche Einigung; als Verbraucher können Sie an Ihrem Wohnsitz klagen.",
    content: (
      <>
        <p>
          Diese Bedingungen unterliegen dem Recht der Argentinischen Republik.
          Bei Meinungsverschiedenheiten versuchen wir zunächst, sie in gutem
          Glauben zu lösen; schreiben Sie uns an{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
        <p>
          Kommt keine Einigung zustande, sind die ordentlichen Gerichte von{" "}
          {jurisdiction} zuständig. Haben Sie als Verbraucher abgeschlossen,
          können Sie Ihre Ansprüche vor den Gerichten Ihres Wohnsitzes und bei den
          Verbraucherschutzbehörden geltend machen (auf nationaler Ebene in
          Argentinien über{" "}
          <LegalLink href="https://www.argentina.gob.ar/produccion/defensadelconsumidor">
            argentina.gob.ar/defensadelconsumidor
          </LegalLink>
          ).
        </p>
      </>
    ),
  },
  {
    id: "contacto",
    title: "Kontakt",
    content: (
      <p>
        Bei Fragen zu diesen Bedingungen schreiben Sie uns an{" "}
        <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        Geschäftssitz: {address}.
      </p>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Allgemeine Geschäftsbedingungen",
  metaDescription:
    "Nutzungsbedingungen von Tivvu, dem Verwaltungssystem für Verkaufs- und Ferienvermietungsagenturen.",
  title: "Allgemeine Geschäftsbedingungen",
  intro: (
    <>
      <p>
        Die Regeln für die Nutzung von Tivvu: was wir tun, was Sache Ihrer
        Agentur ist und was mit Ihren Daten, Zahlungen und Ihrem Konto geschieht.
      </p>
      <p>
        Diese Übersetzung dient der Information. Bei Abweichungen ist die
        spanische Fassung maßgeblich.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/privacy", label: "Datenschutzerklärung" },
};
