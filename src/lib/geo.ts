export interface Coordinates {
  lat: number;
  lng: number;
}

function valid(lat: number, lng: number): Coordinates | null {
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

/**
 * Pulls coordinates out of a full Google Maps link. Short links
 * (maps.app.goo.gl) carry no coordinates, so they return null.
 */
export function parseGoogleMapsCoords(url: string): Coordinates | null {
  const decoded = decodeURIComponent(url);
  const patterns = [
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|ll|query|center)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
  ];
  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (match) {
      const found = valid(Number(match[1]), Number(match[2]));
      if (found) return found;
    }
  }
  return null;
}

/** Looks an address up in OpenStreetMap's Nominatim. Call it only on a user action. */
export async function geocode(query: string): Promise<(Coordinates & { label: string }) | null> {
  const params = new URLSearchParams({ format: "jsonv2", limit: "1", "accept-language": "es", q: query });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
  if (!res.ok) throw new Error("No se pudo consultar el buscador de direcciones");
  const results = (await res.json()) as { lat: string; lon: string; display_name: string }[];
  const first = results[0];
  if (!first) return null;
  const found = valid(Number(first.lat), Number(first.lon));
  return found ? { ...found, label: first.display_name } : null;
}

export function formatCoordinate(value: number) {
  return String(Math.round(value * 1e6) / 1e6);
}
