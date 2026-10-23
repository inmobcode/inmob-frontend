import {
  Building2,
  CalendarCheck,
  CalendarDays,
  Compass,
  Eye,
  Globe,
  Inbox,
  Keyboard,
  KeyRound,
  Settings,
  Sparkles,
  Tag,
  Upload,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";

import {
  DocFigure,
  DocH3,
  DocList,
  DocP,
  DocPill,
  DocSection,
  DocStep,
  DocSteps,
  DocTerms,
  DocTip,
  Kbd,
} from "@/components/docs/docs-parts";

import type { DocEntry } from "./types";

function Basics() {
  return (
    <DocSection
      id="primeros-pasos"
      icon={Compass}
      title="Erste Schritte"
      intro="Tivvu bündelt an einem Ort die Anfragen, die Sie erhalten, Ihre Kunden, Ihren Objektbestand, die Angebote, die Sie verschicken, Buchungen und Verfügbarkeit. Alles, was Sie veröffentlichen, erscheint auf der Website Ihrer Agentur."
    >
      <DocFigure
        src="/docs-media/de/panel.webp"
        alt="Das Tivvu-Dashboard mit Seitenmenü, Objektliste und Profilkarte"
        width={1584}
        height={946}
        markers={[
          { x: 8.9, y: 11.6, label: "Das Seitenmenü: jedes Werkzeug des Dashboards." },
          { x: 15.5, y: 4.7, label: "Menü ein- oder ausklappen (Ctrl/⌘ + B)." },
          { x: 15.1, y: 11.6, label: "Wie viele ungelesene Anfragen Sie haben." },
          { x: 33.3, y: 6, label: "Die Listenleiste: Suche, Sortierung, Filter, Ansichten, Papierkorb und Import." },
          { x: 87.7, y: 6, label: "Neu anlegen." },
          { x: 14.7, y: 94.7, label: "Die Benachrichtigungsglocke." },
          { x: 8.8, y: 93.7, label: "Ihre Profilkarte: Ihr Konto, das Erscheinungsbild, die Hilfe und diese Dokumentation." },
        ]}
      />

      <DocH3>Das Seitenmenü</DocH3>
      <DocP>
        Die Werkzeuge folgen der Arbeitsweise einer Agentur: Eine <strong>Anfrage</strong> kommt herein, wird zum{" "}
        <strong>Kunden</strong>, Sie bieten ihm <strong>Objekte</strong> in einem <strong>Angebot</strong> an, und am Ende
        steht eine <strong>Buchung</strong>. Danach kommen <strong>Verfügbarkeit</strong> und <strong>Leistungen</strong>.
        Als Inhaber oder Administrator des Kontos sehen Sie am Ende außerdem <strong>Website</strong>,{" "}
        <strong>Team</strong> und <strong>Einstellungen</strong>.
      </DocP>
      <DocP>
        „Anfragen“ zeigt eine Zahl, wenn Sie ungelesene Anfragen haben; sie aktualisiert sich jede Minute von selbst. Sie
        können das Menü mit der Schaltfläche oben oder mit <Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd> einklappen, um Platz zu gewinnen,
        und Tivvu merkt sich Ihre Wahl. Auf dem Handy öffnet sich das Menü über das Symbol oben.
      </DocP>

      <DocH3>Benachrichtigungen</DocH3>
      <DocP>
        Die Glocke neben Ihrem Namen zeigt, was passiert ist, während Sie nicht hingeschaut haben: eine neue Anfrage, ein
        Kunde, der ein Angebot geöffnet oder darauf geantwortet hat, eine erfasste Zahlung, eine Buchung und Aufgaben, die
        Ihnen zugewiesen wurden. Die Zahl zeigt, wie viele Benachrichtigungen Sie nicht gelesen haben; sie aktualisiert
        sich jede Minute.
      </DocP>
      <DocFigure
        src="/docs-media/de/notificaciones.webp"
        alt="Die Benachrichtigungsliste mit neuen Anfragen und einem geöffneten Angebot"
        width={760}
        height={1013}
        className="max-w-sm"
        markers={[
          { x: 73.7, y: 9.4, label: "„Alle als gelesen markieren“ markiert sie als gelesen." },
          { x: 50, y: 25.6, label: "Jede Benachrichtigung führt zum Ereignis (Anfrage, Angebot, Buchung). Der Punkt zeigt, dass Sie sie nicht gelesen haben." },
        ]}
      />
      <DocP>
        Um eine Benachrichtigung zu löschen, fahren Sie mit der Maus darüber und klicken Sie auf das Kreuz rechts (auf dem
        Handy ist das Kreuz immer sichtbar). Sie wird nur für Sie gelöscht: Der Rest des Teams sieht seine weiterhin, und
        sie lässt sich nicht wiederherstellen.
      </DocP>

      <DocH3>Ihre Profilkarte</DocH3>
      <DocP>
        Unten im Menü steht Ihr Name. Ein Klick darauf öffnet Ihr Kontomenü: Ihr Profil, die Einstellungen, Agentur
        wechseln (wenn Sie für mehrere arbeiten), den Link zu Ihrer Website ansehen oder kopieren, das Erscheinungsbild,
        die Sprache, diese Dokumentation, die Suche, die Tastenkürzel, die Hilfe und Abmelden.
      </DocP>
      <DocFigure
        src="/docs-media/de/menu-perfil.webp"
        alt="Das Kontomenü, geöffnet über die Profilkarte"
        width={640}
        height={1252}
        className="max-w-xs"
        markers={[
          { x: 50, y: 28.5, label: "Mein Profil: Ihre Daten und Ihr Passwort." },
          { x: 50, y: 34.2, label: "Einstellungen der Agentur (Inhaber und Administratoren)." },
          { x: 50, y: 41.4, label: "Den Link Ihrer Website öffnen oder kopieren." },
          { x: 75, y: 55.3, label: "Erscheinungsbild: hell, dunkel oder automatisch (folgt Ihrem Computer)." },
          { x: 50, y: 69.2, label: "Diese Dokumentation, in einem neuen Tab." },
          { x: 50, y: 74.9, label: "Die Suche und darunter die Tastenkürzel." },
          { x: 50, y: 86.4, label: "Hilfe und Support: häufige Fragen und Kontakt zu Tivvu." },
          { x: 50, y: 93.6, label: "Abmelden." },
        ]}
      />
      <DocTip>
        Wenn Sie für mehr als eine Agentur arbeiten, erscheint „Agentur wechseln“ in diesem Menü. Jede Agentur hat ihre
        eigenen Daten: Beim Wechsel lädt das Dashboard die der anderen.
      </DocTip>

      <DocH3>Rollen</DocH3>
      <DocTerms
        items={[
          ["Inhaber", "Der Besitzer des Kontos. Hat Zugriff auf alles und kann nicht aus dem Team entfernt werden."],
          [
            "Administrator",
            "Wie der Inhaber: sieht alles, verwaltet Team, Website, Einstellungen und Import und weist Objekte und Kunden neu zu.",
          ],
          [
            "Makler",
            "Sieht nur die ihm zugewiesenen Objekte, seine Angebote und Buchungen, seine Kunden und nicht zugewiesene Leads. Sieht weder Website, Team, Einstellungen, Import noch die Kontoauszüge der Eigentümer.",
          ],
        ]}
      />

      <DocH3>Was im ganzen Dashboard wiederkehrt</DocH3>
      <DocTerms
        items={[
          [
            "Aktionsleiste",
            "In den Editoren erscheint oben eine Leiste mit Speichern, Veröffentlichen und Abbrechen. Gibt es Ungespeichertes, wird Speichern aktiv. Ctrl/⌘ + S speichert, ohne die Maus anzufassen.",
          ],
          [
            "Ansichten",
            "Listen lassen sich als Raster, Liste oder Tabelle anzeigen (Tasten 1, 2 und 3). Tivvu merkt sich die gewählte Ansicht in jedem Browser.",
          ],
          [
            "Suche und Filter",
            "Jede Liste hat eine Suche und Filter, um die Anzeige einzugrenzen. Jeder Filter zeigt, wie viele Einträge jede Option hat. „Filter entfernen“ zeigt wieder alles.",
          ],
          [
            "Papierkorb",
            "Was Sie in Objekte, Angebote und Buchungen löschen, landet im Papierkorb und verschwindet nicht. Dort bleibt es 30 Tage, falls Sie es sich anders überlegen; danach wird es endgültig gelöscht. Beim Löschen bietet der Hinweis unten „Rückgängig“.",
          ],
          [
            "„Auf der Website sichtbar“ / „Nur intern“",
            "Jeder Block eines Formulars sagt Ihnen, ob Ihre Kunden die Eingaben sehen oder ob sie nur für Ihr Team sind.",
          ],
          [
            "Hilfe",
            "Die Schaltfläche mit dem Fragezeichen öffnet in jedem Werkzeug den passenden Teil dieser Anleitung.",
          ],
        ]}
      />

      <DocH3>Der Papierkorb</DocH3>
      <DocP>
        Er öffnet sich über das Papierkorbsymbol in der Leiste von Objekte, Angebote und Buchungen. Eine Zahl auf dem
        Symbol zeigt, wie viele Einträge darin liegen.
      </DocP>
      <DocFigure
        src="/docs-media/de/papelera.webp"
        alt="Der Objekt-Papierkorb mit einem gelöschten Objekt"
        width={1304}
        height={281}
        markers={[
          { x: 36.6, y: 87.1, label: "Wann Sie es gelöscht haben und wie viele Tage ihm bleiben." },
          { x: 72.5, y: 82, label: "„Wiederherstellen“ bringt es unverändert in seine Liste zurück." },
          { x: 87.3, y: 82, label: "„Endgültig löschen“ entfernt es sofort, ohne 30 Tage zu warten. Wir bitten um Bestätigung." },
        ]}
      />
    </DocSection>
  );
}

function Inquiries() {
  return (
    <DocSection
      id="consultas"
      icon={Inbox}
      title="Anfragen"
      intro="Der Posteingang für alles, was man Ihnen über Ihre Website, eine Objektseite oder ein Angebot schreibt."
    >
      <DocFigure
        src="/docs-media/de/consultas.webp"
        alt="Der Anfrage-Posteingang mit einer geöffneten Anfrage"
        width={1304}
        height={946}
        markers={[
          { x: 20.7, y: 7.4, label: "Alle oder nur neue, mit der Zahl der ungelesenen." },
          { x: 29, y: 7.4, label: "Alle als gelesen markieren." },
          { x: 18.9, y: 13.5, label: "Suchen Sie nach Name, E-Mail, Nachricht, Objekt oder Angebot." },
          { x: 54.4, y: 21.7, label: "Worauf sich die Anfrage bezieht: das Objekt, das Angebot oder eine allgemeine Anfrage." },
          { x: 92.4, y: 8.6, label: "Wieder als neu markieren, um sie nicht zu vergessen." },
          { x: 47.8, y: 87.4, label: "Per E-Mail, WhatsApp oder Anruf antworten; oder zum Kundenprofil gehen." },
        ]}
      />

      <DocH3>Was passiert, wenn eine eingeht</DocH3>
      <DocList>
        <li>Sie erscheint in Anfragen als neu und erhöht die Zahl im Seitenmenü und an der Glocke.</li>
        <li>
          Der Kunde wird angelegt oder aktualisiert, wenn es schon einen mit dieser E-Mail gab. In seinem Verlauf steht eine
          Notiz mit dem angefragten Objekt oder Angebot.
        </li>
        <li>
          Die Agentur erhält eine E-Mail-Benachrichtigung (an die Kontakt-E-Mail aus den Einstellungen oder, falls keine
          vorhanden ist, an Inhaber und Administratoren), und der Kunde erhält eine Bestätigung.
        </li>
      </DocList>

      <DocH3>Den Posteingang bearbeiten</DocH3>
      <DocList>
        <li>
          Links steht die Liste, gruppiert nach Heute, Gestern, Diese Woche und Älter; rechts die geöffnete Anfrage. Auf dem
          Handy wechseln sie sich ab: Tippen Sie auf eine, um sie zu lesen, und auf den Pfeil, um zurückzugehen.
        </li>
        <li>Beim Öffnen wird eine Anfrage als gelesen markiert. Der Umschlag oben rechts markiert sie wieder als neu.</li>
        <li>Anfragen von bestehenden Kunden zeigen deren Phase (Lead, Kontaktiert…) neben dem Namen.</li>
        <li>
          Antworten Sie mit einem Klick: <strong>Per E-Mail antworten</strong> (mit Betreff und Anrede bereits
          ausgefüllt), <strong>WhatsApp</strong> (mit einer Nachricht, die das Angefragte nennt) oder{" "}
          <strong>Anrufen</strong>. WhatsApp und Anrufen erscheinen, wenn eine Telefonnummer hinterlassen wurde. Das Symbol
          neben der E-Mail kopiert sie.
        </li>
        <li>Klicken Sie auf das Objekt oder Angebot, um es im Dashboard zu öffnen, oder auf „Kunde ansehen“ für sein Profil.</li>
        <li>Der Posteingang aktualisiert sich jede Minute von selbst.</li>
      </DocList>
      <DocTip>
        Ist noch keine Anfrage eingegangen, teilen Sie den Link zu Ihrer Website: Das Kontaktformular und das jeder
        Objektseite landen hier.
      </DocTip>
    </DocSection>
  );
}

function Clients() {
  return (
    <DocSection
      id="clientes"
      icon={Users}
      title="Kunden"
      intro="Ihr Adressbuch und die Betreuung: in welcher Phase jeder ist, wonach er sucht, was zu tun ist und jedes Gespräch."
    >
      <DocFigure
        src="/docs-media/de/clientes-lista.webp"
        alt="Die Kundenliste als Raster"
        width={1304}
        height={946}
        markers={[
          { x: 26.3, y: 6, label: "Suchen Sie nach Name, E-Mail oder Telefon." },
          { x: 64.7, y: 6, label: "Nach Phase filtern." },
          { x: 89.6, y: 6, label: "Einen Kunden manuell anlegen." },
          { x: 77.3, y: 86.9, label: "Die Phase jedes Kunden." },
          { x: 40.2, y: 72.8, label: "Woher er kam: Website, Angebot oder manuell; und wie lange die letzte Aktivität her ist." },
        ]}
      />

      <DocH3>Wie Kunden hinzukommen</DocH3>
      <DocList>
        <li>
          <strong>Manuell:</strong> „Neuer Kunde“ mit Name, E-Mail und Telefon.
        </li>
        <li>
          <strong>Über die Website oder ein Angebot:</strong> Schreibt Ihnen jemand, legt Tivvu den Kunden an (oder erkennt
          ihn an seiner E-Mail) und hinterlässt im Verlauf eine Notiz mit dem angefragten Objekt oder Angebot.
        </li>
      </DocList>

      <DocH3>Phasen</DocH3>
      <DocTerms
        items={[
          [<DocPill key="l" tone="amber">Lead</DocPill>, "Gerade eingegangen; Sie haben noch nicht mit ihm gesprochen."],
          [<DocPill key="c" tone="primary">Kontaktiert</DocPill>, "Es gab bereits einen ersten Kontakt."],
          [<DocPill key="n">In Verhandlung</DocPill>, "Sie besprechen ein konkretes Angebot."],
          [<DocPill key="k" tone="primary">Kunde</DocPill>, "Hat ein Geschäft mit Ihnen abgeschlossen."],
          [<DocPill key="p">Verloren</DocPill>, "Kam nicht zustande. Wird in der Liste blasser angezeigt."],
        ]}
      />
      <DocP>
        Ändern Sie die Phase über das Menü <strong>⋯</strong> jedes Kunden („Phase ändern“) oder in seinem Profil. Im selben
        Menü können Sie das Profil ansehen, eine E-Mail senden, anrufen oder die E-Mail kopieren.
      </DocP>

      <DocH3>Das Kundenprofil</DocH3>
      <DocFigure
        src="/docs-media/de/clientes-ficha.webp"
        alt="Ein Kundenprofil mit Notizen, Aufgaben und Verlauf"
        width={1304}
        height={1651}
        markers={[
          { x: 5.3, y: 15.8, label: "Notizen: was man sich merken sollte." },
          { x: 6.1, y: 34.3, label: "Aufgaben mit Fälligkeitsdatum; überfällige in Rot." },
          { x: 5, y: 58.2, label: "Verlauf: Notizen, Anrufe, E-Mails und Termine." },
          { x: 82.4, y: 14.1, label: "Phase ändern." },
          { x: 82.4, y: 20.1, label: "Der zuständige Makler." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Notizen",
            "Was man sich merken sollte: wonach gesucht wird, Budget, Vorlieben. Unterstützt Überschriften, Fettdruck, Listen und Links. Nach einer Änderung erscheint „Notizen speichern“.",
          ],
          [
            "Aufgaben",
            "Was mit diesem Kunden zu tun ist: anrufen, Fotos schicken, eine Besichtigung vereinbaren. Aufgabe eingeben, optional ein Fälligkeitsdatum wählen und auf + klicken. Erledigte abhaken. Überfällige erscheinen in Rot („Seit 2 Tagen überfällig“), heutige und morgige sind entsprechend markiert.",
          ],
          [
            "Verlauf",
            "Typ wählen (Notiz, Anruf, E-Mail oder Termin), aufschreiben, was passiert ist, und auf „Erfassen“ klicken. Sortiert vom neuesten zum ältesten, mit der Person, die es erfasst hat.",
          ],
          ["Phase", "Klicken Sie im rechten Bereich auf die neue Phase; sie wird sofort gespeichert."],
          [
            "Zuständig",
            "Der Makler, der den Kunden betreut. Inhaber und Administratoren wählen ihn aus der Teamliste; ein Makler kann bei einem nicht zugewiesenen Lead auf „Übernehmen“ klicken.",
          ],
          ["Kontakt", "E-Mail und Telefon, mit einem Klick zum Schreiben oder Anrufen."],
        ]}
      />
      <DocTip>
        Gelöschte Aufgaben landen nicht im Papierkorb: Sie verschwinden sofort. Ist eine nur erledigt, haken Sie sie lieber
        ab.
      </DocTip>
    </DocSection>
  );
}

function Properties() {
  return (
    <DocSection
      id="propiedades"
      icon={Building2}
      title="Objekte"
      intro="Ihr Bestand: jedes Haus, jede Wohnung, jedes Grundstück und jede Ferienvermietung, die Sie vermarkten, mit allen Daten, Fotos, Preisen und der Verfügbarkeit."
    >
      <DocH3>Ein Objekt anlegen</DocH3>
      <DocSteps>
        <DocStep>
          Klicken Sie auf <strong>Neues Objekt</strong> (oder Taste <Kbd>N</Kbd> in der Liste).
        </DocStep>
        <DocStep>
          Wählen Sie, was Sie damit vorhaben: <strong>Verkauf</strong> oder <strong>Vermietung</strong>. Das ändert die
          verfügbaren Kategorien und die Bereiche des Editors.
        </DocStep>
        <DocStep>Geben Sie einen Titel ein und wählen Sie die Kategorie (Haus, Wohnung, Villa, Hotel, Grundstück…).</DocStep>
        <DocStep>
          Klicken Sie auf <strong>Objekt erstellen</strong>. Es wird als <DocPill tone="amber">Entwurf</DocPill> angelegt,
          und der Editor öffnet sich, damit Sie den Rest ergänzen.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/de/propiedades-nueva.webp"
        alt="Der Dialog Neues Objekt"
        width={784}
        height={1023}
        className="max-w-md"
        markers={[
          { x: 72.9, y: 30.7, label: "Verkauf oder Vermietung." },
          { x: 50, y: 50, label: "Der Titel, den Ihre Kunden sehen." },
          { x: 50, y: 57.9, label: "Die Kategorie; sie hängt von Verkauf oder Vermietung ab." },
          { x: 79.4, y: 92.8, label: "Erstellt das Objekt und öffnet den Editor." },
        ]}
      />
      <DocTip>
        Ihre Objekte liegen in einem anderen System? Mit <strong>Importieren</strong> holen Sie alle auf einmal. Siehe
        „Objekte importieren“ weiter unten.
      </DocTip>

      <DocH3>Status</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Entwurf</DocPill>, "Nur Ihr Team sieht es. Ideal, solange Sie es vervollständigen."],
          [<DocPill key="p" tone="primary">Veröffentlicht</DocPill>, "Erscheint auf Ihrer Website und kann Angeboten hinzugefügt werden."],
          [<DocPill key="a">Archiviert</DocPill>, "Nicht mehr am Markt, aber alle Daten bleiben erhalten. Kann erneut veröffentlicht werden."],
        ]}
      />

      <DocH3>Die Liste</DocH3>
      <DocFigure
        src="/docs-media/de/propiedades-lista.webp"
        alt="Die Objektliste in der Rasteransicht"
        width={1276}
        height={946}
        markers={[
          { x: 17.3, y: 6, label: "Suche nach Titel, Gebiet, Region, Land oder Eigentümer." },
          { x: 40.3, y: 6, label: "Sortierung: neueste, älteste, Preis oder Titel." },
          { x: 47.7, y: 6, label: "Filter (Taste F)." },
          { x: 55.1, y: 6, label: "Tabellen-, Listen- oder Rasteransicht." },
          { x: 62.5, y: 6, label: "Papierkorb: was in den letzten 30 Tagen gelöscht wurde." },
          { x: 71.1, y: 6, label: "Objekte aus einem anderen System importieren (Inhaber und Administratoren)." },
          { x: 84.7, y: 6, label: "Neues Objekt (Taste N)." },
          { x: 37.1, y: 69.3, label: "Der Status jedes Objekts." },
        ]}
      />
      <DocList>
        <li>
          Jede Karte zeigt Titelbild, Vermarktungsart und Kategorie, Lage, Preis, Schlafzimmer, Bäder, Fläche, Eigentümer
          und wann das Objekt zuletzt aktualisiert wurde.
        </li>
        <li>25 pro Seite. Beim Scrollen bleibt die Suche oben stehen, damit Sie nicht zurückscrollen müssen.</li>
        <li>
          Über das Menü <strong>⋯</strong> jedes Objekts: bearbeiten, auf der Website ansehen (wenn veröffentlicht),
          veröffentlichen, Veröffentlichung aufheben, archivieren, erneut veröffentlichen oder löschen. Das Pfeilsymbol
          öffnet ebenfalls die öffentliche Seite.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/de/propiedades-filtros.webp"
        alt="Das Filterfenster für Objekte"
        width={560}
        height={1604}
        className="max-w-xs"
        markers={[
          { x: 50.1, y: 3.8, label: "Status, Art und Kategorie: Sie können mehrere wählen; ohne Auswahl wird alles angezeigt." },
          { x: 50.1, y: 36.5, label: "Lage und Eigentümer." },
          { x: 27.5, y: 57.3, label: "Preisspanne in der gewünschten Währung." },
          { x: 50.1, y: 62.2, label: "Mindestanzahl Schlafzimmer und Bäder." },
          { x: 22.4, y: 96, label: "Zurücksetzen löscht alles." },
          { x: 67.6, y: 96, label: "Wendet die Filter an und zeigt, wie viele Objekte übrig bleiben." },
        ]}
      />
      <DocP>Aktive Filter erscheinen als Etiketten über der Liste; klicken Sie auf das Kreuz eines Etiketts, um es zu entfernen.</DocP>

      <DocH3>Sammelaktionen</DocH3>
      <DocP>
        Markieren Sie in der Tabellenansicht mehrere Objekte über das Kästchen jeder Zeile (oder alle über das oben). Unten
        erscheint eine Leiste, um sie gemeinsam zu veröffentlichen, die Veröffentlichung aufzuheben, zu archivieren oder
        zu löschen. <Kbd>Esc</Kbd> hebt die Auswahl auf.
      </DocP>
      <DocFigure
        src="/docs-media/de/propiedades-lote.webp"
        alt="Zwei ausgewählte Objekte und die Leiste für Sammelaktionen"
        width={1276}
        height={946}
        markers={[
          { x: 2.2, y: 30, label: "Markieren Sie die Objekte." },
          { x: 47.9, y: 94.2, label: "Die Leiste für Sammelaktionen." },
        ]}
      />

      <DocH3>Der Editor</DocH3>
      <DocP>
        Oben steht die Editorleiste mit den gruppierten Bereichen: <strong>Allgemeine Informationen</strong>,{" "}
        <strong>Medien</strong>, <strong>Vermietung</strong> (nur bei Vermietungen), <strong>Verwaltung</strong> und{" "}
        <strong>Kontakt</strong>. Fahren Sie über eine Gruppe mit Pfeil (oder tippen Sie darauf), um ihre Bereiche zu
        sehen. Speichern Sie mit <strong>Speichern</strong> oder <Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd>.{" "}
        <strong>Veröffentlichen</strong> speichert und veröffentlicht in einem Schritt; ist das Objekt schon
        veröffentlicht, wird daraus <strong>Veröffentlichung aufheben</strong>. Wollen Sie mit ungespeicherten Änderungen
        gehen, warnen wir Sie.
      </DocP>
      <DocFigure
        src="/docs-media/de/propiedades-editor.webp"
        alt="Der Objekteditor im Bereich Grunddaten"
        width={1760}
        height={990}
        markers={[
          { x: 21.7, y: 5.1, label: "Zurück zur Objektliste." },
          { x: 33, y: 5.1, label: "Die Bereiche des Editors, gruppiert." },
          { x: 35.4, y: 10.4, label: "Hilfe, Abbrechen, Speichern und Veröffentlichen bzw. Veröffentlichung aufheben." },
          { x: 39.7, y: 51.8, label: "Zuständig: der Makler, der das Objekt betreut." },
          { x: 85.8, y: 33.1, label: "So sieht die Karte in Ihrem Bestand aus, live während der Bearbeitung." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Grunddaten",
            "Titel, interner Name (wie Ihr Team es nennt; der Kunde sieht ihn nie), Zuständiger, Vermarktungsart, Kategorie, Schlafzimmer, Bäder, Flächen, Stellplätze, Abstellräume, Etagen, Baujahr und Renovierungsjahr, Energieausweis. Bei Vermietungen außerdem Gäste und Sterne.",
          ],
          [
            "Lage",
            "Wie sie angezeigt wird (die für Ihre Kunden sichtbare Lage), wo das Objekt liegt (genaue Adresse und Markierung auf der Karte, nur intern), die Umgebung (Merkmale der Gegend und Aussicht) und Links (Google Maps, PDF-Exposé und Website).",
          ],
          [
            "Ausstattung",
            "Allgemeine Ausstattung (die kurze Liste auf der Objektseite: jedes Element eingeben und Enter drücken), Ausstattung innen und außen, Pools und Whirlpools mit Typ und Maßen, Schlafzimmer nach Typ, Raumaufteilung sowie Leistungen und Bedingungen.",
          ],
          [
            "Inhalte und Leistungen",
            "Die Kurzbeschreibung (oben auf der Objektseite hervorgehoben) und die Beschreibung, mit Überschriften und Listen. Bei Vermietungen außerdem die im Preis enthaltenen Leistungen sowie Buchungs- und Stornobedingungen.",
          ],
          [
            "Preise",
            "Verkaufspreis oder Grundpreis pro Nacht und Währung. Bleibt das Feld leer, zeigt die Objektseite „Preis auf Anfrage“.",
          ],
          ["Fotos", "Siehe unten. Änderungen in diesem Bereich werden sofort gespeichert, ohne auf Speichern zu klicken."],
          [
            "Verwaltung",
            "Interne Daten: wer das Objekt im Alltag verwaltet, Anbieter und Lizenz, die Provision und ob es außerhalb Ihrer Website vermarktet werden darf.",
          ],
          [
            "Empfehlungen",
            "Vorgeschlagene Verbesserungen mit Details, geschätzten Kosten, Priorität und Status (vorgeschlagen, genehmigt oder erledigt). Der Eigentümer sieht sie auf seiner Seite.",
          ],
          ["Zimmer", "Nur bei Hotels, unter Verwaltung: die Zimmer des Hotels."],
          ["Eigentümer", "Der Eigentümer des Objekts, sein Zugangslink und sein Kontoauszug. Siehe „Eigentümer“."],
        ]}
      />
      <DocP>
        Der <strong>Zuständige</strong> (in Grunddaten) legt fest, welcher Makler das Objekt sieht: Ein Makler arbeitet nur
        mit den ihm zugewiesenen Objekten. Inhaber und Administratoren wählen ihn aus, und die Auswahl wird sofort
        gespeichert.
      </DocP>

      <DocH3>Lage</DocH3>
      <DocFigure
        src="/docs-media/de/propiedades-ubicacion.webp"
        alt="Der Bereich Lage mit sichtbarer Lage, Adresse und Karte"
        width={1452}
        height={1100}
        markers={[
          { x: 26.9, y: 18.9, label: "Was Ihre Kunden sehen: die sichtbare Lage." },
          { x: 26.9, y: 45, label: "Genaue Adresse und Markierung, nur für Ihr Team." },
          { x: 80.5, y: 53, label: "Adresse suchen, auf die Karte klicken oder die Markierung ziehen." },
        ]}
      />
      <DocP>
        Für die Koordinaten können Sie auch einen Google-Maps-Link einfügen. Die genaue Adresse erscheint nie auf der
        Website: Ihre Kunden sehen nur die sichtbare Lage (zum Beispiel „Mallorca, Balearen“).
      </DocP>

      <DocH3>Fotos und Videos</DocH3>
      <DocFigure
        src="/docs-media/de/propiedades-fotos.webp"
        alt="Die Fotogalerie eines Objekts"
        width={1452}
        height={946}
        markers={[
          { x: 4.1, y: 21.9, label: "Was Sie hier hochladen, erscheint auf der Website und wird sofort gespeichert." },
          { x: 71.6, y: 34.5, label: "Die Abschnitte der Galerie; „Hinzufügen“ legt einen neuen an." },
          { x: 40.2, y: 52.2, label: "Fotos ziehen oder auswählen: Sie landen im markierten Abschnitt." },
          { x: 5.3, y: 69.9, label: "Das Titelbild." },
        ]}
      />
      <DocList>
        <li>
          Ziehen Sie die Fotos in das Feld oder klicken Sie zur Auswahl (JPG, PNG, WebP oder HEIC). Sie werden vor dem
          Hochladen automatisch optimiert.
        </li>
        <li>
          Fotos sind nach Abschnitten gruppiert (Allgemein, Schlafzimmer, Wohnbereich, Pool, Außenbereich, Weitere
          Einrichtungen, Aussicht oder ein eigener). Ziehen Sie sie, um sie im Abschnitt zu sortieren, oder nutzen Sie „In
          anderen Abschnitt verschieben“.
        </li>
        <li>Das erste Foto ist das Titelbild. Um es zu ändern, nutzen Sie „Als Titelbild“ auf einem anderen.</li>
        <li>Um ein Foto zu entfernen, klicken Sie auf das Kreuz und bestätigen Sie mit einem zweiten Klick.</li>
        <li>
          <strong>Wasserzeichen:</strong> setzt das Logo Ihrer Agentur auf die veröffentlichten Fotos.
        </li>
        <li>
          <strong>Videos:</strong> Fügen Sie Links von YouTube, Vimeo oder anderen Plattformen ein.
        </li>
      </DocList>

      <DocH3>Nur bei Vermietungen</DocH3>
      <DocTerms
        items={[
          [
            "Verfügbarkeit",
            "Blockieren Sie Daten manuell mit optionaler Notiz. Bestätigte Buchungen blockieren ihre Daten automatisch. Um Doppelbuchungen zu vermeiden, fügen Sie den iCal-Link von Airbnb oder Booking ein und klicken Sie auf „Jetzt synchronisieren“. Ist das Objekt veröffentlicht, gibt es auch einen Link, um Ihre Verfügbarkeit auf diese Plattformen zu exportieren.",
          ],
          [
            "Tarife",
            "Tarifzeiträume (zum Beispiel „Hochsaison“) mit Daten, offiziellem Preis pro Nacht, Mindestaufenthalt, Verwaltungsgebühr und Provision der Agentur.",
          ],
        ]}
      />
      <DocFigure
        src="/docs-media/de/propiedades-disponibilidad.webp"
        alt="Der Bereich Verfügbarkeit einer Vermietung"
        width={1452}
        height={695}
        markers={[
          { x: 23.3, y: 15.2, label: "Daten manuell blockieren, mit optionaler Notiz." },
          { x: 4.7, y: 51.1, label: "Belegte Daten: „BOOKING“ stammt aus einer Buchung, „MANUAL“ aus einer eigenen Blockierung, die Sie entfernen können." },
          { x: 23.3, y: 67.4, label: "Den iCal-Link von Airbnb oder Booking einfügen und synchronisieren." },
          { x: 23.3, y: 82, label: "Ihr Kalender, zum Hinterlegen auf diesen Plattformen." },
        ]}
      />
      <DocFigure
        src="/docs-media/de/propiedades-tarifas.webp"
        alt="Der Bereich Tarife mit drei Saisons"
        width={1452}
        height={734}
        markers={[
          { x: 26.9, y: 16.9, label: "Ein neuer Zeitraum: Bezeichnung, Daten, Preis pro Nacht und Mindestaufenthalt." },
          { x: 14.6, y: 45.3, label: "Verwaltungsgebühr (standardmäßig 10 %) und Provision der Agentur (standardmäßig 20 %), in %." },
          { x: 16.4, y: 91, label: "Die erfassten Saisons mit Preis und Mindestaufenthalt. „Entfernen“ löscht eine." },
        ]}
      />
      <DocTip>
        Um alle Mietobjekte in einem Kalender zu sehen, nutzen Sie <strong>Verfügbarkeit</strong> im Menü.
      </DocTip>

      <DocH3>Empfehlungen</DocH3>
      <DocFigure
        src="/docs-media/de/propiedades-recomendaciones.webp"
        alt="Der Bereich Empfehlungen mit zwei Verbesserungen"
        width={1452}
        height={847}
        markers={[{ x: 10.8, y: 70.8, label: "Jede Verbesserung mit Details, geschätzten Kosten und Priorität." }]}
      />
      <DocP>
        Damit schlagen Sie dem Eigentümer Verbesserungen vor: neue Möbel, eine Ladestation für E-Autos… Jede hat eine
        Priorität (hoch, mittel oder niedrig) und einen Status, den Sie fortschreiben: vorgeschlagen, genehmigt oder
        erledigt. Der Eigentümer sieht sie auf seiner Seite unter „Vorgeschlagene Verbesserungen“.
      </DocP>

      <DocTip>
        Füllen Sie zuerst Grunddaten, Lage, Preise und Fotos aus: Damit sieht die Objektseite auf Ihrer Website schon gut
        aus. Den Rest können Sie nach und nach ergänzen.
      </DocTip>
    </DocSection>
  );
}

