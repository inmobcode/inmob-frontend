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
      title="Premiers pas"
      intro="Tivvo réunit en un seul endroit les demandes que vous recevez, vos clients, votre portefeuille de biens, les propositions que vous envoyez, les réservations et les disponibilités. Tout ce que vous publiez apparaît sur le site de votre agence."
    >
      <DocFigure
        src="/docs-media/fr/panel.webp"
        alt="Le tableau de bord Tivvo avec le menu latéral, la liste des biens et la carte de profil"
        width={1584}
        height={946}
        markers={[
          { x: 8.9, y: 11.6, label: "Le menu latéral : chaque outil du tableau de bord." },
          { x: 15.5, y: 4.7, label: "Replier ou déplier le menu (Ctrl/⌘ + B)." },
          { x: 15.1, y: 11.6, label: "Combien de demandes non lues vous avez." },
          { x: 33.1, y: 6, label: "La barre de la liste : recherche, tri, filtres, vues, corbeille et import." },
          { x: 87.6, y: 6, label: "Créer un nouvel élément." },
          { x: 14.7, y: 94.7, label: "La cloche des notifications." },
          { x: 8.8, y: 93.7, label: "Votre carte de profil : votre compte, l’apparence, l’aide et cette documentation." },
        ]}
      />

      <DocH3>Le menu latéral</DocH3>
      <DocP>
        Les outils suivent l’ordre de travail d’une agence : une <strong>demande</strong> arrive, devient un{" "}
        <strong>client</strong>, vous lui proposez des <strong>biens</strong> dans une <strong>offre</strong> et cela se
        termine par une <strong>réservation</strong>. Viennent ensuite <strong>Disponibilités</strong> et{" "}
        <strong>Services</strong>. Si vous êtes titulaire ou administrateur du compte, vous voyez aussi à la fin{" "}
        <strong>Site</strong>, <strong>Équipe</strong> et <strong>Paramètres</strong>.
      </DocP>
      <DocP>
        « Demandes » affiche un nombre quand vous avez des demandes non lues ; il se met à jour tout seul chaque minute.
        Vous pouvez replier le menu avec le bouton du haut ou avec <Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd> pour gagner de la
        place, et Tivvo se souvient de votre choix. Sur mobile, le menu s’ouvre depuis l’icône du haut.
      </DocP>

      <DocH3>Notifications</DocH3>
      <DocP>
        La cloche, à côté de votre nom, vous signale ce qui s’est passé pendant votre absence : une nouvelle demande, un
        client qui a ouvert une offre ou y a répondu, un paiement enregistré, une réservation et les tâches qui vous ont
        été attribuées. Le nombre indique combien d’alertes vous n’avez pas lues ; il se met à jour chaque minute.
      </DocP>
      <DocFigure
        src="/docs-media/fr/notificaciones.webp"
        alt="La liste des notifications avec de nouvelles demandes et une offre ouverte"
        width={760}
        height={982}
        className="max-w-sm"
        markers={[
          { x: 69.7, y: 8.1, label: "« Tout marquer comme lu » les marque comme lues." },
          { x: 50, y: 23.2, label: "Chaque alerte vous mène à l’élément concerné (la demande, l’offre, la réservation). Le point indique que vous ne l’avez pas lue." },
        ]}
      />
      <DocP>
        Pour supprimer une alerte, survolez-la et cliquez sur la croix à droite (sur mobile, la croix est toujours
        visible). Elle n’est supprimée que pour vous : le reste de l’équipe continue de voir la sienne, et elle ne peut pas
        être récupérée.
      </DocP>

      <DocH3>Votre carte de profil</DocH3>
      <DocP>
        Votre nom se trouve en bas du menu. En cliquant dessus, le menu de votre compte s’ouvre : votre profil, les
        paramètres, changer d’agence (si vous travaillez pour plusieurs), voir ou copier le lien de votre site,
        l’apparence, la langue, cette documentation, la recherche, les raccourcis clavier, l’aide et la déconnexion.
      </DocP>
      <DocFigure
        src="/docs-media/fr/menu-perfil.webp"
        alt="Le menu du compte ouvert depuis la carte de profil"
        width={640}
        height={1252}
        className="max-w-xs"
        markers={[
          { x: 50, y: 28.5, label: "Mon profil : vos informations et votre mot de passe." },
          { x: 50, y: 34.2, label: "Paramètres de l’agence (titulaires et administrateurs)." },
          { x: 50, y: 41.4, label: "Ouvrir ou copier le lien de votre site." },
          { x: 75, y: 55.3, label: "Apparence : claire, sombre ou automatique (suit votre ordinateur)." },
          { x: 50, y: 69.2, label: "Cette documentation, dans un autre onglet." },
          { x: 50, y: 74.9, label: "La recherche et, en dessous, les raccourcis clavier." },
          { x: 50, y: 86.4, label: "Aide et support : questions fréquentes et contact avec Tivvo." },
          { x: 50, y: 93.6, label: "Se déconnecter." },
        ]}
      />
      <DocTip>
        Si vous travaillez pour plusieurs agences, « Changer d’agence » apparaît dans ce menu. Chaque agence a ses propres
        données : en changeant, le tableau de bord se recharge avec celles de l’autre.
      </DocTip>

      <DocH3>Rôles</DocH3>
      <DocTerms
        items={[
          ["Titulaire", "Le propriétaire du compte. Il a accès à tout et ne peut pas être retiré de l’équipe."],
          [
            "Administrateur",
            "Comme le titulaire : voit tout, gère l’équipe, le site, les paramètres et l’import, et réattribue biens et clients.",
          ],
          [
            "Agent",
            "Ne voit que les biens qui lui sont attribués, ses offres et réservations, ses clients et les prospects non attribués. Ne voit pas Site, Équipe, Paramètres, Import ni le relevé de compte des propriétaires.",
          ],
        ]}
      />

      <DocH3>Ce qu’on retrouve partout dans le tableau de bord</DocH3>
      <DocTerms
        items={[
          [
            "Barre d’actions",
            "Dans les éditeurs, une barre avec Enregistrer, Publier et Annuler apparaît en haut. Quand quelque chose n’est pas enregistré, le bouton Enregistrer s’active. Ctrl/⌘ + S enregistre sans toucher la souris.",
          ],
          [
            "Vues",
            "Les listes peuvent s’afficher en grille, liste ou tableau (touches 1, 2 et 3). Tivvo mémorise la vue choisie dans chaque navigateur.",
          ],
          [
            "Recherche et filtres",
            "Chaque liste a une recherche et des filtres pour affiner ce que vous voyez. Chaque filtre indique combien d’éléments compte chaque option. « Retirer les filtres » affiche à nouveau tout.",
          ],
          [
            "Corbeille",
            "Ce que vous supprimez dans Biens, Offres et Réservations va dans la corbeille, rien ne disparaît. Les éléments y restent 30 jours au cas où vous changeriez d’avis ; ils sont ensuite définitivement effacés. Lors d’une suppression, l’avis en bas propose « Annuler ».",
          ],
          [
            "« Affiché sur le site » / « Interne uniquement »",
            "Chaque bloc d’un formulaire vous indique si ce que vous saisissez est vu par vos clients ou reste réservé à votre équipe.",
          ],
          [
            "Aide",
            "Le bouton avec le point d’interrogation, dans chaque outil, ouvre la partie de ce guide qui en parle.",
          ],
        ]}
      />

      <DocH3>La corbeille</DocH3>
      <DocP>
        Elle s’ouvre depuis l’icône de corbeille, dans la barre de Biens, Offres et Réservations. Un nombre sur l’icône
        indique combien d’éléments elle contient.
      </DocP>
      <DocFigure
        src="/docs-media/fr/papelera.webp"
        alt="La corbeille des biens avec un bien supprimé"
        width={1304}
        height={281}
        markers={[
          { x: 36.5, y: 87.1, label: "Quand vous l’avez supprimé et combien de jours il lui reste." },
          { x: 70.3, y: 82, label: "« Restaurer » le remet dans sa liste, tel qu’il était." },
          { x: 85.1, y: 82, label: "« Supprimer définitivement » l’efface tout de suite, sans attendre 30 jours. Nous demandons confirmation." },
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
      title="Demandes"
      intro="La boîte de réception de tout ce qu’on vous écrit depuis votre site, depuis la fiche d’un bien ou depuis une offre."
    >
      <DocFigure
        src="/docs-media/fr/consultas.webp"
        alt="La boîte des demandes avec une demande ouverte"
        width={1304}
        height={946}
        markers={[
          { x: 20.7, y: 7.4, label: "Toutes ou seulement les nouvelles, avec le nombre de non lues." },
          { x: 29, y: 7.4, label: "Tout marquer comme lu." },
          { x: 18.9, y: 13.5, label: "Recherchez par nom, e-mail, message, bien ou offre." },
          { x: 54.4, y: 21.7, label: "L’objet de la demande : le bien, l’offre ou une demande générale." },
          { x: 92.4, y: 8.6, label: "La remarquer comme nouvelle pour ne pas l’oublier." },
          { x: 47.7, y: 87.4, label: "Répondre par e-mail, WhatsApp ou appeler ; ou aller à la fiche du client." },
        ]}
      />

      <DocH3>Ce qui se passe quand une demande arrive</DocH3>
      <DocList>
        <li>Elle apparaît dans Demandes comme nouvelle et s’ajoute au nombre du menu latéral et à la cloche.</li>
        <li>
          Le client est créé, ou mis à jour s’il en existait déjà un avec cet e-mail. Une note dans son historique
          mentionne le bien ou l’offre concerné.
        </li>
        <li>
          L’agence reçoit une alerte par e-mail (à l’e-mail de contact des Paramètres ou, à défaut, aux titulaires et
          administrateurs) et le client reçoit une confirmation.
        </li>
      </DocList>

      <DocH3>Traiter la boîte</DocH3>
      <DocList>
        <li>
          À gauche se trouve la liste, regroupée en Aujourd’hui, Hier, Cette semaine et Plus anciennes ; à droite, la
          demande ouverte. Sur mobile elles alternent : touchez-en une pour la lire et la flèche pour revenir.
        </li>
        <li>Ouvrir une demande la marque comme lue. L’enveloppe en haut à droite la remarque comme nouvelle.</li>
        <li>Celles d’un client que vous avez déjà affichent son étape (Prospect, Contacté…) à côté du nom.</li>
        <li>
          Répondez en un clic : <strong>Répondre par e-mail</strong> (avec l’objet et la formule d’appel déjà écrits),{" "}
          <strong>WhatsApp</strong> (avec un message qui mentionne l’objet de la demande) ou <strong>Appeler</strong>.
          WhatsApp et Appeler apparaissent s’il a laissé un téléphone. L’icône à côté de l’e-mail le copie.
        </li>
        <li>Cliquez sur le bien ou l’offre pour l’ouvrir dans le tableau de bord, ou sur « Voir le client » pour aller à sa fiche.</li>
        <li>La boîte se met à jour toute seule chaque minute.</li>
      </DocList>
      <DocTip>
        Si aucune demande n’est encore arrivée, partagez le lien de votre site : le formulaire de contact et celui de chaque
        fiche arrivent ici.
      </DocTip>
    </DocSection>
  );
}

