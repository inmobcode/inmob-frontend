"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { clearSession, getSessionUser } from "@/lib/auth/session";

const NAV_ITEMS = [
  { href: "/properties", label: "Propiedades" },
  { href: "/offers", label: "Ofertas" },
  { href: "/clients", label: "Clientes" },
  { href: "/bookings", label: "Reservas" },
  { href: "/team", label: "Equipo" },
  { href: "/settings", label: "Configuración" },
];

export function DashboardSidebar() {
  const router = useRouter();
  // Deliberately not a lazy useState initializer: document.cookie is
  // unavailable during SSR but present on the client, so reading it
  // synchronously on first render would make the hydrated output diverge
  // from the server-rendered HTML. Deferring to an effect keeps both
  // passes rendering `null` first, then fills in after mount.
  const [user, setUser] = useState<ReturnType<typeof getSessionUser>>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getSessionUser());
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r bg-white sm:flex dark:bg-zinc-950">
      <div className="px-4 py-4 text-lg font-semibold">Inmobiliario</div>
      <nav className="flex flex-1 flex-col gap-1 px-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {user && (
        <div className="border-t px-4 py-3">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-zinc-500">{user.role}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start px-0"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      )}
    </aside>
  );
}
