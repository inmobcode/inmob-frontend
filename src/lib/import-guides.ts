import type { ImportFormat } from "@/lib/api/imports";
import type { ImportPlatform } from "@/lib/import-platforms";

/** What the importer tags properties with when no specific platform was chosen. */
export const DEFAULT_SOURCE: Record<ImportFormat, string> = {
  table: "csv",
  kyero: "kyero",
  tivvo_xml: "tivvo",
};

export const FORMAT_LABEL: Record<ImportFormat, string> = {
  table: "CSV o Excel",
  kyero: "Feed Kyero (XML)",
  tivvo_xml: "XML de Tivvo",
};

/** Not a platform: the two ways in for anyone whose system isn't listed. */
export interface GenericOrigin {
  slug: string;
  name: string;
  description: string;
  format: ImportFormat;
}

export const GENERIC_ORIGINS: GenericOrigin[] = [
  {
    slug: "xml",
    name: "Otra plataforma (XML)",
    description: "Cualquier CRM que pueda dar un feed XML en formato Kyero, por URL o por archivo.",
    format: "kyero",
  },
  {
    slug: "tivvo",
    name: "Mi propio sistema (XML de Tivvo)",
    description: "Si tu sistema tiene API propia, generá el XML de Tivvo y leemos ese feed por URL o por archivo.",
    format: "tivvo_xml",
  },
];

export interface GuideLink {
  label: string;
  url: string;
}

/** Where to reach a platform's support. `email` lets us open a ready-to-send message; without it we send people to `url`. */
export interface SupportContact {
  label: string;
  url: string;
  email?: string;
}

/** A message ready to send to the platform's support, asking for the data. */
export interface SupportRequest {
  platform: string;
  contact: SupportContact;
  subject: string;
  message: string;
}

export interface Guide {
  format: ImportFormat;
  source: string;
  title: string;
  steps: string[];
  /** A caveat worth knowing about the steps (e.g. they come from a third-party guide). */
  note?: string;
  /** Official documentation the steps come from. */
  sources?: GuideLink[];
  /** Shown under the steps when the route has an alternative. */
  support?: SupportRequest;
  alternative?: { format: ImportFormat; label: string };
}

const TABLE_TIPS =
  "Incluí, si podés: una columna de referencia (ID) única por propiedad —así al volver a importar se actualiza en lugar de duplicar—, título, tipo, operación, precio, ubicación, descripción y fotos (links).";

const REVIEW = "Revisá la vista previa: no se guarda nada hasta que confirmes.";

const PROVIDE_TABLE = "Pegá la URL del archivo (CSV o Excel) en el recuadro de al lado, o subí el archivo. Sugerimos el mapeo de columnas automáticamente.";
const PROVIDE_FEED = "Pegá la URL del feed en el recuadro de al lado, o subí el XML.";

// ---------------------------------------------------------------- asking the platform for the feed

type Language = "es" | "pt" | "en";
type RequestKind = "export" | "kyero-feed";

/** Spanish for Spain-based platforms, Portuguese for Portugal-only ones, English for the rest. */
function languageFor(market: string): Language {
  if (market.includes("España")) return "es";
  if (market.includes("Portugal")) return "pt";
  return "en";
}

/** The message to send to a platform's support, in the language of its market. */
export function supportMessage(platform: ImportPlatform, kind: RequestKind = "export"): string {
  const { name } = platform;
  const language = languageFor(platform.market);

  if (kind === "kyero-feed") {
    if (language === "pt") {
      return `Olá,\n\nSou cliente do ${name} e gostaria de ativar o feed de imóveis por URL no formato Kyero para a minha conta. Podem ativá-lo e enviar-me a URL do feed?\n\nObrigado.`;
    }
    if (language === "es") {
      return `Hola,\n\nSoy cliente de ${name} y quisiera activar el feed de propiedades por URL en formato Kyero para mi cuenta. ¿Podéis activarlo y enviarme la URL del feed?\n\nGracias.`;
    }
    return `Hello,\n\nI'm a ${name} customer and I'd like to enable the property feed by URL in Kyero format for my account. Could you enable it and send me the feed URL?\n\nThank you.`;
  }

  if (language === "pt") {
    return `Olá,\n\nSou cliente do ${name} e vou mudar a minha carteira de imóveis para outro sistema. Podem enviar-me um feed XML com todos os meus imóveis (preferencialmente no formato Kyero, versão 3), através de uma URL pública ou de um ficheiro para descarregar? Deve incluir todos os dados de cada imóvel e as fotos.\n\nSe eu próprio puder obter o feed a partir da minha conta, indiquem-me os passos exatos.\n\nObrigado.`;
  }
  if (language === "es") {
    return `Hola,\n\nSoy cliente de ${name} y voy a mover mi cartera de propiedades a otro sistema. ¿Podéis enviarme un feed XML con todas mis propiedades (preferiblemente en formato Kyero, versión 3), mediante una URL pública o un archivo descargable? Debería incluir todos los datos de cada propiedad y las fotos.\n\nSi puedo obtener el feed yo mismo desde mi cuenta, indicadme los pasos exactos.\n\nGracias.`;
  }
  return `Hello,\n\nI'm a ${name} customer and I'm moving my property portfolio to another system. Could you please send me an XML feed with all my properties (preferably in Kyero format, version 3), either as a public URL or a downloadable file? It should include all the details of each property and the photos.\n\nIf I can get the feed myself from my account, please tell me the exact steps.\n\nThank you.`;
}