function Clients() {
  return (
    <DocSection
      id="clientes"
      icon={Users}
      title="Clients"
      intro="Votre carnet de contacts et leur suivi : à quelle étape en est chacun, ce qu’il cherche, ce qu’il faut faire avec lui et chaque échange."
    >
      <DocFigure
        src="/docs-media/fr/clientes-lista.webp"
        alt="La liste des clients en grille"
        width={1304}
        height={946}
        markers={[
          { x: 26.3, y: 6, label: "Recherchez par nom, e-mail ou téléphone." },
          { x: 63.6, y: 6, label: "Filtrez par étape." },
          { x: 89, y: 6, label: "Ajouter un client à la main." },
          { x: 77.3, y: 86.9, label: "L’étape de chaque client." },
          { x: 40.2, y: 72.8, label: "D’où il vient : site, offre ou saisie manuelle ; et depuis quand date la dernière activité." },
        ]}
      />

      <DocH3>Comment ils arrivent</DocH3>
      <DocList>
        <li>
          <strong>Saisie manuelle :</strong> « Nouveau client » avec nom, e-mail et téléphone.
        </li>
        <li>
          <strong>Depuis le site ou une offre :</strong> quand quelqu’un vous écrit, Tivvo crée le client (ou le reconnaît
          par son e-mail) et laisse une note dans son historique avec le bien ou l’offre concerné.
        </li>
      </DocList>

      <DocH3>Étapes</DocH3>
      <DocTerms
        items={[
          [<DocPill key="l" tone="amber">Prospect</DocPill>, "Vient d’arriver ; vous ne lui avez pas encore parlé."],
          [<DocPill key="c" tone="primary">Contacté</DocPill>, "Un premier contact a eu lieu."],
          [<DocPill key="n">En négociation</DocPill>, "Vous discutez d’une proposition concrète."],
          [<DocPill key="k" tone="primary">Client</DocPill>, "A conclu une transaction avec vous."],
          [<DocPill key="p">Perdu</DocPill>, "N’a pas abouti. Il apparaît en plus pâle dans la liste."],
        ]}
      />
      <DocP>
        Changez l’étape depuis le menu <strong>⋯</strong> de chaque client (« Changer d’étape ») ou depuis sa fiche. Ce même
        menu permet de voir la fiche, lui envoyer un e-mail, l’appeler ou copier son e-mail.
      </DocP>

      <DocH3>La fiche du client</DocH3>
      <DocFigure
        src="/docs-media/fr/clientes-ficha.webp"
        alt="La fiche d’un client avec notes, tâches et historique"
        width={1304}
        height={1651}
        markers={[
          { x: 4.6, y: 15.8, label: "Notes : ce qu’il faut retenir." },
          { x: 5, y: 34.3, label: "Tâches avec échéance ; celles en retard en rouge." },
          { x: 6.5, y: 58.2, label: "Historique : notes, appels, e-mails et rendez-vous." },
          { x: 82.4, y: 12.8, label: "Changer l’étape." },
          { x: 82.4, y: 17.6, label: "L’agent responsable." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Notes",
            "Ce qu’il faut retenir : ce qu’il cherche, budget, préférences. Accepte titres, gras, listes et liens. Quand vous modifiez quelque chose, « Enregistrer les notes » apparaît.",
          ],
          [
            "Tâches",
            "Ce qu’il reste à faire avec ce client : appeler, envoyer des photos, organiser une visite. Écrivez la tâche, choisissez une échéance facultative et cliquez sur +. Cochez la case une fois faite. Celles en retard s’affichent en rouge (« En retard de 2 jours »), et celles d’aujourd’hui et de demain l’indiquent.",
          ],
          [
            "Historique",
            "Choisissez le type (note, appel, e-mail ou rendez-vous), écrivez ce qui s’est passé et cliquez sur « Enregistrer ». Trié du plus récent au plus ancien, avec qui l’a saisi.",
          ],
          ["Étape", "Cliquez sur la nouvelle étape dans le panneau de droite ; elle s’enregistre immédiatement."],
          [
            "Responsable",
            "L’agent qui suit le client. Titulaires et administrateurs le choisissent dans la liste de l’équipe ; un agent peut cliquer sur « Le prendre » pour un prospect non attribué.",
          ],
          ["Contact", "Son e-mail et son téléphone, à un clic pour lui écrire ou l’appeler."],
        ]}
      />
      <DocTip>
        Une tâche supprimée ne passe pas par la corbeille : elle disparaît aussitôt. Si vous l’avez simplement terminée,
        cochez-la plutôt comme faite.
      </DocTip>
    </DocSection>
  );
}

