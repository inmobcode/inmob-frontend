"use client";

import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { FormSection } from "@/components/properties/form-section";
import { Button } from "@/components/ui/button";
import { useFormat } from "@/i18n/format";
import { openBillingPortal } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/client";
import { getAccessToken, useSessionUser } from "@/lib/auth/session";
import { useBilling } from "@/lib/use-billing";

/** Settings: the agency's plan, when the free trial ends, and Paddle's portal to change the card or cancel. */
export function BillingSection() {
  const t = useTranslations("billing.settings");
  const { date } = useFormat();
  const { data: billing } = useBilling();
  const user = useSessionUser();

  const portal = useMutation({
    mutationFn: async () => {
      const token = getAccessToken();
      if (!token) throw new Error("No session");
      return openBillingPortal(token);
    },
    onSuccess: ({ url }) => window.location.assign(url),
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("failed")),
  });

  // Only the owner manages the subscription. Without billing (local development) there is none to show.
  if (user?.role !== "OWNER" || !billing?.billingEnabled) return null;

  const trialing = billing.status === "TRIALING" && billing.trialEndsAt;

  return (
    <FormSection title={t("title")} description={t("description")} shown={null}>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-foreground/[0.04] px-5 py-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium">
            {t(`plan.${billing.plan}`)} · {t(`status.${billing.status}`)}
          </p>
          {trialing && (
            <p className="text-sm text-muted-foreground">
              {t("trialEnds", { date: date(new Date(billing.trialEndsAt as string), "long") })}
            </p>
          )}
        </div>
        <Button type="button" variant="outline" disabled={portal.isPending} onClick={() => portal.mutate()}>
          {portal.isPending && <LoaderCircle className="animate-spin" />}
          {t("manage")}
        </Button>
      </div>
    </FormSection>
  );
}
