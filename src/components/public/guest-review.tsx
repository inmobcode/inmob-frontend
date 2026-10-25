"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Stars } from "@/components/shared/stars";
import { Textarea } from "@/components/ui/textarea";
import { submitGuestReview, type PublicBooking } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

/**
 * After the stay: the guest rates it and says how it went. It reaches the
 * agency, which publishes it on its site. Once sent, they see what they wrote.
 */
export function GuestReview({ token, booking }: { token: string; booking: PublicBooking }) {
  const t = useTranslations("site.guestReview");
  const [review, setReview] = useState(booking.review);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (review) {
    return (
      <section id="review" className="flex scroll-mt-6 flex-col gap-3 rounded-xl border border-site-line p-5 sm:p-6">
        <h2 className="s-heading text-xl">{t("thanksTitle")}</h2>
        <Stars rating={review.rating} label={t("outOf", { rating: review.rating })} className="text-site-accent" />
        {review.text && <p className="text-pretty">“{review.text}”</p>}
        <p className="text-sm text-site-quiet">{review.status === "PUBLISHED" ? t("published") : t("pending")}</p>
      </section>
    );
  }
  if (!booking.canReview) return null;

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!rating) return;
    setSending(true);
    setError(null);
    try {
      const updated = await submitGuestReview(token, { rating, text: text.trim() || undefined });
      setReview(updated.review);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("failed"));
    } finally {
      setSending(false);
    }
  }

  const shown = hover || rating;

  return (
    <section id="review" className="flex scroll-mt-6 flex-col gap-4 rounded-xl border border-site-line p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="s-heading text-xl">{t("title")}</h2>
        <p className="text-site-quiet">{t("lead", { agency: booking.agency.name })}</p>
      </div>
      <form onSubmit={send} className="flex flex-col gap-4">
        <div role="radiogroup" aria-label={t("ratingLabel")} className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={t("outOf", { rating: value })}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHover(value)}
              className="rounded-md p-1 text-site-accent outline-none focus-visible:ring-2 focus-visible:ring-site-accent"
            >
              <Star className={cn("size-8", value <= shown ? "fill-current" : "opacity-30")} strokeWidth={1.5} />
            </button>
          ))}
        </div>
        <Textarea
          rows={4}
          maxLength={2000}
          aria-label={t("textLabel")}
          placeholder={t("placeholder")}
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="border-site-line bg-site-bg text-site-ink"
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={!rating || sending}
          className="inline-flex h-11 w-fit items-center rounded-lg bg-site-accent px-5 font-medium text-site-accent-ink outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-site-accent focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {sending ? t("sending") : t("send")}
        </button>
        <p className="text-xs text-site-quiet">{t("note")}</p>
      </form>
    </section>
  );
}
