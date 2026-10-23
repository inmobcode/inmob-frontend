import type { ImportFormat } from "@/lib/api/imports";
import type { LooseTranslator } from "@/i18n/loose";
import type { ImportPlatform } from "@/lib/import-platforms";

/** What the importer tags properties with when no specific platform was chosen. */
export const DEFAULT_SOURCE: Record<ImportFormat, string> = {
  table: "csv",
  kyero: "kyero",
  tivvu_xml: "tivvu",
};

/** The formats' names are in the "import.formats" messages. */

/** Not a platform: the two ways in for anyone whose system isn't listed. Their words: "import.generic". */
export interface GenericOrigin {
  slug: "xml" | "tivvu";
  format: ImportFormat;
}

export const GENERIC_ORIGINS: GenericOrigin[] = [
  { slug: "xml", format: "kyero" },
  { slug: "tivvu", format: "tivvu_xml" },
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

/** The importer's step texts: a translator scoped to "import.guides". */
export type GuideTranslator = LooseTranslator;

// ---------------------------------------------------------------- asking the platform for the feed

type Language = "es" | "pt" | "en";
type RequestKind = "export" | "kyero-feed";

/** Spanish for Spain-based platforms, Portuguese for Portugal-only ones, English for the rest. */
function languageFor(markets: string[]): Language {
  if (markets.includes("ES")) return "es";
  if (markets.includes("PT")) return "pt";
  return "en";
}

/** The message to send to a platform's support, in the language of its market. */
export function supportMessage(platform: ImportPlatform, kind: RequestKind = "export"): string {
  const { name } = platform;
  const language = languageFor(platform.markets);

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
  const language = languageFor(platform.markets);
  if (kind === "kyero-feed") {
    if (language === "pt") return "Pedido de ativação do feed de imóveis (Kyero)";
    if (language === "es") return "Solicitud de activación del feed de propiedades (Kyero)";
    return "Request to enable the property feed (Kyero)";
  }
  if (language === "pt") return "Pedido de feed XML da minha carteira de imóveis";
  if (language === "es") return "Solicitud de feed XML de mi cartera de propiedades";
  return "Request for an XML feed of my property portfolio";
}

// ---------------------------------------------------------------- asking Tivvu for help

/** The message prefilled in "Pedir ayuda": it goes to the Tivvu team, who help migrate from `originName`. */
export function helpMessage(t: GuideTranslator, originName: string, agencySlug?: string | null): string {
  return [
    t("help.greeting"),
    "",
    t("help.body", { origin: originName }),
    ...(agencySlug ? ["", t("help.agency", { slug: agencySlug })] : []),
    "",
    t("help.thanks"),
  ].join("\n");
}

// ---------------------------------------------------------------- per-platform guides

type Override = Partial<Omit<Guide, "source" | "title" | "steps">> & {
  /** Keys under "overrides.<slug>.steps" in the messages, or the shared provide/review steps. */
  steps: string[];
  /** How many sources the platform's override lists, in the same order as `sourceUrls`. */
  sourceUrls?: string[];
};

/**
 * Platforms whose steps are documented. Everything else gets the "ask their
 * support" guide, with a ready-to-send message, instead of invented menu paths.
 */
const OVERRIDES: Record<string, Override> = {
  "casafari-crm": {
    format: "kyero",
    steps: ["s1", "s2", "@provideFeed", "@review"],
    sourceUrls: ["https://helpcenter.casafari.com/en/crm/integracao-website-e-plataformas-externas"],
  },
  estatebud: {
    format: "kyero",
    steps: ["s1", "s2", "s3", "@provideFeed", "@review"],
    sourceUrls: ["https://index.cy/information/how-to-push-listings-from-estatebud-crm-to-index-cy/"],
  },
  kyero: {
    format: "kyero",
    steps: ["s1", "@provideFeed", "@review"],
    sourceUrls: ["https://help.kyero.com/estate-agents/xml-import-specification"],
  },
};

/** A step of the messages: "@review" and the like are the shared ones, the rest belong to `slug`. */
function overrideStep(t: GuideTranslator, slug: string, step: string) {
  return step.startsWith("@") ? t(`shared.${step.slice(1)}`) : t(`overrides.${slug}.steps.${step}`);
}

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
export function platformGuide(t: GuideTranslator, platform: ImportPlatform): Guide {
  const { name } = platform;
  const base = { source: platform.slug, title: t("titles.platform", { name }) };
  const override = OVERRIDES[platform.slug];
  const known = SUPPORT_CONTACTS[platform.slug];
  const contact: SupportContact = known
    ? { label: t("support", { name }), url: known.url, email: known.email }
    : { label: t("site", { name }), url: siteHome(platform.siteUrl) };
  const requestKind: RequestKind = platform.slug === "casafari-crm" ? "kyero-feed" : "export";
  const support: SupportRequest = {
    platform: name,
    contact,
    subject: supportSubject(platform, requestKind),
    message: supportMessage(platform, requestKind),
  };

  if (override) {
    const format = override.format ?? platform.format;
    const { sourceUrls = [], steps, ...rest } = override;
    return {
      ...base,
      ...rest,
      format,
      steps: steps.map((step) => overrideStep(t, platform.slug, step)),
      note: t(`overrides.${platform.slug}.note`),
      sources: sourceUrls.map((url, index) => ({ label: t(`overrides.${platform.slug}.sources.s${index + 1}`), url })),
      // Kyero receives feeds from CRMs, it doesn't hand them out: its users ask their CRM, not Kyero.
      support: platform.slug === "kyero" ? undefined : support,
      alternative:
        format === "kyero"
          ? { format: "table", label: t("alternatives.table", { name }) }
          : { format: "kyero", label: t("alternatives.kyero", { name }) },
    };
  }

  const kind = platform.type === "portal" ? "portal" : platform.type === "aggregator" ? "aggregator" : "crm";
  const steps = [
    ...(kind === "crm" ? [t("platformSteps.crm.s1", { name })] : [t(`platformSteps.${kind}.s1`, { name }), t(`platformSteps.${kind}.s2`, { name })]),
    t("shared.provideFeed"),
    t("shared.review"),
  ];

  return {
    ...base,
    format: "kyero",
    steps,
    support,
    alternative: { format: "table", label: t("alternatives.table", { name }) },
  };
}

export function genericGuide(t: GuideTranslator, origin: GenericOrigin): Guide {
  if (origin.format === "tivvu_xml") {
    return {
      format: "tivvu_xml",
      source: origin.slug,
      title: t("titles.own"),
      steps: [t("ownSteps.s1"), t("ownSteps.s2"), t("ownSteps.s3"), t("shared.review")],
    };
  }
  if (origin.format === "kyero") {
    return {
      format: "kyero",
      source: origin.slug,
      title: t("titles.kyero"),
      steps: [t("kyeroSteps.s1"), t("shared.provideFeed"), t("shared.review")],
      alternative: { format: "table", label: t("alternatives.tableGeneric") },
    };
  }
  return {
    format: "table",
    source: origin.slug,
    title: t("titles.table"),
    steps: [t("tableSteps.s1"), t("shared.tableTips"), t("shared.provideTable"), t("shared.review")],
    alternative: { format: "kyero", label: t("alternatives.kyeroGeneric") },
  };
}

/** Guide for a route other than the platform's recommended one. */
export function routeGuide(t: GuideTranslator, format: ImportFormat, source: string, name: string): Guide {
  if (format === "kyero") {
    return {
      format,
      source,
      title: t("titles.routeKyero", { name }),
      steps: [t("routeSteps.kyero", { name }), t("shared.provideFeed"), t("shared.review")],
    };
  }
  return {
    format,
    source,
    title: t("titles.routeTable", { name }),
    steps: [t("routeSteps.table", { name }), t("shared.tableTips"), t("shared.provideTable"), t("shared.review")],
  };
}

export const TIVVU_XML_EXAMPLE = `<tivvu version="1">
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
</tivvu>`;

export const CSV_TEMPLATE = [
  "ref,title,listing_type,category,price,currency,country,region,area,address,bedrooms,bathrooms,area_sqm,plot_area,description,features,photos",
  'ABC-123,Villa con vista al mar,venta,villa,850000,EUR,Greece,Crete,Chania,Calle 1,4,3,220,900,Texto de la descripción,"Pool; BBQ",https://tu-sitio.com/fotos/1.jpg|https://tu-sitio.com/fotos/2.jpg',
].join("\n");
