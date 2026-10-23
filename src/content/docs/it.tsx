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
      title="Primi passi"
      intro="Tivvo riunisce in un unico posto le richieste che ricevi, i tuoi clienti, il tuo portafoglio di immobili, le proposte che invii, le prenotazioni e la disponibilità. Tutto ciò che pubblichi compare sul sito della tua agenzia."
    >
      <DocFigure
        src="/docs-media/it/panel.webp"
        alt="Il pannello di Tivvo con il menu laterale, l’elenco degli immobili e la scheda del profilo"
        width={1584}
        height={946}
        markers={[
          { x: 8.9, y: 11.6, label: "Il menu laterale: ogni strumento del pannello." },
          { x: 15.5, y: 4.7, label: "Comprimere o espandere il menu (Ctrl/⌘ + B)." },
          { x: 15.1, y: 11.6, label: "Quante richieste hai da leggere." },
          { x: 33.1, y: 6, label: "La barra dell’elenco: ricerca, ordine, filtri, viste, cestino e importazione." },
          { x: 87.1, y: 6, label: "Crea nuovo." },
          { x: 14.7, y: 94.7, label: "La campanella delle notifiche." },
          { x: 8.8, y: 93.7, label: "La scheda del tuo profilo: il tuo account, l’aspetto, l’assistenza e questa documentazione." },
        ]}
      />

      <DocH3>Il menu laterale</DocH3>
      <DocP>
        Gli strumenti seguono l’ordine di lavoro di un’agenzia: arriva una <strong>richiesta</strong>, diventa{" "}
        <strong>cliente</strong>, gli proponi <strong>immobili</strong> in un’<strong>offerta</strong> e si conclude con
        una <strong>prenotazione</strong>. Poi vengono <strong>Disponibilità</strong> e <strong>Servizi</strong>. Se sei
        titolare o amministratore dell’account, in fondo vedi anche <strong>Sito</strong>, <strong>Team</strong> e{" "}
        <strong>Impostazioni</strong>.
      </DocP>
      <DocP>
        «Richieste» mostra un numero quando hai richieste da leggere; si aggiorna da solo ogni minuto. Puoi comprimere il
        menu con il pulsante in alto o con <Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd> per guadagnare spazio, e Tivvo ricorda come
        l’hai lasciato. Sullo smartphone, il menu si apre dall’icona in alto.
      </DocP>

      <DocH3>Notifiche</DocH3>
      <DocP>
        La campanella, accanto al tuo nome, ti avvisa di ciò che è successo mentre non guardavi: una nuova richiesta, un
        cliente che ha aperto un’offerta o ti ha risposto da lì, un pagamento registrato, una prenotazione e le attività
        che ti hanno assegnato. Il numero indica quanti avvisi non hai letto; si aggiorna ogni minuto.
      </DocP>
      <DocFigure
        src="/docs-media/it/notificaciones.webp"
        alt="L’elenco delle notifiche con nuove richieste e un’offerta aperta"
        width={760}
        height={982}
        className="max-w-sm"
        markers={[
          { x: 70.3, y: 8.1, label: "«Segna tutte come lette» le segna come lette." },
          { x: 50, y: 23.2, label: "Ogni avviso ti porta a ciò che è successo (la richiesta, l’offerta, la prenotazione). Il punto indica che non l’hai letto." },
        ]}
      />
      <DocP>
        Per eliminare un avviso, passaci sopra con il mouse e fai clic sulla croce a destra (sullo smartphone la croce è
        sempre visibile). Si elimina solo per te: il resto del team continua a vedere il proprio, e non si può
        recuperare.
      </DocP>

      <DocH3>La scheda del tuo profilo</DocH3>
      <DocP>
        In fondo al menu c’è il tuo nome. Facendo clic si apre il menu del tuo account: il tuo profilo, le impostazioni,
        cambiare agenzia (se lavori per più di una), vedere o copiare il link del tuo sito, l’aspetto, la lingua, questa
        documentazione, la ricerca, le scorciatoie da tastiera, l’assistenza e l’uscita.
      </DocP>
      <DocFigure
        src="/docs-media/it/menu-perfil.webp"
        alt="Il menu dell’account aperto dalla scheda del profilo"
        width={640}
        height={1252}
        className="max-w-xs"
        markers={[
          { x: 50, y: 28.5, label: "Il mio profilo: i tuoi dati e la tua password." },
          { x: 50, y: 34.2, label: "Impostazioni dell’agenzia (titolari e amministratori)." },
          { x: 50, y: 41.4, label: "Aprire o copiare il link del tuo sito." },
          { x: 75, y: 55.3, label: "Aspetto: chiaro, scuro o automatico (segue il tuo computer)." },
          { x: 50, y: 69.2, label: "Questa documentazione, in un’altra scheda." },
          { x: 50, y: 74.9, label: "La ricerca e, sotto, le scorciatoie da tastiera." },
          { x: 50, y: 86.4, label: "Assistenza e supporto: domande frequenti e contatto con Tivvo." },
          { x: 50, y: 93.6, label: "Esci." },
        ]}
      />
      <DocTip>
        Se lavori per più di un’agenzia, «Cambia agenzia» compare in questo menu. Ogni agenzia ha i propri dati: quando
        cambi, il pannello si ricarica con quelli dell’altra.
      </DocTip>

      <DocH3>Ruoli</DocH3>
      <DocTerms
        items={[
          ["Titolare", "Il proprietario dell’account. Ha accesso a tutto e non può essere rimosso dal team."],
          [
            "Amministratore",
            "Come il titolare: vede tutto, gestisce il team, il sito, le impostazioni e l’importazione, e riassegna immobili e clienti.",
          ],
          [
            "Agente",
            "Vede solo gli immobili assegnati a lui, le sue offerte e prenotazioni, i suoi clienti e i lead senza responsabile. Non vede Sito, Team, Impostazioni, Importa né l’estratto conto dei proprietari.",
          ],
        ]}
      />

      <DocH3>Cose che si ripetono in tutto il pannello</DocH3>
      <DocTerms
        items={[
          [
            "Barra delle azioni",
            "Negli editor compare in alto una barra con Salva, Pubblica e Annulla. Quando c’è qualcosa da salvare, il pulsante Salva si attiva. Ctrl/⌘ + S salva senza toccare il mouse.",
          ],
          [
            "Viste",
            "Gli elenchi si possono vedere a griglia, elenco o tabella (tasti 1, 2 e 3). Tivvo ricorda la vista scelta in ogni browser.",
          ],
          [
            "Ricerca e filtri",
            "Ogni elenco ha una ricerca e dei filtri per restringere ciò che vedi. Ogni filtro mostra quanti elementi ci sono per ogni opzione. «Togli i filtri» mostra di nuovo tutto.",
          ],
          [
            "Cestino",
            "Ciò che elimini da Immobili, Offerte e Prenotazioni va nel cestino, non sparisce. Resta lì 30 giorni nel caso ci ripensi; poi viene cancellato definitivamente. Quando elimini, l’avviso in basso offre «Annulla».",
          ],
          [
            "«Visibile sul sito» / «Solo interno»",
            "Ogni blocco di un modulo ti dice se ciò che inserisci lo vedono i tuoi clienti o resta solo per il tuo team.",
          ],
          [
            "Assistenza",
            "Il pulsante con il punto interrogativo, in ogni strumento, apre la parte di questa guida che ne parla.",
          ],
        ]}
      />

      <DocH3>Il cestino</DocH3>
      <DocP>
        Si apre dall’icona del cestino, nella barra di Immobili, Offerte e Prenotazioni. Un numero sull’icona indica
        quanti elementi contiene.
      </DocP>
      <DocFigure
        src="/docs-media/it/papelera.webp"
        alt="Il cestino degli immobili con un immobile eliminato"
        width={1304}
        height={281}
        markers={[
          { x: 37.2, y: 87.1, label: "Quando l’hai eliminato e quanti giorni gli restano." },
          { x: 71.5, y: 82, label: "«Ripristina» lo rimette nel suo elenco, così com’era." },
          { x: 85.7, y: 82, label: "«Elimina definitivamente» lo cancella subito, senza aspettare 30 giorni. Ti chiediamo conferma." },
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
      title="Richieste"
      intro="La casella di posta di tutto ciò che ti scrivono dal tuo sito, dalla scheda di un immobile o da un’offerta."
    >
      <DocFigure
        src="/docs-media/it/consultas.webp"
        alt="La casella delle richieste con una richiesta aperta"
        width={1304}
        height={946}
        markers={[
          { x: 20.7, y: 7.4, label: "Tutte o solo le nuove, con quante sono da leggere." },
          { x: 29, y: 7.4, label: "Segna tutte come lette." },
          { x: 18.9, y: 13.5, label: "Cerca per nome, email, messaggio, immobile od offerta." },
          { x: 54.4, y: 21.7, label: "Di cosa ha chiesto: l’immobile, l’offerta o una richiesta generale." },
          { x: 92.4, y: 8.6, label: "Segnarla di nuovo come nuova per non dimenticarla." },
          { x: 46.9, y: 87.4, label: "Rispondere via email, WhatsApp o chiamare; oppure andare alla scheda del cliente." },
        ]}
      />

      <DocH3>Cosa succede quando ne arriva una</DocH3>
      <DocList>
        <li>Compare in Richieste come nuova e si somma al numero del menu laterale e della campanella.</li>
        <li>
          Si crea il cliente, o si aggiorna se ne esisteva già uno con quell’email. Nella sua cronologia resta una nota che
          nomina l’immobile o l’offerta richiesta.
        </li>
        <li>
          L’agenzia riceve un avviso via email (all’email di contatto delle Impostazioni o, se non c’è, a titolari e
          amministratori) e il cliente riceve una conferma.
        </li>
      </DocList>

      <DocH3>Lavorare la casella</DocH3>
      <DocList>
        <li>
          A sinistra c’è l’elenco, raggruppato in Oggi, Ieri, Questa settimana e Precedenti; a destra, la richiesta aperta.
          Sullo smartphone si alternano: tocca una richiesta per leggerla e la freccia per tornare indietro.
        </li>
        <li>Aprendo una richiesta, viene segnata come letta. La busta in alto a destra la segna di nuovo come nuova.</li>
        <li>Quelle di un cliente che hai già mostrano la sua fase (Lead, Contattato…) accanto al nome.</li>
        <li>
          Rispondi con un clic: <strong>Rispondi via email</strong> (con oggetto e saluto già scritti),{" "}
          <strong>WhatsApp</strong> (con un messaggio che nomina ciò che ha chiesto) o <strong>Chiama</strong>. WhatsApp e
          Chiama compaiono se ha lasciato un telefono. L’icona accanto all’email la copia.
        </li>
        <li>Fai clic sull’immobile o sull’offerta per aprirli nel pannello, o su «Vedi cliente» per andare alla sua scheda.</li>
        <li>La casella si aggiorna da sola ogni minuto.</li>
      </DocList>
      <DocTip>
        Se non è ancora arrivata nessuna richiesta, condividi il link del tuo sito: il modulo di contatto e quello di ogni
        scheda arrivano qui.
      </DocTip>
    </DocSection>
  );
}

