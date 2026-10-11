"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { updateProperty, type Property } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";

function groupsToText(groups: { title: string; items: string[] }[] | undefined): string {
  if (!groups || groups.length === 0) return "";
  return groups.map((g) => `${g.title}\n${g.items.join("\n")}`).join("\n\n");
}

function textToGroups(text: string): { title: string; items: string[] }[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0)
    .map(([title, ...items]) => ({ title, items }));
}

export function VillaPageTab({ property }: { property: Property }) {
  const queryClient = useQueryClient();
  const [outdoorTitle, setOutdoorTitle] = useState(property.content?.outdoorTitle ?? "");
  const [outdoorDescription, setOutdoorDescription] = useState(
    property.content?.outdoorDescription ?? "",
  );
  const [outdoorImageUrl, setOutdoorImageUrl] = useState(property.content?.outdoorImageUrl ?? "");
  const [groupsText, setGroupsText] = useState(groupsToText(property.content?.theVilla?.groups));

  const saveMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateProperty(token, property.id, {
        content: {
          outdoorTitle: outdoorTitle || undefined,
          outdoorDescription: outdoorDescription || undefined,
          outdoorImageUrl: outdoorImageUrl || undefined,
          theVilla: {
            ...property.content?.theVilla,
            groups: textToGroups(groupsText),
            featuredExperienceIds: property.content?.theVilla?.featuredExperienceIds ?? [],
            hideNearbyExperiences: property.content?.theVilla?.hideNearbyExperiences ?? false,
          },
        },
      });
    },
    onSuccess: () => {
      toast.success("Villa Page guardada");
      queryClient.invalidateQueries({ queryKey: ["property", property.id] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar"),
  });

  return (
    <div className="max-w-xl space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="outdoorTitle">Título del bloque exterior</FieldLabel>
          <Input id="outdoorTitle" value={outdoorTitle} onChange={(e) => setOutdoorTitle(e.target.value)} />
        </Field>
        <Field>
          <FieldLabel htmlFor="outdoorDescription">Descripción del exterior</FieldLabel>
          <Textarea
            id="outdoorDescription"
            rows={4}
            value={outdoorDescription}
            onChange={(e) => setOutdoorDescription(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="outdoorImageUrl">Imagen del exterior (URL)</FieldLabel>
          <Input
            id="outdoorImageUrl"
            value={outdoorImageUrl}
            onChange={(e) => setOutdoorImageUrl(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="groupsText">
            The Villa — grupos de ambientes (primera línea = título, el resto = items; una línea en
            blanco separa grupos)
          </FieldLabel>
          <Textarea
            id="groupsText"
            rows={8}
            placeholder={"Living principal\nSofá cama\nChimenea\n\nCocina\nIsla central"}
            value={groupsText}
            onChange={(e) => setGroupsText(e.target.value)}
          />
        </Field>
      </FieldGroup>
      <Button type="button" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        Guardar Villa Page
      </Button>
    </div>
  );
}
