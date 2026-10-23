import { LOCALE_NAMES, LOCALES, localePath } from "@/i18n/config";
import { getSitemapUrls } from "@/lib/api/sitemap";
import { SITE_NAME, absoluteUrl, agencyPath } from "@/lib/seo";

/**
 * llms.txt (llmstxt.org): what this site is and where its content lives, for
 * an assistant reading it instead of crawling every page. Markdown on purpose
 * — the format is a document, not a config file.
 *
 * It indexes the agency sites, not their thousands of listings: the full list
 * stays in sitemap.xml, which is built for exactly that.
 */
export const revalidate = 3600;

const INTRO = `# ${SITE_NAME}

> Sistema de gestión para inmobiliarias de venta y alquiler temporario. Cada agencia carga sus propiedades, arma ofertas para sus clientes, sigue reservas y pagos, y publica su propio sitio público dentro de ${new URL(absoluteUrl("/")).host}.

Tivvo es el software; las propiedades y los precios son de cada agencia, que los publica y los gestiona. Una dirección \`/page/<agencia>\` es el sitio de esa inmobiliaria, y \`/page/<agencia>/properties/<propiedad>\` es una de sus publicaciones, con su precio, ubicación, fotos y formulario de contacto. La consulta le llega a esa agencia, no a Tivvo.`;

const PRODUCT = `## Producto

- [Inicio](${absoluteUrl("/")}): qué resuelve Tivvo, cómo funciona, planes y preguntas frecuentes.
- [Contacto y ayuda](${absoluteUrl("/help")}): formulario para escribirle al equipo.
- Idiomas: ${LOCALES.map((locale) => `[${LOCALE_NAMES[locale]}](${absoluteUrl(localePath(locale, "/"))})`).join(", ")}. Cada página pública existe en todos con el prefijo del idioma (\`/en/…\`, \`/pt/…\`); sin prefijo es la versión en español.`;

const LEGAL = `## Legal

- [Términos y condiciones](${absoluteUrl("/terms")}): condiciones de uso del servicio.
- [Política de privacidad](${absoluteUrl("/privacy")}): qué datos se tratan, para qué y cómo ejercer derechos.`;

const NOTES = `## Notas

- El índice completo de sitios y publicaciones está en [sitemap.xml](${absoluteUrl("/sitemap.xml")}).
- Las rutas \`/offer/\`, \`/booking/\` y \`/owner/\` son links privados que una agencia le manda a una persona concreta: no se indexan ni se listan acá.
- El panel de gestión vive en el subdominio \`app.\` y pide sesión: no hay nada público ahí.`;

function agencyList(agencies: { slug: string; name: string }[], listingCounts: Map<string, number>) {
  if (agencies.length === 0) return null;
  const lines = agencies.map((agency) => {
    const count = listingCounts.get(agency.slug) ?? 0;
    const listings =
      count === 0
        ? "sin publicaciones por ahora"
        : `${count} ${count === 1 ? "propiedad publicada" : "propiedades publicadas"}`;
    return `- [${agency.name}](${absoluteUrl(agencyPath(agency.slug))}): ${listings}.`;
  });
  return `## Sitios de agencias\n\n${lines.join("\n")}`;
}

export async function GET() {
  // Same fail-soft as the sitemap: without the API, still say what the site is.
  const urls = await getSitemapUrls().catch(() => null);

  const counts = new Map<string, number>();
  for (const property of urls?.properties ?? []) {
    counts.set(property.agencySlug, (counts.get(property.agencySlug) ?? 0) + 1);
  }

  const body = [INTRO, PRODUCT, urls && agencyList(urls.agencies, counts), LEGAL, NOTES]
    .filter(Boolean)
    .join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
