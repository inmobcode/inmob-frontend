"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Hand, Home, Link2, Plus, Settings2, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { OperationPicker } from "@/components/offers/offer-operation";
import { OfferServicesSection, serviceLineTotal } from "@/components/offers/offer-services";
import { OfferStatusPill } from "@/components/offers/offer-status-pill";
import {
  emptyOfferProperty,
  linePrice,
  OfferSectionBlock,
  type OfferFormValues,
} from "@/components/offers/offer-items";
import { SectionNavbar, type SectionGroup } from "@/components/properties/editor-shell";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import { FormSection as Section } from "@/components/properties/form-section";
import { Segmented } from "@/components/properties/segmented";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ApiError } from "@/lib/api/client";
import { listClients } from "@/lib/api/clients";
import { listProperties } from "@/lib/api/properties";
import { getOffer, sendOffer, updateOffer, type Offer, type SaveOfferPayload } from "@/lib/api/offers";
import { getAccessToken } from "@/lib/auth/session";
import { gsap, useGSAP } from "@/lib/gsap";
import { distance, duration, ease, media } from "@/lib/motion";
import { getPublicOrigin } from "@/lib/public-origin";
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
  referenceCode: z.string(),
  operation: z.enum(["SALE", "RENT", "BOTH"]),
  currency: z.string().length(3, "3 letras, ej. USD"),
  showPrice: z.boolean(),
  branded: z.boolean(),
  welcomeTitle: z.string(),
  welcomeDateLabel: z.string(),
  welcomeContent: z.string(),
  clientId: z.string(),
  services: z.array(
    z.object({
      serviceId: z.string(),
      name: z.string().min(1),
      type: z.enum([
        "BUTLER",
        "CHEF",
        "YACHT",
        "TRANSFER",
        "CAR",
        "EXCURSION",
        "SPA",
        "BABYSITTER",
        "HOUSEKEEPING",
        "EVENT",
        "OTHER",
      ]),
      description: z.string(),
      imageUrl: z.string(),
      unit: z.enum(["SERVICE", "PERSON", "DAY", "NIGHT", "HOUR"]),
      unitPrice: z.string(),
      quantity: z.string(),
      date: z.string(),
      note: z.string(),
    }),
  ),
  sections: z.array(offerSectionSchema),
});

type FormValues = OfferFormValues;

