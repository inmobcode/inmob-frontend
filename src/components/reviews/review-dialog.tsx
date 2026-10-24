"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { PropertyPicker } from "@/components/properties/property-picker";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { listProperties } from "@/lib/api/properties";
import { createReview, updateReview, type Review } from "@/lib/api/reviews";
import { getAccessToken } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

function requireToken() {
  const token = getAccessToken();
  if (!token) throw new ApiError("No autenticado", 401);
  return token;
}

type Draft = { propertyId: string; authorName: string; rating: number; text: string; stayedOn: string };

const draftOf = (review?: Review): Draft => ({
  propertyId: review?.propertyId ?? "",
  authorName: review?.authorName ?? "",
  rating: review?.rating ?? 5,
  text: review?.text ?? "",
  stayedOn: review?.stayedOn ?? "",
});

/** Types in a review the agency got elsewhere (published right away), or fixes one it typed in. */
export function ReviewDialog({
  open,
  onOpenChange,
  review,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: Review;
}) {
  const t = useTranslations("reviews.dialog");
  const common = useTranslations("common");
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft>(() => draftOf(review));
  const [error, setError] = useState<string | null>(null);
  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: () => listProperties(requireToken()),
    enabled: open,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        propertyId: draft.propertyId || null,
        authorName: draft.authorName.trim(),
        rating: draft.rating,
        text: draft.text.trim() || null,
        stayedOn: draft.stayedOn || null,
      };
      return review ? updateReview(requireToken(), review.id, payload) : createReview(requireToken(), payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      handleOpenChange(false);
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : common("unexpectedError")),
  });

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (next) setDraft(draftOf(review));
    setError(null);
  }

  const valid = draft.authorName.trim() !== "" && draft.rating >= 1;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 rounded-3xl p-0 sm:max-w-lg" showCloseButton>
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            if (valid) mutation.mutate();
          }}
        >
          <div className="flex flex-col gap-1.5 px-7 pt-7 pb-5">
            <DialogTitle className="font-display text-3xl leading-none tracking-tight">
              {review ? t("editTitle") : t("newTitle")}
            </DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </div>
          <div className="flex flex-col gap-5 px-7 pb-2">
            <div className="flex flex-col gap-2.5">
              <Label>{t("rating")}</Label>
              <div role="radiogroup" aria-label={t("rating")} className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={draft.rating === value}
                    aria-label={t("stars", { count: value })}
                    onClick={() => setDraft({ ...draft, rating: value })}
                    className="rounded-md p-0.5 text-amber-500 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Star className={cn("size-7", value <= draft.rating ? "fill-current" : "opacity-30")} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="review-author">{t("author")}</Label>
              <Input
                id="review-author"
                maxLength={120}
                placeholder={t("authorPlaceholder")}
                className="h-11"
                value={draft.authorName}
                onChange={(event) => setDraft({ ...draft, authorName: event.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="review-property">
                {t("property")} <span className="font-normal text-muted-foreground">{common("optional")}</span>
              </Label>
              <PropertyPicker
                id="review-property"
                properties={properties ?? []}
                value={draft.propertyId}
                onChange={(propertyId) => setDraft({ ...draft, propertyId })}
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="review-text">{t("text")}</Label>
              <Textarea
                id="review-text"
                rows={4}
                maxLength={2000}
                value={draft.text}
                onChange={(event) => setDraft({ ...draft, text: event.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label htmlFor="review-stayed">
                {t("stayedOn")} <span className="font-normal text-muted-foreground">{common("optional")}</span>
              </Label>
              <DatePicker
                id="review-stayed"
                value={draft.stayedOn}
                maxDate={new Date()}
                onChange={(stayedOn) => setDraft({ ...draft, stayedOn })}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex items-center justify-end gap-2 px-7 pt-5 pb-7">
            <Button type="button" variant="ghost" className="h-10 px-5" onClick={() => handleOpenChange(false)}>
              {common("cancel")}
            </Button>
            <Button type="submit" variant="highlight" className="h-10 gap-2 px-6" disabled={!valid || mutation.isPending}>
              {mutation.isPending && <LoaderCircle className="animate-spin" />}
              {review ? common("save") : t("publish")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
