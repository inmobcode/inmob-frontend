import { ImageResponse } from "next/og";

/**
 * The share card for the landing, the legal pages and the app, in one
 * language (served by app/api/og/[locale]). Agency sites and listings set
 * `openGraph.images` to their own photos instead, so none of them end up
 * sharing a Tivvo-branded card.
 *
 * Drawn here rather than shipped as a PNG so the wording and the brand colours
 * stay in one place with the rest of the code.
 */
export const OG_SIZE = { width: 1200, height: 630 };

// Matches --l-forest / --l-forest-deep / --l-lime / --l-paper in globals.css.
const FOREST = "#164832";
const FOREST_DEEP = "#0f3524";
const LIME = "#77e500";
const PAPER = "#fbfbf8";

type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" };

/**
 * Inter, subset to `text`, from Google Fonts: the default font of next/og has
 * no full Greek (it draws ω as Ω). Null if it can't be fetched, so the card
 * still renders with the default.
 */
async function loadInter(text: string, weight: 400 | 600): Promise<OgFont | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const data = await (await fetch(url)).arrayBuffer();
    return { name: "Inter", data, weight, style: "normal" };
  } catch {
    return null;
  }
}

/** Fonts for scripts the default one doesn't cover; empty when it does. */
export async function ogFonts(locale: string, text: string): Promise<OgFont[]> {
  if (locale !== "el") return [];
  const fonts = await Promise.all([loadInter(`Tivvo ${text}`, 400), loadInter(`Tivvo ${text}`, 600)]);
  return fonts.filter((font): font is OgFont => font !== null);
}

export function ogCard({ title, subtitle, fonts = [] }: { title: string; subtitle: string; fonts?: OgFont[] }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: `linear-gradient(135deg, ${FOREST} 0%, ${FOREST_DEEP} 100%)`,
          color: PAPER,
          ...(fonts.length ? { fontFamily: "Inter" } : {}),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: LIME }} />
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1 }}>Tivvo</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, color: "rgba(251,251,248,0.7)", maxWidth: 820 }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 26, color: LIME }}>
          tivvo.app
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      ...(fonts.length ? { fonts } : {}),
      // The card only changes with a deploy.
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable" },
    },
  );
}
