"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { NewItemButton } from "@/components/new-item-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { createTeamMember } from "@/lib/api/team";
import { getAccessToken } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const makeSchema = (t: (key: "nameRequired" | "emailInvalid") => string) =>
  z.object({
    name: z.string().min(2, t("nameRequired")),
    email: z.string().email(t("emailInvalid")),
    role: z.enum(["ADMIN", "AGENT"]),
  });

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

const DEFAULTS: FormValues = { name: "", email: "", role: "AGENT" };

export function InviteMemberDialog() {
  const t = useTranslations("team.invite");
  const tRoles = useTranslations("team.roles");
  const tHints = useTranslations("team.roleHints");
  const tc = useTranslations("common");
  const schema = useMemo(() => makeSchema(tc), [tc]);
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: DEFAULTS });
  const errors = form.formState.errors;

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createTeamMember(token, values);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      handleOpenChange(false);
      toast.success(
        result.linkedExisting ? t("linked") : t("sent"),
      );
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : tc("unexpectedError")),
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      form.reset(DEFAULTS);
      setServerError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <NewItemButton label={t("title")} />
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
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </div>

          <div className="flex flex-col gap-5 px-7 pb-2">
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" autoComplete="off" placeholder={t("namePlaceholder")} aria-invalid={Boolean(errors.name)} className="h-11 px-4" {...form.register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="off" placeholder={t("emailPlaceholder")} aria-invalid={Boolean(errors.email)} className="h-11 px-4" {...form.register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-2.5">
              <Label>{t("role")}</Label>
              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <div role="radiogroup" aria-label={t("role")} className="grid gap-2 sm:grid-cols-2">
                    {(["AGENT", "ADMIN"] as const).map((value) => {
                      const active = field.value === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => field.onChange(value)}
                          className={cn(
                            "flex flex-col gap-0.5 rounded-2xl p-3.5 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                            active ? "bg-primary text-primary-foreground" : "bg-foreground/[0.06] hover:bg-foreground/10",
                          )}
                        >
                          <span className="text-sm font-medium">{tRoles(value)}</span>
                          <span className={cn("text-xs", active ? "text-primary-foreground/75" : "text-muted-foreground")}>
                            {tHints(value)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>
            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 px-7 pt-5 pb-7">
            <Button type="button" variant="ghost" className="h-10 px-5" onClick={() => handleOpenChange(false)}>
              {tc("cancel")}
            </Button>
            <Button type="submit" variant="highlight" className="h-10 gap-2 px-6" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  {t("submitting")}
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
