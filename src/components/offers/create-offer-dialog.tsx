"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LayoutTemplate, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { NewItemButton } from "@/components/new-item-button";
import { OperationPicker } from "@/components/offers/offer-operation";
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
import { createOffer, duplicateOffer, listOffers } from "@/lib/api/offers";
import { getAccessToken } from "@/lib/auth/session";

function makeSchema(t: (key: "titleRequired" | "referenceTooLong" | "operationRequired") => string) {
  return z.object({
    title: z.string().min(2, t("titleRequired")),
    // Optional: the agency's own tracking code, not required to create the offer.
    referenceCode: z.string().max(100, t("referenceTooLong")).optional(),
    // No default: the agent has to say which kind of offer it is.
    operation: z.enum(["SALE", "RENT", "BOTH"], { error: t("operationRequired") }),
  });
}
type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function CreateOfferDialog() {
  const t = useTranslations("offers.create");
  const common = useTranslations("common");
  const schema = useMemo(() => makeSchema(t), [t]);
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", referenceCode: "" },
  });
  const titleError = form.formState.errors.title?.message;
  const referenceCodeError = form.formState.errors.referenceCode?.message;
  const operationError = form.formState.errors.operation?.message;
  const templatesT = useTranslations("offers.templates");
  const { data: templates } = useQuery({
    queryKey: ["offers", "templates"],
    queryFn: () => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return listOffers(token, { templates: true });
    },
    enabled: open,
  });

  // Starts from a template: its content, with the title typed here if there is one.
  const templateMutation = useMutation({
    mutationFn: (templateId: string) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      const title = form.getValues("title").trim();
      return duplicateOffer(token, templateId, title.length >= 2 ? { title } : {});
    },
    onSuccess: (offer) => {
      setOpen(false);
      router.push(`/${agencySlug}/offers/${offer.id}`);
    },
    onError: (err) => setServerError(err instanceof ApiError ? err.message : common("unexpectedError")),
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const token = getAccessToken();
      if (!token) throw new ApiError("No autenticado", 401);
      return createOffer(token, { ...values, referenceCode: values.referenceCode || null });
    },
    onSuccess: (offer) => {
      setOpen(false);
      router.push(`/${agencySlug}/offers/${offer.id}`);
    },
    onError: (err) => {
      setServerError(err instanceof ApiError ? err.message : common("unexpectedError"));
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
        <NewItemButton label={t("new")} />
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
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">{t("new")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </div>

          <div className="flex flex-col gap-2.5 px-7 pb-2">
            <Label htmlFor="offer-title">{t("title")}</Label>
            <Input
              id="offer-title"
              autoComplete="off"
              autoFocus
              placeholder={t("titlePlaceholder")}
              aria-invalid={Boolean(titleError)}
              className="h-11 px-4"
              {...form.register("title")}
            />
            {titleError && <p className="text-sm text-destructive">{titleError}</p>}
          </div>

          <div className="flex flex-col gap-2.5 px-7 pt-5 pb-2">
            <Label htmlFor="offer-reference-code">
              {t("reference")} <span className="font-normal text-quiet">{common("optional")}</span>
            </Label>
            <Input
              id="offer-reference-code"
              autoComplete="off"
              placeholder={t("referencePlaceholder")}
              aria-invalid={Boolean(referenceCodeError)}
              className="h-11 px-4"
              {...form.register("referenceCode")}
            />
            {referenceCodeError && <p className="text-sm text-destructive">{referenceCodeError}</p>}
          </div>

          <div className="flex flex-col gap-2.5 px-7 pt-5 pb-2">
            <p className="text-sm leading-none font-medium">{t("operation")}</p>
            <Controller
              control={form.control}
              name="operation"
              render={({ field }) => (
                <OperationPicker value={field.value} onChange={field.onChange} invalid={Boolean(operationError)} />
              )}
            />
            {operationError && <p className="text-sm text-destructive">{operationError}</p>}
            {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          </div>

          {templates && templates.length > 0 && (
            <div className="flex flex-col gap-2.5 px-7 pt-5 pb-2">
              <p className="text-sm leading-none font-medium">{templatesT("startFrom")}</p>
              <p className="text-xs text-muted-foreground">{templatesT("startFromHint")}</p>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    disabled={templateMutation.isPending}
                    onClick={() => templateMutation.mutate(template.id)}
                    className="inline-flex h-9 max-w-full items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3.5 text-sm font-medium outline-none transition-colors hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  >
                    <LayoutTemplate className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{template.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