/** Email subject for the same request, in the same language. */
export function supportSubject(platform: ImportPlatform, kind: RequestKind = "export"): string {
  const language = languageFor(platform.market);
  if (kind === "kyero-feed") {
    if (language === "pt") return "Pedido de ativação do feed de imóveis (Kyero)";
    if (language === "es") return "Solicitud de activación del feed de propiedades (Kyero)";
    return "Request to enable the property feed (Kyero)";
  }
  if (language === "pt") return "Pedido de feed XML da minha carteira de imóveis";
  if (language === "es") return "Solicitud de feed XML de mi cartera de propiedades";
  return "Request for an XML feed of my property portfolio";
}

// ---------------------------------------------------------------- asking Tivvo for help

/** The message prefilled in "Pedir ayuda": it goes to the Tivvo team, who help migrate from `originName`. */
export function helpMessage(originName: string, agencySlug?: string | null): string {
  return [
    "Hola, equipo de Tivvo:",
    "",
    `Quiero migrar mis propiedades desde ${originName} a Tivvo y no sé cómo conseguir los datos ni cómo importarlos. ¿Me pueden ayudar?`,
    ...(agencySlug ? ["", `Mi agencia en Tivvo: ${agencySlug}`] : []),
    "",
    "Gracias.",
  ].join("\n");
}

// ---------------------------------------------------------------- per-platform guides

type Override = Partial<Omit<Guide, "source" | "title">> & { steps: string[] };

/**
 * Platforms whose steps are documented. Everything else gets the "ask their
 * support" guide, with a ready-to-send message, instead of invented menu paths.
 */
const OVERRIDES: Record<string, Override> = {
  "casafari-crm": {
    format: "kyero",
    steps: [
      "Casafari ofrece un feed de propiedades por URL (en formato Kyero, XML2U o ACME-CRM) que se actualiza cada 20 minutos, pero lo activa su soporte: pedíselo con el botón de abajo (help@casafaricrm.com) y elegí el formato Kyero.",
      "En el export a Kyero, las propiedades sin precio, distrito, ciudad o tipo no salen: completalas antes.",
      PROVIDE_FEED,
      REVIEW,
    ],
    note: "El menú Properties › Export › Portals Catalogue de Casafari sirve para publicar en portales como Kyero, no para obtener tu feed.",
    sources: [{ label: "Ayuda de Casafari: integración con sistemas externos", url: "https://helpcenter.casafari.com/en/crm/integracao-website-e-plataformas-externas" }],
  },
  estatebud: {
    format: "kyero",
    steps: [
      "Entrá a c.estatebud.com, andá a Admin › Plugins, instalá el plugin Kyero y confirmá la instalación.",
      "En Admin › Plugins › Kyero copiá la «XML Feed URL».",
      "Marcá qué propiedades van al feed: en cada una, Actions Menu › Listings › Kyero › Save; o en bloque, seleccioná varias y usá Bulk Edit › «Add listings on» › Kyero. Si falta un campo obligatorio, Estatebud te avisa cuál.",
      PROVIDE_FEED,
      REVIEW,
    ],
    note: "Estos pasos salen de una guía de INDEX.cy (un portal), no de la ayuda de Estatebud: si algún menú cambió, consultá a su soporte.",
    sources: [{ label: "Guía de INDEX.cy para Estatebud", url: "https://index.cy/information/how-to-push-listings-from-estatebud-crm-to-index-cy/" }],
  },
  kyero: {
    format: "kyero",
    steps: [
      "Kyero no entrega tu feed: lo recibe de tu CRM. Pedile a tu CRM o proveedor la URL del feed Kyero (XML versión 3) que ya le envía a Kyero.",
      PROVIDE_FEED,
      REVIEW,
    ],
    note: "Cada feed de Kyero es un snapshot completo de una sola agencia: lo que no está en el feed se considera dado de baja.",
    sources: [{ label: "Especificación del feed de Kyero", url: "https://help.kyero.com/estate-agents/xml-import-specification" }],
  },
};