function Clients() {
  return (
    <DocSection
      id="clientes"
      icon={Users}
      title="Clienti"
      intro="La tua rubrica e il relativo seguito: in che fase è ciascuno, cosa cerca, cosa c’è da fare e ogni volta che vi siete sentiti."
    >
      <DocFigure
        src="/docs-media/it/clientes-lista.webp"
        alt="L’elenco dei clienti a griglia"
        width={1304}
        height={946}
        markers={[
          { x: 26.3, y: 6, label: "Cerca per nome, email o telefono." },
          { x: 64.6, y: 6, label: "Filtra per fase." },
          { x: 89.4, y: 6, label: "Inserire un cliente a mano." },
          { x: 76.5, y: 86.9, label: "La fase di ogni cliente." },
          { x: 40.2, y: 72.8, label: "Da dove è arrivato: sito, offerta o inserimento manuale; e da quanto risale l’ultima attività." },
        ]}
      />

      <DocH3>Come arrivano</DocH3>
      <DocList>
        <li>
          <strong>Inserimento manuale:</strong> «Nuovo cliente» con nome, email e telefono.
        </li>
        <li>
          <strong>Dal sito o da un’offerta:</strong> quando qualcuno ti scrive, Tivvo crea il cliente (o lo riconosce dalla
          sua email) e lascia una nota nella sua cronologia con l’immobile o l’offerta richiesta.
        </li>
      </DocList>

      <DocH3>Fasi</DocH3>
      <DocTerms
        items={[
          [<DocPill key="l" tone="amber">Lead</DocPill>, "Appena arrivato; non ci hai ancora parlato."],
          [<DocPill key="c" tone="primary">Contattato</DocPill>, "C’è già stato un primo contatto."],
          [<DocPill key="n">In trattativa</DocPill>, "State discutendo una proposta concreta."],
          [<DocPill key="k" tone="primary">Cliente</DocPill>, "Ha concluso un’operazione con te."],
          [<DocPill key="p">Perso</DocPill>, "Non è andato avanti. Si vede più sbiadito nell’elenco."],
        ]}
      />
      <DocP>
        Cambia la fase dal menu <strong>⋯</strong> di ogni cliente («Cambia fase») o dalla sua scheda. Nello stesso menu
        puoi vedere la scheda, inviargli un’email, chiamarlo o copiarne l’email.
      </DocP>

      <DocH3>La scheda del cliente</DocH3>
      <DocFigure
        src="/docs-media/it/clientes-ficha.webp"
        alt="La scheda di un cliente con note, attività e cronologia"
        width={1304}
        height={1651}
        markers={[
          { x: 4.1, y: 15.8, label: "Note: cosa conviene ricordare." },
          { x: 5.2, y: 34.3, label: "Attività con scadenza; quelle scadute in rosso." },
          { x: 6.7, y: 58.2, label: "Cronologia: note, chiamate, email e incontri." },
          { x: 82.4, y: 12.8, label: "Cambiare la fase." },
          { x: 82.4, y: 17.6, label: "L’agente responsabile." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Note",
            "Cosa conviene ricordare: cosa cerca, budget, preferenze. Supporta titoli, grassetto, elenchi e link. Quando modifichi qualcosa compare «Salva note».",
          ],
          [
            "Attività",
            "Cosa fare con questo cliente: chiamare, inviare foto, organizzare una visita. Scrivi l’attività, scegli una scadenza facoltativa e fai clic su +. Spunta la casella quando l’hai fatta. Quelle scadute si vedono in rosso («Scaduta da 2 giorni»), e quelle di oggi e domani lo indicano.",
          ],
          [
            "Cronologia",
            "Scegli il tipo (nota, chiamata, email o incontro), scrivi cosa è successo e fai clic su «Registra». Si ordina dalla più recente alla più vecchia e mostra chi l’ha inserita.",
          ],
          ["Fase", "Fai clic sulla nuova fase nel pannello a destra; si salva subito."],
          [
            "Responsabile",
            "L’agente che segue il cliente. Titolari e amministratori lo scelgono dall’elenco del team; un agente può fare clic su «Prendilo tu» su un lead senza responsabile.",
          ],
          ["Contatto", "La sua email e il suo telefono, a un clic per scrivergli o chiamarlo."],
        ]}
      />
      <DocTip>
        Le attività eliminate non vanno nel cestino: spariscono subito. Se l’hai solo completata, meglio spuntarla come
        fatta.
      </DocTip>
    </DocSection>
  );
}