function Owners() {
  return (
    <DocSection
      id="propietarios"
      icon={KeyRound}
      title="Eigentümer"
      intro="Die Eigentümer der Objekte, die Sie vermarkten. Jeder hat eine private Seite, auf der er seine Objekte, Buchungen und seinen Anteil verfolgt, ohne Benutzername oder Passwort."
    >
      <DocH3>Einen Eigentümer zuweisen</DocH3>
      <DocSteps>
        <DocStep>
          Öffnen Sie im Objekteditor <strong>Kontakt</strong> → <strong>Eigentümer</strong>.
        </DocStep>
        <DocStep>Suchen Sie ihn nach Name, E-Mail oder Telefon, oder klicken Sie auf „Neuer Eigentümer“, um ihn direkt anzulegen.</DocStep>
        <DocStep>Speichern Sie das Objekt. Ein Eigentümer kann mehrere Objekte haben.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/de/propietarios-asignar.webp"
        alt="Der Bereich Eigentümer mit einem zugewiesenen Eigentümer und seinem Zugangslink"
        width={1452}
        height={1111}
        markers={[
          { x: 24.1, y: 19, label: "Der zugewiesene Eigentümer; „Entfernen“ hebt die Verknüpfung auf." },
          { x: 34.7, y: 43.2, label: "Seinen persönlichen Link kopieren, um ihn zu verschicken." },
          { x: 46.7, y: 43.2, label: "Neu erzeugen: Der bisherige Link funktioniert nicht mehr." },
          { x: 6.4, y: 51.1, label: "Sein Kontoauszug." },
        ]}
      />

      <DocH3>Kontoauszug</DocH3>
      <DocP>
        Unter dem Zugang steht der Kontoauszug des Eigentümers mit all seinen Objekten zusammen. Nur Inhaber und
        Administratoren der Agentur sehen ihn.
      </DocP>
      <DocFigure
        src="/docs-media/de/propietarios-cuenta.webp"
        alt="Der Kontoauszug eines Eigentümers mit Eingenommenem, Provision, Auszahlungen und Saldo"
        width={1100}
        height={1148}
        className="max-w-2xl"
        markers={[
          { x: 16.3, y: 18.1, label: "Was aus den Buchungen seiner Objekte eingenommen wurde, von der Buchungssumme." },
          { x: 83.7, y: 18.1, label: "Sein Anteil: Eingenommenes abzüglich Provision." },
          { x: 50, y: 30.4, label: "Was noch auszuzahlen ist." },
          { x: 50, y: 79.1, label: "Die Auszahlungen: was Sie ihm schon gezahlt haben. Das Papierkorbsymbol löscht eine." },
          { x: 15.2, y: 96.4, label: "Eine Zahlung an den Eigentümer erfassen." },
        ]}
      />
      <DocTerms
        items={[
          ["Eingenommen", "Die Summe der als eingenommen markierten Zahlungen seiner Buchungen (Anzahlungen und Restbeträge)."],
          ["Provision", "Die Provision der Agentur bei diesen Buchungen; sie wird vom Eingenommenen abgezogen."],
          ["Ihr Anteil", "Eingenommenes abzüglich Provision."],
          ["Bereits ausgezahlt", "Die Summe der von Ihnen erfassten Auszahlungen."],
          ["Noch auszuzahlen", "Was Sie ihm noch schulden. Haben Sie zu viel gezahlt, wird das angezeigt."],
          ["Pro Buchung", "Die Details jeder Buchung: Daten, wie viel von wie viel eingenommen wurde, und die Provision."],
        ]}
      />
      <DocSteps>
        <DocStep>
          Klicken Sie auf <strong>Auszahlung erfassen</strong>. Offener Saldo und Währung sind schon eingetragen.
        </DocStep>
        <DocStep>Passen Sie den Betrag bei Bedarf an und wählen Sie das Datum.</DocStep>
        <DocStep>Geben Sie den Zahlungsweg (Überweisung, bar…) und optional eine Notiz an und klicken Sie auf „Erfassen“.</DocStep>
      </DocSteps>

      <DocH3>Die Seite des Eigentümers</DocH3>
      <DocP>
        Unter „Zugang für den Eigentümer“ steht sein persönlicher Link: Kopieren und schicken Sie ihn. Dort sieht er seine
        Objekte und deren Status (veröffentlicht oder nicht, mit dem veröffentlichten Preis), den laufenden oder nächsten
        Aufenthalt, die Buchungen mit Daten und Zahlungen, seinen Kontoauszug und die Verbesserungsvorschläge, die Sie
        unter Empfehlungen erfasst haben. Über eine Schaltfläche kann er Ihnen per WhatsApp oder E-Mail schreiben.
      </DocP>
      <DocFigure
        src="/docs-media/de/propietarios-pagina.webp"
        alt="Die Eigentümerseite mit Übersicht seiner Objekte und Kontoauszug"
        width={1584}
        height={946}
        markers={[
          { x: 24, y: 38.9, label: "Wie viele seiner Objekte veröffentlicht sind." },
          { x: 50, y: 38.9, label: "Der laufende oder nächste Aufenthalt." },
          { x: 75.2, y: 38.9, label: "Sein Anteil am Eingenommenen." },
          { x: 50, y: 66.1, label: "Sein Kontoauszug: Auszahlungen, Saldo und Details pro Buchung." },
          { x: 82.2, y: 4.2, label: "Eine Schaltfläche, um Ihnen zu schreiben." },
        ]}
      />
      <DocP>
        Standardmäßig sieht der Eigentümer <strong>Ihre Provision nicht</strong>: Er sieht seinen Anteil, aber nicht den
        Abzug. Möchten Sie sie zeigen, aktivieren Sie „Provision der Agentur anzeigen“ in den Einstellungen.
      </DocP>
      <DocTip>
        Ist der Link bei der falschen Person gelandet, klicken Sie auf „Neu erzeugen“: Der alte funktioniert sofort nicht
        mehr.
      </DocTip>
    </DocSection>
  );
}

