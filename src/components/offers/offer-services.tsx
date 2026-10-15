"use client";

import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useWatch, type Control } from "react-hook-form";

import type { OfferFormValues, OfferServiceFormValue } from "@/components/offers/offer-items";
import { ServiceTypeIcon } from "@/components/services/service-type-icon";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { listServices, type Service } from "@/lib/api/services";
import { getAccessToken } from "@/lib/auth/session";
import { SERVICE_TYPE_LABELS, formatMoney, unitCount, unitPer } from "@/lib/service-labels";
import { cn } from "@/lib/utils";
import { IMAGE_WIDTH, sizedImage } from "@/lib/image-url";

/** "250" or "" → 250 or null. */
const price = (text: string) => (text.trim() === "" || Number.isNaN(Number(text)) ? null : Number(text));
const count = (text: string) => Math.max(Number.parseInt(text, 10) || 1, 1);

/** What one service line costs in the offer; null when it's "a consultar". */
export function serviceLineTotal(item: Pick<OfferServiceFormValue, "unitPrice" | "quantity">) {
  const unit = price(item.unitPrice);
  return unit == null ? null : unit * count(item.quantity);
}

export function fromLibrary(service: Service): OfferServiceFormValue {
  return {
    serviceId: service.id,
    name: service.name,
    type: service.type,
    description: service.description ?? "",
    imageUrl: service.imageUrl ?? "",
    unit: service.unit,
    unitPrice: service.price != null ? String(service.price) : "",
    quantity: "1",
    date: "",
    note: "",
  };
}