function Properties() {
  return (
    <DocSection
      id="propiedades"
      icon={Building2}
      title="Immobili"
      intro="Il tuo portafoglio: ogni casa, appartamento, terreno o affitto stagionale che commercializzi, con tutti i suoi dati, foto, prezzi e disponibilità."
    >
      <DocH3>Inserire un immobile</DocH3>
      <DocSteps>
        <DocStep>
          Fai clic su <strong>Nuovo immobile</strong> (o il tasto <Kbd>N</Kbd> nell’elenco).
        </DocStep>
        <DocStep>
          Scegli cosa farne: <strong>Vendita</strong> o <strong>Affitto</strong>. Questo cambia le categorie disponibili e
          le sezioni dell’editor.
        </DocStep>
        <DocStep>Scrivi un titolo e scegli la categoria (casa, appartamento, villa, hotel, terreno…).</DocStep>
        <DocStep>
          Fai clic su <strong>Crea immobile</strong>. Viene creato come <DocPill tone="amber">Bozza</DocPill> e si apre
          l’editor per completare il resto.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/it/propiedades-nueva.webp"
        alt="La finestra Nuovo immobile"
        width={784}
        height={992}
        className="max-w-md"
        markers={[
          { x: 72.9, y: 28.5, label: "Vendita o affitto." },
          { x: 50, y: 48.5, label: "Il titolo con cui lo vedono i tuoi clienti." },
          { x: 50, y: 56.6, label: "La categoria; cambia a seconda di vendita o affitto." },
          { x: 80.3, y: 92.6, label: "Crea l’immobile e apre l’editor." },
        ]}
      />
      <DocTip>
        Hai i tuoi immobili in un altro sistema? Usa <strong>Importa</strong> per portarli tutti insieme. Vedi «Importare
        immobili» più sotto.
      </DocTip>

      <DocH3>Stati</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Bozza</DocPill>, "Lo vede solo il tuo team. Ideale mentre lo completi."],
          [<DocPill key="p" tone="primary">Pubblicato</DocPill>, "Compare sul tuo sito e si può aggiungere alle offerte."],
          [<DocPill key="a">Archiviato</DocPill>, "Non è più sul mercato, ma conservi tutti i suoi dati. Si può ripubblicare."],
        ]}
      />

      <DocH3>L’elenco</DocH3>
      <DocFigure
        src="/docs-media/it/propiedades-lista.webp"
        alt="L’elenco degli immobili in vista griglia"
        width={1276}
        height={946}
        markers={[
          { x: 17, y: 6, label: "Ricerca per titolo, zona, regione, paese o proprietario." },
          { x: 40.3, y: 6, label: "Ordine: più recenti, meno recenti, prezzo o titolo." },
          { x: 48.4, y: 6, label: "Filtri (tasto F)." },
          { x: 55.8, y: 6, label: "Vista tabella, elenco o griglia." },
          { x: 63.2, y: 6, label: "Cestino: ciò che è stato eliminato negli ultimi 30 giorni." },
          { x: 70.7, y: 6, label: "Importa immobili da un altro sistema (titolari e amministratori)." },
          { x: 84, y: 6, label: "Nuovo immobile (tasto N)." },
          { x: 36.6, y: 69.3, label: "Lo stato di ogni immobile." },
        ]}
      />
      <DocList>
        <li>
          Ogni scheda mostra la foto di copertina, l’operazione e la categoria, la località, il prezzo, camere, bagni,
          superficie, il proprietario e da quanto è stato aggiornato.
        </li>
        <li>Se ne mostrano 25 per pagina. Scorrendo, la ricerca resta fissa in alto così non devi tornare su.</li>
        <li>
          Dal menu <strong>⋯</strong> di ogni immobile: modifica, vederlo sul sito (se pubblicato), pubblica, ritira,
          archivia, ripubblica o elimina. Anche l’icona della freccia apre la scheda pubblica.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/it/propiedades-filtros.webp"
        alt="Il pannello dei filtri degli immobili"
        width={560}
        height={1604}
        className="max-w-xs"
        markers={[
          { x: 50.1, y: 3.8, label: "Stato, tipo e categoria: puoi selezionarne più di uno; senza selezione si vedono tutti." },
          { x: 50.1, y: 31.1, label: "Località e proprietario." },
          { x: 27.5, y: 51.8, label: "Fascia di prezzo, nella valuta che scegli." },
          { x: 50.1, y: 56.7, label: "Minimo di camere e bagni." },
          { x: 18.3, y: 96, label: "Cancella azzera tutto." },
          { x: 63.5, y: 96, label: "Applica i filtri e ti dice quanti immobili restano." },
        ]}
      />
      <DocP>I filtri attivi compaiono come etichette sopra l’elenco; fai clic sulla croce di un’etichetta per toglierla.</DocP>

      <DocH3>Azioni multiple</DocH3>
      <DocP>
        Nella vista tabella, seleziona più immobili con la casella di ogni riga (o tutti con quella in alto). In basso
        compare una barra per pubblicarli, ritirarli, archiviarli o eliminarli insieme. <Kbd>Esc</Kbd> annulla la
        selezione.
      </DocP>
      <DocFigure
        src="/docs-media/it/propiedades-lote.webp"
        alt="Due immobili selezionati e la barra delle azioni multiple"
        width={1276}
        height={946}
        markers={[
          { x: 2.2, y: 30, label: "Seleziona gli immobili." },
          { x: 47.9, y: 94.2, label: "La barra delle azioni multiple." },
        ]}
      />

      <DocH3>L’editor</DocH3>
      <DocP>
        In alto c’è la barra dell’editor, con le sezioni raggruppate: <strong>Informazioni generali</strong>,{" "}
        <strong>Multimedia</strong>, <strong>Affitto</strong> (solo negli affitti), <strong>Gestione</strong> e{" "}
        <strong>Contatto</strong>. Passa con il mouse (o tocca) un gruppo con la freccia per vederne le sezioni. Salva con{" "}
        <strong>Salva</strong> o <Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd>. <strong>Pubblica</strong> salva e pubblica in un solo
        passaggio; se è già pubblicato, il pulsante diventa <strong>Ritira</strong>. Se provi a uscire con modifiche non
        salvate, ti avvisiamo.
      </DocP>
      <DocFigure
        src="/docs-media/it/propiedades-editor.webp"
        alt="L’editor di un immobile nella sezione Base"
        width={1760}
        height={990}
        markers={[
          { x: 21.8, y: 5.1, label: "Torna all’elenco degli immobili." },
          { x: 32.3, y: 5.1, label: "Le sezioni dell’editor, raggruppate." },
          { x: 88.8, y: 5.1, label: "Assistenza, Annulla, Salva e Pubblica o Ritira." },
          { x: 39.7, y: 46.5, label: "Il responsabile: l’agente che lo segue." },
          { x: 85.8, y: 27.8, label: "Così appare la scheda nel tuo portafoglio, dal vivo mentre modifichi." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Base",
            "Titolo, nome privato (come lo chiama il tuo team; il cliente non lo vede mai), responsabile, operazione, categoria, camere, bagni, superfici, posti auto, ripostigli, piani, anno di costruzione e di ristrutturazione, certificato energetico. Negli affitti anche ospiti e stelle.",
          ],
          [
            "Posizione",
            "Come viene mostrato (la località visibile ai tuoi clienti), dove si trova (l’indirizzo esatto e il segnaposto sulla mappa, solo interni), i dintorni (caratteristiche della zona e viste) e i link (Google Maps, brochure in PDF e sito web).",
          ],
          [
            "Dotazioni",
            "Servizi generali (l’elenco breve della scheda: scrivi ciascuno e premi Invio), dotazioni interne ed esterne, piscine e idromassaggi con tipo e misure, camere per tipo, distribuzione degli ambienti, e servizi e condizioni.",
          ],
          [
            "Contenuti e servizi",
            "Il riassunto (in evidenza in alto nella scheda) e la descrizione, con titoli ed elenchi. Negli affitti, anche i servizi inclusi nel prezzo e le condizioni di prenotazione e cancellazione.",
          ],
          [
            "Prezzi",
            "Prezzo di vendita o prezzo base per notte, e valuta. Se lo lasci vuoto, la scheda mostra «Prezzo su richiesta».",
          ],
          ["Foto", "Vedi più sotto. Le modifiche di questa sezione si salvano subito, senza fare clic su Salva."],
          [
            "Gestione",
            "Dati interni: chi gestisce l’immobile ogni giorno, il fornitore e la licenza, la commissione e se si può commercializzare fuori dal tuo sito.",
          ],
          [
            "Raccomandazioni",
            "Migliorie suggerite con dettaglio, costo stimato, priorità e stato (proposta, approvata o fatta). Il proprietario le vede nella sua pagina.",
          ],
          ["Camere", "Solo negli hotel, dentro Gestione: le camere dell’hotel."],
          ["Proprietario", "Il proprietario dell’immobile, il suo link di accesso e il suo estratto conto. Vedi «Proprietari»."],
        ]}
      />
      <DocP>
        Il <strong>responsabile</strong> (in Base) stabilisce quale agente lo vede: un agente lavora solo con gli immobili
        assegnati a lui. Lo scelgono titolari e amministratori, e si salva al momento della scelta.
      </DocP>

      <DocH3>Posizione</DocH3>
      <DocFigure
        src="/docs-media/it/propiedades-ubicacion.webp"
        alt="La sezione Posizione con la località visibile, l’indirizzo e la mappa"
        width={1452}
        height={1100}
        markers={[
          { x: 26.9, y: 14.1, label: "Ciò che vedono i tuoi clienti: la località visibile." },
          { x: 26.9, y: 40.2, label: "L’indirizzo esatto e il segnaposto, solo per il tuo team." },
          { x: 80.5, y: 48.2, label: "Cerca l’indirizzo, fai clic sulla mappa o trascina il segnaposto." },
        ]}
      />
      <DocP>
        Per ottenere le coordinate puoi anche incollare un link di Google Maps. L’indirizzo esatto non viene mai mostrato
        sul sito: i tuoi clienti vedono solo la località visibile (per esempio «Maiorca, Isole Baleari»).
      </DocP>

      <DocH3>Foto e video</DocH3>
      <DocFigure
        src="/docs-media/it/propiedades-fotos.webp"
        alt="La galleria fotografica di un immobile"
        width={1452}
        height={946}
        markers={[
          { x: 4.3, y: 16.3, label: "Ciò che carichi qui si vede sul sito e si salva subito." },
          { x: 62.1, y: 29, label: "Le sezioni della galleria; «Aggiungi» ne crea una nuova." },
          { x: 40.2, y: 46.6, label: "Trascina o scegli le foto: vengono caricate nella sezione selezionata." },
          { x: 5.7, y: 64.3, label: "La foto di copertina." },
        ]}
      />
      <DocList>
        <li>
          Trascina le foto nel riquadro o fai clic per sceglierle (JPG, PNG, WebP o HEIC). Vengono ottimizzate
          automaticamente prima del caricamento.
        </li>
        <li>
          Le foto sono raggruppate per sezione (Generale, Camere, Soggiorno, Piscina, Esterni, Dotazioni aggiuntive, Viste
          o una tua). Trascinale per ordinarle all’interno della sezione, o usa «Sposta in un’altra sezione».
        </li>
        <li>La prima foto è la copertina. Per cambiarla, usa «Usa come copertina» su un’altra.</li>
        <li>Per rimuovere una foto fai clic sulla croce e conferma con un secondo clic.</li>
        <li>
          <strong>Filigrana:</strong> mette il logo della tua agenzia sulle foto pubblicate.
        </li>
        <li>
          <strong>Video:</strong> incolla link di YouTube, Vimeo o altre piattaforme.
        </li>
      </DocList>

      <DocH3>Solo negli affitti</DocH3>
      <DocTerms
        items={[
          [
            "Disponibilità",
            "Blocca date a mano con una nota facoltativa. Le prenotazioni confermate bloccano le loro date da sole. Per evitare doppie prenotazioni, incolla il link iCal di Airbnb o Booking e fai clic su «Sincronizza ora». Se l’immobile è pubblicato, hai anche un link per esportare la tua disponibilità su quelle piattaforme.",
          ],
          [
            "Tariffe",
            "Periodi tariffari (per esempio «Alta stagione») con date, prezzo ufficiale per notte, soggiorno minimo, commissione di gestione e commissione dell’agenzia.",
          ],
        ]}
      />
      <DocFigure
        src="/docs-media/it/propiedades-disponibilidad.webp"
        alt="La sezione Disponibilità di un affitto"
        width={1452}
        height={576}
        markers={[
          { x: 23.3, y: 9.2, label: "Bloccare date a mano, con una nota facoltativa." },
          { x: 4.7, y: 44.1, label: "Le date occupate: «BOOKING» viene da una prenotazione, «MANUAL» da un tuo blocco, che puoi rimuovere." },
          { x: 23.3, y: 63.7, label: "Incolla il link iCal di Airbnb o Booking e sincronizza." },
          { x: 23.3, y: 81.3, label: "Il tuo calendario, da caricare su quelle piattaforme." },
        ]}
      />
      <DocFigure
        src="/docs-media/it/propiedades-tarifas.webp"
        alt="La sezione Tariffe con tre stagioni"
        width={1452}
        height={681}
        markers={[
          { x: 26.9, y: 10.5, label: "Un nuovo periodo: etichetta, date, prezzo per notte e soggiorno minimo." },
          { x: 14.6, y: 41, label: "Commissione di gestione (10% di default) e commissione dell’agenzia (20% di default), in %." },
          { x: 15.3, y: 90.3, label: "Le stagioni inserite, con prezzo e soggiorno minimo. «Rimuovi» ne elimina una." },
        ]}
      />
      <DocTip>
        Per vedere tutti i tuoi immobili in affitto in un unico calendario, usa <strong>Disponibilità</strong> nel menu.
      </DocTip>

      <DocH3>Raccomandazioni</DocH3>
      <DocFigure
        src="/docs-media/it/propiedades-recomendaciones.webp"
        alt="La sezione Raccomandazioni con due migliorie"
        width={1452}
        height={847}
        markers={[{ x: 10.8, y: 64.5, label: "Ogni miglioria con il suo dettaglio, costo stimato e priorità." }]}
      />
      <DocP>
        Servono a proporre migliorie al proprietario: rinnovare l’arredamento, aggiungere una colonnina di ricarica… Ognuna
        ha una priorità (alta, media o bassa) e uno stato che aggiorni: proposta, approvata o fatta. Il proprietario le vede
        nella sua pagina, sotto «Migliorie suggerite».
      </DocP>

      <DocTip>
        Completa prima Base, Posizione, Prezzi e Foto: con questo la scheda è già presentabile sul tuo sito. Il resto puoi
        aggiungerlo col tempo.
      </DocTip>
    </DocSection>
  );
}