function Importer() {
  return (
    <DocSection
      id="importar"
      icon={Upload}
      title="Objekte importieren"
      adminOnly
      intro="Holen Sie Ihren Bestand in einem Rutsch aus einem anderen System: einem CRM, einem Portal oder einer Tabelle. Nichts wird gespeichert, bevor Sie geprüft haben, was mit jedem Objekt geschieht."
    >
      <DocP>
        Er öffnet sich über <strong>Importieren</strong> in der Leiste von Objekte. Der Ablauf hat vier Schritte: Herkunft
        wählen, Datei bereitstellen, die Spalten zuordnen (nur bei Tabellen) und prüfen.
      </DocP>

      <DocH3>1. Wählen Sie, woher Sie umziehen</DocH3>
      <DocFigure
        src="/docs-media/de/importar-plataformas.webp"
        alt="Die Liste der Plattformen, von denen Sie umziehen können"
        width={1276}
        height={946}
        markers={[
          { x: 16.5, y: 18.6, label: "Suchen Sie Ihr System nach Name oder Land." },
          { x: 52, y: 18.6, label: "Nach CRM, Portalen oder Aggregatoren filtern." },
          { x: 35.8, y: 44, label: "Wählen Sie Ihre Plattform: Wir zeigen, wie Sie Ihre Daten dort herausbekommen." },
        ]}
      />
      <DocP>
        Es gibt fast 50 Plattformen (Idealista, Inmovilla, Kyero, CASAFARI, Resales Online, Witei, Apimo, Rightmove und
        viele mehr), die meistgenutzten zuerst. Fehlt Ihre, können Sie unten eine <strong>CSV- oder Excel-Datei</strong>,
        ein <strong>Kyero-XML</strong> (das Format, das die meisten CRMs exportieren) oder das <strong>Tivvu-XML</strong>{" "}
        nutzen, falls Ihr System eine eigene API hat.
      </DocP>

      <DocH3>2. Bringen Sie Ihre Daten mit</DocH3>
      <DocFigure
        src="/docs-media/de/importar-fuente.webp"
        alt="Die Anleitung für den Umzug von Idealista mit dem Feld zum Hochladen der Datei"
        width={1276}
        height={946}
        markers={[
          { x: 28.6, y: 22.6, label: "Die Schritte, um Ihre Objekte aus dieser Plattform zu holen." },
          { x: 15.7, y: 45.6, label: "Ein anderer Weg, falls Ihre Plattform eine CSV- oder Excel-Datei liefert." },
          { x: 28.6, y: 52.6, label: "Kommen Sie nicht weiter? Wir formulieren die Anfrage an die Plattform oder helfen selbst." },
          { x: 70, y: 22.6, label: "Datei hochladen oder Feed-URL einfügen." },
          { x: 77.9, y: 39.5, label: "Wir lesen die Datei; noch wird nichts gespeichert." },
        ]}
      />
      <DocList>
        <li>
          Folgen Sie den Schritten der Anleitung Ihrer Plattform. Viele verlangen den Feed über den Support: Klicken Sie
          unter „Kommen Sie nicht weiter?“ auf <strong>Anfrage per E-Mail senden</strong>, dann öffnet sich Ihr
          E-Mail-Programm mit der fertigen Nachricht, oder kopieren Sie sie über „Nachricht ansehen“.
        </li>
        <li>
          <strong>Datei hochladen:</strong> CSV oder Excel (.xlsx) bis 10 MB und 3.000 Zeilen oder XML bis 10 MB.
        </li>
        <li>
          <strong>URL verwenden:</strong> Fügen Sie den öffentlichen Link des Feeds ein. Wir lesen ihn einmal; er bleibt
          nicht synchronisiert.
        </li>
        <li>
          Fangen Sie bei null an, klicken Sie auf <strong>CSV-Vorlage herunterladen</strong>: Sie enthält die Spalten, die
          wir verstehen, und eine Beispielzeile.
        </li>
        <li>Über „Um Hilfe bitten“ schreiben Sie uns mit einer vorbereiteten Nachricht: Wir helfen beim Umzug.</li>
      </DocList>

      <DocH3>3. Was jede Spalte bedeutet</DocH3>
      <DocP>Nur bei Tabellen (CSV oder Excel). Tivvu erkennt die meisten Spalten selbst; prüfen Sie den Rest.</DocP>
      <DocFigure
        src="/docs-media/de/importar-mapeo.webp"
        alt="Der Schritt, in dem jede Spalte der Datei einem Tivvu-Feld zugeordnet wird"
        width={1304}
        height={1110}
        markers={[
          { x: 49, y: 13.7, label: "Wie viele Zeilen und Spalten wir erkannt haben." },
          { x: 11.6, y: 25.8, label: "Nicht erkannte Spalten stehen oben, mit Beispielen aus Ihrer Datei." },
          { x: 79.7, y: 25.8, label: "Wählen Sie das passende Tivvu-Feld oder „Nicht importieren“." },
          { x: 14.7, y: 95.4, label: "Vor dem Speichern sehen, was mit jeder Zeile geschieht." },
        ]}
      />
      <DocList>
        <li>Jedes Feld stammt aus genau einer Spalte: Wählen Sie es bei einer anderen, wird es bei der vorherigen frei.</li>
        <li>Nicht zugeordnete Spalten werden ignoriert. Eine leere Zelle löscht nie bereits Erfasstes.</li>
        <li>
          Ordnen Sie eine <strong>Referenzspalte (ID)</strong> zu: So werden Objekte bei einem erneuten Import aktualisiert
          statt dupliziert. Fehlt sie, weisen wir darauf hin.
        </li>
      </DocList>

      <DocH3>4. Prüfen und importieren</DocH3>
      <DocFigure
        src="/docs-media/de/importar-revision.webp"
        alt="Die Importvorschau mit Übersicht und Details pro Zeile"
        width={1304}
        height={853}
        markers={[
          { x: 9.4, y: 20.9, label: "Die Übersicht: neu, zu aktualisieren, unverändert, übersprungen und mit Fehler. Klicken Sie zum Filtern." },
          { x: 26, y: 31.2, label: "Direkt veröffentlichen oder als Entwurf lassen." },
          { x: 29.4, y: 38.2, label: "Was nicht mehr in der Datei steht, in den Papierkorb verschieben." },
          { x: 8.8, y: 49.3, label: "Zeile für Zeile, mit Hinweisen, Fehlern und Änderungen." },
          { x: 15.8, y: 94.1, label: "Erst hier wird alles gespeichert." },
        ]}
      />
      <DocTerms
        items={[
          ["Neu", "War nicht in Tivvu: Es wird angelegt."],
          ["Aktualisiert", "Schon einmal importiert (gleiche Referenz): Es ändert sich, was die Details nennen, zum Beispiel Preis oder Fotos."],
          ["Unverändert", "Ist in Tivvu bereits identisch."],
          ["Übersprungen", "Wird nicht importiert, zum Beispiel weil es in der Datei doppelt vorkommt."],
          ["Mit Fehler", "Es fehlt eine Pflichtangabe wie der Titel. Die Details nennen sie."],
        ]}
      />
      <DocList>
        <li>
          <strong>Neue beim Import veröffentlichen:</strong> Ausgeschaltet bleiben sie Entwürfe, damit Sie sie prüfen
          können, bevor sie auf Ihrer Website erscheinen.
        </li>
        <li>
          <strong>Was nicht mehr in der Datei steht, in den Papierkorb verschieben:</strong> Betrifft nur Objekte, die Sie
          zuvor von derselben Plattform importiert haben, und wir bitten um Bestätigung. Sie lassen sich 30 Tage lang
          wiederherstellen.
        </li>
        <li>
          Mit einem Klick auf <strong>Importieren</strong> speichert Tivvu die Objekte und lädt ihre Fotos herunter. Bei
          vielen Objekten kann das ein paar Minuten dauern: Schließen Sie den Tab nicht. Wollen Sie vorher gehen, warnen
          wir Sie.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/de/importar-listo.webp"
        alt="Der Abschlussbildschirm des Imports mit Übersicht und Fehlern"
        width={1100}
        height={415}
        className="max-w-2xl"
        markers={[
          { x: 50, y: 44.8, label: "Was erledigt wurde, mit den Fehlerdetails." },
          { x: 39, y: 70, label: "Laden Sie die Fehler als CSV herunter, um sie zu korrigieren." },
          { x: 35.5, y: 82.4, label: "Entwürfe prüfen oder Website ansehen; „Weitere Datei importieren“ beginnt von vorn." },
        ]}
      />
    </DocSection>
  );
}

