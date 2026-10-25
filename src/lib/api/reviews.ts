import { apiFetch } from "./client";

export type ReviewStatus = "PENDING" | "PUBLISHED" | "HIDDEN";
export type ReviewSource = "GUEST" | "MANUAL";

/** A guest's opinion of a stay, as the agency sees it. */
export interface Review {
  id: string;
  propertyId: string | null;
  propertyTitle: string | null;
  bookingId: string | null;
  authorName: string;
  /** 1 to 5. */
  rating: number;
  text: string | null;
  /** yyyy-MM-dd */
  stayedOn: string | null;
  status: ReviewStatus;
  /** GUEST: left from their booking page (its words can't be edited). MANUAL: typed in by the agency. */
  source: ReviewSource;
  createdAt: string;
}

/** What the agency's site shows of a published review. */
export interface PublicReview {
  id: string;
  authorName: string;
  rating: number;
  text: string | null;
  stayedOn: string | null;
  propertyTitle: string | null;
}

/** Average of the published reviews (null with none) and how many there are. */
export interface ReviewSummary {
  average: number | null;
  count: number;
}

export type ReviewInput = Pick<Review, "propertyId" | "authorName" | "rating" | "text" | "stayedOn"> & {
  status?: ReviewStatus;
};

export function listReviews(token: string, status?: ReviewStatus) {
  return apiFetch<Review[]>(`/api/reviews/${status ? `?status=${status}` : ""}`, { token });
}

/** One the agency got elsewhere; published unless `status` says otherwise. */
export function createReview(token: string, payload: ReviewInput) {
  return apiFetch<Review>("/api/reviews/", { method: "POST", token, body: JSON.stringify(payload) });
}

/** A guest's review only takes `status` and `propertyId`: its words are theirs. */
export function updateReview(token: string, id: string, payload: Partial<ReviewInput>) {
  return apiFetch<Review>(`/api/reviews/${id}`, { method: "PATCH", token, body: JSON.stringify(payload) });
}

export function deleteReview(token: string, id: string) {
  return apiFetch<void>(`/api/reviews/${id}`, { method: "DELETE", token });
}
