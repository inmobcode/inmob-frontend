import { ImportGate } from "@/components/import/import-gate";
import { ImportWizard } from "@/components/import/import-wizard";

export default function ImportPropertiesPage() {
  return (
    <ImportGate>
      <ImportWizard />
    </ImportGate>
  );
}
