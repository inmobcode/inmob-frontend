"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { ApiError } from "@/lib/api/client";
import { createOffer } from "@/lib/api/offers";
import { getAccessToken } from "@/lib/auth/session";

const schema = z.object({ title: z.string().min(2, "Ingresá un título") });
type FormValues = z.infer<typeof schema>;

export function CreateOfferDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createOffer(token, values);
    },
    onSuccess: (offer) => {
      setOpen(false);
      router.push(`/offers/${offer.id}`);
    },
    onError: (err) => {
      setServerError(err instanceof ApiError ? err.message : "Error inesperado");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nueva oferta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva oferta</DialogTitle>
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
              <Input id="title" placeholder="Ej. Propuesta para la familia Pérez" {...form.register("title")} />
              <FieldError errors={[form.formState.errors.title]} />
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
