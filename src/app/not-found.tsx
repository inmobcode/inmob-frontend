import { StatusButton, StatusScreen } from "@/components/shared/status-screen";

export default function NotFound() {
  return (
    <StatusScreen
      code="404"
      title="No encontramos esa página"
      description="El enlace puede estar vencido o la dirección tener un error."
      actions={<StatusButton href="/">Ir al inicio</StatusButton>}
    />
  );
}