function Offers() {
  return (
    <DocSection
      id="ofertas"
      icon={Tag}
      title="Angebote"
      intro="Persönliche Vorschläge für einen Kunden: eine Auswahl an Objekten und Leistungen zu Ihren Preisen, präsentiert auf einer eigenen Seite, die der Kunde über einen Link öffnet."
    >
      <DocH3>Ein Angebot erstellen</DocH3>
      <DocSteps>
        <DocStep>
          Klicken Sie auf <strong>Neues Angebot</strong>, geben Sie einen Titel ein (zum Beispiel „Vorschlag für Familie
          Pérez“), wählen Sie den Vorgang (Verkauf, Vermietung oder beides) und optional einen Referenzcode. Der Vorgang
          legt fest, welche Objekte Sie hinzufügen können.
        </DocStep>
        <DocStep>
          Wählen Sie unter <strong>Allgemein</strong> den Kunden, die Währung und ob Preise und das Erscheinungsbild Ihrer
          Agentur (Kopfzeile, Fußzeile und Kontaktdaten) angezeigt werden.
        </DocStep>
        <DocStep>
          Schreiben Sie unter <strong>Begrüßung</strong> den Willkommenstext: einen Titel, Datum oder Saison und eine
          Nachricht.
        </DocStep>
        <DocStep>
          Legen Sie unter <strong>Objekte</strong> Abschnitte an (zum Beispiel „Direkt am Meer“) und fügen Sie Objekte
          hinzu.
        </DocStep>
        <DocStep>
          Fügen Sie unter <strong>Leistungen</strong> Erlebnisse aus Ihrer Bibliothek hinzu: Koch, Transfers, Yacht…
        </DocStep>
        <DocStep>
          Klicken Sie auf <strong>Angebot senden</strong> (mit Kunde) oder <strong>Link veröffentlichen</strong> (ohne).
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/de/ofertas-nueva.webp"
        alt="Der Dialog Neues Angebot"
        width={784}
        height={862}
        className="max-w-md"
        markers={[
          { x: 50, y: 30.2, label: "Der Titel." },
          { x: 50, y: 57.3, label: "Ein optionaler Referenzcode, etwa der aus Ihrem System." },
          { x: 50, y: 47.2, label: "Verkauf, Vermietung oder beides: legt fest, welche Objekte Sie hinzufügen können." },
        ]}
      />
      <DocFigure
        src="/docs-media/de/ofertas-lista.webp"
        alt="Die Angebotsliste"
        width={1304}
        height={946}
        markers={[
          { x: 24.3, y: 6, label: "Suche nach Titel oder Kunde." },
          { x: 51.1, y: 6, label: "Filter nach Vorgang und Status." },
          { x: 88.9, y: 6, label: "Neues Angebot." },
          { x: 7.2, y: 60.5, label: "Der Status: Hier hat der Kunde es bereits geöffnet." },
          { x: 17, y: 47.3, label: "Ihr Referenzcode, falls Sie einen vergeben haben." },
        ]}
      />

      <DocH3>Der Editor</DocH3>
      <DocFigure
        src="/docs-media/de/ofertas-editor.webp"
        alt="Der Angebotseditor im Bereich Allgemein"
        width={1480}
        height={1100}
        markers={[
          { x: 16.6, y: 4.6, label: "Die Bereiche: Allgemein, Begrüßung, Objekte und Leistungen." },
          { x: 30.3, y: 37.1, label: "Der Kunde, der es per E-Mail erhält." },
          { x: 21.1, y: 76.2, label: "Preise ein- oder ausblenden." },
          { x: 17.8, y: 84.8, label: "Ihr Logo, die Kopfzeile und Kontaktdaten zeigen." },
          { x: 84.5, y: 25.4, label: "Die Übersicht, der Link für den Kunden und „Kunde ansehen“." },
          { x: 87.9, y: 4.6, label: "Senden, erneut senden oder Link veröffentlichen." },
        ]}
      />
      <DocP>
        Rechts sehen Sie den Status, die Anzahl der Objekte und Leistungen und die Summe. Bei Vermietungen gibt es keine
        Summe: Es sind Optionen zur Wahl, mit Preis pro Nacht. Nach dem Senden oder Veröffentlichen steht dort der Link für
        den Kunden mit „Link kopieren“.
      </DocP>

      <DocH3>Den Preis jedes Objekts anpassen</DocH3>
      <DocFigure
        src="/docs-media/de/ofertas-propiedades.webp"
        alt="Der Bereich Objekte eines Angebots mit geöffneten Preisanpassungen"
        width={1480}
        height={1292}
        markers={[
          { x: 28.6, y: 12.4, label: "Jeder Abschnitt mit Titel und Text." },
          { x: 17.1, y: 33, label: "Sonderpreis, Rabatt und Kaution nur für dieses Angebot." },
          { x: 30.3, y: 50.4, label: "Ein kurzer Text unter dem Objekt." },
        ]}
      />
      <DocP>
        Mit „Anpassungen anzeigen“ legen Sie für jedes Objekt einen Sonderpreis für dieses Angebot fest, einen Rabatt
        (Prozent oder Festbetrag), eine Kaution und einen Kurztext wie „Inklusive Endreinigung“. Der Kunde sieht den
        früheren Preis durchgestrichen. Der Preis des Objekts in Ihrem Bestand ändert sich nicht.
      </DocP>

      <DocH3>Leistungen im Angebot</DocH3>
      <DocFigure
        src="/docs-media/de/ofertas-servicios.webp"
        alt="Der Bereich Leistungen eines Angebots mit Privatkoch und Transfer"
        width={1480}
        height={814}
        markers={[
          { x: 9.1, y: 93.5, label: "Eine Leistung aus Ihrer Bibliothek hinzufügen." },
          { x: 30.3, y: 9.9, label: "Preis, Menge, Datum und einen Hinweis für den Kunden anpassen." },
          { x: 52.6, y: 43.7, label: "Die Zwischensumme jeder Leistung." },
        ]}
      />
      <DocP>
        Leistungen stammen aus Ihrer Bibliothek (siehe „Leistungen“). Beim Hinzufügen können Sie Preis, Menge (Personen,
        Tage, Nächte oder Stunden, je nach Abrechnung), Datum und einen Hinweis festlegen. Ohne Preis sieht der Kunde „Auf
        Anfrage“.
      </DocP>

      <DocH3>Senden oder teilen</DocH3>
      <DocTerms
        items={[
          ["Mit Kunde", "„Angebot senden“ schickt ihm den Link per E-Mail. Danach können Sie jederzeit „Angebot erneut senden“ nutzen."],
          ["Ohne Kunde", "„Link veröffentlichen“ aktiviert die Seite, und Sie teilen den Link auf beliebigem Weg."],
          ["Link kopieren", "Im rechten Bereich des Editors und im Menü ⋯ jedes Angebots, sobald es gesendet oder veröffentlicht ist."],
        ]}
      />
      <DocP>
        Haben Sie den Link selbst verschickt (zum Beispiel per WhatsApp), nutzen Sie „Als gesendet markieren“ im Menü des
        Angebots. Öffnet der Kunde es, wechselt das Angebot auf „Angesehen“, und Sie erhalten eine Benachrichtigung. Von der
        Angebotsseite aus kann der Kunde Ihnen schreiben: Diese Anfrage landet in Anfragen.
      </DocP>

      <DocH3>Status</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Entwurf</DocPill>, "Noch sieht es niemand."],
          [<DocPill key="s" tone="primary">Gesendet</DocPill>, "Der Link ist aktiv und wurde dem Kunden geschickt."],
          [<DocPill key="v">Angesehen</DocPill>, "Der Kunde hat das Angebot bereits geöffnet."],
          [<DocPill key="e">Abgelaufen</DocPill>, "Das Ablaufdatum ist überschritten; der Kunde sieht einen entsprechenden Hinweis."],
        ]}
      />
    </DocSection>
  );
}

