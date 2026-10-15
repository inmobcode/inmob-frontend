import { ImageResponse } from "next/og";

/**
 * The share card for the landing and the legal pages. Agency sites and
 * listings set `openGraph.images` to their own photos, which takes precedence
 * over this file, so none of them end up sharing a Tivvo-branded card.
 *
 * Drawn here rather than shipped as a PNG so the wording and the brand colours
 * stay in one place with the rest of the code.
 */
export const alt = "Tivvo · Sistema de gestión para inmobiliarias";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Matches --l-forest / --l-forest-deep / --l-lime / --l-paper in globals.css.
const FOREST = "#164832";
const FOREST_DEEP = "#0f3524";
const LIME = "#77e500";
const PAPER = "#fbfbf8";

export default function OpengraphImage() {
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
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: LIME }} />
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1 }}>Tivvo</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            Un solo lugar para tus propiedades, ofertas y reservas
          </div>
          <div style={{ fontSize: 30, color: "rgba(251,251,248,0.7)", maxWidth: 820 }}>
            Sistema de gestión para inmobiliarias de venta y alquiler temporario.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 26, color: LIME }}>
          tivvo.app
        </div>
      </div>
    ),
    size,
  );
}
