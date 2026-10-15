import type { Metadata } from "next";

import { StatusButton, StatusScreen } from "@/components/shared/status-screen";
import { LEGAL_ENTITY } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      searching
      title="No encontramos esta dirección."
      tail="Puede que se haya movido o que ya no esté publicada."
      actions={<StatusButton href="/">Volver al inicio</StatusButton>}
      links={[
        { href: "/", label: "Inicio", hint: "Qué es Tivvo y cómo funciona" },
        { href: "/login", label: "Ingresar", hint: "Entrá al panel de tu agencia" },
        { href: `mailto:${LEGAL_ENTITY.contactEmail}`, label: "Escribinos", hint: LEGAL_ENTITY.contactEmail },
      ]}
    />
  );
}