function Bookings() {
  return (
    <DocSection
      id="reservas"
      icon={CalendarDays}
      title="Buchungen"
      intro="Jedes abgeschlossene Geschäft: eine Vermietung mit ihren Daten oder ein Verkauf, mit Preis, Provision und Zahlungsverfolgung."
    >
      <DocFigure
        src="/docs-media/de/reservas-lista.webp"
        alt="Die Buchungsliste"
        width={1304}
        height={946}
        markers={[
          { x: 25.5, y: 6, label: "Suchen Sie nach Objekt oder Kunde." },
          { x: 53, y: 6, label: "Nach Status oder Lage des Objekts filtern." },
          { x: 89.1, y: 6, label: "Neue Buchung." },
          { x: 7.4, y: 40.5, label: "Der Status jeder Buchung." },
        ]}
      />

      <DocH3>Eine Buchung anlegen</DocH3>
      <DocSteps>
        <DocStep>
          Klicken Sie auf <strong>Neue Buchung</strong> und wählen Sie das Objekt.
        </DocStep>
        <DocStep>Weisen Sie den Kunden zu (optional).</DocStep>
        <DocStep>Wählen Sie bei Vermietungen An- und Abreise. Ein Verkauf kommt ohne Daten aus.</DocStep>
        <DocStep>Erfassen Sie Gesamtpreis und Ihre Provision und klicken Sie auf „Buchung erstellen“.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/de/reservas-nueva.webp"
        alt="Der Dialog Neue Buchung"
        width={784}
        height={839}
        className="max-w-md"
        markers={[
          { x: 50, y: 23.9, label: "Das Objekt." },
          { x: 50, y: 40, label: "Der Kunde (optional)." },
          { x: 50, y: 55.3, label: "An- und Abreise, nur bei Vermietungen." },
          { x: 72.9, y: 71.4, label: "Gesamtpreis und Ihre Provision." },
        ]}
      />

      <DocH3>Status</DocH3>
      <DocTerms
        items={[
          [
            <DocPill key="p" tone="amber">Ausstehend</DocPill>,
            "Gerade angelegt, wartet auf Bestätigung. Blockiert die Daten noch nicht, erscheint aber in Verfügbarkeit in Bernstein.",
          ],
          [<DocPill key="c" tone="primary">Bestätigt</DocPill>, "Fest gebucht und blockiert ihre Daten."],
          [<DocPill key="o">Abgeschlossen</DocPill>, "Der Aufenthalt ist vorbei oder der Verkauf abgeschlossen."],
          [<DocPill key="x">Storniert</DocPill>, "Findet nicht statt: Die Daten werden freigegeben. Erfasste Zahlungen werden nicht gelöscht."],
        ]}
      />
      <DocP>
        Ändern Sie den Status auf der Buchungsseite oder über das Menü ⋯ in der Liste. Vor dem Stornieren bitten wir um
        Bestätigung. „Löschen“ verschiebt sie in den Papierkorb.
      </DocP>

      <DocH3>Die Buchungsseite</DocH3>
      <DocFigure
        src="/docs-media/de/reservas-ficha.webp"
        alt="Eine Buchungsseite mit Aufenthalt, Zahlungen und Übersicht"
        width={1304}
        height={1210}
        markers={[
          { x: 6.5, y: 21.5, label: "Die Daten und die Anzahl der Nächte." },
          { x: 58.4, y: 53.1, label: "Eine Anzahlung, den Restbetrag oder Ihre Provision erfassen." },
          { x: 55.6, y: 66.7, label: "Eine Zahlung als eingenommen markieren." },
          { x: 82.4, y: 12, label: "Summe, Provision, eingenommen und offen." },
          { x: 82.4, y: 28.7, label: "Die Seite, die der Kunde sieht: Link kopieren oder öffnen." },
          { x: 82.4, y: 40.5, label: "Bestätigen, abschließen oder stornieren." },
        ]}
      />

      <DocH3>Zahlungen</DocH3>
      <DocP>
        „Zahlung hinzufügen“ erfasst eine <strong>Anzahlung</strong>, den <strong>Restbetrag</strong> oder Ihre{" "}
        <strong>Provision</strong> in der Währung der Buchung. Jede Zahlung bleibt offen, bis Sie sie als eingenommen
        markieren; dann wird das Datum festgehalten. Der Balken zeigt, wie viel der Summe eingenommen ist.
      </DocP>
      <DocFigure
        src="/docs-media/de/reservas-pago.webp"
        alt="Der Dialog Zahlung hinzufügen"
        width={700}
        height={544}
        className="max-w-sm"
        caption="Art wählen, Betrag eingeben und speichern. Sie bleibt offen, bis Sie sie als eingenommen markieren."
      />
      <DocP>
        Eingenommene Zahlungen fließen in den Kontoauszug des Eigentümers: Eingenommenes abzüglich Provision ist sein
        Anteil.
      </DocP>

      <DocH3>Die Kundenseite</DocH3>
      <DocP>
        Jede Buchung hat eine Seite für den Kunden mit Objekt, Aufenthalt, Status und Zahlungen (Anzahlungen und
        Restbetrag, nie die Provision). Hat die Buchung einen Kunden, erhält er sie per E-Mail, wenn sie angelegt,
        bestätigt oder storniert wird. Sonst kopieren Sie den Link auf der Buchungsseite oder im Menü ⋯ und schicken ihn
        selbst. Siehe „Was Ihre Kunden sehen“.
      </DocP>
    </DocSection>
  );
}

