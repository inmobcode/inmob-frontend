import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 text-center dark:bg-black">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Inmobiliario</h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          Plataforma de gestión para agencias inmobiliarias: propiedades, CRM,
          ofertas y reservas en un solo lugar.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/login">Iniciar sesión</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/register">Crear agencia</Link>
        </Button>
      </div>
    </div>
  );
}
