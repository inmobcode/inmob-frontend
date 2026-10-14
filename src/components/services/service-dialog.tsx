"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, LoaderCircle, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Segmented } from "@/components/properties/segmented";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  createService,
  deleteService,
  updateService,
  uploadServiceImage,
  type SaveServicePayload,
  type Service,
  type ServiceType,
  type ServiceUnit,
} from "@/lib/api/services";
import { getAccessToken } from "@/lib/auth/session";
import { compressToWebp } from "@/lib/image-compression";
import { SERVICE_TYPES, SERVICE_UNITS } from "@/lib/service-labels";

const CURRENCIES = ["USD", "EUR", "ARS"].map((code) => ({ value: code, label: code }));

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

const EMPTY: SaveServicePayload = {
  name: "",
  type: "OTHER",
  description: null,
  imageUrl: null,
  zones: [],
  provider: null,
  price: null,
  currency: "USD",
  unit: "SERVICE",
  active: true,
};

function toDraft(service: Service | null): SaveServicePayload {
  if (!service) return EMPTY;
  return {
    name: service.name,
    type: service.type,
    description: service.description,
    imageUrl: service.imageUrl,
    zones: service.zones,
    provider: service.provider,
    price: service.price,
    currency: service.currency,
    unit: service.unit,
    active: service.active,
  };
}