function Availability() {
  return (
    <DocSection
      id="disponibilidad"
      icon={CalendarCheck}
      title="Verfügbarkeit"
      intro="Alle Mietobjekte in einem Kalender: was frei und was belegt ist, um eine Anfrage schnell zu beantworten und Daten zu blockieren, ohne jedes Objekt zu öffnen."
    >
      <DocP>
        Es gibt zwei Ansichten, rechts wählbar: <strong>Nächste 90 Tage</strong> (ein Raster mit einer Zeile pro Objekt)
        und <strong>Monat</strong> (ein Kalender). Es erscheinen nur Mietobjekte.
      </DocP>

      <DocH3>Nächste 90 Tage</DocH3>
      <DocFigure
        src="/docs-media/de/disponibilidad-grilla.webp"
        alt="Das Verfügbarkeitsraster der nächsten 90 Tage"
        width={1304}
        height={704}
        markers={[
          { x: 12.8, y: 20, label: "Ein Objekt suchen oder nach Lage filtern." },
          { x: 69.1, y: 20, label: "Daten wählen, um zu sehen, welche Objekte frei sind." },
          { x: 88.5, y: 20, label: "Nächste 90 Tage oder Monat." },
          { x: 86.7, y: 8.1, label: "Der öffentliche Link zu Ihrer Verfügbarkeit, zum Teilen." },
          { x: 32.1, y: 27.2, label: "Was jede Farbe bedeutet." },
          { x: 13, y: 48.9, label: "Jede Zeile ist ein Objekt; klicken Sie auf den Namen, um es zu öffnen." },
        ]}
      />
      <DocTerms
        items={[
          ["Grün", "Frei."],
          ["Rot", "Gebucht oder blockiert."],
          ["Halb und halb", "Anreisetag (ab Nachmittag belegt) oder Abreisetag (bis zum Morgen belegt)."],
          ["Bernstein", "Eine ausstehende Buchung: blockiert die Daten noch nicht, ist aber angefragt."],
          ["Grau", "Vergangene Tage."],
        ]}
      />
      <DocList>
        <li>Die Objekte sind nach Region gruppiert. Fahren Sie über einen Tag, um zu sehen, was er bedeutet.</li>
        <li>
          Wenn Sie Daten wählen, werden diese Tage hervorgehoben, und mit <strong>Nur freie</strong> bleiben nur Objekte, die
          im gesamten Zeitraum frei sind. „Daten löschen“ geht zurück.
        </li>
        <li>Es werden 25 Objekte angezeigt; „Mehr anzeigen“ lädt die nächsten.</li>
      </DocList>

      <DocH3>Monat</DocH3>
      <DocFigure
        src="/docs-media/de/disponibilidad-mes.webp"
        alt="Der Monatskalender mit der Belegung jedes Tages"
        width={1304}
        height={1298}
        markers={[
          { x: 6.4, y: 10.7, label: "Zwischen Monaten wechseln; „Heute“ springt zum aktuellen." },
          { x: 67.9, y: 10.7, label: "Ein Objekt wählen, um seine Buchungen zu sehen und Daten zu blockieren." },
          { x: 67.7, y: 52.5, label: "Wie viele Objekte in dieser Nacht belegt sind." },
          { x: 62.4, y: 54.9, label: "Welche: jedes Objekt in seiner Farbe. Ausstehende mit gepunktetem Rahmen." },
        ]}
      />
      <DocP>
        Mit <strong>Alle Objekte</strong> zeigt jeder Tag, wie viele in dieser Nacht belegt sind (in Rot, wenn alle belegt
        sind) und welche, jedes immer in derselben Farbe. Fahren Sie darüber, um die vollständige Liste zu sehen. Klicken
        Sie auf einen Tag, erscheinen darunter die belegten, ausstehenden und freien Objekte:
      </DocP>
      <DocFigure
        src="/docs-media/de/disponibilidad-dia.webp"
        alt="Die Details eines Tages mit belegten und freien Objekten"
        width={1100}
        height={234}
        className="max-w-2xl"
        markers={[
          { x: 25.5, y: 29.5, label: "Was an diesem Tag belegt, ausstehend und frei ist." },
          { x: 44.7, y: 43, label: "„Monat ansehen“ öffnet den Kalender dieses Objekts; der Name öffnet das Objekt." },
        ]}
      />

      <DocH3>Daten im Kalender blockieren</DocH3>
      <DocSteps>
        <DocStep>
          Wählen Sie in der Ansicht <strong>Monat</strong> oben rechts das Objekt.
        </DocStep>
        <DocStep>
          Ziehen Sie über die freien Nächte, die Sie blockieren möchten. Mit der Tastatur: <Kbd>Enter</Kbd> am ersten und{" "}
          <Kbd>Enter</Kbd> am letzten Tag.
        </DocStep>
        <DocStep>
          Darunter erscheint die Zusammenfassung („4 Nächte, vom 25. Okt. bis 29. Okt.“). Schreiben Sie bei Bedarf eine
          Notiz und klicken Sie auf <strong>Blockieren</strong>.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/de/disponibilidad-bloquear.webp"
        alt="Der Kalender eines Objekts mit vier zum Blockieren markierten Nächten"
        width={1304}
        height={1141}
        markers={[
          { x: 48.9, y: 89.2, label: "Die Tage einer Buchung: Anreise, belegte Nächte und Abreise." },
          { x: 8.7, y: 74.3, label: "Über freie Nächte ziehen, um sie zu markieren." },
          { x: 25.7, y: 95.6, label: "Die Blockierung bestätigen, mit optionaler Notiz." },
        ]}
      />
      <DocP>
        Vergangene oder belegte Nächte lassen sich nicht markieren. Die Blockierung erscheint auch im Bereich
        Verfügbarkeit des Objekts, wo Sie sie entfernen können.
      </DocP>

      <DocH3>Der Link zum Teilen</DocH3>
      <DocP>
        „Link zum Teilen kopieren“ kopiert die Adresse Ihrer öffentlichen Verfügbarkeit: dasselbe 90-Tage-Raster auf Ihrer
        Website, mit Ihrem Erscheinungsbild. Ideal, um sie einem Kunden oder Kollegen zu schicken. Es zeigt nur
        veröffentlichte Objekte und keine ausstehenden Buchungen.
      </DocP>
    </DocSection>
  );
}

