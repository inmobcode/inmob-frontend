import {
  LegalLink,
  type LegalContent,
  type LegalSection,
} from "@/components/legal/legal-document";
import { LegalTable } from "@/components/legal/legal-table";
import { LEGAL_ENTITY } from "@/lib/legal";

const { name, taxId, address, privacyEmail } = LEGAL_ENTITY;

const SUMMARY = [
  "Nous utilisons vos données pour vous fournir le service, le facturer, le sécuriser et vous informer de l’essentiel. Nous ne vendons pas de données et n’affichons pas de publicité.",
  "Les données des clients et propriétaires saisies par une agence appartiennent à cette agence : elle décide de leur usage et nous les traitons pour son compte.",
  "Nous travaillons avec des prestataires d’infrastructure et d’e-mail qui peuvent se trouver hors d’Argentine, sous des contrats qui protègent vos données.",
  "Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à " +
    privacyEmail +
    ". L’accès est gratuit.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "responsable",
    title: "Qui est responsable de vos données",
    brief:
      "Pour les données de votre agence et de nos visiteurs, nous sommes responsables ; pour celles de ses clients, c’est l’agence, et nous les traitons pour son compte.",
    content: (
      <>
        <p>
          Cette Politique explique comment {name}, CUIT {taxId}, dont l’adresse
          est {address} (« Tivvo », « nous »), traite les données personnelles
          lorsque vous utilisez tivvo.app, ses sous-domaines et les sites
          d’agences publiés avec Tivvo. Elle s’applique conformément à la loi
          argentine 25.326 sur la protection des données personnelles, à son
          décret d’application 1558/2001 et aux règles de l’Agence d’accès à
          l’information publique (AAIP).
        </p>
        <p>Tivvo a deux rôles distincts selon à qui appartiennent les données :</p>
        <ul>
          <li>
            <strong>Nous sommes responsables du traitement</strong> des données
            des agences et de leurs utilisateurs (compte, facturation,
            utilisation du système), des personnes qui demandent une démo ou
            nous écrivent, et des visiteurs de tivvo.app.
          </li>
          <li>
            <strong>Nous traitons des données pour le compte de chaque agence</strong>{" "}
            lorsqu’il s’agit de ses clients, prospects, voyageurs et
            propriétaires. Dans ce cas, l’agence est responsable du traitement
            et nous agissons comme prestataire (article 25 de la loi 25.326) :
            nous suivons ses instructions et n’utilisons pas ces données à nos
            propres fins.
          </li>
        </ul>
        <p>
          Si vous avez laissé vos coordonnées sur le site d’une agence, reçu une
          offre ou avez une réservation, c’est cette agence qui décide de vos
          données. Mieux vaut lui écrire d’abord ; si vous nous écrivez, nous
          lui transmettons votre demande.
        </p>
      </>
    ),
  },
  {
    id: "datos-que-tratamos",
    title: "Quelles données nous traitons",
    brief:
      "Compte, connexion, données techniques et communications ; et, pour le compte de chaque agence, les données de ses clients. Nous ne demandons pas de données sensibles.",
    content: (
      <>
        <h3>Si vous utilisez Tivvo dans une agence</h3>
        <ul>
          <li>
            <strong>Compte :</strong> nom, e-mail, mot de passe (stocké chiffré
            avec un algorithme de hachage, jamais en clair), rôle et agence à
            laquelle vous appartenez.
          </li>
          <li>
            <strong>Connexion avec Google ou Apple :</strong> si vous la
            choisissez, nous recevons de ce fournisseur votre nom, votre e-mail
            et un identifiant de compte. Nous ne recevons pas votre mot de passe.
          </li>
          <li>
            <strong>Agence :</strong> nom, coordonnées, logo, paramètres du site
            et, pour les offres payantes, les données nécessaires à la
            facturation.
          </li>
          <li>
            <strong>Utilisation et données techniques :</strong> dates de
            connexion, actions pertinentes dans le système, adresse IP,
            navigateur et journaux d’erreurs, que nous utilisons pour la sécurité
            et pour résoudre les problèmes.
          </li>
          <li>
            <strong>Communications :</strong> ce que vous nous écrivez par e-mail
            ou dans le formulaire de démo (nom, e-mail, agence, taille de
            l’équipe et votre message).
          </li>
        </ul>
        <h3>Données que les agences saisissent ou reçoivent avec Tivvo</h3>
        <p>
          Pour le compte de chaque agence, nous traitons les données de ses
          clients finaux : nom, e-mail, téléphone, demandes et messages, notes et
          historique, offres, réservations avec dates et nombre de voyageurs,
          paiements enregistrés, documents joints par l’agence et données des
          propriétaires et de leurs biens. Les données saisies dépendent de
          chaque agence.
        </p>
        <p>
          Nous ne demandons pas de données sensibles et demandons aux agences de
          ne pas en saisir, sauf si la loi le permet et que c’est indispensable.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "À quoi nous les utilisons",
    brief:
      "Pour vous fournir le service, le facturer, le sécuriser et vous informer de l’essentiel. Nous ne vendons pas de données et ne faisons pas de publicité pour des tiers.",
    content: (
      <>
        <p>Nous utilisons les données dont nous sommes responsables pour :</p>
        <ol>
          <li>
            créer et gérer votre compte et celui de votre agence, et vous
            permettre de vous connecter ;
          </li>
          <li>fournir le Service souscrit, avec ses fonctionnalités et limites ;</li>
          <li>facturer et encaisser les offres payantes ;</li>
          <li>
            vous envoyer des avis opérationnels : sécurité, changements de mot
            de passe, nouvelles demandes, changements d’offre ou de ces
            conditions ;
          </li>
          <li>vous assister et répondre à vos questions ou à votre demande de démo ;</li>
          <li>protéger le Service, détecter les abus et prévenir la fraude ;</li>
          <li>
            comprendre comment le Service est utilisé pour l’améliorer, avec des
            données agrégées autant que possible ;
          </li>
          <li>
            vous envoyer des nouvelles du produit, si vous ne vous y êtes pas
            opposé (vous pouvez vous désabonner depuis n’importe quel e-mail) ;
          </li>
          <li>respecter nos obligations légales, comptables et fiscales.</li>
        </ol>
        <p>
          Nous utilisons les données des clients finaux uniquement pour que
          l’agence puisse travailler avec : les stocker, les montrer à son
          équipe, publier ses offres ou réservations sur des liens privés et
          envoyer, au nom de l’agence, les e-mails d’alerte et de confirmation
          des demandes, offres et réservations.
        </p>
        <p>
          Nous ne vendons pas de données personnelles, ne les utilisons pas pour
          de la publicité de tiers et ne prenons pas de décisions automatisées
          produisant des effets juridiques sur les personnes.
        </p>
      </>
    ),
  },
  {
    id: "bases",
    title: "Sur quelle base nous les traitons",
    brief:
      "Contrat, votre consentement ou une obligation légale. Les champs obligatoires de chaque formulaire sont ceux dont le service a besoin.",
    content: (
      <>
        <p>
          Nous traitons vos données parce qu’elles sont nécessaires à la
          relation contractuelle avec votre agence (article 5, paragraphe 2.c de
          la loi 25.326), parce que vous nous avez donné votre consentement (par
          exemple, en envoyant le formulaire de démo), ou parce qu’une règle nous
          oblige à les conserver (par exemple, les données de facturation).
        </p>
        <p>
          Les champs marqués comme obligatoires dans chaque formulaire sont
          nécessaires pour fournir le Service : si vous ne les renseignez pas,
          nous ne pouvons pas créer le compte ni répondre à votre demande. Les
          autres sont facultatifs.
        </p>
        <p>
          Lorsque nous traitons des données pour le compte d’une agence, c’est
          cette agence qui doit disposer d’une base légale et, le cas échéant,
          du consentement de ses clients.
        </p>
      </>
    ),
  },
  {
    id: "proveedores",
    title: "Avec qui nous les partageons",
    brief:
      "Uniquement avec les prestataires dont nous avons besoin pour fonctionner, sous des contrats qui protègent vos données.",
    content: (
      <>
        <p>
          Nous ne partageons des données qu’avec les prestataires nécessaires au
          fonctionnement du Service, sous des contrats qui leur imposent
          confidentialité et sécurité et de ne les utiliser que pour nous
          fournir leur service :
        </p>
        <LegalTable
          columns={["Prestataire", "Ce pour quoi nous l’utilisons"]}
          rows={[
            [
              "Supabase (sur l’infrastructure d’Amazon Web Services)",
              "Base de données et stockage des photos et fichiers.",
            ],
            [
              "Resend",
              "Envoi des e-mails du système : alertes, confirmations et récupération du mot de passe.",
            ],
            [
              "Hébergeurs de l’application web",
              "Ils servent les pages et reçoivent les données techniques de chaque visite (adresse IP, navigateur).",
            ],
            ["Google et Apple", "Seulement si vous choisissez de vous connecter avec leur compte."],
          ]}
        />
        <p>
          Par ailleurs, les données sont montrées aux personnes concernées selon
          votre utilisation du Service : l’équipe de votre agence voit les
          données de l’agence, et la personne qui reçoit un lien d’offre, de
          réservation ou de portail propriétaire voit le contenu de ce lien.
        </p>
        <p>
          Nous pouvons divulguer des données sur ordre d’un juge ou d’une
          autorité compétente, ou si c’est nécessaire pour défendre nos droits.
          Si Tivvo fusionne ou est racheté, les données seront transférées à la
          nouvelle entité, qui devra respecter cette Politique.
        </p>
      </>
    ),
  },
  {
    id: "transferencias",
    title: "Transferts internationaux",
    brief:
      "Certains prestataires sont hors d’Argentine ; les transferts s’effectuent avec des garanties équivalentes à celles de la loi.",
    content: (
      <>
        <p>
          Certains de nos prestataires hébergent ou traitent des données hors
          d’Argentine, notamment aux États-Unis et dans l’Union européenne.
          L’Union européenne est reconnue par l’AAIP comme une destination
          offrant un niveau de protection adéquat ; pour les autres pays, les
          transferts s’effectuent selon des clauses contractuelles offrant des
          garanties équivalentes à celles de la loi 25.326, conformément aux
          modèles approuvés par la Disposition 60-E/2016 et la Résolution
          198/2023 de l’AAIP.
        </p>
        <p>
          En utilisant le Service, et au sens de l’article 12 de la loi 25.326,
          vous consentez à ces transferts. Si vous souhaitez en savoir plus sur
          les garanties que nous appliquons, écrivez-nous.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    title: "Combien de temps nous les conservons",
    brief:
      "Chaque donnée a sa durée : de 30 jours dans la corbeille à 10 ans pour la facturation.",
    content: (
      <LegalTable
        columns={["Quelles données", "Durée de conservation"]}
        rows={[
          [
            "Données du compte et de l’agence",
            "Tant que le compte est actif. S’il est fermé, elles restent disponibles à l’export pendant 30 jours puis sont supprimées ; les sauvegardes sont écrasées dans un délai n’excédant pas 90 jours.",
          ],
          [
            "Éléments supprimés dans le système",
            "30 jours dans la corbeille, où ils peuvent être récupérés ; ensuite ils sont définitivement effacés.",
          ],
          [
            "Données de facturation",
            "10 ans, comme l’exige l’article 328 du Code civil et commercial argentin pour les documents comptables.",
          ],
          [
            "Journaux techniques et de sécurité",
            "Le temps nécessaire pour enquêter sur les incidents, en général pas plus de 12 mois.",
          ],
          [
            "Demandes de démo et questions",
            "Jusqu’à 2 ans après le dernier contact, ou moins si vous nous demandez de les supprimer.",
          ],
        ]}
      />
    ),
  },
  {
    id: "seguridad",
    title: "Comment nous les protégeons",
    brief:
      "Chiffrement, mots de passe hachés, données séparées par agence et autorisations par rôle. En cas d’incident, nous prévenons.",
    content: (
      <>
        <p>
          Nous appliquons des mesures techniques et organisationnelles suivant
          les recommandations de la Résolution 47/2018 de l’AAIP, notamment :
        </p>
        <ul>
          <li>
            chiffrement des communications (HTTPS/TLS) entre votre navigateur,
            l’application et nos prestataires ;
          </li>
          <li>mots de passe stockés sous forme hachée, jamais lisibles ;</li>
          <li>
            séparation des données par agence : chaque équipe n’accède qu’à son
            propre espace ;
          </li>
          <li>autorisations par rôle au sein de chaque agence ;</li>
          <li>
            liens privés d’offres, de réservations et de propriétaires générés
            avec des identifiants difficiles à deviner ;
          </li>
          <li>
            sauvegardes et accès restreint du personnel aux données de
            production.
          </li>
        </ul>
        <p>
          Aucun système n’est infaillible. Si nous détectons un incident de
          sécurité affectant des données personnelles, nous enquêtons, prenons
          des mesures pour le contenir, le signalons aux agences concernées dans
          les meilleurs délais et, le cas échéant, à l’AAIP et aux personnes
          concernées.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies et stockage dans votre navigateur",
    brief:
      "Uniquement ceux nécessaires au fonctionnement du service : pas de publicité ni de traçage par des tiers.",
    content: (
      <>
        <p>
          Tivvo n’utilise que les cookies et le stockage local nécessaires au
          fonctionnement du Service. Nous n’utilisons pas de cookies
          publicitaires ni de traçage par des tiers.
        </p>
        <LegalTable
          columns={["Ce qu’il stocke", "À quoi il sert", "Durée"]}
          rows={[
            [
              <>
                Session (<code>access_token</code>, <code>refresh_token</code>,{" "}
                <code>tivvo_user</code>)
              </>,
              "Ils maintiennent votre session ouverte.",
              "Jusqu’à 180 jours ou jusqu’à la déconnexion.",
            ],
            [
              <>
                Préférences (<code>sidebar_collapsed</code> et stockage local)
              </>,
              "Ils mémorisent si le menu est replié, la vue choisie dans chaque liste et le thème clair ou sombre.",
              "Le cookie du menu, jusqu’à 1 an ; le reste, jusqu’à ce que vous l’effaciez de votre navigateur.",
            ],
            [
              "Connexion avec Google ou Apple",
              "Pendant la connexion, nous gardons dans l’onglet la page où revenir.",
              "Effacé à la fin.",
            ],
          ]}
        />
        <p>
          Vous pouvez supprimer ou bloquer les cookies depuis votre navigateur.
          Si vous bloquez ceux de session, vous ne pourrez pas vous connecter.
          Les sites publics des agences ne déposent pas de cookies Tivvo.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    title: "Vos droits et comment les exercer",
    brief:
      "Vous pouvez demander l’accès, la rectification, la suppression ou que nous cessions de vous écrire ; nous répondons dans les délais du tableau.",
    content: (
      <>
        <p>En tant que personne concernée, vous avez le droit de :</p>
        <LegalTable
          columns={["Droit", "Ce que vous pouvez demander", "Délai de réponse"]}
          rows={[
            [
              "Accès",
              "Savoir quelles données vous concernant nous détenons, d’où elles proviennent et à quoi nous les utilisons. C’est gratuit si vous le demandez à des intervalles d’au moins six mois, sauf si vous justifiez d’un intérêt légitime à le faire plus tôt (article 14 de la loi 25.326).",
              "10 jours calendaires",
            ],
            [
              "Rectification, mise à jour et suppression",
              "Que nous corrigions les données inexactes ou supprimions celles qui ne doivent pas être conservées (article 16).",
              "5 jours ouvrés",
            ],
            [
              "Opposition aux communications commerciales",
              "Nous demander de cesser de vous envoyer des nouvelles, à tout moment (article 27).",
              "À tout moment",
            ],
            [
              "Retirer votre consentement",
              "Lorsque le traitement repose sur celui-ci, sans effet rétroactif.",
              "À tout moment",
            ],
          ]}
        />
        <p>
          Pour les exercer, écrivez à{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          depuis l’e-mail associé à vos données, en indiquant votre demande. Si
          nous ne pouvons pas vérifier votre identité, nous vous demanderons un
          justificatif. Vous pouvez aussi corriger la plupart de vos données
          depuis votre profil.
        </p>
        <p>
          Si vos données ont été saisies par une agence (par exemple, parce que
          vous lui avez envoyé une demande), la demande doit être adressée à
          cette agence ; si elle nous parvient, nous la lui transmettons dans
          les 5 jours ouvrés et l’aidons à y répondre.
        </p>
        <p>
          Si nous ne répondons pas dans les délais ou si la réponse ne vous
          satisfait pas, vous pouvez porter réclamation auprès de l’Agence
          d’accès à l’information publique sur{" "}
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
    title: "Mineurs",
    brief: "Tivvo est un outil destiné aux personnes de plus de 18 ans.",
    content: (
      <p>
        Tivvo est un outil professionnel destiné aux personnes de plus de 18 ans
        et ne s’adresse pas aux mineurs. Si vous savez qu’un mineur nous a
        fourni ses données sans autorisation, écrivez-nous et nous les
        supprimerons.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Modifications de cette Politique",
    brief: "Nous annonçons les changements importants 30 jours à l’avance.",
    content: (
      <p>
        Nous pouvons mettre à jour cette Politique pour refléter des
        changements du Service ou de la loi. Si le changement est important,
        nous vous prévenons par e-mail et dans le Service au moins 30 jours à
        l’avance. La date de la version en vigueur figure en haut de cette page.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Contact",
    content: (
      <>
        <p>
          Pour toute question relative à la confidentialité, écrivez-nous à{" "}
          <LegalLink href={`mailto:${privacyEmail}`}>{privacyEmail}</LegalLink>{" "}
          ou par courrier à {address}.
        </p>
        <p className="border-l-2 border-line pl-4 text-sm text-quiet">
          L’AGENCE D’ACCÈS À L’INFORMATION PUBLIQUE, en sa qualité d’Organe de
          contrôle de la loi n° 25.326, est habilitée à traiter les plaintes et
          réclamations déposées par les personnes dont les droits sont affectés
          par le non-respect des règles en vigueur en matière de protection des
          données personnelles.
        </p>
      </>
    ),
  },
];

export const content: LegalContent = {
  metaTitle: "Politique de confidentialité",
  metaDescription:
    "Quelles données personnelles Tivvo traite, pourquoi, avec qui il les partage et comment exercer vos droits.",
  title: "Politique de confidentialité",
  intro: (
    <>
      <p>
        Quelles données personnelles nous traitons, pourquoi, avec qui nous les
        partageons et comment y accéder, les corriger ou en demander la
        suppression.
      </p>
      <p>
        Cette traduction est fournie à titre indicatif. En cas de divergence, la
        version espagnole prévaut.
      </p>
    </>
  ),
  summary: SUMMARY,
  sections: SECTIONS,
  related: { href: "/terms", label: "Conditions générales" },
  action: {
    href: `mailto:${privacyEmail}?subject=${encodeURIComponent("Demande concernant mes données personnelles")}`,
    label: "Exercer mes droits",
    hint: `Écrivez-nous à ${privacyEmail} : accès, rectification ou suppression.`,
  },
};
