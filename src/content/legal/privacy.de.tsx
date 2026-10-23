import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LegalTable } from "@/components/legal/legal-table";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, privacyEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Wir nutzen Ihre Daten, um den Dienst zu erbringen, abzurechnen, sicher zu halten und Sie über Wichtiges zu informieren. Wir verkaufen keine Daten und zeigen keine Werbung.",
  "Die Daten über Kunden und Eigentümer, die eine Agentur erfasst, gehören dieser Agentur: Sie entscheidet über die Nutzung, und wir verarbeiten sie in ihrem Auftrag.",
  "Wir arbeiten mit Infrastruktur- und E-Mail-Anbietern, die außerhalb Argentiniens sitzen können, unter Verträgen, die Ihre Daten schützen.",
  "Sie können Auskunft, Berichtigung oder Löschung Ihrer Daten verlangen, indem Sie an " +
    privacyEmail +
    " schreiben. Die Auskunft ist kostenlos.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "responsable",
    title: "Wer für Ihre Daten verantwortlich ist",
    brief:
      "Für die Daten Ihrer Agentur und unserer Besucher sind wir verantwortlich; für die Daten ihrer Kunden ist es die Agentur, und wir verarbeiten sie in ihrem Auftrag.",
    content: (
      <>
        <p>
          Diese Erklärung beschreibt, wie {name}, Steuernummer (CUIT) {taxId},
          mit Sitz in {address} („Tivvu“, „wir“), personenbezogene Daten
          verarbeitet, wenn Sie tivvu.app, seine Subdomains und die mit Tivvu
          veröffentlichten Agentur-Websites nutzen. Sie gilt nach dem
          argentinischen Gesetz 25.326 zum Schutz personenbezogener Daten, seiner
          Durchführungsverordnung 1558/2001 und den Vorschriften der Agentur für
          den Zugang zu öffentlichen Informationen (AAIP).
        </p>
        <p>Tivvu hat je nachdem, wem die Daten gehören, zwei Rollen:</p>
        <ul>
          <li>
            <strong>Wir sind Verantwortliche</strong> für die Daten der
            Agenturen und ihrer Nutzer (Konto, Abrechnung, Nutzung des Systems),
            der Personen, die eine Demo anfragen oder uns schreiben, und der
            Besucher von tivvu.app.
          </li>
          <li>
            <strong>Wir verarbeiten Daten im Auftrag jeder Agentur</strong>, wenn
            es um ihre Kunden, Interessenten, Gäste und Eigentümer geht. In
            diesem Fall ist die Agentur verantwortlich, und wir handeln als
            Auftragsverarbeiter (Artikel 25 des Gesetzes 25.326): Wir folgen
            ihren Weisungen und nutzen diese Daten nicht für eigene Zwecke.
          </li>
        </ul>
        <p>
          Wenn Sie Ihre Daten auf der Website einer Agentur hinterlassen, ein
          Angebot erhalten oder eine Buchung haben, entscheidet diese Agentur
          über Ihre Daten. Wenden Sie sich am besten zuerst an sie; schreiben Sie
          uns, leiten wir Ihre Anfrage an sie weiter.
        </p>
      </>
    ),
  },
  {
    id: "datos-que-tratamos",
    title: "Welche Daten wir verarbeiten",
    brief:
      "Konto, Anmeldung, technische Daten und Kommunikation; und im Auftrag jeder Agentur die Daten ihrer Kunden. Wir fragen keine sensiblen Daten ab.",
    content: (
      <>
        <h3>Wenn Sie Tivvu in einer Agentur nutzen</h3>
        <ul>
          <li>
            <strong>Konto:</strong> Name, E-Mail, Passwort (verschlüsselt mit
            einem Hash-Verfahren gespeichert, nie im Klartext), Rolle und Agentur,
            zu der Sie gehören.
          </li>
          <li>
            <strong>Anmeldung mit Google oder Apple:</strong> Wenn Sie dies
            wählen, erhalten wir von diesem Anbieter Ihren Namen, Ihre E-Mail und
            eine Kontokennung. Ihr Passwort erhalten wir nicht.
          </li>
          <li>
            <strong>Agentur:</strong> Name, Kontaktdaten, Logo,
            Website-Einstellungen und bei kostenpflichtigen Tarifen die für die
            Abrechnung nötigen Daten.
          </li>
          <li>
            <strong>Nutzung und technische Daten:</strong> Anmeldezeiten,
            relevante Aktionen im System, IP-Adresse, Browser und Fehlerprotokolle,
            die wir für die Sicherheit und zur Fehlerbehebung nutzen.
          </li>
          <li>
            <strong>Kommunikation:</strong> was Sie uns per E-Mail oder im
            Demo-Formular schreiben (Name, E-Mail, Agentur, Teamgröße und Ihre
            Nachricht).
          </li>
        </ul>
        <h3>Daten, die Agenturen mit Tivvu erfassen oder erhalten</h3>
        <p>
          Im Auftrag jeder Agentur verarbeiten wir die Daten ihrer Endkunden:
          Name, E-Mail, Telefon, Anfragen und Nachrichten, Notizen und Verlauf,
          Angebote, Buchungen mit Daten und Gästezahl, erfasste Zahlungen, von
          der Agentur angehängte Dokumente sowie Daten der Eigentümer und ihrer
          Objekte. Welche Daten erfasst werden, hängt von jeder Agentur ab.
        </p>
        <p>
          Wir fragen keine sensiblen Daten ab und bitten die Agenturen, sie nicht
          zu erfassen, sofern das Gesetz es nicht erlaubt und es nicht
          unerlässlich ist.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Wofür wir sie nutzen",
    brief:
      "Um den Dienst zu erbringen, abzurechnen, sicher zu halten und Sie über Wichtiges zu informieren. Wir verkaufen keine Daten und machen keine Werbung für Dritte.",
    content: (
      <>
        <p>Die Daten, für die wir verantwortlich sind, nutzen wir, um:</p>
        <ol>
          <li>
            Ihr Konto und das Ihrer Agentur anzulegen und zu verwalten und Ihnen
            die Anmeldung zu ermöglichen;
          </li>
          <li>den abgeschlossenen Dienst mit seinen Funktionen und Grenzen zu erbringen;</li>
          <li>kostenpflichtige Tarife abzurechnen und einzuziehen;</li>
          <li>
            Ihnen betriebliche Hinweise zu senden: Sicherheit,
            Passwortänderungen, neue Anfragen, Änderungen der Tarife oder dieser
            Bedingungen;
          </li>
          <li>Sie zu unterstützen und Ihre Fragen oder Ihre Demo-Anfrage zu beantworten;</li>
          <li>den Dienst zu schützen, Missbrauch zu erkennen und Betrug zu verhindern;</li>
          <li>
            zu verstehen, wie der Dienst genutzt wird, um ihn zu verbessern,
            nach Möglichkeit mit aggregierten Daten;
          </li>
          <li>
            Ihnen Produktneuigkeiten zu senden, sofern Sie nicht widersprochen
            haben (Sie können sich in jeder E-Mail abmelden);
          </li>
          <li>gesetzliche, buchhalterische und steuerliche Pflichten zu erfüllen.</li>
        </ol>
        <p>
          Die Daten der Endkunden nutzen wir nur, damit die Agentur damit
          arbeiten kann: sie speichern, ihrem Team anzeigen, ihre Angebote oder
          Buchungen über private Links veröffentlichen und im Namen der Agentur
          die Benachrichtigungs- und Bestätigungs-E-Mails zu Anfragen, Angeboten
          und Buchungen versenden.
        </p>
        <p>
          Wir verkaufen keine personenbezogenen Daten, nutzen sie nicht für
          Werbung Dritter und treffen keine automatisierten Entscheidungen mit
          rechtlicher Wirkung für Personen.
        </p>
      </>
    ),
  },
  {
    id: "bases",
    title: "Auf welcher Grundlage wir sie verarbeiten",
    brief:
      "Vertrag, Ihre Einwilligung oder eine gesetzliche Pflicht. Pflichtfelder in jedem Formular sind die, die der Dienst benötigt.",
    content: (
      <>
        <p>
          Wir verarbeiten Ihre Daten, weil sie für das Vertragsverhältnis mit
          Ihrer Agentur erforderlich sind (Artikel 5 Absatz 2 Buchstabe c des
          Gesetzes 25.326), weil Sie eingewilligt haben (zum Beispiel beim
          Absenden des Demo-Formulars) oder weil eine Vorschrift uns zur
          Aufbewahrung verpflichtet (zum Beispiel Abrechnungsunterlagen).
        </p>
        <p>
          Die in jedem Formular als Pflichtfeld markierten Daten sind für die
          Erbringung des Dienstes erforderlich: Ohne sie können wir das Konto
          nicht anlegen oder Ihre Anfrage nicht beantworten. Die übrigen sind
          freiwillig.
        </p>
        <p>
          Verarbeiten wir Daten im Auftrag einer Agentur, muss diese Agentur über
          eine Rechtsgrundlage und gegebenenfalls über die Einwilligung ihrer
          Kunden verfügen.
        </p>
      </>
    ),
  },
  {
    id: "proveedores",
    title: "Mit wem wir sie teilen",
    brief:
      "Nur mit den Dienstleistern, die wir für den Betrieb brauchen, unter Verträgen, die Ihre Daten schützen.",
    content: (
      <>
        <p>
          Wir teilen Daten nur mit Dienstleistern, die wir für den Betrieb des
          Dienstes benötigen, unter Verträgen, die Vertraulichkeit und Sicherheit
          verlangen und die Nutzung auf die Erbringung ihrer Leistung für uns
          beschränken:
        </p>
        <LegalTable
          columns={["Dienstleister", "Wofür wir ihn nutzen"]}
          rows={[
            [
              "Supabase (auf Infrastruktur von Amazon Web Services)",
              "Datenbank und Speicherung von Fotos und Dateien.",
            ],
            [
              "Resend",
              "Versand der System-E-Mails: Benachrichtigungen, Bestätigungen und Passwortwiederherstellung.",
            ],
            [
              "Hosting-Anbieter der Webanwendung",
              "Sie liefern die Seiten aus und erhalten die technischen Daten jedes Besuchs (IP-Adresse, Browser).",
            ],
            ["Google und Apple", "Nur wenn Sie sich mit deren Konto anmelden."],
          ]}
        />
        <p>
          Außerdem werden die Daten je nach Nutzung des Dienstes den
          zuständigen Personen angezeigt: Das Team Ihrer Agentur sieht die Daten
          der Agentur, und wer einen Angebots-, Buchungs- oder
          Eigentümerportal-Link erhält, sieht dessen Inhalt.
        </p>
        <p>
          Wir können Daten offenlegen, wenn ein Gericht oder eine zuständige
          Behörde dies anordnet oder wenn es zur Verteidigung unserer Rechte
          nötig ist. Fusioniert Tivvu oder wird es übernommen, gehen die Daten auf
          die neue Einheit über, die diese Erklärung einhalten muss.
        </p>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "Internationale Übermittlungen",
    brief:
      "Einige Dienstleister sitzen außerhalb Argentiniens; Übermittlungen erfolgen mit gleichwertigen Garantien wie nach dem Gesetz.",
    content: (
      <>
        <p>
          Einige unserer Dienstleister speichern oder verarbeiten Daten außerhalb
          Argentiniens, unter anderem in den Vereinigten Staaten und in der
          Europäischen Union. Die Europäische Union ist von der AAIP als Ziel mit
          angemessenem Schutzniveau anerkannt; für andere Länder erfolgen
          Übermittlungen auf Grundlage von Vertragsklauseln mit Garantien, die
          denen des Gesetzes 25.326 gleichwertig sind, im Einklang mit den durch
          die Verfügung 60-E/2016 und die Resolution 198/2023 der AAIP
          genehmigten Mustern.
        </p>
        <p>
          Mit der Nutzung des Dienstes willigen Sie gemäß Artikel 12 des
          Gesetzes 25.326 in diese Übermittlungen ein. Wenn Sie mehr über die von
          uns angewandten Garantien erfahren möchten, schreiben Sie uns.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    title: "Wie lange wir sie aufbewahren",
    brief:
      "Jede Datenart hat ihre Frist: von 30 Tagen im Papierkorb bis zu 10 Jahren bei der Abrechnung.",
    content: (
      <LegalTable
        columns={["Welche Daten", "Wie lange wir sie aufbewahren"]}
        rows={[
          [
            "Konto- und Agenturdaten",
            "Solange das Konto aktiv ist. Wird es geschlossen, stehen sie 30 Tage zum Export bereit und werden dann gelöscht; Sicherungen werden innerhalb von höchstens 90 Tagen überschrieben.",
          ],
          [
            "Im System gelöschte Elemente",
            "30 Tage im Papierkorb, wo sie wiederhergestellt werden können; danach endgültig gelöscht.",
          ],
          [
            "Abrechnungsdaten",
            "10 Jahre, wie es Artikel 328 des argentinischen Zivil- und Handelsgesetzbuchs für Buchhaltungsunterlagen verlangt.",
          ],
          [
            "Technische und Sicherheitsprotokolle",
            "So lange, wie zur Untersuchung von Vorfällen nötig, in der Regel nicht länger als 12 Monate.",
          ],
          [
            "Demo-Anfragen und Fragen",
            "Bis zu 2 Jahre ab dem letzten Kontakt oder früher, wenn Sie die Löschung verlangen.",
          ],
        ]}
      />
    ),
  },
  {
    id: "seguridad",
    title: "Wie wir sie schützen",
    brief:
      "Verschlüsselung, gehashte Passwörter, nach Agentur getrennte Daten und rollenbasierte Berechtigungen. Bei einem Vorfall informieren wir.",
    content: (
      <>
        <p>
          Wir wenden technische und organisatorische Maßnahmen gemäß den
          Empfehlungen der AAIP-Resolution 47/2018 an, darunter:
        </p>
        <ul>
          <li>
            Verschlüsselung der Kommunikation (HTTPS/TLS) zwischen Ihrem Browser,
            der Anwendung und unseren Dienstleistern;
          </li>
          <li>als Hash gespeicherte Passwörter, nie lesbar;</li>
          <li>
            Trennung der Daten nach Agentur: Jedes Team greift nur auf seinen
            eigenen Bereich zu;
          </li>
          <li>rollenbasierte Berechtigungen in jeder Agentur;</li>
          <li>
            private Links für Angebote, Buchungen und Eigentümer mit schwer zu
            erratenden Kennungen;
          </li>
          <li>
            Sicherungen und eingeschränkter Zugriff des Personals auf
            Produktionsdaten.
          </li>
        </ul>
        <p>
          Kein System ist unfehlbar. Stellen wir einen Sicherheitsvorfall fest,
          der personenbezogene Daten betrifft, untersuchen wir ihn, ergreifen
          Maßnahmen zur Eindämmung, informieren die betroffenen Agenturen
          unverzüglich und gegebenenfalls die AAIP und die betroffenen Personen.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies und Speicherung in Ihrem Browser",
    brief:
      "Nur die für den Betrieb nötigen: keine Werbung und kein Tracking durch Dritte.",
    content: (
      <>
        <p>
          Tivvu verwendet nur Cookies und lokalen Speicher, die für den Betrieb
          des Dienstes erforderlich sind. Wir verwenden keine Werbe- oder
          Tracking-Cookies Dritter.
        </p>
        <LegalTable
          columns={["Was gespeichert wird", "Wozu es dient", "Wie lange"]}
          rows={[
            [
              <>
                Sitzung (<code>access_token</code>, <code>refresh_token</code>,{" "}
                <code>tivvu_user</code>)
              </>,
              "Sie halten Sie angemeldet.",
              "Bis zu 180 Tage oder bis Sie sich abmelden.",
            ],
            [
              <>
                Einstellungen (<code>sidebar_collapsed</code> und lokaler
                Speicher)
              </>,
              "Sie merken sich, ob das Menü eingeklappt ist, die gewählte Ansicht jeder Liste und das helle oder dunkle Design.",
              "Das Menü-Cookie bis zu 1 Jahr; der Rest, bis Sie es in Ihrem Browser löschen.",
            ],
            [
              "Anmeldung mit Google oder Apple",
              "Während der Anmeldung speichern wir im Tab die Seite, zu der Sie zurückkehren.",
              "Wird danach gelöscht.",
            ],
          ]}
        />
        <p>
          Sie können Cookies in Ihrem Browser löschen oder blockieren. Blockieren
          Sie die Sitzungs-Cookies, können Sie sich nicht anmelden. Die
          öffentlichen Websites der Agenturen setzen keine Tivvu-Cookies.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    title: "Ihre Rechte und wie Sie sie ausüben",
    brief:
      "Sie können Auskunft, Berichtigung, Löschung oder das Ende unserer Zusendungen verlangen; wir antworten in den Fristen der Tabelle.",
    content: (
      <>
        <p>Als betroffene Person haben Sie das Recht auf:</p>
        <LegalTable
          columns={["Recht", "Was Sie verlangen können", "Antwortfrist"]}
          rows={[
            [
              "Auskunft",
              "Zu erfahren, welche Daten wir über Sie haben, woher sie stammen und wofür wir sie nutzen. Kostenlos, wenn Sie sie in Abständen von mindestens sechs Monaten verlangen, es sei denn, Sie weisen ein berechtigtes Interesse an einer früheren Auskunft nach (Artikel 14 des Gesetzes 25.326).",
              "10 Kalendertage",
            ],
            [
              "Berichtigung, Aktualisierung und Löschung",
              "Dass wir unrichtige Daten berichtigen oder Daten löschen, die nicht aufbewahrt werden dürfen (Artikel 16).",
              "5 Werktage",
            ],
            [
              "Widerspruch gegen Werbung",
              "Zu verlangen, dass wir Ihnen keine Neuigkeiten mehr senden, jederzeit (Artikel 27).",
              "Jederzeit",
            ],
            [
              "Widerruf Ihrer Einwilligung",
              "Wenn die Verarbeitung darauf beruht, ohne Rückwirkung.",
              "Jederzeit",
            ],
          ]}
        />
        <p>
          Um sie auszuüben, schreiben Sie an{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          von der mit Ihren Daten verknüpften E-Mail und geben Sie an, was Sie
          verlangen. Können wir Ihre Identität nicht überprüfen, bitten wir Sie
          um einen Nachweis. Die meisten Daten können Sie auch in Ihrem Profil
          korrigieren.
        </p>
        <p>
          Wurden Ihre Daten von einer Agentur erfasst (zum Beispiel, weil Sie ihr
          eine Anfrage gesendet haben), richten Sie Ihr Anliegen an diese
          Agentur; erreicht es uns, leiten wir es innerhalb von 5 Werktagen weiter
          und helfen ihr bei der Beantwortung.
        </p>
        <p>
          Antworten wir nicht fristgerecht oder sind Sie mit der Antwort nicht
          zufrieden, können Sie sich bei der Agentur für den Zugang zu
          öffentlichen Informationen beschweren unter{" "}
          <LegalLink href="https://www.argentina.gob.ar/aaip/datospersonales">
            argentina.gob.ar/aaip
          </LegalLink>
          .
        </p>
      </>
    ),
  },
  {
    id: "menores",
    title: "Minderjährige",
    brief: "Tivvu ist ein Werkzeug für Personen über 18 Jahre.",
    content: (
      <p>
        Tivvu ist ein professionelles Werkzeug für Personen über 18 Jahre und
        richtet sich nicht an Minderjährige. Wissen Sie, dass uns ein
        Minderjähriger ohne Erlaubnis Daten übermittelt hat, schreiben Sie uns,
        und wir löschen sie.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Änderungen dieser Erklärung",
    brief: "Wesentliche Änderungen kündigen wir 30 Tage vorher an.",
    content: (
      <p>
        Wir können diese Erklärung aktualisieren, um Änderungen des Dienstes
        oder des Rechts abzubilden. Ist die Änderung wesentlich, informieren wir
        Sie per E-Mail und im Dienst mindestens 30 Tage im Voraus. Das Datum der
        geltenden Fassung steht oben auf dieser Seite.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Kontakt",
    content: (
      <>
        <p>
          Bei Fragen zum Datenschutz schreiben Sie uns an{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          oder per Post an {address}.
        </p>
        <p className="border-l-2 border-line pl-4 text-sm text-quiet">
          DIE AGENTUR FÜR DEN ZUGANG ZU ÖFFENTLICHEN INFORMATIONEN ist als
          Aufsichtsbehörde des Gesetzes Nr. 25.326 befugt, Beschwerden und
          Ansprüche von Personen zu bearbeiten, deren Rechte durch die
          Nichteinhaltung der geltenden Datenschutzvorschriften verletzt werden.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Datenschutzerklärung",
  metaDescription:
    "Welche personenbezogenen Daten Tivvu verarbeitet, wozu, mit wem sie geteilt werden und wie Sie Ihre Rechte ausüben.",
  title: "Datenschutzerklärung",
  intro: (
    <>
      <p>
        Welche personenbezogenen Daten wir verarbeiten, wozu, mit wem wir sie
        teilen und wie Sie Auskunft erhalten, sie berichtigen oder löschen
        lassen können.
      </p>
      <p>
        Diese Übersetzung dient der Information. Bei Abweichungen ist die
        spanische Fassung maßgeblich.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Allgemeine Geschäftsbedingungen" },
  action: {
    href: `mailto:${privacyEmail}?subject=${encodeURIComponent("Anfrage zu meinen personenbezogenen Daten")}`,
    label: "Meine Rechte ausüben",
    hint: `Schreiben Sie uns an ${privacyEmail}: Auskunft, Berichtigung oder Löschung.`,
  },
};