function Services() {
  return (
    <DocSection
      id="servicios"
      icon={Sparkles}
      title="Leistungen"
      intro="Ihre Bibliothek an Erlebnissen und Zusatzleistungen. Einmal anlegen und in jedes Angebot aufnehmen."
    >
      <DocFigure
        src="/docs-media/de/servicios-lista.webp"
        alt="Die Leistungsbibliothek"
        width={1304}
        height={946}
        markers={[
          { x: 20.9, y: 6, label: "Nach Name, Typ oder Gebiet suchen." },
          { x: 89.2, y: 6, label: "Neue Leistung." },
          { x: 73, y: 52.9, label: "Ohne Preis erscheint „Auf Anfrage“." },
        ]}
      />

      <DocH3>Eine Leistung anlegen</DocH3>
      <DocSteps>
        <DocStep>
          Klicken Sie auf <strong>Neue Leistung</strong> und wählen Sie den Typ: Butler, Privatkoch, Yacht, Transfers, Auto,
          Ausflüge, Spa, Babysitter, Zusatzreinigung, Events oder Sonstiges.
        </DocStep>
        <DocStep>Vergeben Sie Name, Foto und Beschreibung: was enthalten ist, wie lange es dauert, für wie viele Personen.</DocStep>
        <DocStep>
          Legen Sie Preis und Abrechnung fest: pro Leistung, pro Person, pro Tag, pro Nacht oder pro Stunde. Ohne Preis
          erscheint „Auf Anfrage“.
        </DocStep>
        <DocStep>Geben Sie an, wo sie angeboten wird (leer bedeutet überall), und optional den Anbieter.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/de/servicios-editar.webp"
        alt="Das Formular einer Leistung: Foto, Gebiete, Preis, Abrechnungseinheit, Anbieter und Verfügbarkeit"
        width={784}
        height={1628}
        className="max-w-md"
        markers={[
          { x: 50, y: 19.9, label: "Das Foto der Leistung." },
          { x: 50, y: 53.6, label: "Die Gebiete, in denen sie angeboten wird; leer heißt überall." },
          { x: 77.3, y: 69.4, label: "Abrechnung: pro Leistung, Person, Tag, Nacht oder Stunde." },
          { x: 50, y: 73.6, label: "Der Anbieter, nur für Ihr Team." },
          { x: 89.6, y: 97.6, label: "Verfügbar, um sie neuen Angeboten hinzuzufügen." },
        ]}
      />
      <DocList>
        <li>Klicken Sie auf eine Leistung in der Liste, um sie zu bearbeiten oder zu löschen.</li>
        <li>Den Anbieter sieht nur Ihr Team, nie der Kunde.</li>
        <li>Schalten Sie „Verfügbar“ aus, kann die Leistung neuen Angeboten nicht hinzugefügt werden, bleibt aber in bestehenden.</li>
        <li>In jedem Angebot können Sie Preis, Menge und Datum der Leistung für diesen Kunden anpassen und einen Hinweis hinterlassen.</li>
      </DocList>
    </DocSection>
  );
}

function Portal() {
  return (
    <DocSection
      id="portal"
      icon={Globe}
      title="Website"
      adminOnly
      intro="Die öffentliche Website Ihrer Agentur, auf der Ihre Kunden Ihre veröffentlichten Objekte sehen und Ihnen schreiben. Sie gehört Ihnen: mit Ihrem Namen, Ihrem Logo und Ihren Farben."
    >
      <DocP>
        Sie wird über <strong>Website</strong> im Menü bearbeitet. Der Editor nimmt den ganzen Bildschirm ein: links die
        Optionen, rechts eine Vorschau, die Sie als Computer oder Handy betrachten können. Speichern Sie, um die Änderungen
        zu veröffentlichen; wollen Sie mit ungespeicherten Änderungen gehen, warnen wir Sie.
      </DocP>
      <DocFigure
        src="/docs-media/de/portal-editor.webp"
        alt="Der Website-Editor im Tab Layout, mit der Vorschau rechts"
        width={1760}
        height={990}
        markers={[
          { x: 14, y: 9.8, label: "Die Tabs: Layout, Titelbild, Blöcke und Agentur und Kontakt." },
          { x: 5.3, y: 28.8, label: "Wählen Sie, ob Sie die Computer- oder die Handy-Version einrichten." },
          { x: 65.4, y: 3.5, label: "Die Vorschau als Computer oder Handy ansehen." },
          { x: 80.6, y: 3.5, label: "Die veröffentlichte Website ansehen." },
          { x: 93.3, y: 3.5, label: "Änderungen speichern veröffentlicht, was Sie bearbeitet haben." },
          { x: 66, y: 57.1, label: "Die Vorschau, genau so, wie Ihre Kunden sie sehen werden." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Layout",
            "Die Vorlage der Startseite (Titelbild, Editorial, Kompakt, Geteilt oder Mosaik), die auf Handys abweichen kann; die Farbe von Schaltflächen und Links (aus der Palette oder per Code, etwa #1F5F4A); und die Typografie (Modern, Klassisch, Schlicht, Elegant, Editorial, Warm, Urban oder Architektonisch).",
          ],
          [
            "Titelbild",
            "Das Hauptfoto (am besten im Querformat, mindestens 1920 px breit) und bei der Vorlage Mosaik die vier Fotos der Collage. Außerdem Überschrift und Text des Titelbilds.",
          ],
          [
            "Blöcke",
            "Eigene Abschnitte zwischen Titelbild und Objektliste. Jeder hat mehrere Layouts und lässt sich ausblenden, ohne ihn zu löschen.",
          ],
          [
            "Agentur und Kontakt",
            "Der Text über Ihre Agentur, Telefon, WhatsApp (aktiviert die Schaltfläche „Schreiben Sie uns auf WhatsApp“), Instagram und die Büroadresse.",
          ],
        ]}
      />

      <DocH3>Blocktypen</DocH3>
      <DocFigure
        src="/docs-media/de/portal-bloques.webp"
        alt="Der Tab Blöcke mit drei Website-Blöcken"
        width={896}
        height={1084}
        className="max-w-sm"
        markers={[
          { x: 36.7, y: 52.4, label: "Jeder Block mit Typ und Layout. Zum Bearbeiten anklicken." },
          { x: 66.7, y: 53.9, label: "Ausblenden, ohne zu löschen." },
          { x: 81.9, y: 53.9, label: "Nach oben oder unten verschieben." },
          { x: 89.5, y: 53.9, label: "Löschen." },
          { x: 49.9, y: 90.8, label: "Einen neuen Block hinzufügen: Typ wählen, dann Layout und Inhalt." },
        ]}
      />
      <DocTerms
        items={[
          ["Lage", "Ein Gebiet mit Foto, Text und seinen Objekten. Layouts: Hervorgehoben, Banner oder Karussell."],
          [
            "Aktion",
            "Objekte mit einem Etikett wie „15 % Rabatt“, mit optionalem Enddatum. Layouts: Farbband, Fotobanner oder Karussell.",
          ],
          ["Ausgewählte Objekte", "Ihre eigene Auswahl: das Neueste, direkt am Meer, das Gefragteste. Layouts: Raster oder Karussell."],
          ["Reiseziele", "Mehrere Gebiete auf einmal, jedes mit Foto. Ein Klick filtert die Liste. Layouts: Kacheln oder Karussell."],
          [
            "Text und Bild",
            "Erzählen Sie etwas Eigenes: Ihre Leistungen, Bewertungen, wie Sie arbeiten. Bild links, rechts oder nur Text.",
          ],
          [
            "Handlungsaufruf",
            "Eine Einladung mit einer Schaltfläche, die zum Kontaktformular, zu WhatsApp oder zur Liste führt. Layouts: Farbe oder Mit Foto.",
          ],
        ]}
      />

      <DocH3>Agentur und Kontakt</DocH3>
      <DocFigure
        src="/docs-media/de/portal-agencia.webp"
        alt="Der Tab Agentur und Kontakt im Website-Editor"
        width={896}
        height={1958}
        className="max-w-xs"
        caption="Der Text „Über Ihre Agentur“ und die Kontaktdaten, die in der Fußzeile und an der Kontakt-Schaltfläche der Website erscheinen."
      />
      <DocTip>
        Um das Ergebnis zu sehen, nutzen Sie „Veröffentlicht ansehen“ im Editor oder „Meine Website ansehen“ im
        Profilmenü.
      </DocTip>
    </DocSection>
  );
}

function ClientPages() {
  return (
    <DocSection
      id="lo-que-ven-tus-clientes"
      icon={Eye}
      title="Was Ihre Kunden sehen"
      intro="Die öffentlichen Seiten, die Tivvu erzeugt: Ihre Website, jede Objektseite, Angebote, Buchungen, die Eigentümerseite und Ihre Verfügbarkeit. Keine verlangt Benutzername oder Passwort."
    >
      <DocH3>Ihre Website</DocH3>
      <DocFigure
        src="/docs-media/de/portal-publico.webp"
        alt="Die öffentliche Website einer Agentur mit Titelbild und Suche"
        width={1584}
        height={946}
        caption="Das Titelbild mit der Suche (Vorgang, Gebiet und Art), Ihre Blöcke, die Liste der veröffentlichten Objekte und der Kontakt."
      />
      <DocList>
        <li>Sie zeigt nur veröffentlichte Objekte. Objektseiten haben Galerie, Karte mit der sichtbaren Lage und Anfrageformular.</li>
        <li>Anfragen über das Formular landen in Anfragen und legen den Kunden an.</li>
        <li>Sie ändern sie über Website (siehe „Website“); die Adresse in den Einstellungen.</li>
      </DocList>

      <DocH3>Das Angebot</DocH3>
      <DocFigure
        src="/docs-media/de/ofertas-cliente.webp"
        alt="Eine Angebotsseite aus Sicht des Kunden"
        width={1584}
        height={990}
        caption="Die Begrüßung, die Abschnitte mit ihren Objekten (mit Sonderpreis und durchgestrichenem früherem Preis) und die Leistungen. Unten ein Formular, um Ihnen zu schreiben."
      />

      <DocH3>Die Buchung</DocH3>
      <DocFigure
        src="/docs-media/de/reservas-cliente.webp"
        alt="Eine bestätigte Buchungsseite aus Sicht des Kunden"
        width={1584}
        height={946}
        caption="Status, Objekt, Daten und Zahlungen: Summe, bezahlt und offen. Ihre Provision erscheint nie."
      />

      <DocH3>Ihre Verfügbarkeit</DocH3>
      <DocFigure
        src="/docs-media/de/disponibilidad-publica.webp"
        alt="Die öffentliche Verfügbarkeit der Agentur"
        width={1584}
        height={946}
        caption="Die nächsten 90 Tage Ihrer veröffentlichten Mietobjekte, mit Suche, Lage und Daten. Ausstehende Buchungen erscheinen nicht."
      />

      <DocH3>Die Eigentümerseite</DocH3>
      <DocP>Siehe „Eigentümer“.</DocP>
    </DocSection>
  );
}

