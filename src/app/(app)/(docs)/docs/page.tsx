import { getLocale } from "next-intl/server";

import { DocsIndex } from "@/components/docs/docs-index";
import { docSections } from "@/content/docs";
import { isLocale } from "@/i18n/config";

export default async function DocsPage() {
  const locale = await getLocale();
  const sections = docSections(isLocale(locale) ? locale : "es");
  return (
    <DocsIndex entries={sections.map(({ id, label }) => ({ id, label }))}>
      {sections.map(({ id, Content }) => (
        <Content key={id} />
      ))}
    </DocsIndex>
  );
}
