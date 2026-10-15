// Place names (areas, regions, countries) are typed by hand, so the same place
// shows up as "Islas Baleares", "islas baleares" or "ISLAS BALEARES". These
// helpers compare them without caring and show them with proper capitals.

/** What two spellings of a place have in common: lowercase, no accents, single spaces. */
export function placeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function samePlace(a: string | null | undefined, b: string | null | undefined) {
  return !!a && !!b && placeKey(a) === placeKey(b);
}

/** Whether any of the property's place fields is the given place. */
export function placeMatches(
  place: { area?: string | null; region?: string | null; country?: string | null },
  wanted: string,
) {
  return [place.area, place.region, place.country].some((value) => samePlace(value, wanted));
}

const SMALL_WORDS = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "en", "da", "do"]);

/**
 * "islas baleares" or "ISLAS BALEARES" → "Islas Baleares". Text that already
 * mixes upper and lower case is left as the person wrote it ("Río de la Plata", "São Paulo").
 */
export function placeLabel(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  const hasLower = text !== text.toUpperCase();
  const hasUpper = text !== text.toLowerCase();
  if (hasLower && hasUpper) return text;
  return text
    .toLowerCase()
    .split(" ")
    .map((word, index) => (index > 0 && SMALL_WORDS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

/** One entry per place, in alphabetical order, spelled with proper capitals. Empty values drop out. */
export function uniquePlaces(values: (string | null | undefined)[]) {
  const byKey = new Map<string, string>();
  for (const value of values) {
    if (!value || !value.trim()) continue;
    const key = placeKey(value);
    if (!byKey.has(key)) byKey.set(key, placeLabel(value));
  }
  return [...byKey.values()].sort((a, b) => a.localeCompare(b, "es"));
}
