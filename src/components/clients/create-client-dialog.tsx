"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { createClient } from "@/lib/api/clients";
import { getAccessToken } from "@/lib/auth/session";

const schema = z.object({
  name: z.string().min(2, "Ingresá un nombre"),
  email: z.string().email("Email inválido"),
  phone: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function CreateClientDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createClient(token, { ...values, phone: values.phone || undefined });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      form.reset({ name: "", email: "", phone: "" });
      setOpen(false);
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : "Error inesperado"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nuevo cliente</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
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
              <FieldLabel htmlFor="name">Nombre</FieldLabel>
              <Input id="name" {...form.register("name")} />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" {...form.register("email")} />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Teléfono (opcional)</FieldLabel>
              <Input id="phone" {...form.register("phone")} />
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