function Owners() {
  return (
    <DocSection
      id="propietarios"
      icon={KeyRound}
      title="Proprietari"
      intro="I proprietari degli immobili che commercializzi. Ognuno ha una pagina privata dove segue i suoi immobili, le sue prenotazioni e la sua quota, senza bisogno di nome utente né password."
    >
      <DocH3>Assegnare un proprietario</DocH3>
      <DocSteps>
        <DocStep>
          Nell’editor dell’immobile, apri <strong>Contatto</strong> → <strong>Proprietario</strong>.
        </DocStep>
        <DocStep>Cercalo per nome, email o telefono, oppure fai clic su «Nuovo proprietario» per inserirlo lì stesso.</DocStep>
        <DocStep>Salva l’immobile. Uno stesso proprietario può avere più immobili.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/it/propietarios-asignar.webp"
        alt="La sezione Proprietario con un proprietario assegnato e il suo link di accesso"
        width={1452}
        height={1111}
        markers={[
          { x: 24.6, y: 14.3, label: "Il proprietario assegnato; «Rimuovi» lo scollega." },
          { x: 38.1, y: 38.4, label: "Copia il suo link personale per inviarglielo." },
          { x: 48, y: 38.4, label: "Rigenera: il link precedente smette di funzionare." },
          { x: 6.8, y: 46.4, label: "Il suo estratto conto." },
        ]}
      />

      <DocH3>Estratto conto</DocH3>
      <DocP>
        Sotto l’accesso c’è l’estratto conto del proprietario, con tutti i suoi immobili insieme. Lo vedono solo titolari
        e amministratori dell’agenzia.
      </DocP>
      <DocFigure
        src="/docs-media/it/propietarios-cuenta.webp"
        alt="L’estratto conto di un proprietario con incassato, commissione, liquidato e saldo"
        width={1100}
        height={1148}
        className="max-w-2xl"
        markers={[
          { x: 16.3, y: 18.1, label: "L’incassato dalle prenotazioni dei suoi immobili, sul totale prenotato." },
          { x: 83.7, y: 18.1, label: "La sua quota: l’incassato meno la commissione." },
          { x: 50, y: 30.4, label: "Quanto resta da liquidargli." },
          { x: 50, y: 79.1, label: "Le liquidazioni: quanto gli hai già pagato. Il cestino ne elimina una." },
          { x: 15.2, y: 96.4, label: "Registrare un pagamento al proprietario." },
        ]}
      />
      <DocTerms
        items={[
          ["Incassato", "La somma dei pagamenti segnati come incassati nelle sue prenotazioni (acconti e saldi)."],
          ["Commissione", "La commissione dell’agenzia su quelle prenotazioni; si detrae dall’incassato."],
          ["Ti spetta", "L’incassato meno la commissione."],
          ["Già liquidato", "La somma delle liquidazioni che hai registrato."],
          ["Saldo da liquidare", "Quanto gli devi ancora. Se gli hai pagato di più, lo indica."],
          ["Per prenotazione", "Il dettaglio di ogni prenotazione: date, quanto è stato incassato su quanto e la commissione."],
        ]}
      />
      <DocSteps>
        <DocStep>
          Fai clic su <strong>Registra liquidazione</strong>. Il saldo da liquidare e la valuta sono già compilati.
        </DocStep>
        <DocStep>Modifica l’importo se serve e scegli la data.</DocStep>
        <DocStep>Scrivi il metodo (bonifico, contanti…) e una nota se vuoi, poi fai clic su «Registra».</DocStep>
      </DocSteps>

      <DocH3>La pagina del proprietario</DocH3>
      <DocP>
        In «Accesso del proprietario» c’è il suo link personale: copialo e inviaglielo. Da lì vede i suoi immobili e il loro
        stato (pubblicato o no, con il prezzo pubblicato), il soggiorno in corso o il prossimo, le prenotazioni con date e
        pagamenti, il suo estratto conto e le migliorie suggerite che hai inserito in Raccomandazioni. Un pulsante gli
        permette di scriverti via WhatsApp o email.
      </DocP>
      <DocFigure
        src="/docs-media/it/propietarios-pagina.webp"
        alt="La pagina del proprietario con il riepilogo dei suoi immobili e il suo estratto conto"
        width={1584}
        height={946}
        markers={[
          { x: 24, y: 38.9, label: "Quanti dei suoi immobili sono pubblicati." },
          { x: 50, y: 38.9, label: "Il soggiorno in corso o il prossimo." },
          { x: 75.2, y: 38.9, label: "La sua quota dell’incassato." },
          { x: 50, y: 66.1, label: "Il suo estratto conto: il liquidato, il saldo e il dettaglio per prenotazione." },
          { x: 84.2, y: 4.2, label: "Un pulsante per scriverti." },
        ]}
      />
      <DocP>
        Di default il proprietario <strong>non vede la tua commissione</strong>: vede la sua quota, ma non quanto è stato
        trattenuto. Se vuoi mostrargliela, attiva «Mostra la commissione dell’agenzia» in Impostazioni.
      </DocP>
      <DocTip>
        Se il link è arrivato a chi non doveva, fai clic su «Rigenera»: il precedente smette subito di funzionare.
      </DocTip>
    </DocSection>
  );
}

