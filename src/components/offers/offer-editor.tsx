"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Link2, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { OfferStatusPill } from "@/components/offers/offer-status-pill";
import {
  emptyOfferProperty,
  linePrice,
  OfferSectionBlock,
  type OfferFormValues,
} from "@/components/offers/offer-items";
import { FormSection as Section } from "@/components/properties/form-section";
import { Segmented } from "@/components/properties/segmented";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { listProperties } from "@/lib/api/properties";
import { getOffer, sendOffer, updateOffer, type Offer, type SaveOfferPayload } from "@/lib/api/offers";
import { getAccessToken } from "@/lib/auth/session";
import { useActionBarStore } from "@/lib/store/action-bar-store";

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

type FormValues = OfferFormValues;

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

const CURRENCIES = ["USD", "EUR"];

function ToggleRow({
  id,
  title,
  description,
  checked,
  onChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 rounded-2xl bg-foreground/[0.04] p-4">
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="text-sm font-medium">
          {title}
        </label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function OfferEditor({ offerId }: { offerId: string }) {
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();
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
  const isDirty = form.formState.isDirty;
  const currency = useWatch({ control: form.control, name: "currency" }) || "USD";
  const sections = useWatch({ control: form.control, name: "sections" });
  const [copied, setCopied] = useState(false);

  // Re-sync the form from the server whenever the offer actually changes
  // (initial load, or after a save/send mutation). The editor stays on its
  // skeleton until the form has been filled once, so no field renders empty.
  const [formFilled, setFormFilled] = useState(false);
  useEffect(() => {
    if (!offer) return;
    form.reset(toFormValues(offer));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormFilled(true);
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
      isDirty,
      canSubmit: true,
      saveLabel: "Guardar",
      publishLabel: "Enviar oferta",
      onSave: form.handleSubmit((values) => saveMutation.mutate(values)),
      onPublish:
        offer?.status === "DRAFT"
          ? form.handleSubmit((values) => sendMutation.mutate(values))
          : null,
      onCancel: () => router.push(`/${agencySlug}/offers`),
    });
    return resetActions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer, isDirty, saveMutation.isPending, sendMutation.isPending]);

  const allProperties = useMemo(() => properties ?? [], [properties]);
  const chosen = (sections ?? []).flatMap((section) => section.properties ?? []);
  const lines = chosen.filter((item) => item.propertyId);
  const total = lines.reduce(
    (sum, item) => sum + (linePrice(item, allProperties.find((entry) => entry.id === item.propertyId)).final ?? 0),
    0,
  );

  if (isLoading || !offer || !formFilled) {
    return (
      <div className="flex animate-pulse flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <div className="h-56 rounded-3xl bg-muted" />
          <div className="h-44 rounded-3xl bg-muted" />
          <div className="h-72 rounded-3xl bg-muted" />
        </div>
        <div className="h-64 rounded-3xl bg-muted lg:w-80" />
      </div>
    );
  }

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/offer/${offer.token}` : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copiado");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar. Seleccioná el link y copialo a mano.");
    }
  }

  const currencyOptions = (CURRENCIES.includes(currency) ? CURRENCIES : [...CURRENCIES, currency]).map((code) => ({
    value: code,
    label: code,
  }));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
      <div className="flex max-w-3xl min-w-0 flex-col gap-12">
        <Section
          title="General"
          description="Cómo se llama la oferta y qué ve el cliente al abrirla."
          shown={false}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <Input id="title" className="h-12 text-base" {...form.register("title")} />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
            <Field>
              <FieldLabel>Moneda</FieldLabel>
              <Controller
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <div className="flex">
                    <Segmented
                      contained
                      label="Moneda"
                      value={field.value || "USD"}
                      options={currencyOptions}
                      onChange={field.onChange}
                    />
                  </div>
                )}
              />
            </Field>
            <div className="flex flex-col gap-3">
              <Controller
                control={form.control}
                name="showPrice"
                render={({ field }) => (
                  <ToggleRow
                    id="showPrice"
                    title="Mostrar precios al cliente"
                    description="Si lo apagás, el cliente ve las propiedades sin montos ni total."
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="branded"
                render={({ field }) => (
                  <ToggleRow
                    id="branded"
                    title="Mostrar la identidad de tu agencia"
                    description="Encabezado, pie y datos de contacto de la agencia en la oferta."
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </FieldGroup>
        </Section>

        <Section
          title="Bienvenida"
          description="El saludo con el que arranca la oferta."
          shown
        >
          <FieldGroup>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="welcomeTitle">Título</FieldLabel>
                <Input id="welcomeTitle" placeholder="Ej: Bienvenidos" {...form.register("welcomeTitle")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="welcomeDateLabel">Fecha o temporada</FieldLabel>
                <Input id="welcomeDateLabel" placeholder="Ej: Verano 2026" {...form.register("welcomeDateLabel")} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="welcomeContent">Mensaje</FieldLabel>
              <Textarea id="welcomeContent" rows={3} {...form.register("welcomeContent")} />
              <FieldDescription>Los saltos de línea se respetan.</FieldDescription>
            </Field>
          </FieldGroup>
        </Section>

        <Section
          title="Propiedades"
          description="Agrupalas en secciones y ajustá el precio de cada una para esta oferta."
          shown
        >
          <div className="flex flex-col gap-5">
            {sectionFields.length === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-3xl bg-foreground/[0.04] px-6 py-10 text-center">
                <p className="font-display text-xl">Todavía no hay propiedades</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Creá una sección y sumale las propiedades que querés mostrarle a tu cliente.
                </p>
              </div>
            )}
            {sectionFields.map((field, sectionIndex) => (
              <OfferSectionBlock
                key={field.id}
                control={form.control}
                sectionIndex={sectionIndex}
                properties={allProperties}
                currency={currency}
                onRemoveSection={() => removeSection(sectionIndex)}
              />
            ))}
            <div>
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-2 px-5"
                onClick={() => appendSection({ title: "", text: "", properties: [emptyOfferProperty()] })}
              >
                <Plus />
                Agregar sección
              </Button>
            </div>
          </div>
        </Section>
      </div>

      <aside className="order-first lg:order-none">
        <div className="sticky top-28 flex flex-col gap-5 rounded-3xl bg-secondary p-6">
          <div className="flex items-center justify-between gap-3">
            <OfferStatusPill status={offer.status} />
            {offer.clientId && (
              <Link
                href={`/${agencySlug}/clients/${offer.clientId}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                <UserRound className="size-4" />
                Ver cliente
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Total de la oferta</p>
            {lines.length > 0 && total > 0 ? (
              <p className="tabular-nums">
                <span className="mr-1.5 text-sm font-medium text-muted-foreground">{currency}</span>
                <span className="text-4xl font-semibold tracking-tight">
                  {total.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </span>
              </p>
            ) : (
              <p className="text-2xl font-medium text-muted-foreground">Sin total todavía</p>
            )}
            <p className="text-sm text-muted-foreground">
              {lines.length} {lines.length === 1 ? "propiedad" : "propiedades"} en {sectionFields.length}{" "}
              {sectionFields.length === 1 ? "sección" : "secciones"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Link2 className="size-4" />
              Link para el cliente
            </p>
            {offer.status === "DRAFT" ? (
              <p className="text-sm text-muted-foreground">Se activa cuando envíes la oferta.</p>
            ) : (
              <>
                <Input
                  readOnly
                  aria-label="Link público de la oferta"
                  value={publicUrl}
                  onFocus={(event) => event.currentTarget.select()}
                  className="bg-card text-sm"
                />
                <Button type="button" variant="outline" className="h-10 gap-2" onClick={copyLink}>
                  <Copy />
                  {copied ? "Copiado" : "Copiar link"}
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
