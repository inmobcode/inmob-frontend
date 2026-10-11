"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateClientDialog } from "@/components/clients/create-client-dialog";
import { listClients } from "@/lib/api/clients";
import { ApiError } from "@/lib/api/client";
import { getAccessToken } from "@/lib/auth/session";
import { CLIENT_STAGE_LABELS } from "@/lib/properties-labels";

export default function ClientsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listClients(token);
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>
            Contactos, oportunidades e historial de interacciones.
          </CardDescription>
        </div>
        <CreateClientDialog />
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-zinc-500">Cargando...</p>}
        {error && (
          <p className="text-sm text-destructive">
            {error instanceof ApiError ? error.message : "No se pudieron cargar los clientes"}
          </p>
        )}
        {data && data.length === 0 && (
          <p className="text-sm text-zinc-500">
            Todavía no tenés clientes. Las consultas del portal público y de las ofertas van a
            aparecer aquí automáticamente.
          </p>
        )}
        {data && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Etapa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/clients/${c.id}`} className="hover:underline">
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.source}</TableCell>
                  <TableCell>
                    <Badge variant={c.stage === "LOST" ? "outline" : "secondary"}>
                      {CLIENT_STAGE_LABELS[c.stage]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
