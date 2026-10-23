"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { NewItemButton } from "@/components/new-item-button";
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
import { ACCOMMODATION_TYPES, REAL_ESTATE_TYPES } from "@/lib/property-catalogs";

const makeSchema = (titleRequired: string) => z.object({
  title: z.string().min(2, titleRequired),
  listingType: z.enum(["SALE", "RENT"]),
  category: z.string().min(1),
});

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

export function CreatePropertyDialog() {
  const t = useTranslations("properties.create");
  const common = useTranslations("common");
  const router = useRouter();
  const { agencySlug } = useParams<{ agencySlug: string }>();
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(makeSchema(t("titleRequired"))),
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
      router.push(`/${agencySlug}/properties/${property.id}`);
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
              {t("new")}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </div>

          <div className="flex flex-col gap-6 px-7 pb-2">
            <div className="flex flex-col gap-2.5">
              <Label>{t("operation")}</Label>
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
              <Label htmlFor="title">{t("title")}</Label>
              <Input
                id="title"
                autoComplete="off"
                placeholder={t("titlePlaceholder")}
                aria-invalid={Boolean(titleError)}
                className="h-11 px-4"
                {...form.register("title")}
              />
              {titleError && <p className="text-sm text-destructive">{titleError}</p>}
            </div>

            <div className="flex flex-col gap-2.5">
              <Label>{t("category")}</Label>
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
