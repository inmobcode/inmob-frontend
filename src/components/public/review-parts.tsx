import { useTranslations } from "next-intl";

import { Stars } from "@/components/shared/stars";
import { useFormat } from "@/i18n/format";
import type { PublicReview, ReviewSummary } from "@/lib/api/reviews";
import { cn } from "@/lib/utils";

/** "4,8 ★★★★★ · 23 reseñas", or nothing without reviews. */
export function RatingSummary({ rating, className }: { rating?: ReviewSummary | null; className?: string }) {
  const t = useTranslations("site.reviews");
  const { number } = useFormat();
  if (!rating?.average || !rating.count) return null;
  const average = number(rating.average, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className="font-medium tabular-nums">{average}</span>
      <Stars rating={rating.average} label={t("outOf", { rating: average })} className="text-site-accent" />
      <span className="text-site-quiet">{t("count", { count: rating.count })}</span>
    </span>
  );
}

/** One published review: stars, what they wrote, who and when. */
export function ReviewCard({ review, showProperty = false, className }: { review: PublicReview; showProperty?: boolean; className?: string }) {
  const t = useTranslations("site.reviews");
  const { date } = useFormat();
  const when = review.stayedOn ? date(new Date(`${review.stayedOn}T12:00:00`), "monthYear") : null;
  return (
    <figure className={cn("flex flex-col gap-3 rounded-xl border border-site-line p-5", className)}>
      <Stars rating={review.rating} label={t("outOf", { rating: review.rating })} className="text-site-accent" />
      {review.text && <blockquote className="line-clamp-6 leading-relaxed text-pretty">“{review.text}”</blockquote>}
      <figcaption className="mt-auto text-sm text-site-quiet">
        <span className="font-medium text-site-ink">{review.authorName}</span>
        {when && <span className="first-letter:uppercase"> · {when}</span>}
        {showProperty && review.propertyTitle && <span> · {review.propertyTitle}</span>}
      </figcaption>
    </figure>
  );
}
