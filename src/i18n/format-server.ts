import { getLocale } from "next-intl/server";

import { formatTools } from "./format";

/** formatTools() for the request's language, in async Server Components and metadata. */
export async function getFormat() {
  return formatTools(await getLocale());
}
