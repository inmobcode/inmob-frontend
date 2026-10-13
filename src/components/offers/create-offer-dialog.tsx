"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { NewItemButton } from "@/components/new-item-button";
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
import { createOffer } from "@/lib/api/offers";
import { getAccessToken } from "@/lib/auth/session";

const schema = z.object({ title: z.string().min(2, "Ingresá un título") });
type FormValues = z.infer<typeof schema>;

export function CreateOfferDialog() {
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { title: "" } });
  const titleError = form.formState.errors.title?.message;

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createOffer(token, values);
    },
    onSuccess: (offer) => {
      setOpen(false);
      router.push(`/${agencySlug}/offers/${offer.id}`);
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
        <NewItemButton label="Nueva oferta" />
      </DialogTrigger>
      <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-lg">
        <form
          className="flex flex-col"
          onSubmit={form.handleSubmit((values) => {
            setServerError(null);
            mutation.mutate(values);
          })}
        >
          <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">Nueva oferta</DialogTitle>
            <DialogDescription>
              Ponele un nombre fácil de reconocer. Después sumás propiedades, descuentos y el link para tu cliente.
            </DialogDescription>
          </div>

          <div className="flex flex-col gap-2.5 px-7 pb-2">
            <Label htmlFor="offer-title">Título</Label>
            <Input
              id="offer-title"
              autoComplete="off"
              autoFocus
              placeholder="Ej: Propuesta para la familia Pérez"
              aria-invalid={Boolean(titleError)}
              className="h-11 px-4"
              {...form.register("title")}
            />
            {titleError && <p className="text-sm text-destructive">{titleError}</p>}
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
                "Crear oferta"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
