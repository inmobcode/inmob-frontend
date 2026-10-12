"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { getAgency, updateAgency, uploadAgencyLogo } from "@/lib/api/agency";
import { getAccessToken } from "@/lib/auth/session";
import { compressToWebp } from "@/lib/image-compression";

const schema = z.object({
  name: z.string().min(2, "Ingresá un nombre"),
  slug: z
    .string()
    .min(2, "Ingresá un slug")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  contactEmail: z.string(),
  locale: z.string().length(2, "2 letras, ej. es"),
  currency: z.string().length(3, "3 letras, ej. USD"),
});

type FormValues = z.infer<typeof schema>;

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const { data: agency, isLoading } = useQuery({
    queryKey: ["agency"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return getAgency(token);
    },
  });

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  const slugValue = useWatch({ control: form.control, name: "slug" });

  const [formReady, setFormReady] = useState(false);
  useEffect(() => {
    if (agency) {
      form.reset({
        name: agency.name,
        slug: agency.slug,
        contactEmail: agency.contactEmail ?? "",
        locale: agency.locale,
        currency: agency.currency,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- gates the form's first render until reset() has populated real values
      setFormReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agency?.id]);

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateAgency(token, {
        name: values.name,
        slug: values.slug,
        contactEmail: values.contactEmail || null,
        locale: values.locale,
        currency: values.currency,
      });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["agency"], updated);
      toast.success("Cambios guardados");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar"),
  });

  const logoMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      setIsCompressing(true);
      const compressed = await compressToWebp(file, { maxSide: 512 });
      setIsCompressing(false);
      return uploadAgencyLogo(token, compressed);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["agency"], updated);
      toast.success("Logo actualizado");
    },
    onError: (err) => {
      setIsCompressing(false);
      toast.error(err instanceof ApiError ? err.message : "No se pudo subir el logo");
    },
  });

  if (isLoading || !agency || !formReady) {
    return <p className="text-sm text-zinc-500">Cargando...</p>;
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
        <CardDescription>Perfil de la agencia y branding del portal público.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border bg-zinc-50 dark:bg-zinc-900">
              {agency.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={agency.logoUrl} alt={agency.name} className="h-full w-full object-contain" />
              ) : (
                <span className="text-xs text-zinc-400">Sin logo</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) logoMutation.mutate(file);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isCompressing || logoMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {isCompressing || logoMutation.isPending ? "Subiendo..." : "Cambiar logo"}
            </Button>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nombre de la agencia</FieldLabel>
              <Input id="name" {...form.register("name")} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="slug">Slug del portal público</FieldLabel>
              <Input id="slug" {...form.register("slug")} />
              <p className="text-xs text-zinc-500">
                Tu portal público vive en /{slugValue || agency.slug}. Cambiarlo rompe
                cualquier link que ya hayas compartido.
              </p>
              <FieldError errors={[form.formState.errors.slug]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="contactEmail">Email de contacto</FieldLabel>
              <Input id="contactEmail" type="email" {...form.register("contactEmail")} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="locale">Idioma</FieldLabel>
                <Input id="locale" maxLength={2} {...form.register("locale")} />
                <FieldError errors={[form.formState.errors.locale]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="currency">Moneda por defecto</FieldLabel>
                <Input id="currency" maxLength={3} {...form.register("currency")} />
                <FieldError errors={[form.formState.errors.currency]} />
              </Field>
            </div>
          </FieldGroup>

          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
