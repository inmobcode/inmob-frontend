// Formatted text from the rich text editor, stored as HTML the backend already cleaned.
// Text written before the editor existed is plain, with line breaks.
// It is cleaned once more here (allowlist of what the editor can produce) because
// it ends up in dangerouslySetInnerHTML on public pages.

import sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "h2", "h3", "strong", "b", "em", "i", "s", "u", "ul", "ol", "li", "blockquote", "code", "pre", "hr", "a"],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer nofollow", target: "_blank" }),
  },
};

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain text doesn't start with a tag. */
export function isHtml(value: string) {
  return value.trimStart().startsWith("<");
}

/** HTML for any stored value: plain text becomes one paragraph per non-empty line. */
export function richTextHtml(value: string) {
  if (isHtml(value)) return sanitizeHtml(value, SANITIZE_OPTIONS);
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
