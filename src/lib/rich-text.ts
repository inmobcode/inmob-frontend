// Formatted text from the rich text editor, stored as HTML the backend already cleaned.
// Text written before the editor existed is plain, with line breaks.

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain text doesn't start with a tag. */
export function isHtml(value: string) {
  return value.trimStart().startsWith("<");
}

/** HTML for any stored value: plain text becomes one paragraph per non-empty line. */
export function richTextHtml(value: string) {
  if (isHtml(value)) return value;
  return value
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}

/** The words alone, for one-line previews (lists, cards). */
export function richTextPlain(value: string) {
  if (!isHtml(value)) return value;
  return value
    .replace(/<\/(p|h2|h3|li)>/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
