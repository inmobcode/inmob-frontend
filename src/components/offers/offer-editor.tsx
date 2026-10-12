"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, type Control } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { listProperties, type Property } from "@/lib/api/properties";
import {
  getOffer,
  sendOffer,
  updateOffer,
  type Offer,
  type SaveOfferPayload,
} from "@/lib/api/offers";
import { getAccessToken } from "@/lib/auth/session";
import { useActionBarStore } from "@/lib/store/action-bar-store";
import { DISCOUNT_TYPE_LABELS, OFFER_STATUS_LABELS } from "@/lib/properties-labels";

const offerPropertySchema = z.object({
  propertyId: z.string().min(1, "Elegí una propiedad"),
  priceOverride: z.string(),
  discountType: z.enum(["NONE", "PERCENT", "FIXED"]),
  discountValue: z.string(),
  securityDeposit: z.string(),
  bottomText: z.string(),
});

const offerSectionSchema = z.object({
  title: z.string(),
  text: z.string(),
  properties: z.array(offerPropertySchema),
});

const schema = z.object({
  title: z.string().min(2, "Ingresá un título"),
  currency: z.string().length(3, "3 letras, ej. USD"),
  showPrice: z.boolean(),
  branded: z.boolean(),
  welcomeTitle: z.string(),
  welcomeDateLabel: z.string(),
  welcomeContent: z.string(),
  sections: z.array(offerSectionSchema),
});

type FormValues = z.infer<typeof schema>;

function toFormValues(offer: Offer): FormValues {
  return {
    title: offer.title,
    currency: offer.currency,
    showPrice: offer.showPrice,
    branded: offer.branded,
    welcomeTitle: offer.welcomeTitle ?? "",
    welcomeDateLabel: offer.welcomeDateLabel ?? "",
    welcomeContent: offer.welcomeContent ?? "",
    sections: offer.sections.map((section) => ({
      title: section.title ?? "",
      text: section.text ?? "",
      properties: section.properties.map((item) => ({
        propertyId: item.propertyId,
        priceOverride: item.priceOverride?.toString() ?? "",
        discountType: item.discountType,
        discountValue: item.discountValue.toString(),
        securityDeposit: item.securityDeposit?.toString() ?? "",
        bottomText: item.bottomText ?? "",
      })),
    })),
  };
}

function toPayload(values: FormValues): SaveOfferPayload {
  return {
    title: values.title,
    currency: values.currency,
    showPrice: values.showPrice,
    branded: values.branded,
    welcomeTitle: values.welcomeTitle || null,
    welcomeDateLabel: values.welcomeDateLabel || null,
    welcomeContent: values.welcomeContent || null,
    sections: values.sections.map((section) => ({
      title: section.title || null,
      text: section.text || null,
      properties: section.properties.map((item) => ({
        propertyId: item.propertyId,
        priceOverride: item.priceOverride.trim() !== "" ? Number(item.priceOverride) : null,
        discountType: item.discountType,
        discountValue: Number(item.discountValue) || 0,
        securityDeposit: item.securityDeposit.trim() !== "" ? Number(item.securityDeposit) : null,
        bottomText: item.bottomText || null,
      })),
    })),
  };
}

function emptyProperty() {
  return {
    propertyId: "",
    priceOverride: "",
    discountType: "NONE" as const,
    discountValue: "0",
    securityDeposit: "",
    bottomText: "",
  };
}

