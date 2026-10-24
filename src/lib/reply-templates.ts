/**
 * The placeholders a reply template can carry. The token stays the same in
 * every language ("{firstName}"); the dashboard shows each one by its label in
 * "inquiries.templates.placeholders.<key>".
 */
export const REPLY_PLACEHOLDERS = ["firstName", "name", "property", "agency", "me"] as const;

export type ReplyPlaceholder = (typeof REPLY_PLACEHOLDERS)[number];

export const placeholderToken = (key: ReplyPlaceholder) => `{${key}}`;

/**
 * Fills a template's placeholders. Unknown tokens are left as typed, so a
 * stray "{algo}" in the text doesn't vanish; a known one without a value
 * becomes empty and the spaces around it are tidied.
 */
export function fillPlaceholders(text: string, values: Partial<Record<ReplyPlaceholder, string | null>>) {
  return text
    .replace(/\{(\w+)\}/g, (token, key: string) =>
      (REPLY_PLACEHOLDERS as readonly string[]).includes(key) ? (values[key as ReplyPlaceholder] ?? "") : token,
    )
    .replace(/[ \t]+([,.;:!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ");
}