function Properties() {
  return (
    <DocSection
      id="propiedades"
      icon={Building2}
      title="Biens"
      intro="Votre portefeuille : chaque maison, appartement, terrain ou location saisonnière que vous commercialisez, avec toutes ses données, photos, prix et disponibilités."
    >
      <DocH3>Ajouter un bien</DocH3>
      <DocSteps>
        <DocStep>
          Cliquez sur <strong>Nouveau bien</strong> (ou touche <Kbd>N</Kbd> dans la liste).
        </DocStep>
        <DocStep>
          Choisissez ce que vous allez en faire : <strong>Vente</strong> ou <strong>Location</strong>. Cela change les
          catégories disponibles et les sections de l’éditeur.
        </DocStep>
        <DocStep>Saisissez un titre et choisissez la catégorie (maison, appartement, villa, hôtel, terrain…).</DocStep>
        <DocStep>
          Cliquez sur <strong>Créer le bien</strong>. Il est créé en <DocPill tone="amber">Brouillon</DocPill> et
          l’éditeur s’ouvre pour compléter le reste.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/fr/propiedades-nueva.webp"
        alt="La fenêtre Nouveau bien"
        width={784}
        height={998}
        className="max-w-md"
        markers={[
          { x: 70.2, y: 31.4, label: "Vente ou location." },
          { x: 50, y: 48.8, label: "Le titre que voient vos clients." },
          { x: 50, y: 56.9, label: "La catégorie ; elle change selon vente ou location." },
          { x: 81.4, y: 92.6, label: "Crée le bien et ouvre l’éditeur." },
        ]}
      />
      <DocTip>
        Vos biens sont dans un autre système ? Utilisez <strong>Importer</strong> pour les récupérer tous d’un coup. Voir
        « Importer des biens » plus bas.
      </DocTip>

      <DocH3>Statuts</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Brouillon</DocPill>, "Seule votre équipe le voit. Idéal pendant que vous le complétez."],
          [<DocPill key="p" tone="primary">Publié</DocPill>, "Apparaît sur votre site et peut être ajouté aux offres."],
          [<DocPill key="a">Archivé</DocPill>, "N’est plus sur le marché, mais vous conservez toutes ses données. Il peut être republié."],
        ]}
      />

      <DocH3>La liste</DocH3>
      <DocFigure
        src="/docs-media/fr/propiedades-lista.webp"
        alt="La liste des biens en vue grille"
        width={1276}
        height={946}
        markers={[
          { x: 17, y: 6, label: "Recherche par titre, zone, région, pays ou propriétaire." },
          { x: 40.8, y: 6, label: "Tri : plus récents, plus anciens, prix ou titre." },
          { x: 49.3, y: 6, label: "Filtres (touche F)." },
          { x: 56.7, y: 6, label: "Vue tableau, liste ou grille." },
          { x: 64.2, y: 6, label: "Corbeille : ce qui a été supprimé ces 30 derniers jours." },
          { x: 71.9, y: 6, label: "Importer des biens depuis un autre système (titulaires et administrateurs)." },
          { x: 84.7, y: 6, label: "Nouveau bien (touche N)." },
          { x: 37.3, y: 69.3, label: "Le statut de chaque bien." },
        ]}
      />
      <DocList>
        <li>
          Chaque carte affiche la photo de couverture, la transaction et la catégorie, l’emplacement, le prix, les chambres,
          les salles de bain, la surface, le propriétaire et la date de dernière mise à jour.
        </li>
        <li>25 biens par page. En faisant défiler, la recherche reste en haut pour ne pas avoir à remonter.</li>
        <li>
          Depuis le menu <strong>⋯</strong> de chaque bien : modifier, le voir sur le site (s’il est publié), publier,
          dépublier, archiver, republier ou supprimer. L’icône de flèche ouvre aussi la fiche publique.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/fr/propiedades-filtros.webp"
        alt="Le panneau de filtres des biens"
        width={560}
        height={1604}
        className="max-w-xs"
        markers={[
          { x: 50.1, y: 3.8, label: "Statut, type et catégorie : vous pouvez en cocher plusieurs ; sans rien cocher, tout s’affiche." },
          { x: 50.1, y: 32.5, label: "Emplacement et propriétaire." },
          { x: 27.5, y: 53.3, label: "Fourchette de prix, dans la devise de votre choix." },
          { x: 50.1, y: 58.2, label: "Nombre minimum de chambres et de salles de bain." },
          { x: 17, y: 96, label: "Effacer remet tout à zéro." },
          { x: 62.2, y: 96, label: "Applique les filtres et indique combien de biens restent." },
        ]}
      />
      <DocP>Les filtres actifs apparaissent comme étiquettes au-dessus de la liste ; cliquez sur la croix d’une étiquette pour la retirer.</DocP>

      <DocH3>Actions groupées</DocH3>
      <DocP>
        En vue tableau, cochez plusieurs biens avec la case de chaque ligne (ou tous avec celle du haut). Une barre apparaît
        en bas pour les publier, dépublier, archiver ou supprimer ensemble. <Kbd>Esc</Kbd> efface la sélection.
      </DocP>
      <DocFigure
        src="/docs-media/fr/propiedades-lote.webp"
        alt="Deux biens sélectionnés et la barre d’actions groupées"
        width={1276}
        height={946}
        markers={[
          { x: 2.2, y: 30, label: "Cochez les biens." },
          { x: 47.9, y: 94.2, label: "La barre d’actions groupées." },
        ]}
      />

      <DocH3>L’éditeur</DocH3>
      <DocP>
        En haut se trouve la barre de l’éditeur, avec les sections regroupées : <strong>Informations générales</strong>,{" "}
        <strong>Médias</strong>, <strong>Location</strong> (locations uniquement), <strong>Gestion</strong> et{" "}
        <strong>Contact</strong>. Survolez (ou touchez) un groupe fléché pour voir ses sections. Enregistrez avec{" "}
        <strong>Enregistrer</strong> ou <Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd>. <strong>Publier</strong> enregistre et publie en
        une seule étape ; si le bien est déjà publié, le bouton devient <strong>Dépublier</strong>. Si vous tentez de
        quitter avec des modifications non enregistrées, nous vous prévenons.
      </DocP>
      <DocFigure
        src="/docs-media/fr/propiedades-editor.webp"
        alt="L’éditeur d’un bien sur la section Essentiel"
        width={1760}
        height={990}
        markers={[
          { x: 21.2, y: 5.1, label: "Retour à la liste des biens." },
          { x: 31.4, y: 5.1, label: "Les sections de l’éditeur, regroupées." },
          { x: 85.8, y: 5.1, label: "Aide, Annuler, Enregistrer et Publier ou Dépublier." },
          { x: 39.7, y: 46.5, label: "Le responsable : l’agent qui s’en occupe." },
          { x: 85.8, y: 27.8, label: "L’aperçu de la carte dans votre portefeuille, en direct pendant l’édition." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Essentiel",
            "Titre, nom privé (comment votre équipe l’appelle ; le client ne le voit jamais), responsable, transaction, catégorie, chambres, salles de bain, surfaces, places de parking, débarras, étages, année de construction et de rénovation, diagnostic énergétique. Pour les locations, aussi voyageurs et étoiles.",
          ],
          [
            "Emplacement",
            "Ce qui s’affiche (l’emplacement visible pour vos clients), où il se trouve (l’adresse exacte et le repère sur la carte, internes uniquement), l’environnement (caractéristiques de la zone et vues) et des liens (Google Maps, brochure PDF et site web).",
          ],
          [
            "Équipements",
            "Équipements généraux (la liste courte de la fiche : saisissez chacun puis Entrée), équipements intérieurs et extérieurs, piscines et jacuzzis avec type et dimensions, chambres par type, agencement des pièces, et services et conditions.",
          ],
          [
            "Contenu et services",
            "Le résumé (mis en avant en haut de la fiche) et la description, avec titres et listes. Pour les locations, aussi les services inclus dans le prix et les conditions de réservation et d’annulation.",
          ],
          [
            "Prix",
            "Prix de vente ou prix de base par nuit, et devise. Si vous le laissez vide, la fiche affiche « Prix sur demande ».",
          ],
          ["Photos", "Voir plus bas. Les modifications de cette section sont enregistrées immédiatement, sans cliquer sur Enregistrer."],
          [
            "Gestion",
            "Données internes : qui gère le bien au quotidien, le prestataire et la licence, la commission et s’il peut être commercialisé en dehors de votre site.",
          ],
          [
            "Recommandations",
            "Améliorations suggérées avec détail, coût estimé, priorité et statut (proposée, approuvée ou réalisée). Le propriétaire les voit sur sa page.",
          ],
          ["Chambres", "Hôtels uniquement, dans Gestion : les chambres de l’hôtel."],
          ["Propriétaire", "Le propriétaire du bien, son lien d’accès et son relevé de compte. Voir « Propriétaires »."],
        ]}
      />
      <DocP>
        Le <strong>responsable</strong> (dans Essentiel) détermine quel agent voit le bien : un agent ne travaille qu’avec
        les biens qui lui sont attribués. Titulaires et administrateurs le choisissent, et il s’enregistre dès le choix.
      </DocP>

      <DocH3>Emplacement</DocH3>
      <DocFigure
        src="/docs-media/fr/propiedades-ubicacion.webp"
        alt="La section Emplacement avec l’emplacement visible, l’adresse et la carte"
        width={1452}
        height={1100}
        markers={[
          { x: 26.9, y: 14.1, label: "Ce que voient vos clients : l’emplacement visible." },
          { x: 26.9, y: 40.2, label: "L’adresse exacte et le repère, pour votre équipe uniquement." },
          { x: 80.5, y: 48.2, label: "Recherchez l’adresse, cliquez sur la carte ou faites glisser le repère." },
        ]}
      />
      <DocP>
        Pour récupérer les coordonnées, vous pouvez aussi coller un lien Google Maps. L’adresse exacte n’est jamais
        affichée sur le site : vos clients ne voient que l’emplacement visible (par exemple « Majorque, Îles Baléares »).
      </DocP>

      <DocH3>Photos et vidéos</DocH3>
      <DocFigure
        src="/docs-media/fr/propiedades-fotos.webp"
        alt="La galerie photos d’un bien"
        width={1452}
        height={946}
        markers={[
          { x: 4.1, y: 16.3, label: "Ce que vous téléversez ici s’affiche sur le site et s’enregistre immédiatement." },
          { x: 66.9, y: 29, label: "Les sections de la galerie ; « Ajouter » en crée une nouvelle." },
          { x: 40.2, y: 46.6, label: "Faites glisser ou choisissez des photos : elles vont dans la section sélectionnée." },
          { x: 6, y: 64.3, label: "La photo de couverture." },
        ]}
      />
      <DocList>
        <li>
          Faites glisser les photos dans la zone ou cliquez pour les choisir (JPG, PNG, WebP ou HEIC). Elles sont
          optimisées automatiquement avant l’envoi.
        </li>
        <li>
          Les photos sont regroupées par section (Général, Chambres, Séjour, Piscine, Extérieur, Équipements
          supplémentaires, Vues ou une section à vous). Faites-les glisser pour les ordonner dans leur section, ou utilisez
          « Déplacer vers une autre section ».
        </li>
        <li>La première photo est la couverture. Pour la changer, utilisez « Mettre en couverture » sur une autre.</li>
        <li>Pour retirer une photo, cliquez sur la croix et confirmez d’un second clic.</li>
        <li>
          <strong>Filigrane :</strong> ajoute le logo de votre agence sur les photos publiées.
        </li>
        <li>
          <strong>Vidéos :</strong> collez des liens YouTube, Vimeo ou d’autres plateformes.
        </li>
      </DocList>

      <DocH3>Locations uniquement</DocH3>
      <DocTerms
        items={[
          [
            "Disponibilité",
            "Bloquez des dates à la main avec une note facultative. Les réservations confirmées bloquent leurs dates automatiquement. Pour éviter les doubles réservations, collez le lien iCal d’Airbnb ou Booking et cliquez sur « Synchroniser maintenant ». Si le bien est publié, vous avez aussi un lien pour exporter vos disponibilités vers ces plateformes.",
          ],
          [
            "Tarifs",
            "Périodes tarifaires (par exemple « Haute saison ») avec dates, prix officiel par nuit, séjour minimum, frais de gestion et commission de l’agence.",
          ],
        ]}
      />
      <DocFigure
        src="/docs-media/fr/propiedades-disponibilidad.webp"
        alt="La section Disponibilité d’une location"
        width={1452}
        height={625}
        markers={[
          { x: 23.3, y: 8.5, label: "Bloquer des dates à la main, avec une note facultative." },
          { x: 4.7, y: 48.4, label: "Les dates prises : « BOOKING » vient d’une réservation, « MANUAL » d’un blocage de votre part, que vous pouvez retirer." },
          { x: 23.3, y: 66.5, label: "Collez le lien iCal d’Airbnb ou Booking et synchronisez." },
          { x: 23.3, y: 82.7, label: "Votre calendrier, à ajouter sur ces plateformes." },
        ]}
      />
      <DocFigure
        src="/docs-media/fr/propiedades-tarifas.webp"
        alt="La section Tarifs avec trois saisons"
        width={1452}
        height={681}
        markers={[
          { x: 26.9, y: 10.5, label: "Une nouvelle période : libellé, dates, prix par nuit et séjour minimum." },
          { x: 14.6, y: 41, label: "Frais de gestion (10 % par défaut) et commission de l’agence (20 % par défaut), en %." },
          { x: 15, y: 90.3, label: "Les saisons enregistrées, avec leur prix et séjour minimum. « Retirer » en supprime une." },
        ]}
      />
      <DocTip>
        Pour voir tous vos biens en location dans un seul calendrier, utilisez <strong>Disponibilités</strong> dans le menu.
      </DocTip>

      <DocH3>Recommandations</DocH3>
      <DocFigure
        src="/docs-media/fr/propiedades-recomendaciones.webp"
        alt="La section Recommandations avec deux améliorations"
        width={1452}
        height={847}
        markers={[{ x: 10.8, y: 64.5, label: "Chaque amélioration avec son détail, son coût estimé et sa priorité." }]}
      />
      <DocP>
        Elles servent à proposer des améliorations au propriétaire : renouveler le mobilier, ajouter une borne de
        recharge… Chacune a une priorité (haute, moyenne ou basse) et un statut que vous faites évoluer : proposée,
        approuvée ou réalisée. Le propriétaire les voit sur sa page, sous « Améliorations suggérées ».
      </DocP>

      <DocTip>
        Complétez d’abord Essentiel, Emplacement, Prix et Photos : avec cela, la fiche s’affiche déjà bien sur votre site.
        Vous pourrez ajouter le reste au fil du temps.
      </DocTip>
    </DocSection>
  );
}

