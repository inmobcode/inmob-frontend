"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { NewItemButton } from "@/components/new-item-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { createClient } from "@/lib/api/clients";
import { getAccessToken } from "@/lib/auth/session";

function makeSchema(t: (key: "nameRequired" | "emailInvalid") => string) {
  return z.object({
    name: z.string().min(2, t("nameRequired")),
    email: z.string().email(t("emailInvalid")),
    phone: z.string(),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function CreateClientDialog() {
  const t = useTranslations("clients.create");
  const common = useTranslations("common");
  const schema = useMemo(() => makeSchema(common), [common]);
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "" },
  });
  const errors = form.formState.errors;

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createClient(token, { ...values, phone: values.phone || undefined });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setOpen(false);
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : common("unexpectedError")),
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
        <NewItemButton label={t("new")} />
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
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">{t("new")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </div>

          <div className="flex flex-col gap-5 px-7 pb-2">
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                autoComplete="off"
                placeholder={t("namePlaceholder")}
                aria-invalid={Boolean(errors.name)}
                className="h-11 px-4"
                {...form.register("name")}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder={t("emailPlaceholder")}
                aria-invalid={Boolean(errors.email)}
                className="h-11 px-4"
                {...form.register("email")}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="phone">
                {t("phone")} <span className="font-normal text-muted-foreground">{common("optional")}</span>
              </Label>
              <Input id="phone" autoComplete="off" placeholder={t("phonePlaceholder")} className="h-11 px-4" {...form.register("phone")} />
            </div>
            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 px-7 pt-5 pb-7">
            <Button type="button" variant="ghost" className="h-10 px-5" onClick={() => handleOpenChange(false)}>
              {common("cancel")}
            </Button>
            <Button type="submit" variant="highlight" className="h-10 gap-2 px-6" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  {common("creating")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