function toFormValues(offer: Offer): FormValues {
  return {
    title: offer.title,
    referenceCode: offer.referenceCode ?? "",
    operation: offer.operation,
    currency: offer.currency,
    showPrice: offer.showPrice,
    branded: offer.branded,
    welcomeTitle: offer.welcomeTitle ?? "",
    welcomeDateLabel: offer.welcomeDateLabel ?? "",
    welcomeContent: offer.welcomeContent ?? "",
    clientId: offer.clientId ?? "",
    services: (offer.services ?? []).map((item) => ({
      serviceId: item.serviceId ?? "",
      name: item.name,
      type: item.type,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      unit: item.unit,
      unitPrice: item.unitPrice != null ? String(item.unitPrice) : "",
      quantity: String(item.quantity),
      date: item.date ?? "",
      note: item.note ?? "",
    })),
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
    referenceCode: values.referenceCode.trim() || null,
    operation: values.operation,
    currency: values.currency,
    showPrice: values.showPrice,
    branded: values.branded,
    welcomeTitle: values.welcomeTitle || null,
    welcomeDateLabel: values.welcomeDateLabel || null,
    welcomeContent: values.welcomeContent || null,
    clientId: values.clientId || null,
    services: values.services.map((item) => ({
      serviceId: item.serviceId || null,
      name: item.name,
      type: item.type,
      description: item.description || null,
      imageUrl: item.imageUrl || null,
      unit: item.unit,
      unitPrice: item.unitPrice.trim() !== "" && !Number.isNaN(Number(item.unitPrice)) ? Number(item.unitPrice) : null,
      quantity: Math.max(Number.parseInt(item.quantity, 10) || 1, 1),
      date: item.date || null,
      note: item.note.trim() || null,
    })),
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

// Radix Select can't hold an empty value, so "no client" gets its own.
const NO_CLIENT = "none";

// One section per group, so the action bar shows them as plain pills.
const TAB_GROUPS: SectionGroup[] = [
  { label: "General", tabs: [{ value: "general", label: "General", icon: Settings2 }] },
  { label: "Bienvenida", tabs: [{ value: "bienvenida", label: "Bienvenida", icon: Hand }] },
  { label: "Propiedades", tabs: [{ value: "propiedades", label: "Propiedades", icon: Home }] },
  { label: "Servicios", tabs: [{ value: "servicios", label: "Servicios", icon: Sparkles }] },
];

/** The tab holding the first invalid field, so a failed save shows the error. */
function tabWithError(errors: FieldErrors<FormValues>): string | null {
  if (errors.title || errors.operation || errors.currency) return "general";
  if (errors.sections) return "propiedades";
  if (errors.services) return "servicios";
  return null;
}

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
  const searchParams = useSearchParams();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const activeTab = searchParams.get("tab") ?? "general";
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

  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listClients(token);
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
  const operation = useWatch({ control: form.control, name: "operation" });
  const sections = useWatch({ control: form.control, name: "sections" });
  const clientId = useWatch({ control: form.control, name: "clientId" });
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
      // Changing only the sections doesn't touch the offer row, so `updatedAt`
      // may not move and the effect above won't re-sync: reset here.
      form.reset(toFormValues(updated));
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
      form.reset(toFormValues(updated));
      toast.success(updated.clientEmail ? `Oferta enviada a ${updated.clientEmail}` : "Link publicado");
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo enviar"),
  });

  const isDraft = offer?.status === "DRAFT";
  const canResend = offer?.status === "SENT" || offer?.status === "VIEWED";

  function setTab(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`/${agencySlug}/offers/${offerId}?${params.toString()}`);
  }

  function showInvalid(errors: FieldErrors<FormValues>) {
    const tab = tabWithError(errors);
    if (tab && tab !== activeTab) setTab(tab);
    toast.error("Revisá los campos marcados");
  }

  useEffect(() => {
    setActions({
      title: offer?.title ?? "Oferta",
      back: { href: `/${agencySlug}/offers`, label: "Ofertas" },
      navigation: offer ? <SectionNavbar groups={TAB_GROUPS} active={activeTab} onChange={setTab} /> : null,
      isSubmitting: saveMutation.isPending || sendMutation.isPending,
      isDirty,
      canSubmit: true,
      saveLabel: "Guardar",
      // Without a client there's nobody to email: sending only turns the link on.
      // Once out, it can only be sent again to a client.
      publishLabel: isDraft ? (clientId ? "Enviar oferta" : "Publicar link") : "Reenviar oferta",
      onSave: form.handleSubmit((values) => saveMutation.mutate(values), showInvalid),
      onPublish:
        isDraft || (canResend && clientId)
          ? form.handleSubmit((values) => sendMutation.mutate(values), showInvalid)
          : null,
      onCancel: () => router.push(`/${agencySlug}/offers`),
    });
    return resetActions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer, activeTab, clientId, isDirty, saveMutation.isPending, sendMutation.isPending]);

  const contentRef = useRef<HTMLDivElement>(null);
  const shownTab = useRef(activeTab);

  // The tab content eases in whenever you switch tabs.
  useGSAP(
    () => {
      // Only animate when the tab actually changed (not on mount or Strict Mode re-runs).
      if (shownTab.current === activeTab) return;
      shownTab.current = activeTab;
      const mm = gsap.matchMedia();
      mm.add(media.allowMotion, () => {
        gsap.from(contentRef.current, { opacity: 0, y: distance.sm, duration: duration.base, ease: ease.out });
      });
      return () => mm.revert();
    },
    { dependencies: [activeTab] },
  );

  const allProperties = useMemo(() => properties ?? [], [properties]);
  const chosen = (sections ?? []).flatMap((section) => section.properties ?? []);
  const lines = chosen.filter((item) => item.propertyId);
  const total = lines.reduce(
    (sum, item) => sum + (linePrice(item, allProperties.find((entry) => entry.id === item.propertyId)).final ?? 0),
    0,
  );
  const offerServices = useWatch({ control: form.control, name: "services" }) ?? [];
  const servicesTotal = offerServices.reduce((sum, item) => sum + (serviceLineTotal(item) ?? 0), 0);

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

  const publicUrl = typeof window !== "undefined" ? `${getPublicOrigin()}/offer/${offer.token}` : "";

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
      <Tabs value={activeTab} onValueChange={setTab} className="max-w-3xl min-w-0">
        <div ref={contentRef}>
          <TabsContent value="general" className="mt-0">
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
                  <FieldLabel htmlFor="referenceCode">
                    Reference code <span className="font-normal text-muted-foreground">(opcional)</span>
                  </FieldLabel>
                  <Input id="referenceCode" placeholder="Ej: REF-1042" {...form.register("referenceCode")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="client">Cliente</FieldLabel>
                  <Controller
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <Select
                        value={field.value || NO_CLIENT}
                        onValueChange={(value) => field.onChange(value === NO_CLIENT ? "" : value)}
                      >
                        <SelectTrigger id="client" className="h-11 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NO_CLIENT}>Sin cliente</SelectItem>
                          {clients?.map((entry) => (
                            <SelectItem key={entry.id} value={entry.id}>
                              {entry.name}
                              <span className="text-muted-foreground">{entry.email}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldDescription>
                    {offer.status !== "DRAFT"
                      ? clientId
                        ? "Con «Reenviar oferta» le llega el link por email."
                        : "La oferta ya está publicada. Elegí un cliente para mandarle el link por email."
                      : clientId
                        ? "Al enviar la oferta le llega el link por email."
                        : "Sin cliente, la oferta solo publica el link y lo compartís vos."}
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel>Operación</FieldLabel>
                  <Controller
                    control={form.control}
                    name="operation"
                    render={({ field }) => <OperationPicker value={field.value} onChange={field.onChange} />}
                  />
                  <FieldDescription>Define qué propiedades podés sumar a la oferta.</FieldDescription>
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
          </TabsContent>

          <TabsContent value="bienvenida" className="mt-0">
            <Section title="Bienvenida" description="El saludo con el que arranca la oferta." shown>
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
                  <Controller
                    control={form.control}
                    name="welcomeContent"
                    render={({ field }) => (
                      <RichTextEditor id="welcomeContent" value={field.value} onChange={field.onChange} stickyToolbar />
                    )}
                  />
                  <FieldDescription>Usá títulos, negrita y listas para ordenar el mensaje.</FieldDescription>
                </Field>
              </FieldGroup>
            </Section>
          </TabsContent>

          <TabsContent value="propiedades" className="mt-0">
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
          </TabsContent>

          <TabsContent value="servicios" className="mt-0">
            <Section
              title="Servicios"
              description="Experiencias y servicios de tu librería, con el precio, la cantidad y la fecha para este cliente."
              shown
            >
              <OfferServicesSection control={form.control} currency={currency} />
            </Section>
          </TabsContent>
        </div>
      </Tabs>

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

          {/* Rentals are options to choose from, priced per night: adding them up says nothing. */}
          {operation === "RENT" ? (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                {lines.length} {lines.length === 1 ? "propiedad" : "propiedades"} en {sectionFields.length}{" "}
                {sectionFields.length === 1 ? "sección" : "secciones"}
              </p>
              {offerServices.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {offerServices.length} {offerServices.length === 1 ? "servicio" : "servicios"}
                  {servicesTotal > 0 && (
                    <>
                      {" "}
                      por{" "}
                      <span className="font-medium text-foreground tabular-nums">
                        {currency} {servicesTotal.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Total de la oferta</p>
              {total + servicesTotal > 0 ? (
                <p className="tabular-nums">
                  <span className="mr-1.5 text-sm font-medium text-muted-foreground">{currency}</span>
                  <span className="text-4xl font-semibold tracking-tight">
                    {(total + servicesTotal).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                  </span>
                </p>
              ) : (
                <p className="text-2xl font-medium text-muted-foreground">Sin total todavía</p>
              )}
              <p className="text-sm text-muted-foreground">
                {lines.length} {lines.length === 1 ? "propiedad" : "propiedades"} en {sectionFields.length}{" "}
                {sectionFields.length === 1 ? "sección" : "secciones"}
                {offerServices.length > 0 &&
                  ` y ${offerServices.length} ${offerServices.length === 1 ? "servicio" : "servicios"}`}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Link2 className="size-4" />
              Link para el cliente
            </p>
            {offer.status === "DRAFT" ? (
              <p className="text-sm text-muted-foreground">
                {clientId ? "Se activa cuando envíes la oferta." : "Se activa cuando publiques el link."}
              </p>
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
