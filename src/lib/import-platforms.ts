import type { ImportFormat } from "@/lib/api/imports";

/**
 * Platforms agencies migrate from. `format` is the route that works today:
 * an XML feed (Kyero format), by URL or file. How to get the data out of each one
 * lives in import-guides.ts.
 */
export type PlatformType = "crm" | "portal" | "aggregator";

export interface ImportPlatform {
  slug: string;
  name: string;
  /**
   * Where it's used: ISO 3166 country codes, or UN M49 areas for regions
   * ("150" Europe, "039" Southern Europe, "001" the whole world). Each language
   * names them with Intl.DisplayNames.
   */
  markets: string[];
  type: PlatformType;
  /** 1 = high priority for Tivvu's markets, 3 = low. */
  priority: 1 | 2 | 3;
  format: ImportFormat;
  siteUrl: string;
}

export const IMPORT_PLATFORMS: ImportPlatform[] = [
  {
    "slug": "bazaraki",
    "name": "Bazaraki",
    "markets": ["CY"],
    "type": "portal",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://pro.bazaraki.com/"
  },
  {
    "slug": "casafari-crm",
    "name": "CASAFARI CRM",
    "markets": ["PT", "ES"],
    "type": "crm",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://helpcenter.casafari.com/en/crm/integracao-website-e-plataformas-externas"
  },
  {
    "slug": "ego-real-estate",
    "name": "eGO Real Estate (Janela Digital)",
    "markets": ["PT", "ES"],
    "type": "crm",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://api.egorealestate.com/"
  },
  {
    "slug": "estatebud",
    "name": "Estatebud",
    "markets": ["CY", "GB"],
    "type": "crm",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://help.estatebud.com/hc/estatebud/en/categories/integrations"
  },
  {
    "slug": "green-acres-vizzit",
    "name": "Green-Acres / Vizzit",
    "markets": ["150"],
    "type": "portal",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://www.green-acres.fr/en/GatewayInfo"
  },
  {
    "slug": "idealista",
    "name": "Idealista",
    "markets": ["ES", "PT", "IT"],
    "type": "portal",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://developers.idealista.com/access-request"
  },
  {
    "slug": "ilistcrm",
    "name": "ilistCRM (e-agents, Fortunet Hellas)",
    "markets": ["GR", "CY"],
    "type": "crm",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://www.e-agents.gr/el/ilist"
  },
  {
    "slug": "imovirtual",
    "name": "Imovirtual (OLX Group)",
    "markets": ["PT"],
    "type": "portal",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://developer.olxgroup.com/products"
  },
  {
    "slug": "inmovilla",
    "name": "Inmovilla",
    "markets": ["ES"],
    "type": "crm",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://www.inmovilla.com/developers"
  },
  {
    "slug": "irealone",
    "name": "iRealOne",
    "markets": ["HR", "RS", "SI"],
    "type": "crm",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://irealone.com/front/real-estate-management-software-as-a-service.html"
  },
  {
    "slug": "kyero",
    "name": "Kyero",
    "markets": ["039"],
    "type": "portal",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://help.kyero.com/estate-agents/xml-import-specification"
  },
  {
    "slug": "qobrix",
    "name": "Qobrix",
    "markets": ["CY", "GR", "AE", "ES"],
    "type": "crm",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://qobrix.com/real-estate-crm"
  },
  {
    "slug": "resales-online",
    "name": "Resales Online",
    "markets": ["ES"],
    "type": "crm",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://support.resales-online.com/en/articles/5682509-webapi-v6-full-documentation-for-web-developers"
  },
  {
    "slug": "spitogatos",
    "name": "Spitogatos",
    "markets": ["GR", "CY"],
    "type": "portal",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://www.spitogatos.gr/"
  },
  {
    "slug": "xe-gr",
    "name": "xe.gr",
    "markets": ["GR"],
    "type": "portal",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://developers.xe.gr/"
  },
  {
    "slug": "xml2u",
    "name": "XML2U",
    "markets": ["001"],
    "type": "aggregator",
    "priority": 1,
    "format": "kyero",
    "siteUrl": "https://www.xml2u.com/en/faqs.aspx"
  },
  {
    "slug": "acquaint-crm",
    "name": "Acquaint CRM",
    "markets": ["IE", "GB"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://www.acquaintcrm.co.uk/become-a-partner"
  },
  {
    "slug": "agentiz",
    "name": "Agentiz",
    "markets": ["MT", "ME", "HR", "BG", "GR"],
    "type": "aggregator",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://www.agentiz.com/en/partnership/aggregation/mt"
  },
  {
    "slug": "apimo",
    "name": "Apimo",
    "markets": ["FR", "039"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://apimo.com/en/api/webservice"
  },
  {
    "slug": "daft-ie",
    "name": "Daft.ie",
    "markets": ["IE"],
    "type": "portal",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://api.daft.ie/doc/v3/"
  },
  {
    "slug": "domaza",
    "name": "Domaza",
    "markets": ["150"],
    "type": "aggregator",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://www.domaza.com/api-doc/xml-upload/"
  },
  {
    "slug": "epic-agent-crm",
    "name": "EPIC Agent CRM (ISB Technologies)",
    "markets": ["MT"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://isb.mt/software-solutions/real-estate/epic-agent-crm-for-estate-agencies/"
  },
  {
    "slug": "estate",
    "name": "Estate+ (Global Concept)",
    "markets": ["GR"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://estateplus.gr/"
  },
  {
    "slug": "fotocasa",
    "name": "Fotocasa Pro / habitaclia / Milanuncios",
    "markets": ["ES"],
    "type": "portal",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://pro.fotocasa.es/bienvenida-pack-basic/"
  },
  {
    "slug": "imodigi",
    "name": "Imodigi",
    "markets": ["PT"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://www.imodigi.com/"
  },
  {
    "slug": "imot-bg",
    "name": "Imot.bg",
    "markets": ["BG"],
    "type": "portal",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://api.imot.bg/import_doc/"
  },
  {
    "slug": "mobilia",
    "name": "Mobilia",
    "markets": ["ES"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://www.mobiliagestion.es/noticias-software-inmobiliario/api-crm-mobilia-zapier-n8n-wordpress-agente-ia"
  },
  {
    "slug": "nekretnine1",
    "name": "Nekretnine1 (RealCRM1)",
    "markets": ["HR"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://www.nekretnine1.hr/"
  },
  {
    "slug": "njuskalo",
    "name": "Njuškalo",
    "markets": ["HR"],
    "type": "portal",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://www.njuskalo.hr/"
  },
  {
    "slug": "properstar",
    "name": "Properstar",
    "markets": ["001"],
    "type": "aggregator",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://help.properstar.com/knowledge/our-crms-compatibility"
  },
  {
    "slug": "propertybase",
    "name": "Propertybase",
    "markets": ["001"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://apidocs.lwolf.com/doc/propertybasese"
  },
  {
    "slug": "real-status",
    "name": "Real Status",
    "markets": ["GR"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://realstatus.gr/"
  },
  {
    "slug": "reapit",
    "name": "Reapit",
    "markets": ["GB", "IE"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://foundations-documentation.reapit.cloud/developer-portal"
  },
  {
    "slug": "sooprema",
    "name": "Sooprema",
    "markets": ["ES"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://www.sooprema.com/api-desarrolladores/"
  },
  {
    "slug": "witei",
    "name": "Witei",
    "markets": ["ES"],
    "type": "crm",
    "priority": 2,
    "format": "kyero",
    "siteUrl": "https://faq.witei.com/en/articles/2038460-api"
  },
  {
    "slug": "alto",
    "name": "Alto (Zoopla)",
    "markets": ["GB"],
    "type": "crm",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://www.altosoftware.co.uk/become-a-partner/"
  },
  {
    "slug": "dezrez",
    "name": "Dezrez (Rezi)",
    "markets": ["GB"],
    "type": "crm",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://api.dezrez.com/Help"
  },
  {
    "slug": "dimedia-nekretnine",
    "name": "Dimedia nekretnine",
    "markets": ["HR"],
    "type": "crm",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://www.dimedianekretnine.com/o-nama"
  },
  {
    "slug": "estate-assistant-estates-maxprogress",
    "name": "Estate Assistant / Estates Maxprogress",
    "markets": ["BG"],
    "type": "crm",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://www.domaza.com/api-doc/xml-upload/"
  },
  {
    "slug": "estate-crm",
    "name": "Estate CRM",
    "markets": ["GR", "CY"],
    "type": "crm",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://estatecrm.gr/en/features/portal-feeds/"
  },
  {
    "slug": "jupix",
    "name": "Jupix",
    "markets": ["GB"],
    "type": "crm",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://support.jupix.com/"
  },
  {
    "slug": "myhome-ie",
    "name": "MyHome.ie",
    "markets": ["IE"],
    "type": "portal",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://agentapi.myhome.ie/"
  },
  {
    "slug": "optima-crm",
    "name": "Optima-CRM",
    "markets": ["ES"],
    "type": "crm",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://optima-crm.com/en/crm-software-for-real-estate"
  },
  {
    "slug": "relper-volvox",
    "name": "Relper / Volvox",
    "markets": ["RS", "ME"],
    "type": "crm",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://www.domaza.com/api-doc/xml-upload/"
  },
  {
    "slug": "rex",
    "name": "Rex",
    "markets": ["AU", "GB"],
    "type": "crm",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://api-docs.rexsoftware.com/"
  },
  {
    "slug": "rightmove",
    "name": "Rightmove",
    "markets": ["GB"],
    "type": "portal",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://www.rightmove.co.uk/adf.html"
  },
  {
    "slug": "ubiflow",
    "name": "Ubiflow",
    "markets": ["FR"],
    "type": "aggregator",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://www.ubiflow.net/medias-compatibles-immobilier-automobile/diffusion-annonces-vers-immo_france"
  },
  {
    "slug": "zoopla",
    "name": "Zoopla",
    "markets": ["GB"],
    "type": "portal",
    "priority": 3,
    "format": "kyero",
    "siteUrl": "https://www.zoopla.co.uk/realtime-documentation/"
  }
];
