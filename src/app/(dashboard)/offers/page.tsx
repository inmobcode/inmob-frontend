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
import { CreateOfferDialog } from "@/components/offers/create-offer-dialog";
import { ApiError } from "@/lib/api/client";
import { listOffers } from "@/lib/api/offers";
import { getAccessToken } from "@/lib/auth/session";
import { OFFER_STATUS_LABELS } from "@/lib/properties-labels";

export default function OffersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["offers"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listOffers(token);
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ofertas</CardTitle>
          <CardDescription>
            Armado de ofertas compartibles: selección de propiedades, descuentos y link
            público.
          </CardDescription>
        </div>
        <CreateOfferDialog />
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-zinc-500">Cargando...</p>}
        {error && (
          <p className="text-sm text-destructive">
            {error instanceof ApiError ? error.message : "No se pudieron cargar las ofertas"}
          </p>
        )}
        {data && data.length === 0 && (
          <p className="text-sm text-zinc-500">
            Todavía no creaste ninguna oferta. Usá &quot;Nueva oferta&quot; para empezar.
          </p>
        )}
        {data && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Propiedades</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <Link href={`/offers/${offer.id}`} className="hover:underline">
                      {offer.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {offer.sections.reduce((count, section) => count + section.properties.length, 0)}
                  </TableCell>
                  <TableCell>
                    {offer.total ? `${offer.currency} ${offer.total.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={offer.status === "DRAFT" ? "secondary" : "default"}>
                      {OFFER_STATUS_LABELS[offer.status]}
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
