import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, jurisdiction, contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Tivvu è uno strumento con cui la tua agenzia gestisce immobili, clienti, offerte e prenotazioni, e pubblica il proprio sito. Non siamo parte delle operazioni che concludi con i tuoi clienti.",
  "I dati che inserisci appartengono alla tua agenzia. Li conserviamo e li trattiamo per fornirti il servizio, e puoi esportarli.",
  "La tua agenzia è responsabile del rispetto delle norme della sua attività: abilitazione, pubblicità veritiera, contratti di locazione e protezione dei dati dei suoi clienti.",
  "Puoi disdire il tuo piano quando vuoi, con lo stesso mezzo con cui l’hai sottoscritto. Ti avvisiamo con 30 giorni di anticipo se cambiano i prezzi o queste condizioni.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "quienes-somos",
    title: "Chi siamo e cosa regolano questi termini",
    brief:
      "Questi Termini, l’Informativa sulla privacy e le condizioni del tuo piano costituiscono l’intero accordo tra Tivvu e la tua agenzia.",
    content: (
      <>
        <p>
          I presenti Termini e condizioni (i «Termini») regolano l’accesso e
          l’uso di Tivvu, il gestionale per agenzie immobiliari disponibile su
          tivvu.app e sui suoi sottodomini (il «Servizio»). Il Servizio è
          fornito da {name}, CUIT {taxId}, con sede in {address} («Tivvu»,
          «noi»).
        </p>
        <p>
          I Termini costituiscono, insieme all’
          <LegalLink href="/privacy">Informativa sulla privacy</LegalLink> e
          alle condizioni del piano sottoscritto, l’intero accordo tra Tivvu e
          l’Agenzia. Se una condizione particolare del tuo piano (per esempio,
          un contratto Enterprise firmato) prevede qualcosa di diverso,
          prevale la condizione particolare.
        </p>
      </>
    ),
  },
  {
    id: "definiciones",
    title: "Definizioni",
    brief:
      "L’Agenzia è chi apre l’account, gli Utenti sono le persone che ci lavorano e i Clienti finali le persone i cui dati vengono inseriti.",
    content: (
      <ul>
        <li>
          <strong>Agenzia:</strong> la persona fisica o giuridica che crea un
          account su Tivvu per gestire la propria attività immobiliare.
        </li>
        <li>
          <strong>Utenti:</strong> le persone che l’Agenzia autorizza a usare
          il suo account (titolari, amministratori, agenti e altri ruoli).
        </li>
        <li>
          <strong>Clienti finali:</strong> le persone i cui dati l’Agenzia
          inserisce o riceve tramite il Servizio: interessati, acquirenti,
          inquilini, ospiti e proprietari.
        </li>
        <li>
          <strong>Dati dell’Agenzia:</strong> tutte le informazioni che
          l’Agenzia e i suoi Utenti inseriscono nel Servizio o ricevono tramite
          esso: immobili, foto, testi, tariffe, clienti, richieste, offerte,
          prenotazioni, pagamenti registrati e documenti.
        </li>
        <li>
          <strong>Sito dell’Agenzia:</strong> il sito pubblico che l’Agenzia
          crea con l’editor di Tivvu e che viene pubblicato su un sottodominio
          di Tivvu con il nome dell’Agenzia.
        </li>
      </ul>
    ),
  },
  {
    id: "aceptacion",
    title: "Accettazione e capacità",
    brief:
      "Usando Tivvu accetti questi Termini. Devi essere maggiorenne e avere la capacità di contrarre.",
    content: (
      <>
        <p>
          Creando un account, accedendo con Google o Apple o usando il Servizio,
          accetti questi Termini. Se non sei d’accordo, non usare il Servizio.
        </p>
        <p>
          Per creare un account devi avere più di 18 anni e la capacità di
          contrarre. Se lo crei per conto di una società o di un’altra persona,
          dichiari di avere poteri sufficienti per vincolarla; in tal caso,
          «tu» e «l’Agenzia» si riferiscono a quella società o persona.
        </p>
        <p>
          Questi Termini sono un contratto per adesione ai sensi degli articoli
          984 e seguenti del Codice civile e commerciale argentino. Li abbiamo
          scritti per essere compresi senza aiuto; se qualcosa non è chiaro,
          scrivici prima di accettarli.
        </p>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "Account, utenti e sicurezza",
    brief:
      "Tieni aggiornati i tuoi dati, non condividere le password e avvisaci se sospetti che qualcuno sia entrato nel tuo account.",
    content: (
      <>
        <p>
          L’Agenzia deve fornire informazioni veritiere e mantenerle
          aggiornate, in particolare l’email di contatto, perché è il mezzo con
          cui ti avvisiamo dei cambiamenti importanti.
        </p>
        <p>
          L’Agenzia decide chi accede al suo account e con quali permessi, e
          risponde di ciò che fanno i suoi Utenti all’interno del Servizio. Ogni
          Utente deve avere credenziali proprie: non condividere le password tra
          persone.
        </p>
        <p>
          Se sospetti che qualcuno abbia avuto accesso al tuo account senza
          autorizzazione, cambia la password e avvisaci subito a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "servicio",
    title: "Cosa include il Servizio",
    brief:
      "Cosa puoi fare dipende dal tuo piano. Possiamo cambiare funzioni; se ne togliamo una essenziale da un piano a pagamento, avvisiamo 30 giorni prima.",
    content: (
      <>
        <p>A seconda del piano, il Servizio permette, tra le altre cose, di:</p>
        <ul>
          <li>inserire e pubblicare immobili in vendita e in affitto breve;</li>
          <li>
            gestire clienti, richieste, offerte, prenotazioni, disponibilità,
            tariffe stagionali e pagamenti registrati;
          </li>
          <li>
            condividere offerte, prenotazioni e il portale del proprietario
            tramite link privati;
          </li>
          <li>creare e pubblicare il Sito dell’Agenzia;</li>
          <li>lavorare in team con ruoli e permessi.</li>
        </ul>
        <p>
          Tivvu migliora il Servizio in modo continuo: possiamo aggiungere,
          modificare o togliere funzioni. Se togliamo una funzione essenziale da
          un piano a pagamento, ti avvisiamo con almeno 30 giorni di anticipo e,
          se il cambiamento non ti va bene, puoi disdire il piano senza costi.
        </p>
        <p>
          Alcune funzioni possono essere offerte come «beta» o di prova. Sono
          fornite così come sono, possono cambiare senza preavviso ed è meglio
          non affidarvisi per attività critiche.
        </p>
      </>
    ),
  },
  {
    id: "rol-de-tivvu",
    title: "Tivvu non è parte delle tue operazioni",
    brief:
      "Tivvu è un software: non è un’agenzia immobiliare né un intermediario, e non gestisce né custodisce i tuoi incassi.",
    content: (
      <>
        <p>
          Tivvu è uno strumento software. Non è un’agenzia immobiliare, non
          agisce come mediatore né intermediario, non incassa per conto
          dell’Agenzia e non garantisce che un’operazione vada a buon fine.
          Vendite, affitti, prenotazioni, caparre, provvigioni e incassi sono
          accordi tra l’Agenzia, i suoi clienti e i proprietari.
        </p>
        <p>
          I pagamenti che l’Agenzia registra in Tivvu sono annotazioni per il
          proprio controllo; Tivvu non li gestisce né li custodisce. Le
          disponibilità sincronizzate con calendari esterni (per esempio
          tramite iCal) dipendono da quei servizi e possono avere ritardi:
          l’Agenzia deve confermare la disponibilità prima di chiudere una
          prenotazione.
        </p>
      </>
    ),
  },
  {
    id: "obligaciones-agencia",
    title: "Responsabilità dell’Agenzia",
    brief:
      "La tua agenzia risponde della sua abilitazione, della veridicità dei suoi annunci, dei suoi contratti, dei dati dei suoi clienti e delle sue tasse.",
    content: (
      <>
        <p>
          L’Agenzia è l’unica responsabile della propria attività e, in
          particolare:
        </p>
        <ul>
          <li>
            del rispetto delle norme sulla mediazione immobiliare che le si
            applicano (abilitazione, albi professionali e leggi di ciascuna
            giurisdizione in cui opera);
          </li>
          <li>
            che le informazioni su immobili, prezzi e condizioni siano
            veritiere, complete e aggiornate, come richiede la normativa a tutela
            dei consumatori (in Argentina, la Legge 24.240);
          </li>
          <li>
            dei contratti che stipula con clienti e proprietari, comprese le
            norme su locazioni e affitti brevi;
          </li>
          <li>
            del trattamento dei dati personali dei suoi Clienti finali secondo
            la legge applicabile (in Argentina, la Legge 25.326; vedi la sezione
            «Dati dell’Agenzia e dati personali»);
          </li>
          <li>
            di avere i diritti su foto, planimetrie, testi e marchi che pubblica,
            e il permesso dei proprietari di pubblicare i loro immobili;
          </li>
          <li>delle imposte e degli obblighi fiscali derivanti dalla sua attività.</li>
        </ul>
      </>
    ),
  },
  {
    id: "uso-aceptable",
    title: "Uso accettabile",
    brief:
      "Niente annunci falsi, spam, dati sensibili non necessari, scraping né tentativi di accedere ad account altrui.",
    content: (
      <>
        <p>Non è consentito usare il Servizio per:</p>
        <ul>
          <li>pubblicare immobili inesistenti, prezzi ingannevoli o contenuti illeciti;</li>
          <li>
            inviare comunicazioni commerciali non richieste o usare dati di
            contatto ottenuti senza una base giuridica;
          </li>
          <li>
            inserire dati sensibili (salute, origine razziale o etnica, opinioni
            politiche, convinzioni religiose, vita sessuale), salvo che la legge
            lo consenta e sia indispensabile;
          </li>
          <li>
            violare diritti di proprietà intellettuale, d’immagine o di
            riservatezza di terzi;
          </li>
          <li>
            tentare di accedere ad account o dati di altre agenzie, testare
            vulnerabilità senza autorizzazione, sovraccaricare l’infrastruttura o
            diffondere software dannoso;
          </li>
          <li>
            copiare il Servizio in modo automatizzato (scraping), decompilarlo o
            rivenderlo senza un accordo scritto con Tivvu.
          </li>
        </ul>
        <p>
          Se trovi una vulnerabilità, segnalacela a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>:
          la esaminiamo e ti rispondiamo.
        </p>
      </>
    ),
  },
  {
    id: "planes-y-pagos",
    title: "Piani, prezzi e pagamenti",
    brief:
      "Si fattura in anticipo e si rinnova automaticamente. Avvisiamo 30 giorni prima di cambiare i prezzi; se un pagamento non va a buon fine, hai 15 giorni per regolarizzarlo.",
    content: (
      <>
        <p>
          Tivvu offre un piano gratuito con limiti (per esempio, numero di
          immobili e di Utenti) e piani a pagamento. I prezzi, i limiti e le
          funzioni vigenti di ciascun piano sono pubblicati su{" "}
          <LegalLink href="/#planes">tivvu.app</LegalLink> o concordati per
          iscritto nel caso di piani su misura.
        </p>
        <ul>
          <li>
            I piani a pagamento si fatturano in anticipo su base mensile (o per
            il periodo concordato) e si rinnovano automaticamente finché
            l’Agenzia non li disdice.
          </li>
          <li>
            I prezzi pubblicati in dollari statunitensi possono essere pagati in
            pesos argentini al tasso di cambio indicato al momento del pagamento.
            Le imposte applicabili si aggiungono al prezzo salvo diversa
            indicazione.
          </li>
          <li>
            Se cambiamo il prezzo del tuo piano, ti avvisiamo via email con
            almeno 30 giorni di anticipo. Il nuovo prezzo si applica dal periodo
            successivo all’avviso; se non sei d’accordo, puoi disdire il piano
            prima che entri in vigore.
          </li>
          <li>
            Se un pagamento non viene accreditato, ti avvisiamo e hai 15 giorni
            di calendario per regolarizzarlo. Trascorso tale termine, possiamo
            passare l’account al piano gratuito o sospenderlo. La sospensione non
            comporta la cancellazione dei tuoi dati.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "baja",
    title: "Disdetta e diritto di recesso",
    brief:
      "Puoi disdire quando vuoi. Ha effetto alla fine del periodo pagato e non ci sono rimborsi proporzionali, salvo diversa disposizione di legge.",
    content: (
      <>
        <p>
          L’Agenzia può disdire il proprio piano in qualsiasi momento, senza
          motivarlo e senza penali, con lo stesso mezzo con cui l’ha
          sottoscritto o scrivendo a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
          Entro 24 ore ti inviamo, con lo stesso mezzo, un codice che identifica
          la tua richiesta di disdetta.
        </p>
        <p>
          La disdetta ha effetto alla fine del periodo già pagato: fino ad
          allora mantieni l’accesso al piano. Non effettuiamo rimborsi
          proporzionali di periodi già iniziati, salvo diversa disposizione di
          legge.
        </p>
        <p>
          Se sottoscrivi come consumatore ai sensi della Legge argentina 24.240,
          puoi recedere entro 10 giorni di calendario dalla sottoscrizione
          (articolo 34 di tale legge e articolo 1110 del Codice civile e
          commerciale), senza costi né responsabilità, e ti rimborsiamo quanto
          pagato. Questo diritto non si applica quando il Servizio è sottoscritto
          per essere integrato in un’attività commerciale o professionale, che è
          l’uso abituale di un’agenzia.
        </p>
      </>
    ),
  },
  {
    id: "datos-personales",
    title: "Dati dell’Agenzia e dati personali",
    brief:
      "I dati sono della tua agenzia e non li vendiamo. Dei dati dei tuoi clienti sei responsabile tu; noi li trattiamo per tuo conto.",
    content: (
      <>
        <p>
          I Dati dell’Agenzia appartengono all’Agenzia. Tivvu li usa solo per
          fornire, mantenere e migliorare il Servizio, darti assistenza e
          rispettare la legge; non li vende né li usa per contattare i tuoi
          clienti per conto proprio.
        </p>
        <p>
          Per quanto riguarda i dati personali dei Clienti finali, l’Agenzia è
          la titolare della banca dati e Tivvu agisce come fornitore di servizi
          che li tratta per suo conto, ai sensi dell’articolo 25 della Legge
          argentina 25.326. Di conseguenza, Tivvu:
        </p>
        <ul>
          <li>
            tratta tali dati solo per fornire il Servizio e secondo le istruzioni
            dell’Agenzia, che derivano da questi Termini e da come configura e
            usa il Servizio;
          </li>
          <li>
            non li comunica a terzi, salvo ai fornitori di cui ha bisogno per
            operare o quando un’autorità lo ordina;
          </li>
          <li>
            applica misure di sicurezza tecniche e organizzative ed esige
            riservatezza dal proprio personale e dai fornitori;
          </li>
          <li>
            avvisa l’Agenzia senza ingiustificato ritardo se rileva un incidente
            di sicurezza che riguarda i suoi dati;
          </li>
          <li>
            collabora con l’Agenzia per rispondere alle richieste di accesso,
            rettifica o cancellazione dei Clienti finali;
          </li>
          <li>
            al termine del Servizio, cancella tali dati nei tempi della sezione
            «Esportazione e cancellazione dei dati».
          </li>
        </ul>
        <p>
          L’Agenzia, da parte sua, garantisce di avere una base giuridica per
          inserire tali dati e di informare i suoi Clienti finali su come li
          tratta. L’<LegalLink href="/privacy">Informativa sulla privacy</LegalLink>{" "}
          spiega quali dati tratta Tivvu, con quali fornitori e in quali paesi.
        </p>
      </>
    ),
  },
  {
    id: "contenido",
    title: "Contenuti dell’Agenzia e licenza",
    brief:
      "I tuoi contenuti restano tuoi; ci dai solo il permesso di ospitarli e mostrarli mentre usi il Servizio.",
    content: (
      <>
        <p>
          L’Agenzia conserva tutti i suoi diritti su foto, testi, loghi e altri
          contenuti che carica. Ci concede una licenza non esclusiva, gratuita e
          limitata alla durata del Servizio per ospitare, copiare, adattare (per
          esempio, ridurre le dimensioni delle immagini) e mostrare tali
          contenuti, unicamente per fornire il Servizio e pubblicare il Sito
          dell’Agenzia.
        </p>
        <p>
          Se riceviamo un reclamo fondato secondo cui un contenuto viola diritti
          di terzi, possiamo rimuoverlo e te lo comunicheremo.
        </p>
      </>
    ),
  },
  {
    id: "sitio-y-links",
    title: "Sito dell’Agenzia e link condivisi",
    brief:
      "Il sito è della tua agenzia. I link privati li apre chiunque li abbia: inviali solo a chi di dovere.",
    content: (
      <>
        <p>
          Il Sito dell’Agenzia appartiene all’Agenzia: è lei a decidere cosa
          pubblicare ed è responsabile dei contenuti. Le richieste che arrivano
          dal sito, dalle schede degli immobili o dalle offerte vengono salvate
          nell’account dell’Agenzia, e Tivvu invia a suo nome le email di avviso
          e di conferma.
        </p>
        <p>
          Offerte, prenotazioni e portale del proprietario si condividono
          tramite link privati difficili da indovinare. Chiunque abbia il link
          può vederne il contenuto, quindi l’Agenzia deve inviarli solo alla
          persona interessata.
        </p>
        <p>
          Oggi il Sito dell’Agenzia è pubblicato su un sottodominio di Tivvu. Se
          l’Agenzia lascia il Servizio, il sito non è più disponibile.
        </p>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    title: "Proprietà intellettuale di Tivvu",
    brief:
      "Il software e il marchio Tivvu sono nostri; puoi usarli finché il tuo account è attivo.",
    content: (
      <p>
        Il software, il design, i modelli del sito, il marchio Tivvu e il suo
        logo appartengono a Tivvu o ai suoi licenzianti. Questi Termini non ti
        trasferiscono alcun diritto su di essi, oltre al permesso di usare il
        Servizio finché il tuo account è attivo. Se ci invii idee o
        suggerimenti, possiamo usarli liberamente per migliorare il Servizio,
        senza obbligo di compensarti.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "Servizi di terzi",
    brief:
      "Google, Apple e i calendari esterni sono regolati dalle proprie condizioni, e non rispondiamo per essi.",
    content: (
      <p>
        Il Servizio si integra con servizi di terzi, come l’accesso con Google o
        Apple o la sincronizzazione dei calendari delle piattaforme di affitto.
        Tali servizi sono regolati dai propri termini e politiche, e Tivvu non
        risponde del loro funzionamento né delle modifiche che apportano alle
        loro condizioni.
      </p>
    ),
  },
  {
    id: "disponibilidad",
    title: "Disponibilità e assistenza",
    brief:
      "Facciamo il ragionevole perché funzioni bene, senza garantire zero interruzioni. Assistenza via email nei giorni lavorativi.",
    content: (
      <>
        <p>
          Facciamo sforzi ragionevoli perché il Servizio sia disponibile e
          funzioni bene, ma non possiamo garantire che sia privo di interruzioni
          o errori. Quando possibile, programmiamo le manutenzioni in orari di
          basso utilizzo e le annunciamo in anticipo.
        </p>
        <p>
          Gestiamo domande e reclami via email a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>,
          nei giorni lavorativi dal lunedì al venerdì. Gli impegni di
          disponibilità o di tempi di risposta (accordi sul livello di servizio)
          esistono solo se concordati per iscritto, per esempio in un piano
          Enterprise.
        </p>
      </>
    ),
  },
  {
    id: "exportacion",
    title: "Esportazione e cancellazione dei dati",
    brief:
      "Ciò che elimini va nel cestino per 30 giorni. Se chiudi l’account, hai 30 giorni per esportare i tuoi dati.",
    content: (
      <>
        <p>
          Ciò che si elimina all’interno del Servizio va nel cestino, dove si
          può recuperare per 30 giorni; poi viene cancellato definitivamente.
        </p>
        <p>
          Se l’Agenzia disdice il proprio account o l’account viene chiuso per
          qualsiasi motivo, i Dati dell’Agenzia restano disponibili per
          l’esportazione per 30 giorni. Trascorso tale termine li cancelliamo
          dai nostri sistemi attivi, e i backup vengono sovrascritti nel loro
          ciclo normale, che non supera i 90 giorni. Conserviamo più a lungo solo
          ciò che la legge ci obbliga a conservare (per esempio, i registri di
          fatturazione) o, fino a un massimo di due anni, ciò che l’Agenzia ci
          autorizza espressamente a conservare, come consente l’articolo 25 della
          Legge argentina 25.326.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Sospensione e risoluzione da parte di Tivvu",
    brief:
      "Possiamo sospendere un account per gravi inadempimenti o rischi di sicurezza, avvisando prima salvo urgenza.",
    content: (
      <>
        <p>
          Possiamo sospendere o chiudere un account se l’Agenzia viola
          gravemente questi Termini, se l’uso dell’account mette a rischio la
          sicurezza del Servizio o di altre agenzie, o se un’autorità competente
          lo ordina. Salvo urgenza o impedimento legale, ti avvisiamo prima e ti
          diamo un termine ragionevole per risolvere il problema.
        </p>
        <p>
          Possiamo anche cessare di fornire il Servizio in generale, con un
          preavviso di almeno 90 giorni e rimborsando la parte proporzionale di
          quanto pagato in anticipo.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Limitazione di responsabilità",
    brief:
      "Non rispondiamo del lucro cessante né delle tue operazioni; il tetto è quanto hai pagato negli ultimi 12 mesi, con le eccezioni previste dalla legge.",
    content: (
      <>
        <p>
          Nei limiti consentiti dalla legge, Tivvu non risponde del lucro
          cessante, della perdita di opportunità commerciali né dei danni
          indiretti derivanti dall’uso o dall’impossibilità di usare il
          Servizio, né delle operazioni tra l’Agenzia, i suoi clienti e i
          proprietari.
        </p>
        <p>
          La responsabilità complessiva di Tivvu nei confronti dell’Agenzia per
          qualsiasi reclamo legato al Servizio è limitata all’importo che
          l’Agenzia ha pagato a Tivvu nei 12 mesi precedenti il fatto che dà
          origine al reclamo.
        </p>
        <p>
          Tali limiti non si applicano in caso di dolo o colpa grave di Tivvu, né
          limitano i diritti che le norme di ordine pubblico, come la Legge
          argentina 24.240, riconoscono ai consumatori.
        </p>
      </>
    ),
  },
  {
    id: "indemnidad",
    title: "Manleva",
    brief:
      "Se un terzo avanza pretese per ciò che pubblichi o per le tue operazioni, se ne fa carico la tua agenzia.",
    content: (
      <p>
        L’Agenzia manleverà Tivvu da qualsiasi pretesa di terzi (compresi
        Clienti finali, proprietari e autorità) derivante dai contenuti che
        pubblica, dalle operazioni che realizza o dalla violazione di questi
        Termini o della normativa applicabile alla sua attività, comprese le
        spese di difesa ragionevoli.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Modifiche a questi Termini",
    brief:
      "Avvisiamo delle modifiche rilevanti con 30 giorni di anticipo, e puoi disdire prima che entrino in vigore.",
    content: (
      <>
        <p>
          Possiamo aggiornare questi Termini. Se la modifica è rilevante, ti
          avvisiamo via email e all’interno del Servizio con almeno 30 giorni di
          anticipo rispetto alla sua entrata in vigore. Le modifiche richieste
          dalla legge o che ti avvantaggiano soltanto possono applicarsi prima.
        </p>
        <p>
          Se non sei d’accordo con la nuova versione, puoi disdire l’account
          prima che entri in vigore. Se continui a usare il Servizio dopo, si
          intende che l’accetti. La data della versione vigente è indicata
          all’inizio di questa pagina.
        </p>
      </>
    ),
  },
  {
    id: "ley-aplicable",
    title: "Legge applicabile e foro competente",
    brief:
      "Si applica la legge argentina. Prima proviamo a risolvere parlando; se sei un consumatore, puoi agire nel luogo di residenza.",
    content: (
      <>
        <p>
          Questi Termini sono regolati dalle leggi della Repubblica Argentina.
          In caso di controversia, cercheremo prima di risolverla in buona fede;
          scrivici a{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
        <p>
          In mancanza di accordo, saranno competenti i tribunali ordinari di{" "}
          {jurisdiction}. Se hai sottoscritto come consumatore, puoi presentare
          il tuo reclamo davanti ai tribunali del tuo luogo di residenza e alle
          autorità di tutela dei consumatori (a livello nazionale in Argentina,
          tramite{" "}
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
    title: "Contatti",
    content: (
      <p>
        Per qualsiasi domanda su questi Termini scrivici a{" "}
        <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        Sede legale: {address}.
      </p>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Termini e condizioni",
  metaDescription:
    "Condizioni d’uso di Tivvu, il gestionale per agenzie di vendita e affitti brevi.",
  title: "Termini e condizioni",
  intro: (
    <>
      <p>
        Le regole per usare Tivvu: cosa facciamo noi, cosa spetta alla tua
        agenzia e cosa succede ai tuoi dati, ai tuoi pagamenti e al tuo account.
      </p>
      <p>
        Questa traduzione è fornita per comodità. In caso di discrepanza,
        prevale la versione in spagnolo.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/privacy", label: "Informativa sulla privacy" },
};
