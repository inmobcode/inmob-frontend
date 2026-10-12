"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { CategoryChips } from "@/components/properties/category-chips";
import { ListingTypeCards } from "@/components/properties/listing-type-cards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { createProperty } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { gsap } from "@/lib/gsap";
import { duration, ease, media } from "@/lib/motion";
import { ACCOMMODATION_TYPES, REAL_ESTATE_TYPES } from "@/lib/property-catalogs";

const schema = z.object({
  title: z.string().min(2, "Ingresá un título"),
  listingType: z.enum(["SALE", "RENT"]),
  category: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

// Receives the trigger's props (ref, onClick, aria-*) from DialogTrigger's
// `asChild`, so they must be forwarded to the underlying Button.
function NewPropertyButton({ onPointerEnter, onPointerLeave, onFocus, onBlur, ...props }: React.ComponentProps<typeof Button>) {
  const iconRef = useRef<SVGSVGElement>(null);

  function spin(rotation: number) {
    if (window.matchMedia(media.reduceMotion).matches) return;
    gsap.to(iconRef.current, { rotation, duration: duration.base, ease: ease.out });
  }

  return (
    <Button
      size="lg"
      className="h-10 gap-2.5 pr-5 pl-1.5"
      {...props}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        spin(90);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        spin(0);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        spin(90);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        spin(0);
      }}
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-highlight text-highlight-foreground">
        <Plus ref={iconRef} className="size-4" strokeWidth={2.5} />
      </span>
      Nueva propiedad
    </Button>
  );
}

export function CreatePropertyDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", listingType: "SALE", category: "HOUSE" },
  });
  const listingType = useWatch({ control: form.control, name: "listingType" });
  const categoryOptions = listingType === "RENT" ? ACCOMMODATION_TYPES : REAL_ESTATE_TYPES;
  const titleError = form.formState.errors.title?.message;

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createProperty(token, values);
    },
    onSuccess: (property) => {
      setOpen(false);
      router.push(`/properties/${property.id}`);
    },
    onError: (err) => {
      setServerError(err instanceof ApiError ? err.message : "Error inesperado");
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset();
      setServerError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <NewPropertyButton />
      </DialogTrigger>
      <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-lg" showCloseButton>
        <form
          className="flex flex-col"
          onSubmit={form.handleSubmit((values) => {
            setServerError(null);
            mutation.mutate(values);
          })}
        >
          <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">
              Nueva propiedad
            </DialogTitle>
            <DialogDescription>
              Empezá con lo básico. Después sumás fotos, precio y características.
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-6 px-7 pb-2">
            <div className="flex flex-col gap-2.5">
              <Label>¿Qué vas a hacer con ella?</Label>
              <Controller
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <ListingTypeCards
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      const next = value === "RENT" ? ACCOMMODATION_TYPES : REAL_ESTATE_TYPES;
                      if (!next.includes(form.getValues("category"))) {
                        form.setValue("category", next[0]);
                      }
                    }}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                autoComplete="off"
                placeholder="Ej: Casa frente al mar en La Barra"
                aria-invalid={Boolean(titleError)}
                className="h-11 px-4"
                {...form.register("title")}
              />
              {titleError && <p className="text-sm text-destructive">{titleError}</p>}
            </div>

            <div className="flex flex-col gap-2.5">
              <Label>Categoría</Label>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <CategoryChips
                    key={listingType}
                    options={categoryOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 px-7 pt-5 pb-7">
            <Button type="button" variant="ghost" className="h-10 px-5" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="highlight" className="h-10 gap-2 px-6" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Creando…
                </>
              ) : (
                "Crear propiedad"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