/**
 * Support contacts read from each platform's own site. Only Casafari publishes
 * an email we could confirm; for the others we use their contact page, and for
 * the rest their website (many sites block automated reads, so no email was
 * guessed).
 */
const SUPPORT_CONTACTS: Record<string, { url: string; email?: string }> = {
  "casafari-crm": { url: "https://helpcenter.casafari.com/en/crm/integracao-website-e-plataformas-externas", email: "help@casafaricrm.com" },
  ilistcrm: { url: "https://www.e-agents.gr/el/contact-us" },
  estatebud: { url: "https://estatebud.com/company/contact" },
  qobrix: { url: "https://qobrix.com/contact-us" },
  "ego-real-estate": { url: "https://www.egorealestate.com/contact-us" },
};

/** Main sites for the platforms whose catalog link is a developer/API page, which is no place to ask for support. */
const MAIN_SITES: Record<string, string> = {
  "developers.idealista.com": "https://www.idealista.com",
  "developer.olxgroup.com": "https://www.imovirtual.com",
  "developers.xe.gr": "https://www.xe.gr",
  "api.daft.ie": "https://www.daft.ie",
  "api.imot.bg": "https://www.imot.bg",
  "apidocs.lwolf.com": "https://www.propertybase.com",
  "foundations-documentation.reapit.cloud": "https://reapit.com",
  "api.dezrez.com": "https://www.dezrez.com",
  "agentapi.myhome.ie": "https://www.myhome.ie",
  "api-docs.rexsoftware.com": "https://www.rexsoftware.com",
  "api.egorealestate.com": "https://www.egorealestate.com",
};

/** The site's front page: help centers keep their own address, developer/API pages go to the platform's main site. */
function siteHome(url: string): string {
  try {
    const { origin, hostname } = new URL(url);
    return MAIN_SITES[hostname] ?? origin;
  } catch {
    return url;
  }
}

/** The step-by-step for a platform: documented steps where they exist, a ready-to-send support message where they don't. */
export function platformGuide(platform: ImportPlatform): Guide {
  const { name } = platform;
  const base = { source: platform.slug, title: `Migrar desde ${name}` };
  const override = OVERRIDES[platform.slug];
  const known = SUPPORT_CONTACTS[platform.slug];
  const contact: SupportContact = known
    ? { label: `Soporte de ${name}`, url: known.url, email: known.email }
    : { label: `Sitio de ${name}`, url: siteHome(platform.siteUrl) };
  const requestKind: RequestKind = platform.slug === "casafari-crm" ? "kyero-feed" : "export";
  const support: SupportRequest = {
    platform: name,
    contact,
    subject: supportSubject(platform, requestKind),
    message: supportMessage(platform, requestKind),
  };

  if (override) {
    const format = override.format ?? platform.format;
    return {
      ...base,
      ...override,
      format,
      // Kyero receives feeds from CRMs, it doesn't hand them out: its users ask their CRM, not Kyero.
      support: platform.slug === "kyero" ? undefined : support,
      alternative:
        format === "kyero"
          ? { format: "table", label: `Prefiero un CSV o Excel de ${name}` }
          : { format: "kyero", label: `Tengo un feed Kyero (XML) de ${name}` },
    };
  }

  const steps =
    platform.type === "portal"
      ? [
          `${name} es un portal de publicación: tus datos suelen vivir en el CRM desde el que publicás, y lo más completo es migrar desde ese CRM (volvé y elegilo en la lista).`,
          `Si querés traer tus anuncios publicados en ${name}, pedile a su soporte el feed XML (idealmente en formato Kyero): abajo tenés el mensaje listo.`,
          PROVIDE_FEED,
          REVIEW,
        ]
      : platform.type === "aggregator"
        ? [
            `${name} agrega y convierte feeds de otros sistemas: lo más completo es migrar desde el CRM que le envía los datos (volvé y elegilo en la lista).`,
            `Si tenés un feed XML de ${name} (idealmente en formato Kyero), usalo; si no, pedíselo a su soporte con el mensaje de abajo.`,
            PROVIDE_FEED,
            REVIEW,
          ]
        : [
            `Conseguí en ${name} el feed XML de tus propiedades, idealmente en formato Kyero (versión 3). Si no sabés dónde está, pedíselo a su soporte: abajo tenés el mensaje listo para enviar.`,
            PROVIDE_FEED,
            REVIEW,
          ];

  return {
    ...base,
    format: "kyero",
    steps,
    support,
    alternative: { format: "table", label: `Prefiero un CSV o Excel de ${name}` },
  };
}

