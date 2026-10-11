"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { createRoom, listProperties } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";

export function RoomsTab({ hotelPropertyId }: { hotelPropertyId: string }) {
  const queryClient = useQueryClient();

  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listProperties(token);
    },
  });

  const addMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createRoom(token, hotelPropertyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });

  const rooms = properties?.filter((p) => p.parentPropertyId === hotelPropertyId) ?? [];

  return (
    <div className="space-y-4">
      <Button type="button" onClick={() => addMutation.mutate()} disabled={addMutation.isPending}>
        + Agregar habitación
      </Button>

      {rooms.length === 0 ? (
        <p className="text-sm text-zinc-500">Este hotel todavía no tiene habitaciones.</p>
      ) : (
        <div className="space-y-2">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
              <span>{room.title}</span>
              <Link href={`/properties/${room.id}`} className="text-blue-600 hover:underline">
                Editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
