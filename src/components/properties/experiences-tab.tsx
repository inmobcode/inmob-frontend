"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { updateProperty, type Property } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";

export function ExperiencesTab({ property }: { property: Property }) {
  const queryClient = useQueryClient();
  const [featuredText, setFeaturedText] = useState(
    (property.content?.theVilla?.featuredExperienceIds ?? []).join("\n"),
  );
  const [hideNearby, setHideNearby] = useState(
    property.content?.theVilla?.hideNearbyExperiences ?? false,
  );

  const saveMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateProperty(token, property.id, {
        content: {
          theVilla: {
            ...property.content?.theVilla,
            groups: property.content?.theVilla?.groups ?? [],
            featuredExperienceIds: featuredText
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean),
            hideNearbyExperiences: hideNearby,
          },
        },
      });
    },
    onSuccess: () => {
      toast.success("Experiences guardado");
      queryClient.invalidateQueries({ queryKey: ["property", property.id] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar"),
  });

  return (
    <div className="max-w-xl space-y-4">
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="hideNearby">Ocultar esta sección en la página de la villa</FieldLabel>
          <Switch id="hideNearby" checked={hideNearby} onCheckedChange={setHideNearby} />
        </Field>
        <Field>
          <FieldLabel htmlFor="featuredText">
            Experiencias destacadas (una por línea — nombre o referencia)
          </FieldLabel>
          <Textarea
            id="featuredText"
            rows={6}
            value={featuredText}
            onChange={(e) => setFeaturedText(e.target.value)}
          />
        </Field>
      </FieldGroup>
      <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        Guardar
      </Button>
    </div>
  );
}
