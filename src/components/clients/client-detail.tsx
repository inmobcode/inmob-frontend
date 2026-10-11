"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import {
  addInteraction,
  getClient,
  updateClient,
  type ClientStage,
  type InteractionType,
} from "@/lib/api/clients";
import { getAccessToken } from "@/lib/auth/session";
import { CLIENT_STAGE_LABELS } from "@/lib/properties-labels";

const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  NOTE: "Nota",
  CALL: "Llamada",
  EMAIL: "Email",
  MEETING: "Reunión",
};

export function ClientDetail({ clientId }: { clientId: string }) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");

  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return getClient(token, clientId);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { stage?: ClientStage; notes?: string }) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateClient(token, clientId, payload);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["client", clientId], (prev: typeof client) => ({
        ...prev,
        ...updated,
      }));
      toast.success("Cambios guardados");
    },
  });

  const noteMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return addInteraction(token, clientId, { type: "NOTE", content: noteContent });
    },
    onSuccess: () => {
      setNoteContent("");
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    },
  });

  if (isLoading || !client) {
    return <p className="text-sm text-zinc-500">Cargando...</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{client.name}</h1>
        <p className="text-sm text-zinc-500">{client.email}</p>
        {client.phone && <p className="text-sm text-zinc-500">{client.phone}</p>}
        <Badge className="mt-2">{client.source}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Etapa</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={client.stage}
            onValueChange={(value) => updateMutation.mutate({ stage: value as ClientStage })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CLIENT_STAGE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={4}
            defaultValue={client.notes ?? ""}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => updateMutation.mutate({ notes: notes ?? client.notes ?? "" })}
          >
            Guardar notas
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de interacciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              rows={2}
              placeholder="Agregar una nota..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <Button
              size="sm"
              disabled={!noteContent || noteMutation.isPending}
              onClick={() => noteMutation.mutate()}
            >
              Agregar
            </Button>
          </div>
          {client.interactions && client.interactions.length > 0 ? (
            <ul className="space-y-3">
              {client.interactions.map((interaction) => (
                <li key={interaction.id} className="rounded-md border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{INTERACTION_TYPE_LABELS[interaction.type]}</Badge>
                    <span className="text-xs text-zinc-500">
                      {new Date(interaction.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-zinc-700 dark:text-zinc-300">{interaction.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">Todavía no hay interacciones registradas.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
