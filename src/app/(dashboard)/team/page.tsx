"use client";

import { useQuery } from "@tanstack/react-query";

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
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";
import { ApiError } from "@/lib/api/client";
import { listTeam } from "@/lib/api/team";
import { getAccessToken } from "@/lib/auth/session";

export default function TeamPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["team"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listTeam(token);
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Equipo</CardTitle>
          <CardDescription>Usuarios, roles y permisos de la agencia.</CardDescription>
        </div>
        <InviteMemberDialog />
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-zinc-500">Cargando...</p>}
        {error && (
          <p className="text-sm text-destructive">
            {error instanceof ApiError ? error.message : "No se pudo cargar el equipo"}
          </p>
        )}
        {data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.isActive ? "default" : "outline"}>
                      {member.isActive ? "Activo" : "Inactivo"}
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