export function genericGuide(origin: GenericOrigin): Guide {
  if (origin.format === "tivvo_xml") {
    return {
      format: "tivvo_xml",
      source: origin.slug,
      title: "Migrar desde tu propio sistema",
      steps: [
        "Generá desde tu API un XML con el formato de Tivvo (ejemplo abajo): un <listing> por propiedad.",
        "Usá siempre la misma <external_id> para la misma propiedad: así al volver a importar se actualiza en lugar de duplicar.",
        "Publicá el XML en una URL pública y pegala en el recuadro de al lado, o subí el archivo.",
        REVIEW,
      ],
    };
  }
  if (origin.format === "kyero") {
    return {
      format: "kyero",
      source: origin.slug,
      title: "Migrar desde otra plataforma con un feed XML",
      steps: [
        "Conseguí en tu CRM el feed XML de tus propiedades en formato Kyero (versión 3): la mayoría de los CRM lo generan para publicar en portales.",
        PROVIDE_FEED,
        REVIEW,
      ],
      alternative: { format: "table", label: "Prefiero un CSV o Excel" },
    };
  }
  return {
    format: "table",
    source: origin.slug,
    title: "Migrar desde un CSV o Excel",
    steps: [
      "Conseguí tus propiedades en un CSV o Excel (.xlsx). Si empezás de cero, descargá la plantilla de abajo.",
      TABLE_TIPS,
      PROVIDE_TABLE,
      REVIEW,
    ],
    alternative: { format: "kyero", label: "Tengo un feed Kyero (XML)" },
  };
}

/** Guide for a route other than the platform's recommended one. */
export function routeGuide(format: ImportFormat, source: string, name: string): Guide {
  if (format === "kyero") {
    return {
      format,
      source,
      title: `Migrar desde ${name} con un feed Kyero`,
      steps: [
        `Si ${name} puede darte un feed en formato Kyero (XML), copiá su URL pública o descargá el archivo.`,
        PROVIDE_FEED,
        REVIEW,
      ],
    };
  }
  return {
    format,
    source,
    title: `Migrar desde ${name} con un CSV o Excel`,
    steps: [`Conseguí tus propiedades de ${name} en un CSV o Excel (.xlsx).`, TABLE_TIPS, PROVIDE_TABLE, REVIEW],
  };
}

export const TIVVO_XML_EXAMPLE = `<tivvo version="1">
  <listing>
    <external_id>ABC-123</external_id>
    <title>Villa con vista al mar</title>
    <listing_type>SALE</listing_type>
    <category>VILLA</category>
    <price>850000</price>
    <currency>EUR</currency>
    <country>Greece</country>
    <region>Crete</region>
    <area>Chania</area>
    <lat>35.51</lat>
    <lng>24.02</lng>
    <bedrooms>4</bedrooms>
    <bathrooms>3</bathrooms>
    <area_sqm>220</area_sqm>
    <description>Texto de la descripción</description>
    <features><feature>Pool</feature><feature>BBQ</feature></features>
    <photos><photo>https://tu-sitio.com/fotos/1.jpg</photo></photos>
    <owner><name>Nombre</name><email>mail@ejemplo.com</email></owner>
  </listing>
</tivvo>`;

export const CSV_TEMPLATE = [
  "ref,title,listing_type,category,price,currency,country,region,area,address,bedrooms,bathrooms,area_sqm,plot_area,description,features,photos",
  'ABC-123,Villa con vista al mar,venta,villa,850000,EUR,Greece,Crete,Chania,Calle 1,4,3,220,900,Texto de la descripción,"Pool; BBQ",https://tu-sitio.com/fotos/1.jpg|https://tu-sitio.com/fotos/2.jpg',
].join("\n");
