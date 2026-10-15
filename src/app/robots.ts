import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/**
 * Served from the apex domain, where the landing, the legal pages and every
 * agency site live. The dashboard answers on `app.` instead: its pages are
 * `noindex` and the proxy adds `X-Robots-Tag` on that host, so nothing there
 * depends on this file.
 *
 * The disallowed paths are links meant for one person (an offer sent to a
 * client, a booking, an owner's portal): not secret, but nothing a crawler
 * should spend its budget on or surface in results.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/offer/", "/booking/", "/owner/", "/docs", "/landing-test", "/login", "/register"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