function Importer() {
  return (
    <DocSection
      id="importar"
      icon={Upload}
      title="Importare immobili"
      adminOnly
      intro="Porta il tuo portafoglio da un altro sistema in una sola volta: un CRM, un portale o un foglio di calcolo. Non si salva nulla finché non controlli cosa succederà a ogni immobile."
    >
      <DocP>
        Si apre da <strong>Importa</strong>, nella barra di Immobili. Il processo ha quattro passaggi: scegliere da dove
        arrivi, caricare il file, indicare cos’è ogni colonna (solo nei fogli di calcolo) e controllare.
      </DocP>

      <DocH3>1. Scegli da dove migri</DocH3>
      <DocFigure
        src="/docs-media/it/importar-plataformas.webp"
        alt="L’elenco delle piattaforme da cui puoi migrare"
        width={1276}
        height={946}
        markers={[
          { x: 16.5, y: 18.6, label: "Cerca il tuo sistema per nome o paese." },
          { x: 51.7, y: 18.6, label: "Filtra per CRM, portali o aggregatori." },
          { x: 35.8, y: 44, label: "Scegli la tua piattaforma: ti mostriamo come estrarne i dati." },
        ]}
      />
      <DocP>
        Ci sono quasi 50 piattaforme (Idealista, Inmovilla, Kyero, CASAFARI, Resales Online, Witei, Apimo, Rightmove e molte
        altre), le più usate per prime. Se la tua non c’è, più sotto puoi usare un <strong>CSV o Excel</strong>, un{" "}
        <strong>XML di Kyero</strong> (il formato che esporta la maggior parte dei CRM) o l’<strong>XML di Tivvo</strong>,
        se il tuo sistema ha una sua API.
      </DocP>

      <DocH3>2. Porta i tuoi dati</DocH3>
      <DocFigure
        src="/docs-media/it/importar-fuente.webp"
        alt="La guida per migrare da Idealista, con il riquadro per caricare il file"
        width={1276}
        height={946}
        markers={[
          { x: 28.6, y: 21.3, label: "I passaggi per estrarre i tuoi immobili da quella piattaforma." },
          { x: 10.2, y: 42.9, label: "Un’altra strada, se la tua piattaforma ti dà un CSV o Excel." },
          { x: 28.6, y: 50, label: "Bloccato? Prepariamo noi la richiesta alla piattaforma o ti aiutiamo direttamente." },
          { x: 70, y: 22.6, label: "Carica il file o incolla l’URL del feed." },
          { x: 77.9, y: 39.5, label: "Leggiamo il file; non si salva ancora nulla." },
        ]}
      />
      <DocList>
        <li>
          Segui i passaggi della guida della tua piattaforma. Molte chiedono il feed tramite il supporto: in «Bloccato?» fai
          clic su <strong>Invia richiesta via email</strong> e si apre la tua email con il messaggio già scritto, oppure
          copialo con «Vedi messaggio».
        </li>
        <li>
          <strong>Carica file:</strong> CSV o Excel (.xlsx) fino a 10 MB e 3.000 righe, oppure XML fino a 10 MB.
        </li>
        <li>
          <strong>Usa un URL:</strong> incolla il link pubblico del feed. Lo leggiamo una sola volta; non resta
          sincronizzato.
        </li>
        <li>
          Se parti da zero, fai clic su <strong>Scarica modello CSV</strong>: contiene le colonne che capiamo e una riga di
          esempio.
        </li>
        <li>«Chiedi aiuto» ti permette di scriverci con il messaggio già pronto: ti aiutiamo a migrare.</li>
      </DocList>

      <DocH3>3. Cos’è ogni colonna</DocH3>
      <DocP>Solo nei fogli di calcolo (CSV o Excel). Tivvo riconosce da solo la maggior parte delle colonne; controlla le altre.</DocP>
      <DocFigure
        src="/docs-media/it/importar-mapeo.webp"
        alt="Il passaggio per assegnare ogni colonna del file a un campo di Tivvo"
        width={1304}
        height={1132}
        markers={[
          { x: 49, y: 14.4, label: "Quante righe e colonne abbiamo riconosciuto." },
          { x: 12.8, y: 27.2, label: "Le colonne non riconosciute sono in cima, con esempi dal tuo file." },
          { x: 83.8, y: 27.2, label: "Scegli a quale campo di Tivvo corrisponde, o «Non importare»." },
          { x: 14.4, y: 95.5, label: "Vedere cosa succederà a ogni riga, prima di salvare." },
        ]}
      />
      <DocList>
        <li>Ogni campo proviene da una sola colonna: se lo scegli per un’altra, si libera nella precedente.</li>
        <li>Le colonne non assegnate vengono ignorate. Una cella vuota non cancella mai ciò che è già inserito.</li>
        <li>
          Assegna una colonna di <strong>riferimento (ID)</strong>: così, se reimporti il file, gli immobili si aggiornano
          invece di duplicarsi. Se manca, ti avvisiamo.
        </li>
      </DocList>

      <DocH3>4. Controlla e importa</DocH3>
      <DocFigure
        src="/docs-media/it/importar-revision.webp"
        alt="L’anteprima dell’importazione con il riepilogo e il dettaglio per riga"
        width={1304}
        height={853}
        markers={[
          { x: 9.4, y: 20.9, label: "Il riepilogo: nuovi, da aggiornare, senza modifiche, saltati e con errore. Fai clic per filtrare." },
          { x: 20.1, y: 31.2, label: "Pubblicarli subito o lasciarli in bozza." },
          { x: 24.9, y: 38.2, label: "Spostare nel cestino ciò che non è più nel file." },
          { x: 9.3, y: 49.3, label: "Riga per riga, con avvisi, errori e cosa cambia." },
          { x: 15.4, y: 94.1, label: "Solo qui si salva tutto." },
        ]}
      />
      <DocTerms
        items={[
          ["Nuovo", "Non era in Tivvo: viene creato."],
          ["Aggiorna", "L’avevi già importato (stesso riferimento): cambia ciò che indica il dettaglio, per esempio prezzo o foto."],
          ["Senza modifiche", "È già identico in Tivvo."],
          ["Saltato", "Non viene importato, per esempio perché è ripetuto nel file."],
          ["Con errore", "Manca qualcosa di obbligatorio, come il titolo. Il dettaglio dice cosa."],
        ]}
      />
      <DocList>
        <li>
          <strong>Pubblica i nuovi all’importazione:</strong> disattivato, restano in bozza così li controlli prima di
          mostrarli sul tuo sito.
        </li>
        <li>
          <strong>Sposta nel cestino ciò che non è più nel file:</strong> riguarda solo gli immobili importati prima da
          quella stessa piattaforma, e ti chiediamo conferma. Si possono ripristinare per 30 giorni.
        </li>
        <li>
          Facendo clic su <strong>Importa</strong>, Tivvo salva gli immobili e scarica le loro foto. Se sono molti può
          richiedere qualche minuto: non chiudere la scheda. Se provi a uscire prima della fine, ti avvisiamo.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/it/importar-listo.webp"
        alt="La schermata finale dell’importazione con il riepilogo e gli errori"
        width={1100}
        height={415}
        className="max-w-2xl"
        markers={[
          { x: 50, y: 44.8, label: "Cosa è stato fatto, con il dettaglio degli errori." },
          { x: 37, y: 70, label: "Scarica gli errori in un CSV per correggerli." },
          { x: 38.4, y: 82.4, label: "Controlla le bozze o guarda il tuo sito; «Importa un altro file» ricomincia." },
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
      title="Offerte"
      intro="Proposte personalizzate per un cliente: una selezione di immobili e servizi ai tuoi prezzi, presentata in una pagina dedicata che il cliente apre da un link."
    >
      <DocH3>Creare un’offerta</DocH3>
      <DocSteps>
        <DocStep>
          Fai clic su <strong>Nuova offerta</strong>, dalle un titolo (per esempio «Proposta per la famiglia Pérez»),
          scegli l’operazione (vendita, affitto o entrambe) e, se vuoi, un codice di riferimento. L’operazione stabilisce
          quali immobili puoi aggiungere.
        </DocStep>
        <DocStep>
          In <strong>Generale</strong> scegli il cliente, la valuta e se mostrare i prezzi e l’identità della tua agenzia
          (intestazione, piè di pagina e contatti).
        </DocStep>
        <DocStep>
          In <strong>Benvenuto</strong> scrivi il saluto: un titolo, la data o la stagione e un messaggio.
        </DocStep>
        <DocStep>
          In <strong>Immobili</strong> crea delle sezioni (per esempio «Fronte mare») e aggiungi gli immobili.
        </DocStep>
        <DocStep>
          In <strong>Servizi</strong> aggiungi esperienze della tua libreria: chef, transfer, yacht…
        </DocStep>
        <DocStep>
          Fai clic su <strong>Invia offerta</strong> (se ha un cliente) o <strong>Pubblica link</strong> (se non ce l’ha).
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/it/ofertas-nueva.webp"
        alt="La finestra Nuova offerta"
        width={784}
        height={838}
        className="max-w-md"
        markers={[
          { x: 50, y: 31.1, label: "Il titolo." },
          { x: 50, y: 59, label: "Un codice di riferimento facoltativo, come quello del tuo sistema." },
          { x: 50, y: 48.6, label: "Vendita, affitto o entrambe: stabilisce quali immobili puoi aggiungere." },
        ]}
      />
      <DocFigure
        src="/docs-media/it/ofertas-lista.webp"
        alt="L’elenco delle offerte"
        width={1304}
        height={946}
        markers={[
          { x: 24.2, y: 6, label: "Ricerca per titolo o cliente." },
          { x: 51.8, y: 6, label: "Filtri per operazione e stato." },
          { x: 89.4, y: 6, label: "Nuova offerta." },
          { x: 5.8, y: 60.5, label: "Lo stato: qui il cliente l’ha già aperta." },
          { x: 17, y: 47.3, label: "Il tuo codice di riferimento, se ne hai messo uno." },
        ]}
      />

      <DocH3>L’editor</DocH3>
      <DocFigure
        src="/docs-media/it/ofertas-editor.webp"
        alt="L’editor di un’offerta nella sezione Generale"
        width={1480}
        height={1100}
        markers={[
          { x: 15.2, y: 4.6, label: "Le sezioni: Generale, Benvenuto, Immobili e Servizi." },
          { x: 30.3, y: 37.1, label: "Il cliente che la riceve via email." },
          { x: 18.4, y: 76.2, label: "Mostrare o nascondere i prezzi." },
          { x: 17.4, y: 84.8, label: "Mostrare il tuo logo, l’intestazione e i contatti." },
          { x: 84.5, y: 25.4, label: "Il riepilogo, il link per il cliente e «Vedi cliente»." },
          { x: 90.1, y: 4.6, label: "Inviare, reinviare o pubblicare il link." },
        ]}
      />
      <DocP>
        A destra vedi lo stato, quanti immobili e servizi contiene e il totale. Negli affitti non c’è totale: sono opzioni
        tra cui scegliere, con prezzo per notte. Una volta inviata o pubblicata, lì trovi il link per il cliente con «Copia
        link».
      </DocP>

      <DocH3>Regolare il prezzo di ogni immobile</DocH3>
      <DocFigure
        src="/docs-media/it/ofertas-propiedades.webp"
        alt="La sezione Immobili di un’offerta con le regolazioni di prezzo aperte"
        width={1480}
        height={1292}
        markers={[
          { x: 28.6, y: 12.4, label: "Ogni sezione con il suo titolo e un testo." },
          { x: 17.1, y: 33, label: "Prezzo speciale, sconto e deposito solo per questa offerta." },
          { x: 30.3, y: 50.4, label: "Un breve testo sotto l’immobile." },
        ]}
      />
      <DocP>
        «Mostra regolazioni» su ogni immobile ti permette di impostare un prezzo speciale per questa offerta, uno sconto
        (percentuale o importo fisso), un deposito cauzionale e un breve testo come «Pulizia finale inclusa». Il cliente
        vede il prezzo precedente barrato. Il prezzo dell’immobile nel tuo portafoglio non cambia.
      </DocP>

      <DocH3>Servizi nell’offerta</DocH3>
      <DocFigure
        src="/docs-media/it/ofertas-servicios.webp"
        alt="La sezione Servizi di un’offerta con uno chef privato e un transfer"
        width={1480}
        height={814}
        markers={[
          { x: 8.3, y: 93.5, label: "Aggiungi un servizio dalla tua libreria." },
          { x: 30.3, y: 9.9, label: "Regola prezzo, quantità, data e una nota per il cliente." },
          { x: 52.6, y: 43.7, label: "Il subtotale di ogni servizio." },
        ]}
      />
      <DocP>
        I servizi vengono dalla tua libreria (vedi «Servizi»). Quando lo aggiungi all’offerta puoi cambiare il prezzo, la
        quantità (persone, giorni, notti od ore, a seconda di come si addebita), la data e lasciare una nota. Senza prezzo,
        il cliente vede «Su richiesta».
      </DocP>

      <DocH3>Inviare o condividere</DocH3>
      <DocTerms
        items={[
          ["Con cliente", "«Invia offerta» gli manda il link via email. Poi puoi usare «Reinvia offerta» quando vuoi."],
          ["Senza cliente", "«Pubblica link» attiva la pagina e condividi tu il link come preferisci."],
          ["Copia link", "Disponibile nel pannello destro dell’editor e nel menu ⋯ di ogni offerta, una volta inviata o pubblicata."],
        ]}
      />
      <DocP>
        Se hai inviato il link per conto tuo (su WhatsApp, per esempio), usa «Segna come inviata» dal menu dell’offerta.
        Quando il cliente la apre, l’offerta passa a «Vista» e ricevi una notifica. Dalla pagina dell’offerta il cliente può
        scriverti: quella richiesta arriva in Richieste.
      </DocP>

      <DocH3>Stati</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Bozza</DocPill>, "Non la vede ancora nessuno."],
          [<DocPill key="s" tone="primary">Inviata</DocPill>, "Il link è attivo ed è stato inviato al cliente."],
          [<DocPill key="v">Vista</DocPill>, "Il cliente ha già aperto l’offerta."],
          [<DocPill key="e">Scaduta</DocPill>, "È passata la data di scadenza; il cliente vede un avviso che è scaduta."],
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
      title="Prenotazioni"
      intro="Ogni operazione conclusa: un affitto con le sue date o una vendita, con il prezzo, la commissione e il monitoraggio dei pagamenti."
    >
      <DocFigure
        src="/docs-media/it/reservas-lista.webp"
        alt="L’elenco delle prenotazioni"
        width={1304}
        height={946}
        markers={[
          { x: 23.4, y: 6, label: "Cerca per immobile o cliente." },
          { x: 48.6, y: 6, label: "Filtra per stato o per località dell’immobile." },
          { x: 87.6, y: 6, label: "Nuova prenotazione." },
          { x: 6.6, y: 40.5, label: "Lo stato di ogni prenotazione." },
        ]}
      />

      <DocH3>Creare una prenotazione</DocH3>
      <DocSteps>
        <DocStep>
          Fai clic su <strong>Nuova prenotazione</strong> e scegli l’immobile.
        </DocStep>
        <DocStep>Assegna il cliente (facoltativo).</DocStep>
        <DocStep>Negli affitti, scegli le date di arrivo e partenza. Una vendita non ha date.</DocStep>
        <DocStep>Inserisci il prezzo totale e la tua commissione, poi fai clic su «Crea prenotazione».</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/it/reservas-nueva.webp"
        alt="La finestra Nuova prenotazione"
        width={784}
        height={809}
        className="max-w-md"
        markers={[
          { x: 50, y: 21, label: "L’immobile." },
          { x: 50, y: 37.7, label: "Il cliente (facoltativo)." },
          { x: 50, y: 53.6, label: "Arrivo e partenza, solo negli affitti." },
          { x: 72.9, y: 70.3, label: "Prezzo totale e la tua commissione." },
        ]}
      />

      <DocH3>Stati</DocH3>
      <DocTerms
        items={[
          [
            <DocPill key="p" tone="amber">In attesa</DocPill>,
            "Appena creata, in attesa di conferma. Non blocca ancora le date, ma in Disponibilità si vede in ambra.",
          ],
          [<DocPill key="c" tone="primary">Confermata</DocPill>, "È definitiva e blocca le sue date."],
          [<DocPill key="o">Completata</DocPill>, "Il soggiorno è finito o la vendita è conclusa."],
          [<DocPill key="x">Annullata</DocPill>, "Non avrà luogo: le date vengono liberate. I pagamenti registrati non vengono eliminati."],
        ]}
      />
      <DocP>
        Cambia lo stato dalla scheda della prenotazione o dal menu ⋯ dell’elenco. Prima di annullare ti chiediamo conferma.
        «Elimina» la sposta nel cestino.
      </DocP>

      <DocH3>La scheda della prenotazione</DocH3>
      <DocFigure
        src="/docs-media/it/reservas-ficha.webp"
        alt="La scheda di una prenotazione con il soggiorno, i pagamenti e il riepilogo"
        width={1304}
        height={1210}
        markers={[
          { x: 6.5, y: 21.5, label: "Le date e il numero di notti." },
          { x: 58.1, y: 51.3, label: "Registrare un acconto, il saldo o la tua commissione." },
          { x: 57.1, y: 64.9, label: "Segnare un pagamento come incassato." },
          { x: 82.4, y: 12, label: "Totale, commissione, incassato e da incassare." },
          { x: 82.4, y: 28.7, label: "La pagina che vede il cliente: copia il link o aprila." },
          { x: 82.4, y: 42, label: "Confermare, completare o annullare." },
        ]}
      />

      <DocH3>Pagamenti</DocH3>
      <DocP>
        «Aggiungi pagamento» registra un <strong>acconto</strong>, il <strong>saldo</strong> o la tua{" "}
        <strong>commissione</strong>, nella valuta della prenotazione. Ogni pagamento resta in sospeso finché non lo segni
        come incassato; a quel punto conserva la data. La barra mostra quanto è stato incassato sul totale.
      </DocP>
      <DocFigure
        src="/docs-media/it/reservas-pago.webp"
        alt="La finestra Aggiungi pagamento"
        width={700}
        height={544}
        className="max-w-sm"
        caption="Scegli il tipo, scrivi l’importo e salva. Resta in sospeso finché non lo segni come incassato."
      />
      <DocP>
        I pagamenti incassati alimentano l’estratto conto del proprietario: l’incassato meno la commissione è la sua quota.
      </DocP>

      <DocH3>La pagina del cliente</DocH3>
      <DocP>
        Ogni prenotazione ha una pagina per il cliente con l’immobile, il soggiorno, lo stato e i pagamenti (acconti e
        saldo, mai la commissione). Se la prenotazione ha un cliente, la riceve via email quando viene creata, confermata o
        annullata. Altrimenti copia il link dalla scheda o dal menu ⋯ e mandaglielo tu. Vedi «Cosa vedono i tuoi
        clienti».
      </DocP>
    </DocSection>
  );
}

function Availability() {
  return (
    <DocSection
      id="disponibilidad"
      icon={CalendarCheck}
      title="Disponibilità"
      intro="Tutti i tuoi immobili in affitto in un unico calendario: cosa è libero e cosa è occupato, per rispondere in fretta a una richiesta e bloccare date senza entrare in ogni immobile."
    >
      <DocP>
        Ha due viste, che scegli a destra: <strong>Prossimi 90 giorni</strong> (una griglia con una riga per immobile) e{" "}
        <strong>Mensile</strong> (un calendario). Compaiono solo gli immobili in affitto.
      </DocP>

      <DocH3>Prossimi 90 giorni</DocH3>
      <DocFigure
        src="/docs-media/it/disponibilidad-grilla.webp"
        alt="La griglia di disponibilità dei prossimi 90 giorni"
        width={1304}
        height={704}
        markers={[
          { x: 12.8, y: 20, label: "Cerca un immobile o filtra per località." },
          { x: 69.1, y: 20, label: "Scegli delle date per vedere quali immobili sono liberi." },
          { x: 88.5, y: 20, label: "Prossimi 90 giorni o Mensile." },
          { x: 86.5, y: 8.1, label: "Il link pubblico della tua disponibilità, da condividere." },
          { x: 38.2, y: 27.2, label: "Cosa significa ogni colore." },
          { x: 13, y: 48.9, label: "Ogni riga è un immobile; fai clic sul nome per aprirlo." },
        ]}
      />
      <DocTerms
        items={[
          ["Verde", "Disponibile."],
          ["Rosso", "Prenotato o bloccato."],
          ["Metà e metà", "Giorno di arrivo (check-in, occupato dal pomeriggio) o di partenza (check-out, occupato fino al mattino)."],
          ["Ambra", "Una prenotazione in attesa: non blocca ancora le date, ma è stata richiesta."],
          ["Grigio", "Giorni passati."],
        ]}
      />
      <DocList>
        <li>Gli immobili sono raggruppati per regione. Passa il mouse su un giorno per vedere di cosa si tratta.</li>
        <li>
          Scegliendo delle date, quei giorni vengono evidenziati e con <strong>Solo liberi</strong> restano solo gli
          immobili disponibili per tutto il periodo. «Cancella date» torna indietro.
        </li>
        <li>Si mostrano 25 immobili; «Vedi altro» carica i successivi.</li>
      </DocList>

      <DocH3>Mensile</DocH3>
      <DocFigure
        src="/docs-media/it/disponibilidad-mes.webp"
        alt="Il calendario mensile con l’occupazione di ogni giorno"
        width={1304}
        height={1298}
        markers={[
          { x: 6.4, y: 10.7, label: "Spostarti tra i mesi; «Oggi» torna a quello attuale." },
          { x: 67.9, y: 10.7, label: "Scegli un immobile per vederne le prenotazioni e bloccare date." },
          { x: 67.7, y: 52.5, label: "Quanti immobili sono occupati quella notte." },
          { x: 62.4, y: 54.9, label: "Quali: ogni immobile con il suo colore. Quelli in attesa, con bordo tratteggiato." },
        ]}
      />
      <DocP>
        Con <strong>Tutti gli immobili</strong>, ogni giorno dice quanti sono occupati quella notte (in rosso se lo sono
        tutti) e quali, ognuno sempre dello stesso colore. Passa il mouse per vedere l’elenco completo. Facendo clic su un
        giorno, sotto compaiono gli occupati, quelli in attesa e i liberi:
      </DocP>
      <DocFigure
        src="/docs-media/it/disponibilidad-dia.webp"
        alt="Il dettaglio di un giorno con gli immobili occupati e liberi"
        width={1100}
        height={234}
        className="max-w-2xl"
        markers={[
          { x: 25.5, y: 29.5, label: "Cosa è occupato, in attesa e libero quel giorno." },
          { x: 46, y: 43, label: "«Vedi mese» apre il calendario di quell’immobile; il nome apre l’immobile." },
        ]}
      />

      <DocH3>Bloccare date dal calendario</DocH3>
      <DocSteps>
        <DocStep>
          Nella vista <strong>Mensile</strong>, scegli l’immobile in alto a destra.
        </DocStep>
        <DocStep>
          Trascina sulle notti libere che vuoi bloccare. Da tastiera: <Kbd>Enter</Kbd> sul primo giorno e <Kbd>Enter</Kbd>{" "}
          sull’ultimo.
        </DocStep>
        <DocStep>
          Sotto compare il riepilogo («4 notti, dal 25 ott al 29 ott»). Scrivi una nota se vuoi e fai clic su{" "}
          <strong>Blocca</strong>.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/it/disponibilidad-bloquear.webp"
        alt="Il calendario di un immobile con quattro notti selezionate da bloccare"
        width={1304}
        height={1141}
        markers={[
          { x: 48.9, y: 89.2, label: "I giorni di una prenotazione: arrivo, notti occupate e partenza." },
          { x: 8.7, y: 74.3, label: "Trascina sulle notti libere per selezionarle." },
          { x: 22.5, y: 95.6, label: "Conferma il blocco, con una nota facoltativa." },
        ]}
      />
      <DocP>
        Non si possono selezionare notti passate né occupate. Il blocco compare anche nella sezione Disponibilità
        dell’immobile, dove puoi rimuoverlo.
      </DocP>

      <DocH3>Il link da condividere</DocH3>
      <DocP>
        «Copia link da condividere» copia l’indirizzo della tua disponibilità pubblica: la stessa griglia di 90 giorni, sul
        tuo sito, con il tuo marchio. Serve per inviarla a un cliente o a un collega. Mostra solo gli immobili pubblicati e
        non mostra le prenotazioni in attesa.
      </DocP>
    </DocSection>
  );
}

function Services() {
  return (
    <DocSection
      id="servicios"
      icon={Sparkles}
      title="Servizi"
      intro="La tua libreria di esperienze e servizi extra. Li inserisci una volta e li aggiungi a qualsiasi offerta."
    >
      <DocFigure
        src="/docs-media/it/servicios-lista.webp"
        alt="La libreria dei servizi"
        width={1304}
        height={946}
        markers={[
          { x: 20.9, y: 6, label: "Cerca per nome, tipo o zona." },
          { x: 89.1, y: 6, label: "Nuovo servizio." },
          { x: 73.5, y: 52.9, label: "Senza prezzo, si mostra «Su richiesta»." },
        ]}
      />

      <DocH3>Creare un servizio</DocH3>
      <DocSteps>
        <DocStep>
          Fai clic su <strong>Nuovo servizio</strong> e scegli il tipo: maggiordomo, chef privato, yacht, transfer, auto,
          escursioni, spa, babysitter, pulizie extra, eventi o altro.
        </DocStep>
        <DocStep>Dagli un nome, una foto e una descrizione: cosa include, quanto dura, per quante persone.</DocStep>
        <DocStep>
          Definisci il prezzo e come si addebita: a servizio, a persona, al giorno, a notte o all’ora. Senza prezzo si
          mostra «Su richiesta».
        </DocStep>
        <DocStep>Indica dove viene offerto (vuoto significa ovunque) e, se vuoi, il fornitore.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/it/servicios-editar.webp"
        alt="Il modulo di un servizio: foto, zone, prezzo, unità di addebito, fornitore e disponibilità"
        width={784}
        height={1628}
        className="max-w-md"
        markers={[
          { x: 50, y: 18.2, label: "La foto del servizio." },
          { x: 50, y: 51.9, label: "Le zone dove viene offerto; vuoto è ovunque." },
          { x: 78, y: 67.8, label: "Come si addebita: a servizio, persona, giorno, notte od ora." },
          { x: 50, y: 71.9, label: "Il fornitore, solo per il tuo team." },
          { x: 89.6, y: 95.9, label: "Disponibile da aggiungere a nuove offerte." },
        ]}
      />
      <DocList>
        <li>Fai clic su un servizio dell’elenco per modificarlo o eliminarlo.</li>
        <li>Il fornitore lo vede solo il tuo team, mai il cliente.</li>
        <li>Se disattivi «Disponibile», il servizio non si può aggiungere a nuove offerte, ma resta in quelle che lo hanno già.</li>
        <li>In ogni offerta puoi regolare prezzo, quantità e data del servizio per quel cliente, e lasciargli una nota.</li>
      </DocList>
    </DocSection>
  );
}

function Portal() {
  return (
    <DocSection
      id="portal"
      icon={Globe}
      title="Sito web"
      adminOnly
      intro="Il sito pubblico della tua agenzia, dove i tuoi clienti vedono i tuoi immobili pubblicati e ti scrivono. È tuo: porta il tuo nome, il tuo logo e i tuoi colori."
    >
      <DocP>
        Si modifica da <strong>Sito</strong> nel menu. L’editor occupa tutto lo schermo: a sinistra le opzioni, a destra
        un’anteprima che puoi vedere come computer o come smartphone. Salva per pubblicare le modifiche; se provi a uscire
        con modifiche non salvate, ti avvisiamo.
      </DocP>
      <DocFigure
        src="/docs-media/it/portal-editor.webp"
        alt="L’editor del sito nella scheda Layout, con l’anteprima a destra"
        width={1760}
        height={990}
        markers={[
          { x: 14, y: 9.8, label: "Le schede: Layout, Copertina, Blocchi e Agenzia e contatti." },
          { x: 5.3, y: 28.8, label: "Scegli se stai configurando la versione per computer o per smartphone." },
          { x: 68.6, y: 3.5, label: "Vedere l’anteprima come computer o come smartphone." },
          { x: 84.9, y: 3.5, label: "Vedere il sito pubblicato." },
          { x: 94.7, y: 3.5, label: "Salva modifiche pubblica ciò che hai modificato." },
          { x: 66, y: 57.1, label: "L’anteprima, esattamente come la vedranno i tuoi clienti." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Layout",
            "Il modello della home page (Copertina, Editoriale, Compatto, Diviso o Mosaico), che può essere diverso su smartphone; il colore di pulsanti e link (uno della palette o un altro tramite codice, come #1F5F4A); e la tipografia (Moderna, Classica, Sobria, Elegante, Editoriale, Calda, Urbana o Architettonica).",
          ],
          [
            "Copertina",
            "La foto principale (meglio orizzontale, larga almeno 1920 px) e, nel modello Mosaico, le quattro foto del collage. Anche il titolo e il testo della copertina.",
          ],
          [
            "Blocchi",
            "Sezioni tue tra la copertina e l’elenco. Ognuna ha diversi layout e si può nascondere senza eliminarla.",
          ],
          [
            "Agenzia e contatti",
            "Il testo sulla tua agenzia, telefono, WhatsApp (attiva il pulsante «Scrivici su WhatsApp»), Instagram e l’indirizzo dell’ufficio.",
          ],
        ]}
      />

      <DocH3>Tipi di blocco</DocH3>
      <DocFigure
        src="/docs-media/it/portal-bloques.webp"
        alt="La scheda Blocchi con tre blocchi del sito"
        width={896}
        height={1038}
        className="max-w-sm"
        markers={[
          { x: 36.7, y: 50.3, label: "Ogni blocco, con tipo e layout. Fai clic per modificarlo." },
          { x: 66.7, y: 51.9, label: "Nasconderlo senza eliminarlo." },
          { x: 81.9, y: 51.9, label: "Spostarlo su o giù." },
          { x: 89.5, y: 51.9, label: "Eliminarlo." },
          { x: 49.9, y: 90.4, label: "Aggiungere un nuovo blocco: scegli il tipo, poi il layout e il contenuto." },
        ]}
      />
      <DocTerms
        items={[
          ["Località", "Una zona con foto, testo e i suoi immobili. Layout: In evidenza, Banner o Carosello."],
          [
            "Promozione",
            "Immobili con un’etichetta come «-15%», con data di scadenza facoltativa. Layout: Fascia colorata, Banner con foto o Carosello.",
          ],
          ["Immobili in evidenza", "Una tua selezione: le novità, fronte mare, i più richiesti. Layout: Griglia o Carosello."],
          ["Destinazioni", "Più zone insieme, ciascuna con la sua foto. Toccandone una, l’elenco si filtra. Layout: Mosaico o Carosello."],
          [
            "Testo e immagine",
            "Racconta qualcosa di tuo: i tuoi servizi, le valutazioni, come lavorate. Immagine a sinistra, a destra o solo testo.",
          ],
          [
            "Invito all’azione",
            "Un invito con un pulsante che porta al modulo di contatto, a WhatsApp o all’elenco. Layout: Colore o Con foto.",
          ],
        ]}
      />

      <DocH3>Agenzia e contatti</DocH3>
      <DocFigure
        src="/docs-media/it/portal-agencia.webp"
        alt="La scheda Agenzia e contatti dell’editor del sito"
        width={896}
        height={1886}
        className="max-w-xs"
        caption="Il testo «La tua agenzia» e i contatti che compaiono nel piè di pagina e nel pulsante di contatto del sito."
      />
      <DocTip>
        Per vedere il risultato, usa «Vedi pubblicato» nell’editor o «Vedi il mio sito» nel menu del tuo profilo.
      </DocTip>
    </DocSection>
  );
}

function ClientPages() {
  return (
    <DocSection
      id="lo-que-ven-tus-clientes"
      icon={Eye}
      title="Cosa vedono i tuoi clienti"
      intro="Le pagine pubbliche che genera Tivvo: il tuo sito, la scheda di ogni immobile, le offerte, le prenotazioni, la pagina del proprietario e la tua disponibilità. Nessuna chiede nome utente né password."
    >
      <DocH3>Il tuo sito</DocH3>
      <DocFigure
        src="/docs-media/it/portal-publico.webp"
        alt="Il sito pubblico di un’agenzia con la copertina e la ricerca"
        width={1584}
        height={946}
        caption="La copertina con la ricerca (operazione, zona e tipo), i tuoi blocchi, l’elenco degli immobili pubblicati e i contatti."
      />
      <DocList>
        <li>Mostra solo gli immobili pubblicati. Le schede hanno galleria, mappa con la località visibile e modulo di richiesta.</li>
        <li>Le richieste dal modulo arrivano in Richieste e creano il cliente.</li>
        <li>Lo modifichi da Sito (vedi «Sito web»); l’indirizzo, da Impostazioni.</li>
      </DocList>

      <DocH3>L’offerta</DocH3>
      <DocFigure
        src="/docs-media/it/ofertas-cliente.webp"
        alt="La pagina di un’offerta come la vede il cliente"
        width={1584}
        height={990}
        caption="Il saluto, le sezioni con i loro immobili (con il prezzo speciale e il precedente barrato) e i servizi. In fondo, un modulo per scriverti."
      />

      <DocH3>La prenotazione</DocH3>
      <DocFigure
        src="/docs-media/it/reservas-cliente.webp"
        alt="La pagina di una prenotazione confermata come la vede il cliente"
        width={1584}
        height={946}
        caption="Lo stato, l’immobile, le date e i pagamenti: totale, pagato e quanto manca. Non mostra mai la tua commissione."
      />

      <DocH3>La tua disponibilità</DocH3>
      <DocFigure
        src="/docs-media/it/disponibilidad-publica.webp"
        alt="La disponibilità pubblica dell’agenzia"
        width={1584}
        height={946}
        caption="I prossimi 90 giorni dei tuoi affitti pubblicati, con ricerca, località e date. Non mostra le prenotazioni in attesa."
      />

      <DocH3>La pagina del proprietario</DocH3>
      <DocP>Vedi «Proprietari».</DocP>
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
      intro="Le persone che lavorano nella tua agenzia su Tivvo e cosa può fare ciascuna."
    >
      <DocFigure
        src="/docs-media/it/equipo.webp"
        alt="Il team dell’agenzia"
        width={1304}
        height={946}
        markers={[
          { x: 63.9, y: 6, label: "Filtra per ruolo." },
          { x: 89.1, y: 6, label: "Invitare qualcuno." },
          { x: 11.6, y: 19.7, label: "Il ruolo di ogni persona." },
        ]}
      />
      <DocSteps>
        <DocStep>
          Fai clic su <strong>Invita membro</strong>, scrivi nome ed email e scegli il ruolo: amministratore o agente.
        </DocStep>
        <DocStep>
          Riceve l’accesso via email. Se aveva già un account Tivvo (per esempio in un’altra agenzia), lo aggiungiamo al
          tuo team ed entra con la sua solita password.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/it/equipo-invitar.webp"
        alt="La finestra Invita membro"
        width={784}
        height={769}
        className="max-w-md"
        markers={[{ x: 50, y: 72.7, label: "Amministratore o agente. Vedi «Ruoli» in Primi passi." }]}
      />
      <DocList>
        <li>Dal menu ⋯ di ogni persona puoi cambiarle il ruolo, copiarne l’email, disattivarne l’accesso o rimuoverla dal team.</li>
        <li>
          <strong>Disattivare l’accesso</strong> le impedisce di entrare ma conserva il suo posto, i suoi immobili e i suoi
          clienti; puoi riattivarlo quando vuoi. Chi non ha accesso compare in fondo.
        </li>
        <li>
          <strong>Rimuovere dal team</strong> le toglie l’accesso a questa agenzia. Il suo account non viene eliminato: se
          appartiene a un’altra agenzia, continua ad accedervi.
        </li>
        <li>Il titolare dell’account non può essere rimosso né cambiare ruolo.</li>
      </DocList>
    </DocSection>
  );
}

function SettingsDoc() {
  return (
    <DocSection
      id="configuracion"
      icon={Settings}
      title="Impostazioni"
      adminOnly
      intro="I dati della tua agenzia e le preferenze di tutto l’account."
    >
      <DocFigure
        src="/docs-media/it/configuracion.webp"
        alt="La pagina Impostazioni"
        width={1304}
        height={1486}
        markers={[
          { x: 6.1, y: 16.8, label: "Il tuo logo e il nome dell’agenzia." },
          { x: 30.4, y: 32.6, label: "L’indirizzo del tuo sito." },
          { x: 30.4, y: 39.1, label: "L’email che riceve gli avvisi delle richieste." },
          { x: 32.2, y: 51.8, label: "Se il proprietario vede la tua commissione. Si salva al cambio." },
          { x: 30.4, y: 69.1, label: "Lingua e valuta predefinite." },
          { x: 91.4, y: 3.4, label: "Salva; accanto, scorciatoie per copiare, vedere e personalizzare il sito." },
        ]}
      />
      <DocTerms
        items={[
          [
            "La tua agenzia",
            "Il nome e il logo con cui ti vedono i tuoi clienti. Fai clic sul logo per cambiarlo; viene caricato subito.",
          ],
          [
            "Sito pubblico",
            "L’indirizzo del tuo sito (solo minuscole, numeri e trattini). Se lo cambi, il link precedente smette di funzionare: aggiornalo ovunque l’abbia condiviso. Anche l’email di contatto, che riceve gli avvisi delle richieste.",
          ],
          [
            "Portale del proprietario",
            "«Mostra la commissione dell’agenzia»: disattivato, il proprietario vede la sua quota ma non quanto è stato trattenuto. Si salva al cambio, senza fare clic su Salva.",
          ],
          [
            "Preferenze",
            "La lingua del sito (i link che condividi si aprono in quella lingua, e i tuoi clienti possono cambiarla dalla pagina) e la valuta predefinita dei prezzi.",
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
      title="Il mio profilo"
      intro="I tuoi dati personali all’interno dell’account dell’agenzia."
    >
      <DocFigure
        src="/docs-media/it/perfil.webp"
        alt="La pagina Il mio profilo"
        width={1304}
        height={1321}
        markers={[
          { x: 6.1, y: 18.9, label: "Fai clic sulla foto per cambiarla; accanto, il tuo ruolo." },
          { x: 30.4, y: 30.1, label: "Il tuo nome e la tua email; si salvano con «Salva», in alto." },
          { x: 30.4, y: 53, label: "Per cambiare la password: quella attuale e la nuova, due volte." },
        ]}
      />
      <DocList>
        <li>La foto viene caricata subito; il tuo nome si vede nel menu e nella cronologia dei tuoi clienti.</li>
        <li>La nuova password deve avere almeno 8 caratteri. L’occhio di ogni campo mostra ciò che hai scritto.</li>
        <li>
          La lingua del pannello si cambia dal menu del tuo profilo, in «Lingua». È personale: ogni persona del team può
          usare la sua.
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
      title="Ricerca, scorciatoie e assistenza"
      intro="Per muoverti in tutto il pannello senza staccare le mani dalla tastiera, e a chi rivolgerti se ti blocchi."
    >
      <DocH3>Ricerca</DocH3>
      <DocP>
        <Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd> apre una ricerca che trova pagine, immobili, offerte e clienti per nome. Da lì puoi
        anche creare un immobile, un’offerta, un cliente o una prenotazione, invitare qualcuno nel team, aprire questa
        documentazione, cambiare l’aspetto, comprimere il menu ed uscire.
      </DocP>
      <DocFigure
        src="/docs-media/it/buscador.webp"
        alt="La ricerca che mostra risultati scrivendo «pérez»"
        width={960}
        height={347}
        className="max-w-lg"
        caption="Scrivi parte di un nome e scegli con le frecce e Invio. Esc la chiude."
      />

      <DocH3>Scorciatoie</DocH3>
      <DocP>
        <Kbd>?</Kbd> mostra tutte le scorciatoie in qualsiasi schermata del pannello.
      </DocP>
      <DocTerms
        items={[
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd></>, "Cerca ed esegui comandi"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd></>, "Salva il modulo aperto"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd></>, "Comprimi o espandi il menu laterale"],
          [<Kbd key="q">?</Kbd>, "Vedi tutte le scorciatoie"],
          [
            <><Kbd>G</Kbd> e una lettera</>,
            "Vai a una sezione: P immobili, O offerte, C clienti, I richieste, R prenotazioni, D disponibilità, E team, W sito, S impostazioni, M il mio profilo",
          ],
          [<Kbd key="n">N</Kbd>, "Crea nuovo nell’elenco aperto"],
          [<Kbd key="s">/</Kbd>, "Vai alla ricerca dell’elenco"],
          [<Kbd key="f">F</Kbd>, "Apri i filtri"],
          [<><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd></>, "Vista griglia, elenco o tabella"],
          [<><Kbd>J</Kbd> <Kbd>K</Kbd></>, "Scendi e sali tra gli elementi; Invio apre quello selezionato"],
          [<Kbd key="e">Esc</Kbd>, "Annulla la selezione"],
        ]}
      />

      <DocH3>Assistenza e supporto</DocH3>
      <DocP>
        Nel menu del tuo profilo, <strong>Assistenza e supporto</strong> apre il centro assistenza: domande frequenti con
        ricerca e un modulo per scrivere al team di Tivvo. Rispondiamo via email.
      </DocP>
      <DocFigure
        src="/docs-media/it/ayuda.webp"
        alt="Il centro assistenza di Tivvo"
        width={1584}
        height={946}
        caption="Cerca la tua domanda; se non la trovi, scrivici dal modulo."
      />
    </DocSection>
  );
}

export const DOC_SECTIONS: DocEntry[] = [
  { id: "primeros-pasos", label: "Primi passi", Content: Basics },
  { id: "consultas", label: "Richieste", Content: Inquiries },
  { id: "clientes", label: "Clienti", Content: Clients },
  { id: "propiedades", label: "Immobili", Content: Properties },
  { id: "propietarios", label: "Proprietari", Content: Owners },
  { id: "importar", label: "Importare immobili", adminOnly: true, Content: Importer },
  { id: "ofertas", label: "Offerte", Content: Offers },
  { id: "reservas", label: "Prenotazioni", Content: Bookings },
  { id: "disponibilidad", label: "Disponibilità", Content: Availability },
  { id: "servicios", label: "Servizi", Content: Services },
  { id: "portal", label: "Sito web", adminOnly: true, Content: Portal },
  { id: "lo-que-ven-tus-clientes", label: "Cosa vedono i tuoi clienti", Content: ClientPages },
  { id: "equipo", label: "Team", adminOnly: true, Content: Team },
  { id: "configuracion", label: "Impostazioni", adminOnly: true, Content: SettingsDoc },
  { id: "perfil", label: "Il mio profilo", Content: Profile },
  { id: "atajos", label: "Ricerca, scorciatoie e assistenza", Content: Shortcuts },
];
