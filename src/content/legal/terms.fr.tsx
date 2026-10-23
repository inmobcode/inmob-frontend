import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, jurisdiction, contactEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Tivvu est un outil qui permet à votre agence de gérer ses biens, clients, offres et réservations, et de publier son propre site. Nous ne sommes pas partie aux transactions que vous concluez avec vos clients.",
  "Les données que vous saisissez appartiennent à votre agence. Nous les stockons et les traitons pour vous fournir le service, et vous pouvez les exporter.",
  "Votre agence est responsable du respect des règles de son activité : carte professionnelle, publicité loyale, contrats de location et protection des données de ses clients.",
  "Vous pouvez résilier votre abonnement quand vous voulez, par le même moyen que celui utilisé pour souscrire. Nous vous prévenons 30 jours à l’avance si les prix ou ces conditions changent.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "quienes-somos",
    title: "Qui sommes-nous et ce que régissent ces conditions",
    brief:
      "Ces Conditions, la Politique de confidentialité et les conditions de votre offre forment l’accord complet entre Tivvu et votre agence.",
    content: (
      <>
        <p>
          Les présentes Conditions générales (les « Conditions ») régissent
          l’accès à Tivvu et son utilisation, le logiciel de gestion pour
          agences immobilières disponible sur tivvu.app et ses sous-domaines (le
          « Service »). Le Service est fourni par {name}, CUIT {taxId}, dont
          l’adresse est {address} (« Tivvu », « nous »).
        </p>
        <p>
          Les Conditions forment, avec la{" "}
          <LegalLink href="/privacy">Politique de confidentialité</LegalLink> et
          les conditions de l’offre que vous souscrivez, l’accord complet entre
          Tivvu et l’Agence. Si une condition particulière de votre offre (par
          exemple, un contrat Enterprise signé) prévoit autre chose, la
          condition particulière prévaut.
        </p>
      </>
    ),
  },
  {
    id: "definiciones",
    title: "Définitions",
    brief:
      "L’Agence est celle qui ouvre le compte, les Utilisateurs sont ceux qui y travaillent et les Clients finaux sont les personnes dont les données sont saisies.",
    content: (
      <ul>
        <li>
          <strong>Agence :</strong> la personne physique ou morale qui crée un
          compte Tivvu pour gérer son activité immobilière.
        </li>
        <li>
          <strong>Utilisateurs :</strong> les personnes que l’Agence autorise à
          utiliser son compte (titulaires, administrateurs, agents et autres
          rôles).
        </li>
        <li>
          <strong>Clients finaux :</strong> les personnes dont l’Agence saisit
          ou reçoit les données via le Service : prospects, acheteurs,
          locataires, voyageurs et propriétaires.
        </li>
        <li>
          <strong>Données de l’Agence :</strong> toutes les informations que
          l’Agence et ses Utilisateurs saisissent dans le Service ou reçoivent
          par son intermédiaire : biens, photos, textes, tarifs, clients,
          demandes, offres, réservations, paiements enregistrés et documents.
        </li>
        <li>
          <strong>Site de l’Agence :</strong> le site public que l’Agence
          construit avec l’éditeur de Tivvu et qui est publié sur un
          sous-domaine de Tivvu au nom de l’Agence.
        </li>
      </ul>
    ),
  },
  {
    id: "aceptacion",
    title: "Acceptation et capacité",
    brief:
      "En utilisant Tivvu, vous acceptez ces Conditions. Vous devez avoir plus de 18 ans et être capable de contracter.",
    content: (
      <>
        <p>
          En créant un compte, en vous connectant avec Google ou Apple, ou en
          utilisant le Service, vous acceptez ces Conditions. Si vous n’êtes pas
          d’accord, n’utilisez pas le Service.
        </p>
        <p>
          Pour créer un compte, vous devez avoir plus de 18 ans et la capacité
          de contracter. Si vous le créez au nom d’une société ou d’une autre
          personne, vous déclarez disposer des pouvoirs suffisants pour
          l’engager ; dans ce cas, « vous » et « l’Agence » désignent cette
          société ou cette personne.
        </p>
        <p>
          Ces Conditions constituent un contrat d’adhésion au sens des articles
          984 et suivants du Code civil et commercial argentin. Nous les avons
          rédigées pour qu’elles se comprennent sans aide ; si quelque chose
          n’est pas clair, écrivez-nous avant de les accepter.
        </p>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "Compte, utilisateurs et sécurité",
    brief:
      "Tenez vos informations à jour, ne partagez pas de mots de passe et prévenez-nous si vous soupçonnez un accès non autorisé.",
    content: (
      <>
        <p>
          L’Agence doit fournir des informations exactes et les tenir à jour,
          notamment l’e-mail de contact, car c’est par ce moyen que nous vous
          informons des changements importants.
        </p>
        <p>
          L’Agence décide qui accède à son compte et avec quelles autorisations,
          et répond des actions de ses Utilisateurs dans le Service. Chaque
          Utilisateur doit avoir ses propres identifiants : ne partagez pas de
          mots de passe entre personnes.
        </p>
        <p>
          Si vous soupçonnez qu’une personne a accédé à votre compte sans
          autorisation, changez le mot de passe et prévenez-nous immédiatement à{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
      </>
    ),
  },
  {
    id: "servicio",
    title: "Ce que comprend le Service",
    brief:
      "Ce que vous pouvez faire dépend de votre offre. Nous pouvons modifier des fonctionnalités ; si nous en retirons une essentielle d’une offre payante, nous prévenons 30 jours avant.",
    content: (
      <>
        <p>Selon l’offre souscrite, le Service permet notamment de :</p>
        <ul>
          <li>saisir et publier des biens à vendre et en location saisonnière ;</li>
          <li>
            gérer clients, demandes, offres, réservations, disponibilités,
            tarifs saisonniers et paiements enregistrés ;
          </li>
          <li>
            partager des offres, des réservations et le portail propriétaire au
            moyen de liens privés ;
          </li>
          <li>construire et publier le Site de l’Agence ;</li>
          <li>travailler en équipe avec des rôles et des autorisations.</li>
        </ul>
        <p>
          Tivvu améliore le Service en continu : nous pouvons ajouter, modifier
          ou retirer des fonctionnalités. Si nous retirons une fonctionnalité
          essentielle d’une offre payante, nous vous prévenons au moins 30 jours
          à l’avance et, si le changement ne vous convient pas, vous pouvez
          résilier l’offre sans frais.
        </p>
        <p>
          Certaines fonctionnalités peuvent être proposées en « bêta » ou à
          l’essai. Elles sont fournies en l’état, peuvent changer sans préavis et
          il est déconseillé de s’y appuyer pour des tâches critiques.
        </p>
      </>
    ),
  },
  {
    id: "rol-de-tivvu",
    title: "Tivvu n’est pas partie à vos transactions",
    brief:
      "Tivvu est un logiciel : ce n’est ni une agence immobilière ni un intermédiaire, et il ne traite ni ne détient vos encaissements.",
    content: (
      <>
        <p>
          Tivvu est un outil logiciel. Ce n’est pas une agence immobilière, il
          n’agit pas comme mandataire ni comme intermédiaire, n’encaisse pas au
          nom de l’Agence et ne garantit pas qu’une transaction aboutisse. Les
          ventes, locations, réservations, acomptes, commissions et encaissements
          sont des accords entre l’Agence, ses clients et les propriétaires.
        </p>
        <p>
          Les paiements que l’Agence enregistre dans Tivvu sont des écritures
          pour son propre suivi ; Tivvu ne les traite pas et ne les détient pas.
          Les disponibilités synchronisées avec des calendriers externes (par
          exemple via iCal) dépendent de ces services et peuvent présenter des
          retards : l’Agence doit confirmer la disponibilité avant de conclure
          une réservation.
        </p>
      </>
    ),
  },
  {
    id: "obligaciones-agencia",
    title: "Responsabilités de l’Agence",
    brief:
      "Votre agence répond de sa carte professionnelle, de l’exactitude de ses annonces, de ses contrats, des données de ses clients et de ses impôts.",
    content: (
      <>
        <p>
          L’Agence est seule responsable de son activité et, en particulier :
        </p>
        <ul>
          <li>
            du respect des règles de l’intermédiation immobilière qui lui sont
            applicables (carte professionnelle, ordres professionnels et lois de
            chaque juridiction où elle exerce) ;
          </li>
          <li>
            de l’exactitude, de l’exhaustivité et de la mise à jour des
            informations sur ses biens, prix et conditions, comme l’exige le
            droit de la consommation (en Argentine, la loi 24.240) ;
          </li>
          <li>
            des contrats qu’elle conclut avec ses clients et propriétaires, y
            compris les règles sur les baux et les locations saisonnières ;
          </li>
          <li>
            du traitement des données personnelles de ses Clients finaux
            conformément à la loi applicable (en Argentine, la loi 25.326 ; voir
            la section « Données de l’Agence et données personnelles ») ;
          </li>
          <li>
            de la détention des droits sur les photos, plans, textes et marques
            qu’elle publie, et de l’autorisation des propriétaires de publier
            leurs biens ;
          </li>
          <li>des impôts et obligations fiscales découlant de son activité.</li>
        </ul>
      </>
    ),
  },
  {
    id: "uso-aceptable",
    title: "Utilisation acceptable",
    brief:
      "Pas d’annonces fausses, de spam, de données sensibles inutiles, de scraping ni de tentatives d’accès aux comptes d’autrui.",
    content: (
      <>
        <p>Il est interdit d’utiliser le Service pour :</p>
        <ul>
          <li>publier des biens inexistants, des prix trompeurs ou des contenus illicites ;</li>
          <li>
            envoyer des communications commerciales non sollicitées ou utiliser
            des coordonnées obtenues sans base légale ;
          </li>
          <li>
            saisir des données sensibles (santé, origine raciale ou ethnique,
            opinions politiques, convictions religieuses, vie sexuelle), sauf si
            la loi le permet et que c’est indispensable ;
          </li>
          <li>
            porter atteinte aux droits de propriété intellectuelle, à l’image ou
            à la vie privée de tiers ;
          </li>
          <li>
            tenter d’accéder aux comptes ou données d’autres agences, tester des
            vulnérabilités sans autorisation, surcharger l’infrastructure ou
            diffuser des logiciels malveillants ;
          </li>
          <li>
            copier le Service de manière automatisée (scraping), en faire de
            l’ingénierie inverse ou le revendre sans accord écrit de Tivvu.
          </li>
        </ul>
        <p>
          Si vous découvrez une vulnérabilité, signalez-la à{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink> :
          nous l’examinons et vous répondons.
        </p>
      </>
    ),
  },
  {
    id: "planes-y-pagos",
    title: "Offres, prix et paiements",
    brief:
      "Facturé d’avance et renouvelé automatiquement. Nous prévenons 30 jours avant de changer les prix ; si un paiement échoue, vous avez 15 jours pour régulariser.",
    content: (
      <>
        <p>
          Tivvu propose une offre gratuite avec des limites (par exemple, nombre
          de biens et d’Utilisateurs) et des offres payantes. Les prix, limites
          et fonctionnalités en vigueur de chaque offre sont publiés sur{" "}
          <LegalLink href="/#planes">tivvu.app</LegalLink> ou convenus par écrit
          pour les offres sur mesure.
        </p>
        <ul>
          <li>
            Les offres payantes sont facturées d’avance chaque mois (ou pour la
            période convenue) et se renouvellent automatiquement jusqu’à ce que
            l’Agence les résilie.
          </li>
          <li>
            Les prix publiés en dollars américains peuvent être réglés en pesos
            argentins au taux de change indiqué au moment du paiement. Les taxes
            applicables s’ajoutent au prix sauf indication contraire.
          </li>
          <li>
            Si nous modifions le prix de votre offre, nous vous prévenons par
            e-mail au moins 30 jours à l’avance. Le nouveau prix s’applique à
            partir de la période suivant l’avis ; si vous n’êtes pas d’accord,
            vous pouvez résilier l’offre avant son entrée en vigueur.
          </li>
          <li>
            Si un paiement n’aboutit pas, nous vous prévenons et vous disposez de
            15 jours calendaires pour régulariser. Passé ce délai, nous pouvons
            basculer le compte sur l’offre gratuite ou le suspendre. Vos données
            ne sont pas supprimées du fait de la suspension.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "baja",
    title: "Résiliation et droit de rétractation",
    brief:
      "Vous pouvez résilier quand vous voulez. Cela prend effet à la fin de la période payée, sans remboursement au prorata, sauf disposition légale contraire.",
    content: (
      <>
        <p>
          L’Agence peut résilier son offre à tout moment, sans motif et sans
          pénalité, par le même moyen que celui utilisé pour souscrire ou en
          écrivant à{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
          Dans les 24 heures, nous vous envoyons, par le même moyen, un code
          identifiant votre demande de résiliation.
        </p>
        <p>
          La résiliation prend effet à la fin de la période déjà payée : jusque-là
          vous conservez l’accès à l’offre. Nous ne remboursons pas au prorata
          les périodes déjà commencées, sauf disposition légale contraire.
        </p>
        <p>
          Si vous souscrivez en tant que consommateur au sens de la loi
          argentine 24.240, vous pouvez vous rétracter dans les 10 jours
          calendaires suivant la souscription (article 34 de cette loi et
          article 1110 du Code civil et commercial), sans frais ni
          responsabilité, et nous vous remboursons ce que vous avez payé. Ce
          droit ne s’applique pas lorsque le Service est souscrit pour être
          intégré à une activité commerciale ou professionnelle, ce qui est
          l’usage habituel d’une agence.
        </p>
      </>
    ),
  },
  {
    id: "datos-personales",
    title: "Données de l’Agence et données personnelles",
    brief:
      "Les données appartiennent à votre agence et nous ne les vendons pas. Vous êtes responsable des données de vos clients ; nous les traitons pour votre compte.",
    content: (
      <>
        <p>
          Les Données de l’Agence appartiennent à l’Agence. Tivvu les utilise
          uniquement pour fournir, maintenir et améliorer le Service, vous
          assister et respecter la loi ; il ne les vend pas et ne les utilise pas
          pour contacter vos clients pour son propre compte.
        </p>
        <p>
          S’agissant des données personnelles des Clients finaux, l’Agence est
          responsable de la base de données et Tivvu agit comme prestataire
          traitant les données pour son compte, au sens de l’article 25 de la
          loi argentine 25.326. En conséquence, Tivvu :
        </p>
        <ul>
          <li>
            traite ces données uniquement pour fournir le Service et selon les
            instructions de l’Agence, qui découlent de ces Conditions et de la
            façon dont elle configure et utilise le Service ;
          </li>
          <li>
            ne les communique pas à des tiers, sauf aux prestataires dont il a
            besoin pour fonctionner ou sur ordre d’une autorité ;
          </li>
          <li>
            applique des mesures de sécurité techniques et organisationnelles et
            exige la confidentialité de son personnel et de ses prestataires ;
          </li>
          <li>
            prévient l’Agence dans les meilleurs délais s’il détecte un incident
            de sécurité affectant ses données ;
          </li>
          <li>
            aide l’Agence à répondre aux demandes d’accès, de rectification ou
            d’effacement des Clients finaux ;
          </li>
          <li>
            à la fin du Service, supprime ces données dans les délais de la
            section « Export et suppression des données ».
          </li>
        </ul>
        <p>
          L’Agence, de son côté, garantit disposer d’une base légale pour saisir
          ces données et informer ses Clients finaux de leur traitement. La{" "}
          <LegalLink href="/privacy">Politique de confidentialité</LegalLink>{" "}
          explique quelles données Tivvu traite, avec quels prestataires et dans
          quels pays.
        </p>
      </>
    ),
  },
  {
    id: "contenido",
    title: "Contenu de l’Agence et licence",
    brief:
      "Votre contenu reste le vôtre ; vous nous autorisez seulement à l’héberger et l’afficher pendant que vous utilisez le Service.",
    content: (
      <>
        <p>
          L’Agence conserve tous ses droits sur les photos, textes, logos et
          autres contenus qu’elle téléverse. Elle nous accorde une licence non
          exclusive, gratuite et limitée à la durée du Service pour héberger,
          copier, adapter (par exemple, réduire la taille des images) et
          afficher ce contenu, uniquement pour fournir le Service et publier le
          Site de l’Agence.
        </p>
        <p>
          Si nous recevons une réclamation fondée selon laquelle un contenu porte
          atteinte aux droits de tiers, nous pouvons le retirer et vous en
          informerons.
        </p>
      </>
    ),
  },
  {
    id: "sitio-y-links",
    title: "Site de l’Agence et liens partagés",
    brief:
      "Le site appartient à votre agence. Toute personne disposant d’un lien privé peut l’ouvrir : ne l’envoyez qu’à la bonne personne.",
    content: (
      <>
        <p>
          Le Site de l’Agence appartient à l’Agence : elle décide de ce qu’elle
          publie et est responsable de son contenu. Les demandes reçues via le
          site, les fiches de biens ou les offres sont enregistrées dans le
          compte de l’Agence, et Tivvu envoie en son nom les e-mails d’alerte et
          de confirmation.
        </p>
        <p>
          Les offres, réservations et le portail propriétaire sont partagés via
          des liens privés difficiles à deviner. Toute personne disposant du
          lien peut en voir le contenu ; l’Agence doit donc ne les envoyer qu’à
          la personne concernée.
        </p>
        <p>
          Aujourd’hui, le Site de l’Agence est publié sur un sous-domaine de
          Tivvu. Si l’Agence quitte le Service, le site n’est plus disponible.
        </p>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    title: "Propriété intellectuelle de Tivvu",
    brief:
      "Le logiciel et la marque Tivvu nous appartiennent ; vous pouvez les utiliser tant que votre compte est actif.",
    content: (
      <p>
        Le logiciel, le design, les modèles de site, la marque Tivvu et son logo
        appartiennent à Tivvu ou à ses concédants. Ces Conditions ne vous
        transfèrent aucun droit sur eux, au-delà de l’autorisation d’utiliser le
        Service tant que votre compte est actif. Si vous nous envoyez des idées
        ou suggestions, nous pouvons les utiliser librement pour améliorer le
        Service, sans obligation de vous rémunérer.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "Services tiers",
    brief:
      "Google, Apple et les calendriers externes sont régis par leurs propres conditions, et nous n’en répondons pas.",
    content: (
      <p>
        Le Service s’intègre à des services tiers, comme la connexion avec
        Google ou Apple, ou la synchronisation des calendriers de plateformes de
        location. Ces services sont régis par leurs propres conditions et
        politiques, et Tivvu ne répond ni de leur fonctionnement ni des
        modifications qu’ils apportent à leurs conditions.
      </p>
    ),
  },
  {
    id: "disponibilidad",
    title: "Disponibilité et assistance",
    brief:
      "Nous faisons le nécessaire pour que tout fonctionne bien, sans garantir l’absence d’interruptions. Assistance par e-mail les jours ouvrés.",
    content: (
      <>
        <p>
          Nous déployons des efforts raisonnables pour que le Service soit
          disponible et fonctionne bien, mais nous ne pouvons pas garantir
          l’absence d’interruptions ou d’erreurs. Dans la mesure du possible,
          nous programmons les maintenances aux heures creuses et les annonçons
          à l’avance.
        </p>
        <p>
          Nous traitons les questions et réclamations par e-mail à{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>,
          les jours ouvrés du lundi au vendredi. Les engagements de
          disponibilité ou de délais de réponse (accords de niveau de service)
          n’existent que s’ils sont convenus par écrit, par exemple dans une
          offre Enterprise.
        </p>
      </>
    ),
  },
  {
    id: "exportacion",
    title: "Export et suppression des données",
    brief:
      "Ce que vous supprimez va dans la corbeille pendant 30 jours. Si vous fermez le compte, vous avez 30 jours pour exporter vos données.",
    content: (
      <>
        <p>
          Ce qui est supprimé dans le Service va dans la corbeille, où il peut
          être récupéré pendant 30 jours ; il est ensuite définitivement effacé.
        </p>
        <p>
          Si l’Agence résilie son compte ou si le compte est fermé pour quelque
          motif que ce soit, les Données de l’Agence restent disponibles à
          l’export pendant 30 jours. Passé ce délai, nous les supprimons de nos
          systèmes actifs, et les sauvegardes sont écrasées selon leur cycle
          normal, qui n’excède pas 90 jours. Nous ne conservons plus longtemps
          que ce que la loi nous oblige à garder (par exemple, les données de
          facturation) ou, pendant deux ans au maximum, ce que l’Agence nous
          autorise expressément à conserver, comme le permet l’article 25 de la
          loi argentine 25.326.
        </p>
      </>
    ),
  },
  {
    id: "suspension",
    title: "Suspension et résiliation par Tivvu",
    brief:
      "Nous pouvons suspendre un compte en cas de manquement grave ou de risque de sécurité, en prévenant d’abord sauf urgence.",
    content: (
      <>
        <p>
          Nous pouvons suspendre ou fermer un compte si l’Agence manque
          gravement à ces Conditions, si l’utilisation du compte met en danger
          la sécurité du Service ou d’autres agences, ou si une autorité
          compétente l’ordonne. Sauf urgence ou empêchement légal, nous vous
          prévenons à l’avance et vous laissons un délai raisonnable pour
          corriger le problème.
        </p>
        <p>
          Nous pouvons aussi cesser de fournir le Service de manière générale,
          avec un préavis d’au moins 90 jours et en remboursant au prorata ce que
          vous avez payé d’avance.
        </p>
      </>
    ),
  },
  {
    id: "responsabilidad",
    title: "Limitation de responsabilité",
    brief:
      "Nous ne répondons ni du manque à gagner ni de vos transactions ; le plafond est ce que vous avez payé au cours des 12 derniers mois, sous réserve des exceptions légales.",
    content: (
      <>
        <p>
          Dans la mesure permise par la loi, Tivvu ne répond pas du manque à
          gagner, de la perte d’opportunités commerciales ni des dommages
          indirects découlant de l’utilisation ou de l’impossibilité d’utiliser
          le Service, ni des transactions entre l’Agence, ses clients et les
          propriétaires.
        </p>
        <p>
          La responsabilité totale de Tivvu envers l’Agence pour toute
          réclamation liée au Service est limitée au montant que l’Agence a payé
          à Tivvu au cours des 12 mois précédant le fait générateur de la
          réclamation.
        </p>
        <p>
          Ces limites ne s’appliquent pas en cas de dol ou de faute lourde de
          Tivvu, et ne limitent pas les droits que les règles d’ordre public,
          comme la loi argentine 24.240, reconnaissent aux consommateurs.
        </p>
      </>
    ),
  },
  {
    id: "indemnidad",
    title: "Garantie",
    brief:
      "Si un tiers réclame au sujet de ce que vous publiez ou de vos transactions, votre agence en assume la charge.",
    content: (
      <p>
        L’Agence garantit Tivvu contre les réclamations de tiers (y compris les
        Clients finaux, propriétaires et autorités) découlant du contenu qu’elle
        publie, des transactions qu’elle réalise ou du non-respect de ces
        Conditions ou de la réglementation applicable à son activité, y compris
        les frais de défense raisonnables.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Modifications de ces Conditions",
    brief:
      "Nous annonçons les changements importants 30 jours à l’avance, et vous pouvez résilier avant leur entrée en vigueur.",
    content: (
      <>
        <p>
          Nous pouvons mettre à jour ces Conditions. Si le changement est
          important, nous vous prévenons par e-mail et dans le Service au moins
          30 jours avant son entrée en vigueur. Les changements imposés par la
          loi ou qui vous sont uniquement favorables peuvent s’appliquer plus
          tôt.
        </p>
        <p>
          Si vous n’acceptez pas la nouvelle version, vous pouvez résilier votre
          compte avant son entrée en vigueur. Si vous continuez à utiliser le
          Service ensuite, vous êtes réputé l’accepter. La date de la version en
          vigueur figure en haut de cette page.
        </p>
      </>
    ),
  },
  {
    id: "ley-aplicable",
    title: "Droit applicable et juridiction",
    brief:
      "Le droit argentin s’applique. Nous essayons d’abord de régler les choses à l’amiable ; si vous êtes consommateur, vous pouvez agir à votre domicile.",
    content: (
      <>
        <p>
          Ces Conditions sont régies par les lois de la République argentine. En
          cas de différend, nous essaierons d’abord de le résoudre de bonne foi ;
          écrivez-nous à{" "}
          <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        </p>
        <p>
          À défaut d’accord, les tribunaux ordinaires de {jurisdiction} seront
          compétents. Si vous avez souscrit en tant que consommateur, vous
          pouvez saisir les tribunaux de votre domicile et les autorités de
          protection des consommateurs (au niveau national en Argentine, via{" "}
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
    title: "Contact",
    content: (
      <p>
        Pour toute question sur ces Conditions, écrivez-nous à{" "}
        <LegalLink href={`mailto:${contactEmail}`}>{contactEmail}</LegalLink>.
        Siège : {address}.
      </p>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Conditions générales",
  metaDescription:
    "Conditions d’utilisation de Tivvu, le logiciel de gestion pour agences de vente et de location saisonnière.",
  title: "Conditions générales",
  intro: (
    <>
      <p>
        Les règles d’utilisation de Tivvu : ce que nous faisons, ce qui revient
        à votre agence et ce qu’il advient de vos données, de vos paiements et
        de votre compte.
      </p>
      <p>
        Cette traduction est fournie à titre indicatif. En cas de divergence, la
        version espagnole prévaut.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/privacy", label: "Politique de confidentialité" },
};
