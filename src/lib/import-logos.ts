/**
 * Platforms with a logo in /public/platform-logos/. The files are the
 * platforms' own icons, kept here only to identify them in the importer; the
 * ones missing (no usable icon found) fall back to a generic icon.
 */
const LOGO_FILES: Record<string, string> = {
  "acquaint-crm": "acquaint-crm.png",
  "agentiz": "agentiz.png",
  "alto": "alto.png",
  "apimo": "apimo.png",
  "bazaraki": "bazaraki.png",
  "casafari-crm": "casafari-crm.png",
  "daft-ie": "daft-ie.png",
  "dezrez": "dezrez.png",
  "dimedia-nekretnine": "dimedia-nekretnine.png",
  "domaza": "domaza.png",
  "ego-real-estate": "ego-real-estate.png",
  "epic-agent-crm": "epic-agent-crm.png",
  "estate-assistant-estates-maxprogress": "estate-assistant-estates-maxprogress.png",
  "estate-crm": "estate-crm.png",
  "estate": "estate.png",
  "estatebud": "estatebud.png",
  "fotocasa": "fotocasa.png",
  "green-acres-vizzit": "green-acres-vizzit.png",
  "idealista": "idealista.png",
  "ilistcrm": "ilistcrm.png",
  "imodigi": "imodigi.png",
  "imot-bg": "imot-bg.png",
  "imovirtual": "imovirtual.png",
  "inmovilla": "inmovilla.png",
  "irealone": "irealone.png",
  "jupix": "jupix.png",
  "kyero": "kyero.png",
  "mobilia": "mobilia.png",
  "myhome-ie": "myhome-ie.png",
  "nekretnine1": "nekretnine1.png",
  "njuskalo": "njuskalo.png",
  "optima-crm": "optima-crm.png",
  "properstar": "properstar.png",
  "propertybase": "propertybase.png",
  "qobrix": "qobrix.png",
  "real-status": "real-status.png",
  "reapit": "reapit.png",
  "resales-online": "resales-online.svg",
  "rex": "rex.png",
  "rightmove": "rightmove.png",
  "sooprema": "sooprema.png",
  "spitogatos": "spitogatos.png",
  "ubiflow": "ubiflow.png",
  "witei": "witei.png",
  "xe-gr": "xe-gr.svg",
  "xml2u": "xml2u.png",
  "zoopla": "zoopla.png",
};

export function platformLogo(slug: string): string | null {
  const file = LOGO_FILES[slug];
  return file ? `/platform-logos/${file}` : null;
}