/** The library, to pick from: searchable, by name, type or place; only available services. */
function ServicePicker({
  open,
  onOpenChange,
  onPick,
  chosen,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPick: (service: Service) => void;
  chosen: string[];
}) {
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const [query, setQuery] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listServices(token);
    },
    enabled: open,
  });

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (data ?? [])
      .filter((service) => service.active)
      .filter(
        (service) =>
          !term ||
          [service.name, SERVICE_TYPE_LABELS[service.type], ...service.zones].join(" ").toLowerCase().includes(term),
      );
  }, [data, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85svh] gap-4 overflow-hidden rounded-3xl p-0 sm:max-w-xl" showCloseButton>
        <div className="flex flex-col gap-1.5 px-6 pt-6">
          <DialogTitle className="font-display text-2xl tracking-tight">Sumar un servicio</DialogTitle>
          <DialogDescription>De tu librería. Después podés ajustar precio, cantidad y fecha para esta oferta.</DialogDescription>
        </div>
        <div className="relative px-6">
          <Search className="pointer-events-none absolute top-1/2 left-9.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nombre, tipo o zona"
            aria-label="Buscar servicios"
            className="h-11 pl-10"
          />
        </div>
        <div className="min-h-0 overflow-y-auto px-3 pb-4">
          {isLoading ? (
            <div className="flex flex-col gap-2 px-3">
              {[0, 1, 2].map((index) => (
                <div key={index} className="h-16 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (data ?? []).length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
              <p className="font-display text-xl">Tu librería está vacía</p>
              <p className="max-w-xs text-sm text-muted-foreground">Cargá tus servicios una vez y sumalos a cualquier oferta.</p>
              <Button asChild variant="outline">
                <Link href={`/${agencySlug}/services`}>Ir a Servicios</Link>
              </Button>
            </div>
          ) : results.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">Ningún servicio disponible coincide.</p>
          ) : (
            <ul className="flex flex-col">
              {results.map((service) => {
                const added = chosen.includes(service.id);
                const per = unitPer(service.unit);
                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      onClick={() => onPick(service)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left outline-none hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.06]"
                    >
                      <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary text-primary/60">
                        {service.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={sizedImage(service.imageUrl, IMAGE_WIDTH.thumb)} alt="" className="size-full object-cover" />
                        ) : (
                          <ServiceTypeIcon type={service.type} className="size-5" />
                        )}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-medium">{service.name}</span>
                        <span className="truncate text-sm text-muted-foreground">
                          {SERVICE_TYPE_LABELS[service.type]}
                          {service.zones.length > 0 && ` · ${service.zones.join(", ")}`}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-sm tabular-nums">
                        {service.price != null ? (
                          <>
                            {formatMoney(service.currency, service.price)}
                            {per && <span className="block text-xs text-muted-foreground">{per}</span>}
                          </>
                        ) : (
                          <span className="text-muted-foreground">A consultar</span>
                        )}
                        {added && <span className="block text-xs font-medium text-primary">Ya está en la oferta</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ServiceLine({
  control,
  index,
  currency,
  onRemove,
}: {
  control: Control<OfferFormValues>;
  index: number;
  currency: string;
  onRemove: () => void;
}) {
  const item = useWatch({ control, name: `services.${index}` });
  if (!item) return null;
  const total = serviceLineTotal(item);
  const per = unitPer(item.unit);

  return (
    <li className="flex flex-col gap-4 rounded-3xl bg-foreground/[0.04] p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-card text-primary/60">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sizedImage(item.imageUrl, IMAGE_WIDTH.thumb)} alt="" className="size-full object-cover" />
          ) : (
            <ServiceTypeIcon type={item.type} className="size-6" />
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <ServiceTypeIcon type={item.type} className="size-3.5" />
            {SERVICE_TYPE_LABELS[item.type]}
          </span>
          <span className="font-display text-lg leading-snug">{item.name}</span>
          {item.description && <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}
        </div>
        <button
          type="button"
          aria-label={`Quitar ${item.name}`}
          title="Quitar de la oferta"
          onClick={onRemove}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.1fr_1fr_1fr]">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Precio{per && ` ${per}`} ({currency})
          </span>
          <Controller
            control={control}
            name={`services.${index}.unitPrice`}
            render={({ field }) => (
              <Input
                inputMode="decimal"
                value={field.value}
                placeholder="A consultar"
                onChange={(event) => field.onChange(event.target.value.replace(/[^\d.]/g, ""))}
                className="bg-card"
              />
            )}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Cantidad</span>
          <Controller
            control={control}
            name={`services.${index}.quantity`}
            render={({ field }) => {
              const value = count(field.value);
              const stepper =
                "flex size-9 shrink-0 items-center justify-center rounded-full outline-none hover:bg-foreground/[0.06] disabled:opacity-30 focus-visible:ring-3 focus-visible:ring-ring/50";
              return (
                <div className="flex h-11 items-center justify-between rounded-xl bg-card px-1">
                  <button type="button" aria-label="Uno menos" className={stepper} disabled={value <= 1} onClick={() => field.onChange(String(value - 1))}>
                    <Minus className="size-4" />
                  </button>
                  <span className="text-sm tabular-nums">{unitCount(item.unit, value)}</span>
                  <button type="button" aria-label="Uno más" className={stepper} onClick={() => field.onChange(String(value + 1))}>
                    <Plus className="size-4" />
                  </button>
                </div>
              );
            }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Fecha (opcional)</span>
          <Controller
            control={control}
            name={`services.${index}.date`}
            render={({ field }) => <DatePicker id={`services-${index}-date`} surface="card" value={field.value} onChange={field.onChange} />}
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Nota para el cliente (opcional)</span>
          <Controller
            control={control}
            name={`services.${index}.note`}
            render={({ field }) => (
              <Input {...field} maxLength={500} placeholder="Ej: incluye bebidas a bordo" className="bg-card" />
            )}
          />
        </label>
        <p className="shrink-0 text-right tabular-nums sm:min-w-32">
          <span className="block text-xs text-muted-foreground">Subtotal</span>
          <span className={cn("font-semibold", total == null && "font-normal text-muted-foreground")}>
            {total == null ? "A consultar" : formatMoney(currency, total)}
          </span>
        </p>
      </div>
    </li>
  );
}

/** The offer's services: picked from the library, then priced and dated for this client. */
export function OfferServicesSection({ control, currency }: { control: Control<OfferFormValues>; currency: string }) {
  const { fields, append, remove } = useFieldArray({ control, name: "services" });
  const services = useWatch({ control, name: "services" }) ?? [];
  const [picking, setPicking] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {fields.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-foreground/[0.04] px-6 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-card text-primary">
            <Sparkles className="size-5" />
          </span>
          <p className="font-display text-xl">Sin servicios todavía</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Sumá mayordomo, chef, yate, traslados o excursiones para que el cliente reciba todo en una sola oferta.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <ServiceLine key={field.id} control={control} index={index} currency={currency} onRemove={() => remove(index)} />
          ))}
        </ul>
      )}
      <div>
        <Button type="button" variant="outline" className="h-10 gap-2 px-5" onClick={() => setPicking(true)}>
          <Plus />
          Sumar servicio
        </Button>
      </div>
      <ServicePicker
        open={picking}
        onOpenChange={setPicking}
        chosen={services.map((item) => item.serviceId).filter(Boolean)}
        onPick={(service) => {
          append(fromLibrary(service));
          setPicking(false);
        }}
      />
    </div>
  );
}