function OfferSectionCard({
  control,
  sectionIndex,
  onRemoveSection,
  properties,
}: {
  control: Control<FormValues>;
  sectionIndex: number;
  onRemoveSection: () => void;
  properties: Property[];
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.properties`,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <Field>
            <FieldLabel htmlFor={`sections.${sectionIndex}.title`}>
              Título de la sección (opcional)
            </FieldLabel>
            <Controller
              control={control}
              name={`sections.${sectionIndex}.title`}
              render={({ field }) => (
                <Input
                  id={`sections.${sectionIndex}.title`}
                  placeholder="Ej. Seleccionadas para usted"
                  {...field}
                />
              )}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`sections.${sectionIndex}.text`}>Texto (opcional)</FieldLabel>
            <Controller
              control={control}
              name={`sections.${sectionIndex}.text`}
              render={({ field }) => (
                <Textarea id={`sections.${sectionIndex}.text`} rows={2} {...field} />
              )}
            />
          </Field>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onRemoveSection}>
          Eliminar sección
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, propertyIndex) => (
          <div key={field.id} className="space-y-3 rounded-md border p-3">
            <div className="flex items-start justify-between gap-3">
              <Field className="flex-1">
                <FieldLabel>Propiedad</FieldLabel>
                <Controller
                  control={control}
                  name={`sections.${sectionIndex}.properties.${propertyIndex}.propertyId`}
                  render={({ field: selectField }) => (
                    <Select value={selectField.value} onValueChange={selectField.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Elegir propiedad" />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-6"
                onClick={() => remove(propertyIndex)}
              >
                Quitar
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field>
                <FieldLabel>Precio override</FieldLabel>
                <Controller
                  control={control}
                  name={`sections.${sectionIndex}.properties.${propertyIndex}.priceOverride`}
                  render={({ field: f }) => <Input inputMode="decimal" {...f} />}
                />
              </Field>
              <Field>
                <FieldLabel>Descuento</FieldLabel>
                <Controller
                  control={control}
                  name={`sections.${sectionIndex}.properties.${propertyIndex}.discountType`}
                  render={({ field: f }) => (
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DISCOUNT_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <FieldLabel>Valor descuento</FieldLabel>
                <Controller
                  control={control}
                  name={`sections.${sectionIndex}.properties.${propertyIndex}.discountValue`}
                  render={({ field: f }) => <Input inputMode="decimal" {...f} />}
                />
              </Field>
              <Field>
                <FieldLabel>Depósito de seguridad</FieldLabel>
                <Controller
                  control={control}
                  name={`sections.${sectionIndex}.properties.${propertyIndex}.securityDeposit`}
                  render={({ field: f }) => <Input inputMode="decimal" {...f} />}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Texto corto (opcional)</FieldLabel>
              <Controller
                control={control}
                name={`sections.${sectionIndex}.properties.${propertyIndex}.bottomText`}
                render={({ field: f }) => <Input placeholder="Ej. Incluye limpieza final" {...f} />}
              />
            </Field>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append(emptyProperty())}>
          Agregar propiedad
        </Button>
      </CardContent>
    </Card>
  );
}

export function OfferEditor({ offerId }: { offerId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setActions = useActionBarStore((state) => state.setActions);
  const resetActions = useActionBarStore((state) => state.reset);

  const { data: offer, isLoading } = useQuery({
    queryKey: ["offer", offerId],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return getOffer(token, offerId);
    },
  });

  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listProperties(token);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { sections: [] },
  });
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({ control: form.control, name: "sections" });

  // Re-sync the form from the server whenever the offer actually changes
  // (initial load, or after a save/send mutation).
  const [formReady, setFormReady] = useState(false);
  useEffect(() => {
    if (offer) {
      form.reset(toFormValues(offer));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- gates the form's first render until reset() has populated real values
      setFormReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer?.updatedAt]);

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return updateOffer(token, offerId, toPayload(values));
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["offer", offerId], updated);
      toast.success("Cambios guardados");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar"),
  });

  const sendMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      await updateOffer(token, offerId, toPayload(values));
      return sendOffer(token, offerId);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["offer", offerId], updated);
      toast.success("Oferta enviada");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo enviar"),
  });

  useEffect(() => {
    setActions({
      title: offer?.title ?? "Oferta",
      isSubmitting: saveMutation.isPending || sendMutation.isPending,
      canSubmit: true,
      saveLabel: "Guardar cambios",
      publishLabel: "Enviar oferta",
      onSave: form.handleSubmit((values) => saveMutation.mutate(values)),
      onPublish:
        offer?.status === "DRAFT"
          ? form.handleSubmit((values) => sendMutation.mutate(values))
          : null,
      onCancel: () => router.push("/offers"),
    });
    return resetActions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer, saveMutation.isPending, sendMutation.isPending]);

  if (isLoading || !offer || !formReady) {
    return <p className="text-sm text-zinc-500">Cargando...</p>;
  }

  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}/offer/${offer.token}` : "";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Badge>{OFFER_STATUS_LABELS[offer.status]}</Badge>
        {offer.clientId && (
          <Link href={`/clients/${offer.clientId}`} className="text-sm text-blue-600 hover:underline">
            Ver cliente
          </Link>
        )}
        {offer.status !== "DRAFT" && (
          <div className="flex items-center gap-2">
            <Input readOnly value={publicUrl} className="w-80" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(publicUrl);
                toast.success("Link copiado");
              }}
            >
              Copiar link
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <Input id="title" {...form.register("title")} />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="currency">Moneda</FieldLabel>
                <Input id="currency" maxLength={3} {...form.register("currency")} />
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="showPrice">Mostrar precios al cliente</FieldLabel>
                <Controller
                  control={form.control}
                  name="showPrice"
                  render={({ field }) => (
                    <Switch id="showPrice" checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </Field>
            </div>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="branded">Mostrar header, footer y contacto de la agencia</FieldLabel>
              <Controller
                control={form.control}
                name="branded"
                render={({ field }) => (
                  <Switch id="branded" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bienvenida</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="welcomeTitle">Título de bienvenida</FieldLabel>
                <Input id="welcomeTitle" placeholder="Ej. Bienvenidos" {...form.register("welcomeTitle")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="welcomeDateLabel">Fecha / temporada</FieldLabel>
                <Input id="welcomeDateLabel" placeholder="Ej. Verano 2026" {...form.register("welcomeDateLabel")} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="welcomeContent">Contenido</FieldLabel>
              <Textarea id="welcomeContent" rows={3} {...form.register("welcomeContent")} />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Secciones y propiedades</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendSection({ title: "", text: "", properties: [emptyProperty()] })}
          >
            Agregar sección
          </Button>
        </div>

        {sectionFields.length === 0 && (
          <p className="text-sm text-zinc-500">
            Todavía no agregaste secciones. Usá &quot;Agregar sección&quot; para empezar.
          </p>
        )}

        {sectionFields.map((field, sectionIndex) => (
          <OfferSectionCard
            key={field.id}
            control={form.control}
            sectionIndex={sectionIndex}
            onRemoveSection={() => removeSection(sectionIndex)}
            properties={properties ?? []}
          />
        ))}
      </div>
    </div>
  );
}