function Owners() {
  return (
    <DocSection
      id="propietarios"
      icon={KeyRound}
      title="Propriétaires"
      intro="Les propriétaires des biens que vous commercialisez. Chacun a une page privée où il suit ses biens, ses réservations et ce qui lui revient, sans identifiant ni mot de passe."
    >
      <DocH3>Attribuer un propriétaire</DocH3>
      <DocSteps>
        <DocStep>
          Dans l’éditeur du bien, ouvrez <strong>Contact</strong> → <strong>Propriétaire</strong>.
        </DocStep>
        <DocStep>Recherchez-le par nom, e-mail ou téléphone, ou cliquez sur « Nouveau propriétaire » pour le créer sur place.</DocStep>
        <DocStep>Enregistrez le bien. Un même propriétaire peut avoir plusieurs biens.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/fr/propietarios-asignar.webp"
        alt="La section Propriétaire avec un propriétaire attribué et son lien d’accès"
        width={1452}
        height={1111}
        markers={[
          { x: 24.9, y: 14.3, label: "Le propriétaire attribué ; « Retirer » le dissocie." },
          { x: 36.5, y: 38.4, label: "Copiez son lien personnel pour le lui envoyer." },
          { x: 47.6, y: 38.4, label: "Régénérer : le lien précédent cesse de fonctionner." },
          { x: 8.2, y: 46.4, label: "Son relevé de compte." },
        ]}
      />

      <DocH3>Relevé de compte</DocH3>
      <DocP>
        Sous l’accès se trouve le relevé de compte du propriétaire, avec tous ses biens réunis. Seuls les titulaires et
        administrateurs de l’agence le voient.
      </DocP>
      <DocFigure
        src="/docs-media/fr/propietarios-cuenta.webp"
        alt="Le relevé de compte d’un propriétaire avec l’encaissé, la commission, les versements et le solde"
        width={1100}
        height={1148}
        className="max-w-2xl"
        markers={[
          { x: 16.3, y: 18.1, label: "Ce qui a été encaissé sur les réservations de ses biens, sur le total réservé." },
          { x: 83.7, y: 18.1, label: "Ce qui lui revient : l’encaissé moins la commission." },
          { x: 50, y: 30.4, label: "Ce qu’il reste à lui verser." },
          { x: 50, y: 79.1, label: "Les versements : ce que vous lui avez déjà payé. La corbeille en supprime un." },
          { x: 17.5, y: 96.4, label: "Enregistrer un paiement au propriétaire." },
        ]}
      />
      <DocTerms
        items={[
          ["Encaissé", "La somme des paiements marqués comme encaissés sur ses réservations (acomptes et soldes)."],
          ["Commission", "La commission de l’agence sur ces réservations ; elle est déduite de l’encaissé."],
          ["Vous revient", "L’encaissé moins la commission."],
          ["Déjà versé", "La somme des versements que vous avez enregistrés."],
          ["Solde à verser", "Ce que vous lui devez encore. Si vous lui avez trop versé, cela s’affiche."],
          ["Par réservation", "Le détail de chaque réservation : dates, montant encaissé sur le total et commission."],
        ]}
      />
      <DocSteps>
        <DocStep>
          Cliquez sur <strong>Enregistrer un versement</strong>. Le solde restant et sa devise sont déjà renseignés.
        </DocStep>
        <DocStep>Ajustez le montant si nécessaire et choisissez la date.</DocStep>
        <DocStep>Indiquez le moyen (virement, espèces…) et une note si vous voulez, puis cliquez sur « Enregistrer ».</DocStep>
      </DocSteps>

      <DocH3>La page du propriétaire</DocH3>
      <DocP>
        Dans « Accès du propriétaire » se trouve son lien personnel : copiez-le et envoyez-le-lui. Il y voit ses biens et
        leur statut (publié ou non, avec le prix publié), le séjour en cours ou le prochain, les réservations avec leurs
        dates et paiements, son relevé de compte et les améliorations suggérées que vous avez saisies dans
        Recommandations. Un bouton lui permet de vous écrire par WhatsApp ou par e-mail.
      </DocP>
      <DocFigure
        src="/docs-media/fr/propietarios-pagina.webp"
        alt="La page du propriétaire avec le résumé de ses biens et son relevé de compte"
        width={1584}
        height={946}
        markers={[
          { x: 24, y: 38.9, label: "Combien de ses biens sont publiés." },
          { x: 50, y: 38.9, label: "Le séjour en cours ou le prochain." },
          { x: 75.2, y: 38.9, label: "Ce qui lui revient sur l’encaissé." },
          { x: 50, y: 66.1, label: "Son relevé de compte : les versements, le solde et le détail par réservation." },
          { x: 83.1, y: 4.2, label: "Un bouton pour vous écrire." },
        ]}
      />
      <DocP>
        Par défaut, le propriétaire <strong>ne voit pas votre commission</strong> : il voit ce qui lui revient, mais pas ce
        qui a été déduit. Pour la lui montrer, activez « Afficher la commission de l’agence » dans Paramètres.
      </DocP>
      <DocTip>
        Si le lien est arrivé chez la mauvaise personne, cliquez sur « Régénérer » : l’ancien cesse de fonctionner
        immédiatement.
      </DocTip>
    </DocSection>
  );
}

