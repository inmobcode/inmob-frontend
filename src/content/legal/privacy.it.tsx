import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LegalTable } from "@/components/legal/legal-table";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, privacyEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Usiamo i tuoi dati per fornirti il servizio, fatturarlo, mantenerlo sicuro e avvisarti di ciò che conta. Non vendiamo dati né mostriamo pubblicità.",
  "I dati dei clienti e dei proprietari che un’agenzia inserisce sono di quell’agenzia: è lei a decidere come usarli e noi li trattiamo per suo conto.",
  "Lavoriamo con fornitori di infrastruttura e di email che possono trovarsi fuori dall’Argentina, con contratti che proteggono i tuoi dati.",
  "Puoi chiederci accesso, rettifica o cancellazione dei tuoi dati scrivendo a " +
    privacyEmail +
    ". L’accesso è gratuito.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "responsable",
    title: "Chi è responsabile dei tuoi dati",
    brief:
      "Per i dati della tua agenzia e di chi ci visita siamo titolari noi; per quelli dei suoi clienti lo è l’agenzia, e noi li trattiamo per suo conto.",
    content: (
      <>
        <p>
          Questa Informativa spiega come {name}, CUIT {taxId}, con sede in{" "}
          {address} («Tivvo», «noi»), tratta i dati personali quando usi
          tivvo.app, i suoi sottodomini e i siti delle agenzie pubblicati con
          Tivvo. Si applica ai sensi della Legge argentina 25.326 sulla
          protezione dei dati personali, del relativo Decreto attuativo
          1558/2001 e delle norme dell’Agenzia di accesso all’informazione
          pubblica (AAIP).
        </p>
        <p>Tivvo ha due ruoli diversi a seconda di chi siano i dati:</p>
        <ul>
          <li>
            <strong>Siamo titolari</strong> dei dati delle agenzie e dei loro
            utenti (account, fatturazione, uso del sistema), di chi richiede una
            demo o ci scrive, e di chi visita tivvo.app.
          </li>
          <li>
            <strong>Trattiamo dati per conto di ciascuna agenzia</strong> quando
            si tratta dei suoi clienti, interessati, ospiti e proprietari. In
            questo caso la titolare è l’agenzia, e noi agiamo come fornitore di
            servizi di trattamento (articolo 25 della Legge 25.326): seguiamo le
            sue istruzioni e non usiamo quei dati per fini propri.
          </li>
        </ul>
        <p>
          Se hai lasciato i tuoi dati sul sito di un’agenzia, hai ricevuto
          un’offerta o hai una prenotazione, a decidere sui tuoi dati è quella
          agenzia. Conviene scrivere prima a lei; se scrivi a noi, le
          inoltriamo la tua richiesta.
        </p>
      </>
    ),
  },
  {
    id: "datos-que-tratamos",
    title: "Quali dati trattiamo",
    brief:
      "Account, accesso, dati tecnici e comunicazioni; e, per conto di ciascuna agenzia, i dati dei suoi clienti. Non chiediamo dati sensibili.",
    content: (
      <>
        <h3>Se usi Tivvo in un’agenzia</h3>
        <ul>
          <li>
            <strong>Account:</strong> nome, email, password (conservata cifrata
            con un algoritmo di hash, mai in chiaro), ruolo e agenzia a cui
            appartieni.
          </li>
          <li>
            <strong>Accesso con Google o Apple:</strong> se lo scegli, riceviamo
            da quel fornitore il tuo nome, la tua email e un identificativo
            dell’account. Non riceviamo la tua password.
          </li>
          <li>
            <strong>Agenzia:</strong> nome, contatti, logo, impostazioni del sito
            e, nei piani a pagamento, i dati necessari per la fatturazione.
          </li>
          <li>
            <strong>Uso e dati tecnici:</strong> date di accesso, azioni
            rilevanti nel sistema, indirizzo IP, browser e log degli errori, che
            usiamo per la sicurezza e per risolvere problemi.
          </li>
          <li>
            <strong>Comunicazioni:</strong> ciò che ci scrivi via email o nel
            modulo di richiesta demo (nome, email, agenzia, dimensione del team e
            il tuo messaggio).
          </li>
        </ul>
        <h3>Dati che le agenzie inseriscono o ricevono con Tivvo</h3>
        <p>
          Per conto di ciascuna agenzia trattiamo i dati dei suoi clienti finali:
          nome, email, telefono, richieste e messaggi, note e cronologia,
          offerte, prenotazioni con date e numero di ospiti, pagamenti
          registrati, documenti allegati dall’agenzia e dati dei proprietari e
          dei loro immobili. Quali dati vengono inseriti dipende da ciascuna
          agenzia.
        </p>
        <p>
          Non chiediamo dati sensibili e chiediamo alle agenzie di non
          inserirli, salvo che la legge lo consenta e sia indispensabile.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Per cosa li usiamo",
    brief:
      "Per fornirti il servizio, fatturarlo, mantenerlo sicuro e avvisarti di ciò che conta. Non vendiamo dati né facciamo pubblicità per terzi.",
    content: (
      <>
        <p>Usiamo i dati di cui siamo titolari per:</p>
        <ol>
          <li>
            creare e gestire il tuo account e quello della tua agenzia, e
            permetterti di accedere;
          </li>
          <li>fornire il Servizio sottoscritto, con le sue funzioni e i suoi limiti;</li>
          <li>fatturare e incassare i piani a pagamento;</li>
          <li>
            inviarti avvisi operativi: sicurezza, cambi di password, nuove
            richieste, modifiche ai piani o a queste condizioni;
          </li>
          <li>darti assistenza e rispondere alle tue domande o alla tua richiesta di demo;</li>
          <li>proteggere il Servizio, rilevare abusi e prevenire frodi;</li>
          <li>
            capire come viene usato il Servizio per migliorarlo, con dati
            aggregati ogni volta che è possibile;
          </li>
          <li>
            inviarti novità sul prodotto, se non ti sei opposto (puoi
            disiscriverti da qualsiasi email);
          </li>
          <li>adempiere agli obblighi di legge, contabili e fiscali.</li>
        </ol>
        <p>
          I dati dei clienti finali li usiamo solo perché l’agenzia possa
          lavorarci: conservarli, mostrarli al suo team, pubblicare le sue
          offerte o prenotazioni su link privati e inviare, a nome dell’agenzia,
          le email di avviso e conferma di richieste, offerte e prenotazioni.
        </p>
        <p>
          Non vendiamo dati personali, non li usiamo per pubblicità di terzi e
          non prendiamo decisioni automatizzate che producano effetti giuridici
          sulle persone.
        </p>
      </>
    ),
  },
  {
    id: "bases",
    title: "Su quale base li trattiamo",
    brief:
      "Contratto, il tuo consenso o un obbligo di legge. I dati obbligatori di ogni modulo sono quelli di cui il servizio ha bisogno.",
    content: (
      <>
        <p>
          Trattiamo i tuoi dati perché sono necessari per il rapporto
          contrattuale con la tua agenzia (articolo 5, comma 2, lettera c della
          Legge 25.326), perché ci hai dato il tuo consenso (per esempio,
          inviando il modulo di richiesta demo) o perché una norma ci obbliga a
          conservarli (per esempio, i registri di fatturazione).
        </p>
        <p>
          I dati indicati come obbligatori in ogni modulo sono necessari per
          fornire il Servizio: se non li fornisci, non possiamo creare l’account
          o rispondere alla tua richiesta. Gli altri sono facoltativi.
        </p>
        <p>
          Quando trattiamo dati per conto di un’agenzia, è quell’agenzia a dover
          disporre di una base giuridica e, se necessario, del consenso dei suoi
          clienti.
        </p>
      </>
    ),
  },
  {
    id: "proveedores",
    title: "Con chi li condividiamo",
    brief:
      "Solo con i fornitori di cui abbiamo bisogno per operare, con contratti che proteggono i tuoi dati.",
    content: (
      <>
        <p>
          Condividiamo dati solo con i fornitori di cui abbiamo bisogno per far
          funzionare il Servizio, con contratti che impongono riservatezza,
          sicurezza e di usarli solo per fornirci il servizio:
        </p>
        <LegalTable
          columns={["Fornitore", "Per cosa lo usiamo"]}
          rows={[
            [
              "Supabase (su infrastruttura di Amazon Web Services)",
              "Database e archiviazione di foto e file.",
            ],
            [
              "Resend",
              "Invio delle email di sistema: avvisi, conferme e recupero password.",
            ],
            [
              "Fornitori di hosting dell’applicazione web",
              "Servono le pagine e ricevono i dati tecnici di ogni visita (indirizzo IP, browser).",
            ],
            ["Google e Apple", "Solo se scegli di accedere con il loro account."],
          ]}
        />
        <p>
          Inoltre, i dati vengono mostrati a chi di dovere a seconda di come usi
          il Servizio: il team della tua agenzia vede i dati dell’agenzia, e chi
          riceve un link di offerta, prenotazione o portale del proprietario ne
          vede il contenuto.
        </p>
        <p>
          Possiamo comunicare dati se lo ordina un giudice o un’autorità
          competente, o se è necessario per difendere i nostri diritti. Se Tivvo
          si fonde o viene acquisita, i dati saranno trasferiti al nuovo
          soggetto, che dovrà rispettare questa Informativa.
        </p>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "Trasferimenti internazionali",
    brief:
      "Alcuni fornitori sono fuori dall’Argentina; i trasferimenti avvengono con garanzie equivalenti a quelle di legge.",
    content: (
      <>
        <p>
          Alcuni dei nostri fornitori ospitano o trattano dati fuori
          dall’Argentina, tra cui negli Stati Uniti e nell’Unione europea.
          L’Unione europea è riconosciuta dall’AAIP come destinazione con un
          livello di protezione adeguato; per gli altri paesi, i trasferimenti
          avvengono in base a clausole contrattuali che offrono garanzie
          equivalenti a quelle della Legge 25.326, in linea con i modelli
          approvati dalla Disposizione 60-E/2016 e dalla Risoluzione 198/2023
          dell’AAIP.
        </p>
        <p>
          Usando il Servizio, e ai sensi dell’articolo 12 della Legge 25.326,
          presti il tuo consenso a questi trasferimenti. Se vuoi saperne di più
          sulle garanzie che applichiamo, scrivici.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    title: "Per quanto tempo li conserviamo",
    brief:
      "Ogni dato ha il suo termine: da 30 giorni nel cestino a 10 anni per la fatturazione.",
    content: (
      <LegalTable
        columns={["Quali dati", "Per quanto li conserviamo"]}
        rows={[
          [
            "Dati dell’account e dell’agenzia",
            "Finché l’account è attivo. Se viene chiuso, restano disponibili per l’esportazione per 30 giorni e poi vengono cancellati; i backup vengono sovrascritti entro un termine non superiore a 90 giorni.",
          ],
          [
            "Elementi eliminati nel sistema",
            "30 giorni nel cestino, dove si possono recuperare; poi vengono cancellati definitivamente.",
          ],
          [
            "Dati di fatturazione",
            "10 anni, come richiede l’articolo 328 del Codice civile e commerciale argentino per la documentazione contabile.",
          ],
          [
            "Log tecnici e di sicurezza",
            "Il tempo necessario per indagare sugli incidenti, in genere non più di 12 mesi.",
          ],
          [
            "Richieste di demo e domande",
            "Fino a 2 anni dall’ultimo contatto, o prima se ci chiedi di cancellarli.",
          ],
        ]}
      />
    ),
  },
  {
    id: "seguridad",
    title: "Come li proteggiamo",
    brief:
      "Cifratura, password con hash, dati separati per agenzia e permessi per ruolo. Se c’è un incidente, avvisiamo.",
    content: (
      <>
        <p>
          Applichiamo misure tecniche e organizzative seguendo le
          raccomandazioni della Risoluzione 47/2018 dell’AAIP, tra cui:
        </p>
        <ul>
          <li>
            cifratura delle comunicazioni (HTTPS/TLS) tra il tuo browser,
            l’applicazione e i nostri fornitori;
          </li>
          <li>password conservate con hash, mai leggibili;</li>
          <li>
            separazione dei dati per agenzia: ogni team accede solo al proprio
            spazio;
          </li>
          <li>permessi per ruolo all’interno di ogni agenzia;</li>
          <li>
            link privati di offerte, prenotazioni e proprietari generati con
            identificativi difficili da indovinare;
          </li>
          <li>
            backup e accesso limitato del personale ai dati di produzione.
          </li>
        </ul>
        <p>
          Nessun sistema è infallibile. Se rileviamo un incidente di sicurezza
          che riguarda dati personali, lo esaminiamo, adottiamo misure per
          contenerlo, lo comunichiamo alle agenzie interessate senza
          ingiustificato ritardo e, quando necessario, all’AAIP e alle persone
          interessate.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookie e archiviazione nel tuo browser",
    brief:
      "Solo quelli necessari al funzionamento del servizio: niente pubblicità né tracciamento di terzi.",
    content: (
      <>
        <p>
          Tivvo usa solo cookie e archiviazione locale necessari al
          funzionamento del Servizio. Non usiamo cookie pubblicitari né di
          tracciamento di terzi.
        </p>
        <LegalTable
          columns={["Cosa salva", "A cosa serve", "Quanto dura"]}
          rows={[
            [
              <>
                Sessione (<code>access_token</code>, <code>refresh_token</code>,{" "}
                <code>tivvo_user</code>)
              </>,
              "Mantengono la sessione aperta.",
              "Fino a 180 giorni o finché non esci.",
            ],
            [
              <>
                Preferenze (<code>sidebar_collapsed</code> e archiviazione
                locale)
              </>,
              "Ricordano se il menu è compresso, la vista scelta in ogni elenco e il tema chiaro o scuro.",
              "Il cookie del menu, fino a 1 anno; il resto, finché non lo cancelli dal browser.",
            ],
            [
              "Accesso con Google o Apple",
              "Durante l’accesso salviamo nella scheda la pagina a cui tornare.",
              "Si cancella al termine.",
            ],
          ]}
        />
        <p>
          Puoi cancellare o bloccare i cookie dal tuo browser. Se blocchi quelli
          di sessione, non potrai accedere al sistema. I siti pubblici delle
          agenzie non installano cookie di Tivvo.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    title: "I tuoi diritti e come esercitarli",
    brief:
      "Puoi chiedere accesso, rettifica, cancellazione o che smettiamo di scriverti; rispondiamo nei termini della tabella.",
    content: (
      <>
        <p>Come interessato hai diritto a:</p>
        <LegalTable
          columns={["Diritto", "Cosa puoi chiedere", "Termine di risposta"]}
          rows={[
            [
              "Accesso",
              "Sapere quali tuoi dati abbiamo, da dove provengono e per cosa li usiamo. È gratuito se lo chiedi a intervalli di almeno sei mesi, salvo che dimostri un interesse legittimo a farlo prima (articolo 14 della Legge 25.326).",
              "10 giorni di calendario",
            ],
            [
              "Rettifica, aggiornamento e cancellazione",
              "Che correggiamo dati inesatti o cancelliamo quelli che non è corretto conservare (articolo 16).",
              "5 giorni lavorativi",
            ],
            [
              "Opposizione alle comunicazioni commerciali",
              "Chiedere che smettiamo di inviarti novità, in qualsiasi momento (articolo 27).",
              "In qualsiasi momento",
            ],
            [
              "Revocare il consenso",
              "Quando il trattamento si basa su di esso, senza effetto retroattivo.",
              "In qualsiasi momento",
            ],
          ]}
        />
        <p>
          Per esercitarli, scrivi a{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          dall’email associata ai tuoi dati, indicando cosa chiedi. Se non
          possiamo verificare la tua identità, ti chiederemo un documento che la
          attesti. Puoi anche correggere la maggior parte dei tuoi dati dal tuo
          profilo.
        </p>
        <p>
          Se i tuoi dati sono stati inseriti da un’agenzia (per esempio, perché
          le hai inviato una richiesta), la richiesta va indirizzata a
          quell’agenzia; se arriva a noi, gliela inoltriamo entro 5 giorni
          lavorativi e la aiutiamo a rispondere.
        </p>
        <p>
          Se non rispondiamo nei termini o la risposta non ti soddisfa, puoi
          presentare reclamo all’Agenzia di accesso all’informazione pubblica su{" "}
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
    title: "Minori",
    brief: "Tivvo è uno strumento per maggiorenni.",
    content: (
      <p>
        Tivvo è uno strumento professionale per maggiori di 18 anni e non si
        rivolge ai minori. Se sai che un minore ci ha fornito i suoi dati senza
        autorizzazione, scrivici e li cancelleremo.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Modifiche a questa Informativa",
    brief: "Avvisiamo delle modifiche rilevanti con 30 giorni di anticipo.",
    content: (
      <p>
        Possiamo aggiornare questa Informativa per riflettere cambiamenti del
        Servizio o della legge. Se la modifica è rilevante, ti avvisiamo via
        email e all’interno del Servizio con almeno 30 giorni di anticipo. La
        data della versione vigente è indicata all’inizio di questa pagina.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Contatti",
    content: (
      <>
        <p>
          Per qualsiasi domanda sulla privacy scrivici a{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          o per posta a {address}.
        </p>
        <p className="border-l-2 border-line pl-4 text-sm text-quiet">
          L’AGENZIA DI ACCESSO ALL’INFORMAZIONE PUBBLICA, in qualità di Organo
          di controllo della Legge n. 25.326, ha il compito di gestire le
          denunce e i reclami presentati da chi sia leso nei propri diritti per
          il mancato rispetto delle norme vigenti in materia di protezione dei
          dati personali.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Informativa sulla privacy",
  metaDescription:
    "Quali dati personali tratta Tivvo, per cosa, con chi li condivide e come esercitare i tuoi diritti.",
  title: "Informativa sulla privacy",
  intro: (
    <>
      <p>
        Quali dati personali trattiamo, per cosa, con chi li condividiamo e come
        puoi accedervi, correggerli o chiederne la cancellazione.
      </p>
      <p>
        Questa traduzione è fornita per comodità. In caso di discrepanza,
        prevale la versione in spagnolo.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Termini e condizioni" },
  action: {
    href: `mailto:${privacyEmail}?subject=${encodeURIComponent("Richiesta sui miei dati personali")}`,
    label: "Esercitare i miei diritti",
    hint: `Scrivici a ${privacyEmail}: accesso, rettifica o cancellazione.`,
  },
};
