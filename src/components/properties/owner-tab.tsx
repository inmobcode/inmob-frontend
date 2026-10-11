"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { createOwner, listOwners } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";

export function OwnerTab({
  ownerId,
  onChange,
}: {
  ownerId: string;
  onChange: (ownerId: string) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const queryClient = useQueryClient();

  const { data: owners } = useQuery({
    queryKey: ["owners"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listOwners(token);
    },
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createOwner(token, { name, email: email || undefined, phone: phone || undefined });
    },
    onSuccess: (owner) => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      onChange(owner.id);
      setShowCreate(false);
      setName("");
      setEmail("");
      setPhone("");
    },
  });

  return (
    <div className="space-y-4">
      <Select value={ownerId || undefined} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sin propietario asignado" />
        </SelectTrigger>
        <SelectContent>
          {owners?.map((owner) => (
            <SelectItem key={owner.id} value={owner.id}>
              {owner.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!showCreate ? (
        <Button type="button" variant="outline" size="sm" onClick={() => setShowCreate(true)}>
          Nuevo propietario
        </Button>
      ) : (
        <div className="space-y-3 rounded-md border p-3">
          <Input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            placeholder="Email (opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Teléfono (opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              disabled={!name || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              Guardar propietario
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowCreate(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
