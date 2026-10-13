"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Copy,
  ExternalLink,
  LoaderCircle,
  Paintbrush,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FormSection } from "@/components/properties/form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAgency, updateAgency, uploadAgencyLogo } from "@/lib/api/agency";
import { ApiError } from "@/lib/api/client";
import { getAccessToken, useRequireNonAgent } from "@/lib/auth/session";
import { compressToWebp } from "@/lib/image-compression";
import { useActionBarStore } from "@/lib/store/action-bar-store";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Ingresá un nombre"),
  slug: z
    .string()
    .min(2, "Ingresá una dirección")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Solo minúsculas, números y guiones"),
  contactEmail: z
    .string()
    .refine(
      (value) => value === "" || z.string().email().safeParse(value).success,
      "Email inválido",
    ),
  locale: z.string().length(2),
  currency: z.string().length(3),
});

type FormValues = z.infer<typeof schema>;

const LOCALES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
];

const CURRENCIES = ["USD", "ARS", "EUR", "UYU", "BRL", "MXN", "CLP"];

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  // A value saved before this list existed still has to show up as selected.
  const all =
    options.some((option) => option.value === value) || !value
      ? options
      : [...options, { value, label: value }];
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-wrap gap-1.5"
    >
      {all.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/[0.06] text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex max-w-2xl animate-pulse flex-col gap-12">
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="h-6 w-48 rounded-full bg-muted" />
          <div className="h-11 w-full rounded-xl bg-muted" />
        </div>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  useRequireNonAgent();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const setActions = useActionBarStore((state) => state.setActions);
  const resetActions = useActionBarStore((state) => state.reset);

  const { data: agency, isLoading } = useQuery({
    queryKey: ["agency"],
    queryFn: () => getAgency(requireToken()),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      contactEmail: "",
      locale: "es",
      currency: "USD",
    },
  });
  const slug = useWatch({ control: form.control, name: "slug" });
  const errors = form.formState.errors;
  const isDirty = form.formState.isDirty;
  const slugChanged = Boolean(agency && slug && slug !== agency.slug);

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
    mutationFn: (values: FormValues) =>
      updateAgency(requireToken(), {
        name: values.name,
        slug: values.slug,
        contactEmail: values.contactEmail || null,
        locale: values.locale,
        currency: values.currency,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["agency"], updated);
      form.reset({
        name: updated.name,
        slug: updated.slug,
        contactEmail: updated.contactEmail ?? "",
        locale: updated.locale,
        currency: updated.currency,
      });
      toast.success("Cambios guardados");
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "No se pudo guardar"),
  });

  const logoMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = requireToken();
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
      toast.error(
        err instanceof ApiError ? err.message : "No se pudo subir el logo",
      );
    },
  });

  useEffect(() => {
    setActions({
      title: "Configuración",
      isSubmitting: saveMutation.isPending,
      isDirty,
      canSubmit: true,
      saveLabel: "Guardar",
      onSave: form.handleSubmit((values) => saveMutation.mutate(values)),
      onPublish: null,
      onCancel: null,
      extra: agency ? (
        <div className="flex items-center gap-1 sm:mr-2">
          <Button
            type="button"
            variant="ghost"
            className="gap-1.5"
            onClick={copyLink}
            title="Copiar link del portal"
          >
            <Copy />
            <span className="hidden md:inline">Copiar link</span>
          </Button>
          <Button type="button" variant="ghost" className="gap-1.5" asChild>
            <a
              href={`/page/${agency.slug}`}
              target="_blank"
              rel="noreferrer"
              title="Ver portal"
            >
              <ExternalLink />
              <span className="hidden md:inline">Ver portal</span>
            </a>
          </Button>
          <Button type="button" variant="ghost" className="gap-1.5" asChild>
            <Link href="/portal" title="Personalizar portal">
              <Paintbrush />
              <span className="hidden md:inline">Personalizar portal</span>
            </Link>
          </Button>
        </div>
      ) : null,
    });
    return resetActions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, saveMutation.isPending, agency?.slug]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/page/${agency?.slug ?? slug}`,
      );
      toast.success("Link copiado");
    } catch {
      toast.error("No se pudo copiar el link");
    }
  }

  if (isLoading || !agency || !formReady) return <Skeleton />;

  const uploading = isCompressing || logoMutation.isPending;

  return (
    <form
      className="flex max-w-2xl min-w-0 flex-col gap-12"
      onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
    >
      <h1 className="sr-only">Configuración</h1>

      <FormSection
        title="Tu agencia"
        description="El nombre y el logo con los que te ven tus clientes."
        shown
      >
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Cambiar el logo"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-foreground/[0.06] text-muted-foreground outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {agency.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agency.logoUrl}
                alt={agency.name}
                className="size-full object-contain p-2"
              />
            ) : (
              <Building2 className="size-8" strokeWidth={1.5} />
            )}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-foreground/55 text-xs font-medium text-background opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100",
                uploading && "opacity-100",
              )}
            >
              {uploading ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                "Cambiar"
              )}
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) logoMutation.mutate(file);
              event.target.value = "";
            }}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <Label htmlFor="name">Nombre de la agencia</Label>
            <Input
              id="name"
              autoComplete="off"
              aria-invalid={Boolean(errors.name)}
              className="h-11 px-4"
              {...form.register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Portal público"
        description="La página donde tus clientes ven tus propiedades."
        shown
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="slug">Dirección del portal</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-muted-foreground">
                /
              </span>
              <Input
                id="slug"
                autoComplete="off"
                aria-invalid={Boolean(errors.slug)}
                className="h-11 pr-4 pl-8"
                {...form.register("slug")}
              />
            </div>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
            {slugChanged && (
              <p className="flex items-start gap-2 rounded-2xl bg-amber-500/15 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                Cambiar la dirección rompe los links que ya compartiste.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <Label htmlFor="contactEmail">
              Email de contacto{" "}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              autoComplete="off"
              placeholder="contacto@tuagencia.com"
              aria-invalid={Boolean(errors.contactEmail)}
              className="h-11 px-4"
              {...form.register("contactEmail")}
            />
            {errors.contactEmail && (
              <p className="text-sm text-destructive">
                {errors.contactEmail.message}
              </p>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Preferencias"
        description="Cómo se muestran los textos y los precios por defecto."
        shown={false}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <Label>Idioma</Label>
            <Controller
              control={form.control}
              name="locale"
              render={({ field }) => (
                <Chips
                  label="Idioma"
                  options={LOCALES}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label>Moneda por defecto</Label>
            <Controller
              control={form.control}
              name="currency"
              render={({ field }) => (
                <Chips
                  label="Moneda por defecto"
                  options={CURRENCIES.map((value) => ({ value, label: value }))}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </FormSection>
    </form>
  );
}
