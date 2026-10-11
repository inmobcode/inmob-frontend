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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { createTeamMember } from "@/lib/api/team";
import { getAccessToken } from "@/lib/auth/session";

const schema = z.object({
  name: z.string().min(2, "Ingresá un nombre"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  role: z.enum(["ADMIN", "AGENT"]),
});

type FormValues = z.infer<typeof schema>;

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "AGENT" },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createTeamMember(token, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      form.reset({ name: "", email: "", password: "", role: "AGENT" });
      setOpen(false);
    },
    onError: (err) => {
      setServerError(err instanceof ApiError ? err.message : "Error inesperado");
    },
  });

  function onSubmit(values: FormValues) {
    setServerError(null);
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invitar miembro</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar miembro al equipo</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
              <FieldLabel htmlFor="password">Contraseña temporal</FieldLabel>
              <Input id="password" type="password" {...form.register("password")} />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Rol</FieldLabel>
              <Select
                defaultValue={form.getValues("role")}
                onValueChange={(value) => form.setValue("role", value as FormValues["role"])}
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="AGENT">Agente</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Invitando..." : "Invitar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
