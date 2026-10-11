"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { createProperty } from "@/lib/api/properties";
import { getAccessToken } from "@/lib/auth/session";
import { LISTING_TYPE_LABELS } from "@/lib/properties-labels";
import { ACCOMMODATION_TYPES, REAL_ESTATE_TYPES } from "@/lib/property-catalogs";

const schema = z.object({
  title: z.string().min(2, "Ingresá un título"),
  listingType: z.enum(["SALE", "RENT"]),
  category: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nueva propiedad</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva propiedad</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            setServerError(null);
            mutation.mutate(values);
          })}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Título</FieldLabel>
              <Input id="title" {...form.register("title")} />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="listingType">Tipo</FieldLabel>
              <Controller
                control={form.control}
                name="listingType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const nextOptions = value === "RENT" ? ACCOMMODATION_TYPES : REAL_ESTATE_TYPES;
                      if (!nextOptions.includes(form.getValues("category"))) {
                        form.setValue("category", nextOptions[0]);
                      }
                    }}
                  >
                    <SelectTrigger id="listingType" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
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
              <FieldLabel htmlFor="category">Categoría</FieldLabel>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </FieldGroup>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