function Importer() {
  return (
    <DocSection
      id="importar"
      icon={Upload}
      title="Importer des biens"
      adminOnly
      intro="Récupérez votre portefeuille depuis un autre système en une seule fois : un CRM, un portail ou un tableur. Rien n’est enregistré tant que vous n’avez pas vérifié ce qui arrivera à chaque bien."
    >
      <DocP>
        Il s’ouvre depuis <strong>Importer</strong>, dans la barre de Biens. Le processus a quatre étapes : choisir d’où
        vous venez, apporter le fichier, indiquer à quoi correspond chaque colonne (tableurs uniquement) et vérifier.
      </DocP>

      <DocH3>1. Choisissez d’où vous migrez</DocH3>
      <DocFigure
        src="/docs-media/fr/importar-plataformas.webp"
        alt="La liste des plateformes depuis lesquelles migrer"
        width={1276}
        height={946}
        markers={[
          { x: 16.5, y: 18.6, label: "Cherchez votre système par nom ou pays." },
          { x: 52.6, y: 18.6, label: "Filtrez par CRM, portails ou agrégateurs." },
          { x: 35.8, y: 44, label: "Choisissez votre plateforme : nous vous montrons comment en extraire vos données." },
        ]}
      />
      <DocP>
        Il y a près de 50 plateformes (Idealista, Inmovilla, Kyero, CASAFARI, Resales Online, Witei, Apimo, Rightmove et
        bien d’autres), les plus utilisées en premier. Si la vôtre n’y est pas, vous pouvez utiliser plus bas un{" "}
        <strong>CSV ou Excel</strong>, un <strong>XML Kyero</strong> (le format exporté par la plupart des CRM) ou le{" "}
        <strong>XML Tivvo</strong>, si votre système a sa propre API.
      </DocP>

      <DocH3>2. Apportez vos données</DocH3>
      <DocFigure
        src="/docs-media/fr/importar-fuente.webp"
        alt="Le guide pour migrer depuis Idealista, avec la zone pour téléverser le fichier"
        width={1276}
        height={946}
        markers={[
          { x: 28.6, y: 22.6, label: "Les étapes pour extraire vos biens de cette plateforme." },
          { x: 10.8, y: 45.6, label: "Une autre voie, si votre plateforme vous fournit un CSV ou Excel." },
          { x: 28.6, y: 52.6, label: "Bloqué ? Nous préparons la demande à la plateforme ou nous vous aidons nous-mêmes." },
          { x: 70, y: 22.6, label: "Téléversez le fichier ou collez l’URL du flux." },
          { x: 77.9, y: 39.5, label: "Nous lisons le fichier ; rien n’est encore enregistré." },
        ]}
      />
      <DocList>
        <li>
          Suivez les étapes du guide de votre plateforme. Beaucoup demandent le flux via le support : dans « Bloqué ? »,
          cliquez sur <strong>Envoyer la demande par e-mail</strong> et votre messagerie s’ouvre avec le message déjà
          rédigé, ou copiez-le avec « Voir le message ».
        </li>
        <li>
          <strong>Téléverser un fichier :</strong> CSV ou Excel (.xlsx) jusqu’à 10 Mo et 3 000 lignes, ou XML jusqu’à 10
          Mo.
        </li>
        <li>
          <strong>Utiliser une URL :</strong> collez le lien public du flux. Nous le lisons une seule fois ; il ne reste pas
          synchronisé.
        </li>
        <li>
          Si vous partez de zéro, cliquez sur <strong>Télécharger le modèle CSV</strong> : il contient les colonnes que nous
          comprenons et une ligne d’exemple.
        </li>
        <li>« Demander de l’aide » vous permet de nous écrire avec le message déjà préparé : nous vous aidons à migrer.</li>
      </DocList>

      <DocH3>3. À quoi correspond chaque colonne</DocH3>
      <DocP>Tableurs uniquement (CSV ou Excel). Tivvo reconnaît seul la plupart des colonnes ; vérifiez les autres.</DocP>
      <DocFigure
        src="/docs-media/fr/importar-mapeo.webp"
        alt="L’étape pour associer chaque colonne du fichier à un champ Tivvo"
        width={1304}
        height={1132}
        markers={[
          { x: 49, y: 14.4, label: "Combien de lignes et de colonnes nous avons reconnues." },
          { x: 13.3, y: 27.2, label: "Les colonnes non reconnues apparaissent en premier, avec des exemples de votre fichier." },
          { x: 80.9, y: 27.2, label: "Choisissez le champ Tivvo correspondant, ou « Ne pas importer »." },
          { x: 13, y: 95.5, label: "Voir ce qui arrivera à chaque ligne, avant d’enregistrer." },
        ]}
      />
      <DocList>
        <li>Chaque champ provient d’une seule colonne : si vous le choisissez pour une autre, il est libéré de la précédente.</li>
        <li>Les colonnes sans correspondance sont ignorées. Une cellule vide n’efface jamais ce qui est déjà saisi.</li>
        <li>
          Associez une colonne de <strong>référence (ID)</strong> : ainsi, si vous réimportez le fichier, les biens sont mis
          à jour au lieu d’être dupliqués. S’il n’y en a pas, nous vous prévenons.
        </li>
      </DocList>

      <DocH3>4. Vérifiez et importez</DocH3>
      <DocFigure
        src="/docs-media/fr/importar-revision.webp"
        alt="L’aperçu de l’import avec le résumé et le détail par ligne"
        width={1304}
        height={853}
        markers={[
          { x: 9.4, y: 20.9, label: "Le résumé : nouveaux, à mettre à jour, inchangés, ignorés et en erreur. Cliquez sur l’un pour filtrer." },
          { x: 24.8, y: 31.2, label: "Les publier directement ou les laisser en brouillon." },
          { x: 30.2, y: 38.2, label: "Mettre à la corbeille ce qui n’est plus dans le fichier." },
          { x: 8.3, y: 49.3, label: "Ligne par ligne, avec ses avertissements, erreurs et ce qui change." },
          { x: 14.1, y: 94.1, label: "Ce n’est qu’ici que tout est enregistré." },
        ]}
      />
      <DocTerms
        items={[
          ["Nouveau", "N’était pas dans Tivvo : il est créé."],
          ["Mise à jour", "Vous l’aviez déjà importé (même référence) : ce qu’indique le détail change, par exemple prix ou photos."],
          ["Inchangé", "Il est déjà identique dans Tivvo."],
          ["Ignoré", "N’est pas importé, par exemple parce qu’il est en double dans le fichier."],
          ["En erreur", "Il manque quelque chose d’obligatoire, comme le titre. Le détail précise quoi."],
        ]}
      />
      <DocList>
        <li>
          <strong>Publier les nouveaux à l’importation :</strong> désactivé, ils restent en brouillon pour que vous les
          vérifiiez avant de les afficher sur votre site.
        </li>
        <li>
          <strong>Mettre à la corbeille ce qui n’est plus dans le fichier :</strong> ne concerne que les biens importés
          précédemment depuis cette même plateforme, et nous demandons confirmation. Ils peuvent être restaurés pendant 30
          jours.
        </li>
        <li>
          En cliquant sur <strong>Importer</strong>, Tivvo enregistre les biens et télécharge leurs photos. S’ils sont
          nombreux, cela peut prendre quelques minutes : ne fermez pas l’onglet. Si vous tentez de partir avant la fin,
          nous vous prévenons.
        </li>
      </DocList>
      <DocFigure
        src="/docs-media/fr/importar-listo.webp"
        alt="L’écran final de l’import avec le résumé et les erreurs"
        width={1100}
        height={415}
        className="max-w-2xl"
        markers={[
          { x: 50, y: 44.8, label: "Ce qui a été fait, avec le détail des erreurs." },
          { x: 39.5, y: 70, label: "Téléchargez les erreurs en CSV pour les corriger." },
          { x: 37.1, y: 82.4, label: "Vérifiez les brouillons ou voyez votre site ; « Importer un autre fichier » recommence." },
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
      title="Offres"
      intro="Des propositions personnalisées pour un client : une sélection de biens et de services à vos prix, présentée sur une page dédiée que le client ouvre depuis un lien."
    >
      <DocH3>Créer une offre</DocH3>
      <DocSteps>
        <DocStep>
          Cliquez sur <strong>Nouvelle offre</strong>, donnez-lui un titre (par exemple « Proposition pour la famille
          Pérez »), choisissez l’opération (vente, location ou les deux) et, si vous voulez, un code de référence.
          L’opération détermine les biens que vous pouvez ajouter.
        </DocStep>
        <DocStep>
          Dans <strong>Général</strong>, choisissez le client, la devise et si vous voulez afficher les prix et l’identité
          de votre agence (en-tête, pied de page et coordonnées).
        </DocStep>
        <DocStep>
          Dans <strong>Accueil</strong>, écrivez le message d’accueil : un titre, la date ou la saison et un message.
        </DocStep>
        <DocStep>
          Dans <strong>Biens</strong>, créez des sections (par exemple « Front de mer ») et ajoutez-y des biens.
        </DocStep>
        <DocStep>
          Dans <strong>Services</strong>, ajoutez des expériences de votre bibliothèque : chef, transferts, yacht…
        </DocStep>
        <DocStep>
          Cliquez sur <strong>Envoyer l’offre</strong> (si elle a un client) ou <strong>Publier le lien</strong> (sinon).
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/fr/ofertas-nueva.webp"
        alt="La fenêtre Nouvelle offre"
        width={784}
        height={838}
        className="max-w-md"
        markers={[
          { x: 50, y: 31.1, label: "Le titre." },
          { x: 50, y: 59, label: "Un code de référence facultatif, comme celui de votre système." },
          { x: 50, y: 48.6, label: "Vente, location ou les deux : détermine les biens que vous pouvez ajouter." },
        ]}
      />
      <DocFigure
        src="/docs-media/fr/ofertas-lista.webp"
        alt="La liste des offres"
        width={1304}
        height={946}
        markers={[
          { x: 24.2, y: 6, label: "Recherche par titre ou client." },
          { x: 51.5, y: 6, label: "Filtres par opération et statut." },
          { x: 89.3, y: 6, label: "Nouvelle offre." },
          { x: 7, y: 60.5, label: "Le statut : ici, le client l’a déjà ouverte." },
          { x: 17, y: 47.3, label: "Votre code de référence, si vous en avez mis un." },
        ]}
      />

      <DocH3>L’éditeur</DocH3>
      <DocFigure
        src="/docs-media/fr/ofertas-editor.webp"
        alt="L’éditeur d’une offre sur la section Général"
        width={1480}
        height={1100}
        markers={[
          { x: 14.4, y: 4.6, label: "Les sections : Général, Accueil, Biens et Services." },
          { x: 30.3, y: 37.1, label: "Le client qui la reçoit par e-mail." },
          { x: 16.4, y: 76.2, label: "Afficher ou masquer les prix." },
          { x: 18, y: 84.8, label: "Afficher votre logo, votre en-tête et vos coordonnées." },
          { x: 84.5, y: 25.4, label: "Le résumé, le lien pour le client et « Voir le client »." },
          { x: 89.9, y: 4.6, label: "Envoyer, renvoyer ou publier le lien." },
        ]}
      />
      <DocP>
        À droite, vous voyez le statut, le nombre de biens et de services et le total. En location il n’y a pas de total :
        ce sont des options au choix, avec un prix par nuit. Une fois envoyée ou publiée, le lien pour le client s’y trouve
        avec « Copier le lien ».
      </DocP>

      <DocH3>Ajuster le prix de chaque bien</DocH3>
      <DocFigure
        src="/docs-media/fr/ofertas-propiedades.webp"
        alt="La section Biens d’une offre avec les ajustements de prix ouverts"
        width={1480}
        height={1292}
        markers={[
          { x: 28.6, y: 12.4, label: "Chaque section avec son titre et un texte." },
          { x: 17.1, y: 33, label: "Prix spécial, remise et dépôt de garantie pour cette offre uniquement." },
          { x: 30.3, y: 50.4, label: "Un texte court sous le bien." },
        ]}
      />
      <DocP>
        « Afficher les ajustements » sur chaque bien permet de fixer un prix spécial pour cette offre, une remise
        (pourcentage ou montant fixe), un dépôt de garantie et un texte court comme « Ménage de fin de séjour inclus ». Le
        client voit l’ancien prix barré. Le prix du bien dans votre portefeuille ne change pas.
      </DocP>

      <DocH3>Services dans l’offre</DocH3>
      <DocFigure
        src="/docs-media/fr/ofertas-servicios.webp"
        alt="La section Services d’une offre avec un chef privé et un transfert"
        width={1480}
        height={814}
        markers={[
          { x: 8.7, y: 93.5, label: "Ajoutez un service de votre bibliothèque." },
          { x: 30.3, y: 9.9, label: "Ajustez prix, quantité, date et une note pour le client." },
          { x: 52.6, y: 43.7, label: "Le sous-total de chaque service." },
        ]}
      />
      <DocP>
        Les services viennent de votre bibliothèque (voir « Services »). En l’ajoutant à l’offre, vous pouvez changer le
        prix, la quantité (personnes, jours, nuits ou heures, selon la facturation), la date et laisser une note. Sans
        prix, le client voit « Sur demande ».
      </DocP>

      <DocH3>Envoyer ou partager</DocH3>
      <DocTerms
        items={[
          ["Avec client", "« Envoyer l’offre » lui envoie le lien par e-mail. Ensuite, vous pouvez utiliser « Renvoyer l’offre » quand vous voulez."],
          ["Sans client", "« Publier le lien » active la page et vous partagez le lien comme vous le souhaitez."],
          ["Copier le lien", "Disponible dans le panneau droit de l’éditeur et dans le menu ⋯ de chaque offre, une fois envoyée ou publiée."],
        ]}
      />
      <DocP>
        Si vous avez envoyé le lien vous-même (par WhatsApp, par exemple), utilisez « Marquer comme envoyée » dans le menu
        de l’offre. Quand le client l’ouvre, l’offre passe à « Vue » et vous recevez une notification. Depuis la page de
        l’offre, le client peut vous écrire : cette demande arrive dans Demandes.
      </DocP>

      <DocH3>Statuts</DocH3>
      <DocTerms
        items={[
          [<DocPill key="d" tone="amber">Brouillon</DocPill>, "Personne ne la voit encore."],
          [<DocPill key="s" tone="primary">Envoyée</DocPill>, "Le lien est actif et a été envoyé au client."],
          [<DocPill key="v">Vue</DocPill>, "Le client a déjà ouvert l’offre."],
          [<DocPill key="e">Expirée</DocPill>, "Sa date d’expiration est passée ; le client voit un avis indiquant qu’elle a expiré."],
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
      title="Réservations"
      intro="Chaque transaction conclue : une location avec ses dates ou une vente, avec le prix, la commission et le suivi des paiements."
    >
      <DocFigure
        src="/docs-media/fr/reservas-lista.webp"
        alt="La liste des réservations"
        width={1304}
        height={946}
        markers={[
          { x: 21.4, y: 6, label: "Recherchez par bien ou client." },
          { x: 44.8, y: 6, label: "Filtrez par statut ou par emplacement du bien." },
          { x: 87.5, y: 6, label: "Nouvelle réservation." },
          { x: 7, y: 40.5, label: "Le statut de chaque réservation." },
        ]}
      />

      <DocH3>Créer une réservation</DocH3>
      <DocSteps>
        <DocStep>
          Cliquez sur <strong>Nouvelle réservation</strong> et choisissez le bien.
        </DocStep>
        <DocStep>Attribuez le client (facultatif).</DocStep>
        <DocStep>Pour une location, choisissez les dates d’arrivée et de départ. Une vente n’a pas de dates.</DocStep>
        <DocStep>Saisissez le prix total et votre commission, puis cliquez sur « Créer la réservation ».</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/fr/reservas-nueva.webp"
        alt="La fenêtre Nouvelle réservation"
        width={784}
        height={839}
        className="max-w-md"
        markers={[
          { x: 50, y: 23.9, label: "Le bien." },
          { x: 50, y: 40, label: "Le client (facultatif)." },
          { x: 50, y: 55.3, label: "Arrivée et départ, locations uniquement." },
          { x: 72.9, y: 71.4, label: "Prix total et votre commission." },
        ]}
      />

      <DocH3>Statuts</DocH3>
      <DocTerms
        items={[
          [
            <DocPill key="p" tone="amber">En attente</DocPill>,
            "Tout juste créée, en attente de confirmation. Elle ne bloque pas encore les dates, mais apparaît en ambre dans Disponibilités.",
          ],
          [<DocPill key="c" tone="primary">Confirmée</DocPill>, "Elle est ferme et bloque ses dates."],
          [<DocPill key="o">Terminée</DocPill>, "Le séjour est fini ou la vente est conclue."],
          [<DocPill key="x">Annulée</DocPill>, "Elle n’aura pas lieu : les dates sont libérées. Les paiements enregistrés ne sont pas supprimés."],
        ]}
      />
      <DocP>
        Changez le statut depuis la fiche de la réservation ou depuis le menu ⋯ de la liste. Nous demandons confirmation
        avant d’annuler. « Supprimer » l’envoie à la corbeille.
      </DocP>

      <DocH3>La fiche de la réservation</DocH3>
      <DocFigure
        src="/docs-media/fr/reservas-ficha.webp"
        alt="La fiche d’une réservation avec le séjour, les paiements et le résumé"
        width={1304}
        height={1210}
        markers={[
          { x: 4.8, y: 21.5, label: "Les dates et le nombre de nuits." },
          { x: 58.1, y: 53.1, label: "Enregistrer un acompte, le solde ou votre commission." },
          { x: 56.2, y: 66.7, label: "Marquer un paiement comme encaissé." },
          { x: 82.4, y: 12, label: "Total, commission, encaissé et à encaisser." },
          { x: 82.4, y: 28.7, label: "La page que voit le client : copiez le lien ou ouvrez-la." },
          { x: 82.4, y: 40.5, label: "Confirmer, terminer ou annuler." },
        ]}
      />

      <DocH3>Paiements</DocH3>
      <DocP>
        « Ajouter un paiement » enregistre un <strong>acompte</strong>, le <strong>solde</strong> ou votre{" "}
        <strong>commission</strong>, dans la devise de la réservation. Chaque paiement reste en attente jusqu’à ce que vous
        le marquiez comme encaissé ; il garde alors la date. La barre montre combien a été encaissé sur le total.
      </DocP>
      <DocFigure
        src="/docs-media/fr/reservas-pago.webp"
        alt="La fenêtre Ajouter un paiement"
        width={700}
        height={575}
        className="max-w-sm"
        caption="Choisissez le type, saisissez le montant et enregistrez. Il reste en attente jusqu’à ce que vous le marquiez comme encaissé."
      />
      <DocP>
        Les paiements encaissés alimentent le relevé de compte du propriétaire : l’encaissé moins la commission correspond
        à ce qui lui revient.
      </DocP>

      <DocH3>La page du client</DocH3>
      <DocP>
        Chaque réservation a une page pour le client avec le bien, son séjour, le statut et les paiements (acomptes et
        solde, jamais la commission). Si la réservation a un client, il la reçoit par e-mail à la création, la confirmation
        ou l’annulation. Sinon, copiez le lien depuis la fiche ou le menu ⋯ et envoyez-le vous-même. Voir « Ce que voient
        vos clients ».
      </DocP>
    </DocSection>
  );
}

function Availability() {
  return (
    <DocSection
      id="disponibilidad"
      icon={CalendarCheck}
      title="Disponibilités"
      intro="Tous vos biens en location dans un seul calendrier : ce qui est libre et ce qui est occupé, pour répondre vite à une demande et bloquer des dates sans ouvrir chaque bien."
    >
      <DocP>
        Il y a deux vues, à choisir à droite : <strong>90 prochains jours</strong> (une grille avec une ligne par bien) et{" "}
        <strong>Mensuelle</strong> (un calendrier). Seuls les biens en location apparaissent.
      </DocP>

      <DocH3>90 prochains jours</DocH3>
      <DocFigure
        src="/docs-media/fr/disponibilidad-grilla.webp"
        alt="La grille de disponibilités des 90 prochains jours"
        width={1304}
        height={704}
        markers={[
          { x: 12.8, y: 20, label: "Recherchez un bien ou filtrez par emplacement." },
          { x: 69.1, y: 20, label: "Choisissez des dates pour voir quels biens sont libres." },
          { x: 88.5, y: 20, label: "90 prochains jours ou Mensuelle." },
          { x: 86.8, y: 8.1, label: "Le lien public de vos disponibilités, à partager." },
          { x: 34.4, y: 27.2, label: "Ce que signifie chaque couleur." },
          { x: 13, y: 48.9, label: "Chaque ligne est un bien ; cliquez sur le nom pour l’ouvrir." },
        ]}
      />
      <DocTerms
        items={[
          ["Vert", "Disponible."],
          ["Rouge", "Réservé ou bloqué."],
          ["Moitié-moitié", "Jour d’arrivée (occupé à partir de l’après-midi) ou de départ (occupé jusqu’au matin)."],
          ["Ambre", "Une réservation en attente : elle ne bloque pas encore les dates, mais elle a été demandée."],
          ["Gris", "Jours passés."],
        ]}
      />
      <DocList>
        <li>Les biens sont regroupés par région. Survolez un jour pour voir de quoi il s’agit.</li>
        <li>
          Quand vous choisissez des dates, ces jours sont mis en évidence et avec <strong>Libres uniquement</strong> il ne
          reste que les biens disponibles sur toute la période. « Effacer les dates » revient en arrière.
        </li>
        <li>25 biens sont affichés ; « Voir plus » charge les suivants.</li>
      </DocList>

      <DocH3>Mensuelle</DocH3>
      <DocFigure
        src="/docs-media/fr/disponibilidad-mes.webp"
        alt="Le calendrier mensuel avec l’occupation de chaque jour"
        width={1304}
        height={1298}
        markers={[
          { x: 6.4, y: 10.7, label: "Changer de mois ; « Aujourd’hui » revient au mois en cours." },
          { x: 67.9, y: 10.7, label: "Choisissez un bien pour voir ses réservations et bloquer des dates." },
          { x: 67.7, y: 52.5, label: "Combien de biens sont occupés cette nuit-là." },
          { x: 62.4, y: 54.9, label: "Lesquels : chaque bien avec sa couleur. Ceux en attente, avec une bordure pointillée." },
        ]}
      />
      <DocP>
        Avec <strong>Tous les biens</strong>, chaque jour indique combien sont occupés cette nuit-là (en rouge s’ils le sont
        tous) et lesquels, chacun toujours de la même couleur. Survolez pour voir la liste complète. En cliquant sur un
        jour, les biens occupés, en attente et libres apparaissent en dessous :
      </DocP>
      <DocFigure
        src="/docs-media/fr/disponibilidad-dia.webp"
        alt="Le détail d’un jour avec les biens occupés et libres"
        width={1100}
        height={234}
        className="max-w-2xl"
        markers={[
          { x: 25.5, y: 29.5, label: "Ce qui est occupé, en attente et libre ce jour-là." },
          { x: 45.7, y: 43, label: "« Voir le mois » ouvre le calendrier de ce bien ; le nom ouvre le bien." },
        ]}
      />

      <DocH3>Bloquer des dates depuis le calendrier</DocH3>
      <DocSteps>
        <DocStep>
          Dans la vue <strong>Mensuelle</strong>, choisissez le bien en haut à droite.
        </DocStep>
        <DocStep>
          Faites glisser sur les nuits libres à bloquer. Au clavier : <Kbd>Enter</Kbd> sur le premier jour puis{" "}
          <Kbd>Enter</Kbd> sur le dernier.
        </DocStep>
        <DocStep>
          Le résumé apparaît en dessous (« 4 nuits, du 25 oct. au 29 oct. »). Écrivez une note si vous voulez et cliquez
          sur <strong>Bloquer</strong>.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/fr/disponibilidad-bloquear.webp"
        alt="Le calendrier d’un bien avec quatre nuits marquées à bloquer"
        width={1304}
        height={1141}
        markers={[
          { x: 48.9, y: 89.2, label: "Les jours d’une réservation : arrivée, nuits occupées et départ." },
          { x: 8.7, y: 74.3, label: "Faites glisser sur les nuits libres pour les marquer." },
          { x: 23.5, y: 95.6, label: "Confirmez le blocage, avec une note facultative." },
        ]}
      />
      <DocP>
        Les nuits passées ou occupées ne peuvent pas être marquées. Le blocage apparaît aussi dans la section Disponibilité
        du bien, où vous pouvez le retirer.
      </DocP>

      <DocH3>Le lien à partager</DocH3>
      <DocP>
        « Copier le lien à partager » copie l’adresse de vos disponibilités publiques : la même grille de 90 jours, sur
        votre site, à vos couleurs. Pratique pour l’envoyer à un client ou à un confrère. Elle n’affiche que les biens
        publiés et pas les réservations en attente.
      </DocP>
    </DocSection>
  );
}

function Services() {
  return (
    <DocSection
      id="servicios"
      icon={Sparkles}
      title="Services"
      intro="Votre bibliothèque d’expériences et de services en plus. Vous les ajoutez une fois et les incluez dans n’importe quelle offre."
    >
      <DocFigure
        src="/docs-media/fr/servicios-lista.webp"
        alt="La bibliothèque de services"
        width={1304}
        height={946}
        markers={[
          { x: 20.9, y: 6, label: "Recherchez par nom, type ou zone." },
          { x: 88.6, y: 6, label: "Nouveau service." },
          { x: 73.1, y: 52.9, label: "Sans prix, « Sur demande » s’affiche." },
        ]}
      />

      <DocH3>Créer un service</DocH3>
      <DocSteps>
        <DocStep>
          Cliquez sur <strong>Nouveau service</strong> et choisissez le type : majordome, chef privé, yacht, transferts,
          voiture, excursions, spa, baby-sitter, ménage supplémentaire, événements ou autre.
        </DocStep>
        <DocStep>Donnez-lui un nom, une photo et une description : ce qui est inclus, la durée, pour combien de personnes.</DocStep>
        <DocStep>
          Définissez le prix et la facturation : par service, par personne, par jour, par nuit ou par heure. Sans prix,
          « Sur demande » s’affiche.
        </DocStep>
        <DocStep>Indiquez où il est proposé (vide signifie partout) et, si vous voulez, le prestataire.</DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/fr/servicios-editar.webp"
        alt="Le formulaire d’un service : photo, zones, prix, unité de facturation, prestataire et disponibilité"
        width={784}
        height={1628}
        className="max-w-md"
        markers={[
          { x: 50, y: 18.2, label: "La photo du service." },
          { x: 50, y: 51.9, label: "Les zones où il est proposé ; vide signifie partout." },
          { x: 78.7, y: 67.8, label: "La facturation : par service, personne, jour, nuit ou heure." },
          { x: 50, y: 71.9, label: "Le prestataire, pour votre équipe uniquement." },
          { x: 89.6, y: 95.9, label: "Disponible pour être ajouté à de nouvelles offres." },
        ]}
      />
      <DocList>
        <li>Cliquez sur un service de la liste pour le modifier ou le supprimer.</li>
        <li>Seule votre équipe voit le prestataire, jamais le client.</li>
        <li>Si vous désactivez « Disponible », le service ne peut plus être ajouté à de nouvelles offres, mais reste dans celles qui l’ont déjà.</li>
        <li>Dans chaque offre, vous pouvez ajuster prix, quantité et date du service pour ce client, et laisser une note.</li>
      </DocList>
    </DocSection>
  );
}

function Portal() {
  return (
    <DocSection
      id="portal"
      icon={Globe}
      title="Site web"
      adminOnly
      intro="Le site public de votre agence, où vos clients voient vos biens publiés et vous écrivent. Il est à vous : il porte votre nom, votre logo et vos couleurs."
    >
      <DocP>
        Il se modifie depuis <strong>Site</strong> dans le menu. L’éditeur occupe tout l’écran : les options à gauche, à
        droite un aperçu que vous pouvez voir en mode ordinateur ou mobile. Enregistrez pour publier les modifications ;
        si vous tentez de quitter avec des modifications non enregistrées, nous vous prévenons.
      </DocP>
      <DocFigure
        src="/docs-media/fr/portal-editor.webp"
        alt="L’éditeur du site sur l’onglet Mise en page, avec l’aperçu à droite"
        width={1760}
        height={990}
        markers={[
          { x: 14, y: 9.8, label: "Les onglets : Mise en page, Couverture, Blocs et Agence et contact." },
          { x: 5.4, y: 28.8, label: "Choisissez si vous configurez la version ordinateur ou mobile." },
          { x: 63.3, y: 3.5, label: "Voir l’aperçu en mode ordinateur ou mobile." },
          { x: 78.3, y: 3.5, label: "Voir le site publié." },
          { x: 92.1, y: 3.5, label: "Enregistrer les modifications publie ce que vous avez modifié." },
          { x: 66, y: 57.1, label: "L’aperçu, tel que le verront vos clients." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Mise en page",
            "Le modèle de la page d’accueil (Couverture, Éditorial, Compact, Partagé ou Mosaïque), qui peut être différent sur mobile ; la couleur des boutons et des liens (une de la palette ou une autre par son code, comme #1F5F4A) ; et la typographie (Moderne, Classique, Sobre, Élégante, Éditoriale, Chaleureuse, Urbaine ou Architecturale).",
          ],
          [
            "Couverture",
            "La photo principale (de préférence horizontale, d’au moins 1920 px de large) et, avec le modèle Mosaïque, les quatre photos du collage. Aussi le titre et le texte de la couverture.",
          ],
          [
            "Blocs",
            "Vos propres sections entre la couverture et la liste. Chacune a plusieurs mises en page et peut être masquée sans être supprimée.",
          ],
          [
            "Agence et contact",
            "Le texte sur votre agence, le téléphone, WhatsApp (active le bouton « Écrivez-nous sur WhatsApp »), Instagram et l’adresse de l’agence.",
          ],
        ]}
      />

      <DocH3>Types de blocs</DocH3>
      <DocFigure
        src="/docs-media/fr/portal-bloques.webp"
        alt="L’onglet Blocs avec trois blocs du site"
        width={896}
        height={1084}
        className="max-w-sm"
        markers={[
          { x: 36.7, y: 52.4, label: "Chaque bloc, avec son type et sa mise en page. Cliquez dessus pour le modifier." },
          { x: 66.7, y: 53.9, label: "Le masquer sans le supprimer." },
          { x: 81.9, y: 53.9, label: "Le monter ou le descendre." },
          { x: 89.5, y: 53.9, label: "Le supprimer." },
          { x: 49.9, y: 90.8, label: "Ajouter un nouveau bloc : vous choisissez le type, puis sa mise en page et son contenu." },
        ]}
      />
      <DocTerms
        items={[
          ["Emplacement", "Une zone avec photo, texte et ses biens. Mises en page : Mis en avant, Bannière ou Carrousel."],
          [
            "Promotion",
            "Des biens avec une étiquette comme « -15 % », avec une date de fin facultative. Mises en page : Bande de couleur, Bannière photo ou Carrousel.",
          ],
          ["Biens à la une", "Votre sélection : les nouveautés, en bord de mer, les plus demandés. Mises en page : Grille ou Carrousel."],
          ["Destinations", "Plusieurs zones à la fois, chacune avec sa photo. En touchant l’une d’elles, la liste se filtre. Mises en page : Mosaïque ou Carrousel."],
          [
            "Texte et image",
            "Racontez quelque chose de vous : vos services, estimations, votre façon de travailler. Image à gauche, à droite ou texte seul.",
          ],
          [
            "Appel à l’action",
            "Une invitation avec un bouton qui mène au formulaire de contact, à WhatsApp ou à la liste. Mises en page : Couleur ou Avec photo.",
          ],
        ]}
      />

      <DocH3>Agence et contact</DocH3>
      <DocFigure
        src="/docs-media/fr/portal-agencia.webp"
        alt="L’onglet Agence et contact de l’éditeur du site"
        width={896}
        height={1886}
        className="max-w-xs"
        caption="Le texte « À propos de votre agence » et les coordonnées qui apparaissent dans le pied de page et le bouton de contact du site."
      />
      <DocTip>
        Pour voir le résultat, utilisez « Voir la version publiée » dans l’éditeur ou « Voir mon site » dans le menu de votre
        profil.
      </DocTip>
    </DocSection>
  );
}

function ClientPages() {
  return (
    <DocSection
      id="lo-que-ven-tus-clientes"
      icon={Eye}
      title="Ce que voient vos clients"
      intro="Les pages publiques que génère Tivvo : votre site, la fiche de chaque bien, les offres, les réservations, la page du propriétaire et vos disponibilités. Aucune ne demande d’identifiant ni de mot de passe."
    >
      <DocH3>Votre site</DocH3>
      <DocFigure
        src="/docs-media/fr/portal-publico.webp"
        alt="Le site public d’une agence avec la couverture et la recherche"
        width={1584}
        height={946}
        caption="La couverture avec la recherche (opération, zone et type), vos blocs, la liste des biens publiés et le contact."
      />
      <DocList>
        <li>Il n’affiche que les biens publiés. Les fiches ont une galerie, une carte avec l’emplacement visible et un formulaire de demande.</li>
        <li>Les demandes du formulaire arrivent dans Demandes et créent le client.</li>
        <li>Vous le modifiez depuis Site (voir « Site web ») ; l’adresse, depuis Paramètres.</li>
      </DocList>

      <DocH3>L’offre</DocH3>
      <DocFigure
        src="/docs-media/fr/ofertas-cliente.webp"
        alt="La page d’une offre telle que la voit le client"
        width={1584}
        height={990}
        caption="L’accueil, les sections avec leurs biens (avec le prix spécial et l’ancien barré) et les services. En bas, un formulaire pour vous écrire."
      />

      <DocH3>La réservation</DocH3>
      <DocFigure
        src="/docs-media/fr/reservas-cliente.webp"
        alt="La page d’une réservation confirmée telle que la voit le client"
        width={1584}
        height={946}
        caption="Le statut, le bien, les dates et les paiements : total, payé et reste à payer. Elle n’affiche jamais votre commission."
      />

      <DocH3>Vos disponibilités</DocH3>
      <DocFigure
        src="/docs-media/fr/disponibilidad-publica.webp"
        alt="Les disponibilités publiques de l’agence"
        width={1584}
        height={946}
        caption="Les 90 prochains jours de vos locations publiées, avec recherche, emplacement et dates. Les réservations en attente n’apparaissent pas."
      />

      <DocH3>La page du propriétaire</DocH3>
      <DocP>Voir « Propriétaires ».</DocP>
    </DocSection>
  );
}

function Team() {
  return (
    <DocSection
      id="equipo"
      icon={UsersRound}
      title="Équipe"
      adminOnly
      intro="Les personnes qui travaillent dans votre agence sur Tivvo et ce que chacune peut faire."
    >
      <DocFigure
        src="/docs-media/fr/equipo.webp"
        alt="L’équipe de l’agence"
        width={1304}
        height={946}
        markers={[
          { x: 62.2, y: 6, label: "Filtrez par rôle." },
          { x: 88.1, y: 6, label: "Inviter quelqu’un." },
          { x: 11.7, y: 19.7, label: "Le rôle de chaque personne." },
        ]}
      />
      <DocSteps>
        <DocStep>
          Cliquez sur <strong>Inviter un membre</strong>, saisissez son nom et son e-mail et choisissez le rôle :
          administrateur ou agent.
        </DocStep>
        <DocStep>
          Il reçoit l’accès par e-mail. S’il avait déjà un compte Tivvo (par exemple dans une autre agence), nous l’ajoutons
          à votre équipe et il se connecte avec son mot de passe habituel.
        </DocStep>
      </DocSteps>
      <DocFigure
        src="/docs-media/fr/equipo-invitar.webp"
        alt="La fenêtre Inviter un membre"
        width={784}
        height={769}
        className="max-w-md"
        markers={[{ x: 50, y: 72.7, label: "Administrateur ou agent. Voir « Rôles » dans Premiers pas." }]}
      />
      <DocList>
        <li>Depuis le menu ⋯ de chaque personne, vous pouvez changer son rôle, copier son e-mail, désactiver son accès ou la retirer de l’équipe.</li>
        <li>
          <strong>Désactiver l’accès</strong> l’empêche de se connecter mais conserve sa place, ses biens et ses clients ;
          vous pouvez le réactiver quand vous voulez. Les personnes sans accès apparaissent à la fin.
        </li>
        <li>
          <strong>Retirer de l’équipe</strong> lui retire l’accès à cette agence. Son compte n’est pas supprimé : s’il
          appartient à une autre agence, il continue à s’y connecter.
        </li>
        <li>Le titulaire du compte ne peut être ni retiré ni changer de rôle.</li>
      </DocList>
    </DocSection>
  );
}

function SettingsDoc() {
  return (
    <DocSection
      id="configuracion"
      icon={Settings}
      title="Paramètres"
      adminOnly
      intro="Les informations de votre agence et les préférences de tout le compte."
    >
      <DocFigure
        src="/docs-media/fr/configuracion.webp"
        alt="La page Paramètres"
        width={1304}
        height={1486}
        markers={[
          { x: 6.1, y: 16.8, label: "Votre logo et le nom de l’agence." },
          { x: 30.4, y: 32.6, label: "L’adresse de votre site." },
          { x: 30.4, y: 39.1, label: "L’e-mail qui reçoit les alertes de demandes." },
          { x: 32.2, y: 51.8, label: "Si le propriétaire voit votre commission. Enregistré dès le changement." },
          { x: 30.4, y: 69.1, label: "Langue et devise par défaut." },
          { x: 89.8, y: 3.4, label: "Enregistrer ; à côté, des raccourcis pour copier, voir et personnaliser le site." },
        ]}
      />
      <DocTerms
        items={[
          [
            "Votre agence",
            "Le nom et le logo que voient vos clients. Cliquez sur le logo pour le changer ; il est téléversé aussitôt.",
          ],
          [
            "Site public",
            "L’adresse de votre site (minuscules, chiffres et tirets uniquement). Si vous la changez, l’ancien lien cesse de fonctionner : mettez-le à jour partout où vous l’avez partagé. Aussi l’e-mail de contact, qui reçoit les alertes de demandes.",
          ],
          [
            "Portail propriétaire",
            "« Afficher la commission de l’agence » : désactivé, le propriétaire voit ce qui lui revient mais pas ce qui a été déduit. Enregistré dès le changement, sans cliquer sur Enregistrer.",
          ],
          [
            "Préférences",
            "La langue du site (les liens que vous partagez s’ouvrent dans cette langue, et vos clients peuvent la changer depuis la page) et la devise par défaut des prix.",
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
      title="Mon profil"
      intro="Vos informations personnelles dans le compte de l’agence."
    >
      <DocFigure
        src="/docs-media/fr/perfil.webp"
        alt="La page Mon profil"
        width={1304}
        height={1321}
        markers={[
          { x: 6.1, y: 18.9, label: "Cliquez sur la photo pour la changer ; à côté, votre rôle." },
          { x: 30.4, y: 30.1, label: "Votre nom et votre e-mail ; enregistrés avec « Enregistrer », en haut." },
          { x: 30.4, y: 53, label: "Pour changer de mot de passe : l’actuel et le nouveau, deux fois." },
        ]}
      />
      <DocList>
        <li>La photo est téléversée aussitôt ; votre nom apparaît dans le menu et dans l’historique de vos clients.</li>
        <li>Le nouveau mot de passe doit comporter au moins 8 caractères. L’œil de chaque champ affiche ce que vous avez saisi.</li>
        <li>
          La langue du tableau de bord se change depuis le menu de votre profil, dans « Langue ». Elle est personnelle :
          chaque membre de l’équipe peut utiliser la sienne.
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
      title="Recherche, raccourcis et aide"
      intro="Pour parcourir tout le tableau de bord sans lâcher le clavier, et à qui vous adresser si vous êtes bloqué."
    >
      <DocH3>Recherche</DocH3>
      <DocP>
        <Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd> ouvre une recherche qui trouve pages, biens, offres et clients par leur nom. Vous
        pouvez aussi y créer un bien, une offre, un client ou une réservation, inviter quelqu’un dans l’équipe, ouvrir
        cette documentation, changer l’apparence, replier le menu et vous déconnecter.
      </DocP>
      <DocFigure
        src="/docs-media/fr/buscador.webp"
        alt="La recherche affichant des résultats pour « pérez »"
        width={960}
        height={347}
        className="max-w-lg"
        caption="Tapez une partie d’un nom et choisissez avec les flèches et Entrée. Esc la ferme."
      />

      <DocH3>Raccourcis</DocH3>
      <DocP>
        <Kbd>?</Kbd> affiche tous les raccourcis sur n’importe quel écran du tableau de bord.
      </DocP>
      <DocTerms
        items={[
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>K</Kbd></>, "Rechercher et exécuter des commandes"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>S</Kbd></>, "Enregistrer le formulaire ouvert"],
          [<><Kbd>Ctrl/⌘</Kbd> <Kbd>B</Kbd></>, "Replier ou déplier le menu latéral"],
          [<Kbd key="q">?</Kbd>, "Voir tous les raccourcis"],
          [
            <><Kbd>G</Kbd> puis une lettre</>,
            "Aller à une section : P biens, O offres, C clients, I demandes, R réservations, D disponibilités, E équipe, W site, S paramètres, M mon profil",
          ],
          [<Kbd key="n">N</Kbd>, "Créer un nouvel élément dans la liste ouverte"],
          [<Kbd key="s">/</Kbd>, "Aller à la recherche de la liste"],
          [<Kbd key="f">F</Kbd>, "Ouvrir les filtres"],
          [<><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd></>, "Vue grille, liste ou tableau"],
          [<><Kbd>J</Kbd> <Kbd>K</Kbd></>, "Descendre et monter entre les éléments ; Entrée ouvre l’élément sélectionné"],
          [<Kbd key="e">Esc</Kbd>, "Effacer la sélection"],
        ]}
      />

      <DocH3>Aide et support</DocH3>
      <DocP>
        Dans le menu de votre profil, <strong>Aide et support</strong> ouvre le centre d’aide : questions fréquentes avec
        recherche et un formulaire pour écrire à l’équipe Tivvo. Nous répondons par e-mail.
      </DocP>
      <DocFigure
        src="/docs-media/fr/ayuda.webp"
        alt="Le centre d’aide Tivvo"
        width={1584}
        height={946}
        caption="Recherchez votre question ; si vous ne la trouvez pas, écrivez-nous via le formulaire."
      />
    </DocSection>
  );
}

export const DOC_SECTIONS: DocEntry[] = [
  { id: "primeros-pasos", label: "Premiers pas", Content: Basics },
  { id: "consultas", label: "Demandes", Content: Inquiries },
  { id: "clientes", label: "Clients", Content: Clients },
  { id: "propiedades", label: "Biens", Content: Properties },
  { id: "propietarios", label: "Propriétaires", Content: Owners },
  { id: "importar", label: "Importer des biens", adminOnly: true, Content: Importer },
  { id: "ofertas", label: "Offres", Content: Offers },
  { id: "reservas", label: "Réservations", Content: Bookings },
  { id: "disponibilidad", label: "Disponibilités", Content: Availability },
  { id: "servicios", label: "Services", Content: Services },
  { id: "portal", label: "Site web", adminOnly: true, Content: Portal },
  { id: "lo-que-ven-tus-clientes", label: "Ce que voient vos clients", Content: ClientPages },
  { id: "equipo", label: "Équipe", adminOnly: true, Content: Team },
  { id: "configuracion", label: "Paramètres", adminOnly: true, Content: SettingsDoc },
  { id: "perfil", label: "Mon profil", Content: Profile },
  { id: "atajos", label: "Recherche, raccourcis et aide", Content: Shortcuts },
];