/** Places, typed one by one: Enter or a comma adds it, the cross removes it. */
/** Quita tildes y pasa a minúsculas, para que "nino" encuentre "Niñera". */
function normalizeSearch(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

function ServiceTypeField({ value, onChange }: { value: ServiceType; onChange: (type: ServiceType) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const current = SERVICE_TYPES.find((type) => type.value === value);
  const matches = SERVICE_TYPES.filter((type) => normalizeSearch(type.label).includes(normalizeSearch(query)));

  function pick(type: ServiceType) {
    onChange(type);
    setOpen(false);
    setQuery("");
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <Button id="service-type" variant="outline" role="combobox" aria-expanded={open} className="w-full justify-start font-normal">
          {current && <current.icon />}
          {current?.label ?? "Elegí un tipo"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) gap-1 p-2">
        <Input
          autoFocus
          value={query}
          placeholder="Buscar tipo…"
          aria-label="Buscar tipo de servicio"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && matches[0]) {
              event.preventDefault();
              pick(matches[0].value);
            }
          }}
        />
        <ul className="flex max-h-64 flex-col overflow-y-auto" role="listbox" aria-label="Tipos de servicio">
          {matches.map((type) => (
            <li key={type.value} role="option" aria-selected={type.value === value}>
              <button
                type="button"
                onClick={() => pick(type.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-accent",
                  type.value === value && "bg-accent/60",
                )}
              >
                <type.icon className="size-4 shrink-0" />
                {type.label}
              </button>
            </li>
          ))}
          {matches.length === 0 && <li className="px-2 py-1.5 text-muted-foreground">Sin resultados para “{query}”</li>}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function ZonesField({ value, onChange }: { value: string[]; onChange: (zones: string[]) => void }) {
  const [text, setText] = useState("");
  function add() {
    const zone = text.trim().replace(/,$/, "");
    if (zone && !value.some((entry) => entry.toLowerCase() === zone.toLowerCase())) onChange([...value, zone]);
    setText("");
  }
  return (
    <div className="flex flex-col gap-2">
      <Input
        id="service-zones"
        value={text}
        placeholder="Ej: Ibiza, Punta del Este"
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            add();
          } else if (event.key === "Backspace" && !text && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((zone) => (
            <span key={zone} className="inline-flex h-7 items-center gap-1 rounded-full bg-secondary pr-1.5 pl-3 text-sm">
              {zone}
              <button
                type="button"
                aria-label={`Quitar ${zone}`}
                onClick={() => onChange(value.filter((entry) => entry !== zone))}
                className="flex size-5 items-center justify-center rounded-full hover:bg-foreground/10"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Creates or edits a service of the library. `service` null opens it empty.
 * The parent gives it a key per service, so the form starts fresh each time.
 */
export function ServiceDialog({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<SaveServicePayload>(() => toDraft(service));
  const [priceText, setPriceText] = useState(service?.price != null ? String(service.price) : "");
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof SaveServicePayload>(key: K, value: SaveServicePayload[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload: SaveServicePayload = {
        ...draft,
        name: draft.name.trim(),
        description: draft.description?.trim() || null,
        provider: draft.provider?.trim() || null,
        price: priceText.trim() === "" ? null : Number(priceText),
      };
      return service ? updateService(requireToken(), service.id, payload) : createService(requireToken(), payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(service ? "Servicio actualizado" : "Servicio creado");
      onOpenChange(false);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo guardar el servicio"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteService(requireToken(), service!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Servicio eliminado");
      onOpenChange(false);
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "No se pudo eliminar el servicio"),
  });

  async function upload(file: File) {
    setUploading(true);
    try {
      const compressed = await compressToWebp(file, { maxSide: 1800 });
      const { url } = await uploadServiceImage(requireToken(), compressed);
      set("imageUrl", url);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "No se pudo subir la foto");
    } finally {
      setUploading(false);
    }
  }

  const priceValid = priceText.trim() === "" || (!Number.isNaN(Number(priceText)) && Number(priceText) >= 0);
  const canSave = draft.name.trim().length >= 2 && priceValid && !saveMutation.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92svh] gap-0 overflow-y-auto rounded-3xl p-0 sm:max-w-xl" showCloseButton>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (canSave) saveMutation.mutate();
            }}
          >
            <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
              <DialogTitle className="font-display text-3xl leading-none tracking-tight">
                {service ? "Editar servicio" : "Nuevo servicio"}
              </DialogTitle>
              <DialogDescription>Queda en tu librería para sumarlo a las ofertas que quieras.</DialogDescription>
            </div>

            <FieldGroup className="px-7 pb-6">
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                aria-label={draft.imageUrl ? "Cambiar foto" : "Subir foto"}
                className="group relative flex aspect-[16/7] w-full items-center justify-center overflow-hidden rounded-2xl bg-foreground/[0.05] text-muted-foreground outline-none hover:bg-foreground/[0.08] focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {draft.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.imageUrl} alt="" className="size-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-2 text-sm">
                    <ImagePlus className="size-6" strokeWidth={1.5} />
                    Subir una foto
                  </span>
                )}
                {uploading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-foreground/50 text-background">
                    <LoaderCircle className="size-6 animate-spin" />
                  </span>
                )}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) upload(file);
                  event.target.value = "";
                }}
              />

              <div className="grid gap-5 sm:grid-cols-[1.4fr_1fr]">
                <Field>
                  <FieldLabel htmlFor="service-name">Nombre</FieldLabel>
                  <Input
                    id="service-name"
                    autoFocus
                    value={draft.name}
                    placeholder="Ej: Chef privado"
                    onChange={(event) => set("name", event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="service-type">Tipo</FieldLabel>
                  <ServiceTypeField value={draft.type} onChange={(type) => set("type", type)} />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="service-description">Descripción</FieldLabel>
                <Textarea
                  id="service-description"
                  rows={3}
                  value={draft.description ?? ""}
                  placeholder="Qué incluye, cuánto dura, para cuántas personas…"
                  onChange={(event) => set("description", event.target.value)}
                />
                <FieldDescription>El cliente la ve en la oferta.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="service-zones">Dónde se ofrece</FieldLabel>
                <ZonesField value={draft.zones} onChange={(zones) => set("zones", zones)} />
                <FieldDescription>Vacío: en cualquier lugar.</FieldDescription>
              </Field>

              <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
                <Field>
                  <FieldLabel htmlFor="service-price">Precio</FieldLabel>
                  <Input
                    id="service-price"
                    inputMode="decimal"
                    value={priceText}
                    placeholder="A consultar"
                    aria-invalid={!priceValid}
                    onChange={(event) => setPriceText(event.target.value.replace(/[^\d.]/g, ""))}
                  />
                </Field>
                <Field>
                  <FieldLabel>Moneda</FieldLabel>
                  <Segmented
                    contained
                    label="Moneda"
                    value={draft.currency}
                    options={CURRENCIES}
                    onChange={(currency) => set("currency", currency)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="service-unit">Se cobra</FieldLabel>
                  <Select value={draft.unit} onValueChange={(value) => set("unit", value as ServiceUnit)}>
                    <SelectTrigger id="service-unit" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="service-provider">Proveedor</FieldLabel>
                <Input
                  id="service-provider"
                  value={draft.provider ?? ""}
                  placeholder="Quién lo presta"
                  onChange={(event) => set("provider", event.target.value)}
                />
                <FieldDescription>Solo lo ve tu equipo, nunca el cliente.</FieldDescription>
              </Field>

              <label className="flex items-center justify-between gap-4 rounded-2xl bg-foreground/[0.04] p-4">
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Disponible</span>
                  <span className="text-sm text-muted-foreground">Si lo apagás, no se puede sumar a ofertas nuevas.</span>
                </span>
                <Switch checked={draft.active} onCheckedChange={(checked) => set("active", checked)} />
              </label>
            </FieldGroup>

            <div className="flex items-center justify-between gap-3 border-t px-7 py-5">
              {service ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 />
                  Eliminar
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={!canSave}>
                  {saveMutation.isPending && <LoaderCircle className="animate-spin" />}
                  {service ? "Guardar" : "Crear servicio"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">¿Eliminar «{service?.name}»?</AlertDialogTitle>
            <AlertDialogDescription>
              Sale de tu librería. Las ofertas que ya lo incluyen lo mantienen tal cual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => deleteMutation.mutate()}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
