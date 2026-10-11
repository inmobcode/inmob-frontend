"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  createRecommendation,
  deleteRecommendation,
  listRecommendations,
  updateRecommendation,
  type RecommendationPriority,
  type RecommendationStatus,
} from "@/lib/api/recommendations";
import { getAccessToken } from "@/lib/auth/session";

const STATUS_LABELS: Record<RecommendationStatus, string> = {
  PROPOSED: "Propuesta",
  APPROVED: "Aprobada",
  DONE: "Hecha",
};

export function RecommendationsTab({ propertyId }: { propertyId: string }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState<RecommendationPriority>("MEDIUM");
  const [estCost, setEstCost] = useState("");
  const queryClient = useQueryClient();

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations", propertyId],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listRecommendations(token, propertyId);
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["recommendations", propertyId] });
  }

  const createMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createRecommendation(token, propertyId, {
        title,
        details: details || undefined,
        priority,
        estCost: estCost ? Number(estCost) : undefined,
      });
    },
    onSuccess: () => {
      setTitle("");
      setDetails("");
      setEstCost("");
      invalidate();
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RecommendationStatus }) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateRecommendation(token, propertyId, id, { status });
    },
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return deleteRecommendation(token, propertyId, id);
    },
    onSuccess: invalidate,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-md border p-4">
        <h4 className="text-sm font-medium">Nueva recomendación de mejora</h4>
        <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          placeholder="Detalle"
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <div className="flex gap-2">
          <Select value={priority} onValueChange={(v) => setPriority(v as RecommendationPriority)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Baja</SelectItem>
              <SelectItem value="MEDIUM">Media</SelectItem>
              <SelectItem value="HIGH">Alta</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Costo estimado"
            inputMode="decimal"
            value={estCost}
            onChange={(e) => setEstCost(e.target.value)}
          />
          <Button
            type="button"
            size="sm"
            disabled={!title || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            Agregar
          </Button>
        </div>
      </div>

      {recommendations && recommendations.length > 0 ? (
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <div key={rec.id} className="rounded-md border p-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium">{rec.title}</p>
                <Badge variant="secondary">{rec.priority}</Badge>
              </div>
              {rec.details && <p className="mt-1 text-zinc-600">{rec.details}</p>}
              {rec.estCost != null && <p className="text-zinc-500">Costo estimado: {rec.estCost}</p>}
              <div className="mt-2 flex items-center gap-2">
                <Select
                  value={rec.status}
                  onValueChange={(status) =>
                    statusMutation.mutate({ id: rec.id, status: status as RecommendationStatus })
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeMutation.mutate(rec.id)}
                >
                  Quitar
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Todavía no hay recomendaciones.</p>
      )}
    </div>
  );
}
