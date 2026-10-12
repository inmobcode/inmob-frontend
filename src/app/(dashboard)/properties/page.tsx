"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreatePropertyDialog } from "@/components/properties/create-property-dialog";
import { ApiError } from "@/lib/api/client";
import { deleteProperty, listProperties, type Property } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { LISTING_TYPE_LABELS, STATUS_LABELS } from "@/lib/properties-labels";

function PropertyRowActions({ property }: { property: Property }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return deleteProperty(token, property.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Propiedad eliminada");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar"),
  });

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/properties/${property.id}`}>Editar</Link>
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
            >
              Eliminar
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar &quot;{property.title}&quot;?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se va a borrar la propiedad junto con sus fotos,
            disponibilidad y cualquier oferta que la incluya.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function PropertiesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["properties"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listProperties(token);
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Propiedades</CardTitle>
          <CardDescription>
            Alta y administración de propiedades: fotos, precios, características y
            propietarios.
          </CardDescription>
        </div>
        <CreatePropertyDialog />
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-zinc-500">Cargando...</p>}
        {error && (
          <p className="text-sm text-destructive">
            {error instanceof ApiError ? error.message : "No se pudieron cargar las propiedades"}
          </p>
        )}
        {data && data.length === 0 && (
          <p className="text-sm text-zinc-500">
            Todavía no cargaste ninguna propiedad. Usá &quot;Nueva propiedad&quot; para empezar.
          </p>
        )}
        {data && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <Link href={`/properties/${property.id}`} className="hover:underline">
                      {property.title}
                    </Link>
                  </TableCell>
                  <TableCell>{LISTING_TYPE_LABELS[property.listingType]}</TableCell>
                  <TableCell>{property.category}</TableCell>
                  <TableCell>
                    {property.price
                      ? `${property.currency} ${property.price.toLocaleString()}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={property.status === "PUBLISHED" ? "default" : "secondary"}>
                      {STATUS_LABELS[property.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <PropertyRowActions property={property} />
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
