import type { DocSectionId } from "@/components/docs/docs-sections";

export interface DocEntry {
  /** Also what the dashboard's help links point at: see docs-sections.ts. */
  id: DocSectionId;
  label: string;
  adminOnly?: boolean;
  Content: () => React.ReactNode;
}