function Team() {
  return (
    <DocSection
      id="equipo"
      icon={UsersRound}
      title="Team"
      adminOnly
      intro="Die Personen, die in Ihrer Agentur mit Tivvu arbeiten, und was jede davon tun kann."
    >
      <DocFigure
        src="/docs-media/de/equipo.webp"
        alt="Das Team der Agentur"
        width={1304}
        height={946}
        markers={[
          { x: 62.7, y: 6, label: "Nach Rolle filtern." },
          { x: 88.4, y: 6, label: "Jemanden einladen." },
          { x: 11.6, y: 19.7, label: "Die Rolle jeder Person." },
        ]}
      />
      <DocSteps>
        <DocStep>
          Klicken Sie auf <strong>Mitglied einladen</strong>, geben Sie Name und E-Mail ein und wählen Sie die Rolle:
          Administrator oder Makler.
        </DocStep>
        <DocStep>
          Die Person erhält den Zugang per E-Mail. Hatte sie bereits ein Tivvu-Konto (etwa bei einer anderen Agentur),
          fügen wir sie Ihrem Team hinzu, und sie meldet sich mit ihrem gewohnten Passwort an.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/de/equipo-invitar.webp"
        alt="Der Dialog Mitglied einladen"
        width={784}
        height={769}
        className="max-w-md"
        markers={[{ x: 50, y: 72.7, label: "Administrator oder Makler. Siehe „Rollen“ in Erste Schritte." }]}
      />
      <DocList>
        <li>Über das Menü ⋯ jeder Person können Sie die Rolle ändern, die E-Mail kopieren, den Zugang deaktivieren oder sie aus dem Team entfernen.</li>
        <li>
          <strong>Zugang deaktivieren</strong> verhindert die Anmeldung, behält aber Platz, Objekte und Kunden; Sie können
          den Zugang jederzeit reaktivieren. Personen ohne Zugang stehen am Ende.
        </li>
        <li>
          <strong>Aus dem Team entfernen</strong> entzieht den Zugang zu dieser Agentur. Das Konto wird nicht gelöscht:
          Gehört die Person zu einer anderen Agentur, meldet sie sich dort weiter an.
        </li>
        <li>Der Inhaber des Kontos kann weder entfernt werden noch seine Rolle ändern.</li>
      </DocList>
    </DocSection>
  );
}

function SettingsDoc() {
  return (
    <DocSection
      id="configuracion"
      icon={Settings}
      title="Einstellungen"
      adminOnly
      intro="Die Daten Ihrer Agentur und die Einstellungen für das ganze Konto."
    >
      <DocFigure
        src="/docs-media/de/configuracion.webp"
        alt="Die Seite Einstellungen"
        width={1304}
        height={1486}
        markers={[
          { x: 6.1, y: 16.8, label: "Ihr Logo und der Name der Agentur." },
          { x: 30.4, y: 32.6, label: "Die Adresse Ihrer Website." },
          { x: 30.4, y: 39.1, label: "Die E-Mail, die Benachrichtigungen über Anfragen erhält." },
          { x: 32.2, y: 51.8, label: "Ob der Eigentümer Ihre Provision sieht. Wird beim Umschalten gespeichert." },
          { x: 30.4, y: 69.1, label: "Standardsprache und -währung." },
          { x: 90, y: 3.4, label: "Speichern; daneben Kürzel zum Kopieren, Ansehen und Anpassen der Website." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Ihre Agentur",
            "Name und Logo, die Ihre Kunden sehen. Klicken Sie auf das Logo, um es zu ändern; es wird sofort hochgeladen.",
          ],
          [
            "Öffentliche Website",
            "Die Adresse Ihrer Website (nur Kleinbuchstaben, Zahlen und Bindestriche). Ändern Sie sie, funktioniert der alte Link nicht mehr: Aktualisieren Sie ihn überall, wo Sie ihn geteilt haben. Außerdem die Kontakt-E-Mail, die Benachrichtigungen über Anfragen erhält.",
          ],
          [
            "Eigentümerportal",
            "„Provision der Agentur anzeigen“: Ausgeschaltet sieht der Eigentümer seinen Anteil, aber nicht den Abzug. Wird beim Umschalten gespeichert, ohne auf Speichern zu klicken.",
          ],
          [
            "Einstellungen",
            "Die Sprache der Website (geteilte Links öffnen sich in dieser Sprache, Ihre Kunden können sie auf der Seite ändern) und die Standardwährung der Preise.",
          ],
        ]}
      />
    </DocSection>
  );
}

function Profile() {
  return (
    <DocSection
      id="perfil"
      icon={UserRound}
      title="Mein Profil"
      intro="Ihre persönlichen Daten im Konto der Agentur."
    >
      <DocFigure
        src="/docs-media/de/perfil.webp"
        alt="Die Seite Mein Profil"
        width={1304}
        height={1321}
        markers={[
          { x: 6.1, y: 18.9, label: "Klicken Sie auf das Foto, um es zu ändern; daneben Ihre Rolle." },
          { x: 30.4, y: 30.1, label: "Ihr Name und Ihre E-Mail; gespeichert mit „Speichern“ oben." },
          { x: 30.4, y: 53, label: "Zum Ändern des Passworts: das aktuelle und das neue, zweimal." },
        ]}
      />
      <DocList>
        <li>Das Foto wird sofort hochgeladen; Ihr Name erscheint im Menü und im Verlauf Ihrer Kunden.</li>
        <li>Das neue Passwort muss mindestens 8 Zeichen haben. Das Auge in jedem Feld zeigt, was Sie eingegeben haben.</li>
        <li>
          Die Sprache des Dashboards ändern Sie im Profilmenü unter „Sprache“. Sie ist persönlich: Jede Person im Team
          kann ihre eigene nutzen.
        </li>
      </DocList>
    </DocSection>
  );
}

function Shortcuts() {
  return (
    <DocSection
      id="atajos"
      icon={Keyboard}
      title="Suche, Tastenkürzel und Hilfe"
      intro="Um sich im ganzen Dashboard zu bewegen, ohne die Tastatur loszulassen, und an wen Sie sich wenden, wenn Sie nicht weiterkommen."
    >
      <DocH3>Suche</DocH3>
      <DocP>
        <Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd> öffnet eine Suche, die Seiten, Objekte, Angebote und Kunden nach Namen findet. Dort
        können Sie auch ein Objekt, Angebot, einen Kunden oder eine Buchung anlegen, jemanden ins Team einladen, diese
        Dokumentation öffnen, das Erscheinungsbild ändern, das Menü einklappen und sich abmelden.
      </DocP>
      <DocFigure
        src="/docs-media/de/buscador.webp"
        alt="Die Suche mit Ergebnissen für „pérez“"
        width={960}
        height={347}
        className="max-w-lg"
        caption="Geben Sie einen Teil eines Namens ein und wählen Sie mit den Pfeiltasten und Enter. Esc schließt sie."
      />

      <DocH3>Tastenkürzel</DocH3>
      <DocP>
        <Kbd>?</Kbd> zeigt auf jedem Bildschirm des Dashboards alle Tastenkürzel.
      </DocP>
      <DocTerms
        items={[
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd></>, "Suchen und Befehle ausführen"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd></>, "Das geöffnete Formular speichern"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd></>, "Seitenmenü ein- oder ausklappen"],
          [<Kbd key="q">?</Kbd>, "Alle Tastenkürzel anzeigen"],
          [
            <><Kbd>G</Kbd> und ein Buchstabe</>,
            "Zu einem Bereich gehen: P Objekte, O Angebote, C Kunden, I Anfragen, R Buchungen, D Verfügbarkeit, E Team, W Website, S Einstellungen, M Mein Profil",
          ],
          [<Kbd key="n">N</Kbd>, "Neuen Eintrag in der geöffneten Liste anlegen"],
          [<Kbd key="s">/</Kbd>, "Zur Suche der Liste springen"],
          [<Kbd key="f">F</Kbd>, "Filter öffnen"],
          [<><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd></>, "Raster-, Listen- oder Tabellenansicht"],
          [<><Kbd>J</Kbd> <Kbd>K</Kbd></>, "Zwischen Einträgen nach unten und oben wechseln; Enter öffnet den ausgewählten"],
          [<Kbd key="e">Esc</Kbd>, "Auswahl aufheben"],
        ]}
      />

      <DocH3>Hilfe und Support</DocH3>
      <DocP>
        Im Profilmenü öffnet <strong>Hilfe und Support</strong> das Hilfecenter: häufige Fragen mit Suche und ein
        Formular, um dem Tivvu-Team zu schreiben. Wir antworten per E-Mail.
      </DocP>
      <DocFigure
        src="/docs-media/de/ayuda.webp"
        alt="Das Tivvu-Hilfecenter"
        width={1584}
        height={946}
        caption="Suchen Sie nach Ihrer Frage; finden Sie sie nicht, schreiben Sie uns über das Formular."
      />
    </DocSection>
  );
}

export const DOC_SECTIONS: DocEntry[] = [
  { id: "primeros-pasos", label: "Erste Schritte", Content: Basics },
  { id: "consultas", label: "Anfragen", Content: Inquiries },
  { id: "clientes", label: "Kunden", Content: Clients },
  { id: "propiedades", label: "Objekte", Content: Properties },
  { id: "propietarios", label: "Eigentümer", Content: Owners },
  { id: "importar", label: "Objekte importieren", adminOnly: true, Content: Importer },
  { id: "ofertas", label: "Angebote", Content: Offers },
  { id: "reservas", label: "Buchungen", Content: Bookings },
  { id: "disponibilidad", label: "Verfügbarkeit", Content: Availability },
  { id: "servicios", label: "Leistungen", Content: Services },
  { id: "portal", label: "Website", adminOnly: true, Content: Portal },
  { id: "lo-que-ven-tus-clientes", label: "Was Ihre Kunden sehen", Content: ClientPages },
  { id: "equipo", label: "Team", adminOnly: true, Content: Team },
  { id: "configuracion", label: "Einstellungen", adminOnly: true, Content: SettingsDoc },
  { id: "perfil", label: "Mein Profil", Content: Profile },
  { id: "atajos", label: "Suche, Tastenkürzel und Hilfe", Content: Shortcuts },
];
