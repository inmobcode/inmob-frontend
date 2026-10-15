/**
 * Structured data (schema.org) for search engines: what a page is about, in a
 * form a crawler can read without guessing from the markup.
 *
 * Payloads carry agency- and owner-written text (titles, descriptions), so
 * every `<` is escaped: a listing called `</script>` would otherwise close
 * this tag and run as markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Drops the keys we had no value for, so the payload never states `null`. */
export function compact<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}
